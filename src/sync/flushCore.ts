/**
 * The flush algorithm (PRD §7.9, §10). DOM-free so it runs in both the window
 * and the service worker (Background Sync on Chromium).
 *
 * Guarantees:
 *  - exactly-once effect: Idempotency-Key = clientRecordId, backend dedupes;
 *    a record only advances to `synced` on confirmed 2xx/409.
 *  - ordered drain by submissionSequence; poison records never block the queue.
 *  - exponential backoff with jitter via nextAttemptAtUtc; maxAttempts → failedPermanent.
 */
import { db } from '../db/db';
import { getMeta, setMeta } from '../db/meta';
import { log } from '../util/log';
import { health, submitRecord, uploadPhoto, refreshToken, type BackendConfig } from './api';

const MAX_ATTEMPTS = 8;
const BACKOFF_BASE_MS = 30_000;
const BACKOFF_CAP_MS = 60 * 60_000;

export interface FlushResult {
  ran: boolean;
  reason?: string;
  recordsSynced: number;
  recordsFailed: number;
  recordsPermanent: number;
  photosUploaded: number;
  photosFailed: number;
}

function backoffDelayMs(attemptCount: number): number {
  const base = Math.min(BACKOFF_BASE_MS * 2 ** Math.max(0, attemptCount - 1), BACKOFF_CAP_MS);
  const jitter = base * 0.2 * (Math.random() * 2 - 1);
  return Math.round(base + jitter);
}

async function loadConfig(): Promise<BackendConfig | null> {
  const backendUrl = await getMeta<string>('backendUrl');
  if (!backendUrl) return null;
  const token = await getMeta<string>('authToken');
  return { backendUrl: backendUrl.replace(/\/+$/, ''), token };
}

/** PRD §7.2: refresh an expired token on reconnect BEFORE flushing. */
async function ensureFreshToken(cfg: BackendConfig): Promise<BackendConfig> {
  const expiry = await getMeta<string>('authTokenExpiry');
  if (!cfg.token || !expiry) return cfg;
  if (new Date(expiry).getTime() > Date.now() + 60_000) return cfg;
  const refreshed = await refreshToken(cfg);
  if (refreshed) {
    await setMeta('authToken', refreshed.token);
    await setMeta('authTokenExpiry', refreshed.expiresAtUtc);
    return { ...cfg, token: refreshed.token };
  }
  return cfg; // refresh failed: records will land in `failed` (retryable), never lost
}

let inFlight: Promise<FlushResult> | null = null;

/** Single-flight: concurrent triggers coalesce into one flush. */
export function flushQueue(): Promise<FlushResult> {
  if (!inFlight) {
    inFlight = doFlush().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function doFlush(): Promise<FlushResult> {
  const result: FlushResult = {
    ran: false,
    recordsSynced: 0,
    recordsFailed: 0,
    recordsPermanent: 0,
    photosUploaded: 0,
    photosFailed: 0,
  };

  let cfg = await loadConfig();
  if (!cfg) {
    result.reason = 'backend URL not configured';
    return result;
  }

  // Connectivity check: never trust navigator.onLine alone (PRD §7.9).
  if (!(await health(cfg.backendUrl))) {
    result.reason = 'heartbeat failed';
    return result;
  }

  cfg = await ensureFreshToken(cfg);
  result.ran = true;
  const nowIso = () => new Date().toISOString();

  // Select pending + retry-eligible failed records, ordered by submissionSequence.
  const now = Date.now();
  const queue = (
    await db.submissions
      .where('syncStatus')
      .anyOf('pending', 'failed')
      .and((r) => !r.isDeleted)
      .toArray()
  )
    .filter((r) => !r.nextAttemptAtUtc || new Date(r.nextAttemptAtUtc).getTime() <= now)
    .sort((a, b) => a.submissionSequence - b.submissionSequence);

  for (const record of queue) {
    await db.submissions.update(record.clientRecordId, { syncStatus: 'syncing' });
    let outcome = await submitRecord(cfg, { ...record, syncStatus: 'syncing' });

    if (outcome.kind === 'unauthorized') {
      // 401 → refresh once, retry once (PRD §8.1).
      const refreshed = await refreshToken(cfg);
      if (refreshed) {
        await setMeta('authToken', refreshed.token);
        await setMeta('authTokenExpiry', refreshed.expiresAtUtc);
        cfg = { ...cfg, token: refreshed.token };
        outcome = await submitRecord(cfg, { ...record, syncStatus: 'syncing' });
      }
    }

    if (outcome.kind === 'ok') {
      await db.submissions.update(record.clientRecordId, {
        syncStatus: 'synced',
        syncedAtUtc: nowIso(),
        lastError: null,
        nextAttemptAtUtc: null,
      });
      result.recordsSynced++;
    } else if (outcome.kind === 'validation') {
      await db.submissions.update(record.clientRecordId, {
        syncStatus: 'failedPermanent',
        lastError: outcome.message,
        nextAttemptAtUtc: null,
      });
      log.warn('sync', 'record rejected by backend (failedPermanent)', {
        clientRecordId: record.clientRecordId,
        error: outcome.message,
      });
      result.recordsPermanent++;
    } else {
      // retryable (5xx/network) or still-401 after refresh
      const attemptCount = record.attemptCount + 1;
      const permanent = attemptCount >= MAX_ATTEMPTS;
      await db.submissions.update(record.clientRecordId, {
        syncStatus: permanent ? 'failedPermanent' : 'failed',
        attemptCount,
        lastError: outcome.kind === 'unauthorized' ? 'unauthorized (after refresh)' : outcome.message,
        nextAttemptAtUtc: permanent ? null : new Date(now + backoffDelayMs(attemptCount)).toISOString(),
      });
      if (permanent) {
        log.warn('sync', 'record exhausted retries (failedPermanent)', {
          clientRecordId: record.clientRecordId,
          attempts: attemptCount,
          error: outcome.kind === 'unauthorized' ? 'unauthorized' : outcome.message,
        });
        result.recordsPermanent++;
      } else {
        result.recordsFailed++;
      }
    }
  }

  // Photo upload pass: photos of synced records, keyed by photoId (idempotent).
  // Covers both freshly-synced records and earlier "record synced, photo failed" cases.
  const pendingPhotos = await db.photos.filter((p) => !p.uploaded).toArray();
  for (const photo of pendingPhotos) {
    const parent = await db.submissions.get(photo.clientRecordId);
    if (!parent || parent.syncStatus !== 'synced') continue;
    const outcome = await uploadPhoto(cfg, {
      clientRecordId: photo.clientRecordId,
      photoId: photo.photoId,
      filename: photo.filename,
      blob: photo.blob,
      dateTakenUtc: photo.dateTakenUtc,
      inspectorName: photo.inspectorName,
      photoDescription: photo.photoDescription,
      siteCode: parent.siteCode,
      assetTag: parent.assetTag,
      parentAsset: parent.parentAsset,
    });
    if (outcome.kind === 'ok') {
      await db.photos.update(photo.photoId, { uploaded: true });
      result.photosUploaded++;
    } else {
      result.photosFailed++;
    }
  }

  await setMeta('lastFlushAt', nowIso());
  if (queue.length > 0 || result.photosUploaded > 0 || result.photosFailed > 0) {
    log.info('sync', 'flush complete', { ...result });
  }
  return result;
}
