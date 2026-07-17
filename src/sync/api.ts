/** Backend HTTP contract (PRD §8). The backend is any endpoint satisfying this contract. */
import type { Submission } from '../domain/types';

export interface BackendConfig {
  backendUrl: string;
  token: string | null;
}

function headers(cfg: BackendConfig, extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  if (cfg.token) h['Authorization'] = `Bearer ${cfg.token}`;
  return h;
}

const REQUEST_TIMEOUT_MS = 20_000;

function timeoutSignal(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

export async function health(backendUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${backendUrl}/health`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: timeoutSignal(5_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type SubmitOutcome =
  | { kind: 'ok' }
  | { kind: 'unauthorized' }
  | { kind: 'validation'; message: string }
  | { kind: 'retryable'; message: string };

/** POST the record (photo blobs excluded — they live in the photos store). */
export async function submitRecord(cfg: BackendConfig, record: Submission): Promise<SubmitOutcome> {
  try {
    const res = await fetch(`${cfg.backendUrl}/field-intake`, {
      method: 'POST',
      headers: headers(cfg, {
        'Content-Type': 'application/json',
        'Idempotency-Key': record.clientRecordId,
      }),
      body: JSON.stringify(record),
      signal: timeoutSignal(REQUEST_TIMEOUT_MS),
    });
    if (res.ok || res.status === 409) return { kind: 'ok' }; // 409 = already exists → idempotent success
    if (res.status === 401) return { kind: 'unauthorized' };
    if (res.status >= 400 && res.status < 500) {
      let message = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        // keep default message
      }
      return { kind: 'validation', message };
    }
    return { kind: 'retryable', message: `HTTP ${res.status}` };
  } catch (e) {
    return { kind: 'retryable', message: e instanceof Error ? e.message : 'network error' };
  }
}

export async function uploadPhoto(
  cfg: BackendConfig,
  clientRecordId: string,
  photoId: string,
  filename: string,
  blob: Blob,
): Promise<SubmitOutcome> {
  try {
    const form = new FormData();
    form.append('clientRecordId', clientRecordId);
    form.append('photoId', photoId);
    form.append('file', blob, filename);
    const res = await fetch(`${cfg.backendUrl}/field-photo`, {
      method: 'POST',
      headers: headers(cfg),
      body: form,
      signal: timeoutSignal(60_000),
    });
    if (res.ok || res.status === 409) return { kind: 'ok' };
    if (res.status === 401) return { kind: 'unauthorized' };
    if (res.status >= 400 && res.status < 500) return { kind: 'validation', message: `HTTP ${res.status}` };
    return { kind: 'retryable', message: `HTTP ${res.status}` };
  } catch (e) {
    return { kind: 'retryable', message: e instanceof Error ? e.message : 'network error' };
  }
}

/** Returns the new token, or null if refresh failed. */
export async function refreshToken(cfg: BackendConfig): Promise<{ token: string; expiresAtUtc: string | null } | null> {
  try {
    const res = await fetch(`${cfg.backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: headers(cfg, { 'Content-Type': 'application/json' }),
      body: '{}',
      signal: timeoutSignal(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.token) return null;
    return { token: String(body.token), expiresAtUtc: body.expiresAtUtc ? String(body.expiresAtUtc) : null };
  } catch {
    return null;
  }
}

export interface RemoteAsset {
  assetTag: string;
  parentAsset?: string;
  assetCategory?: string;
  component?: string;
  siteCode?: string;
  locationDescription?: string;
  accessNotes?: string;
  latitude?: number | null;
  longitude?: number | null;
  lastInspectedUtc?: string | null;
  isActive?: boolean;
}

export async function fetchAssets(cfg: BackendConfig, siteCode?: string): Promise<RemoteAsset[] | null> {
  try {
    const q = siteCode ? `?siteCode=${encodeURIComponent(siteCode)}` : '';
    const res = await fetch(`${cfg.backendUrl}/assets${q}`, {
      headers: headers(cfg),
      signal: timeoutSignal(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return Array.isArray(body) ? body : Array.isArray(body?.assets) ? body.assets : null;
  } catch {
    return null;
  }
}
