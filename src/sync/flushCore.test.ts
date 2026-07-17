/**
 * Sync state machine tests (PRD §7.9, §10) against a mocked backend —
 * tests never touch real services (ENGINEERING_PRACTICES).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../db/db';
import { setMeta } from '../db/meta';
import { newSubmission, saveSubmission } from '../db/submissions';
import { flushQueue } from './flushCore';
import type { Submission } from '../domain/types';

type Handler = (url: string, init?: RequestInit) => Response | Promise<Response>;

let handler: Handler;
const calls: Array<{ url: string; init?: RequestInit }> = [];

function json(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function queueRecord(overrides: Partial<Submission> = {}): Promise<Submission> {
  const s = await newSubmission();
  return saveSubmission(
    {
      ...s,
      assetTag: overrides.assetTag ?? 'AST-001',
      inspectorName: 'T',
      componentType: 'Roofing',
      deficiencyCategory: 'CML - Corrosion & Material Loss',
      detailedDescription: 'Corrosion of steel deck',
      consequenceSeverity: 'High',
      likelihood: 'Low',
      priorityRating: 'P3',
      ...overrides,
    },
    'pending',
  );
}

beforeEach(async () => {
  await Promise.all([db.submissions.clear(), db.photos.clear(), db.meta.clear()]);
  await setMeta('backendUrl', 'https://backend.test');
  await setMeta('authToken', 'tok-1');
  calls.length = 0;
  handler = () => json(200, { status: 'ok' });
  vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    return Promise.resolve(handler(url, init));
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('flushQueue', () => {
  it('does not run without a configured backend', async () => {
    await db.meta.delete('backendUrl');
    const res = await flushQueue();
    expect(res.ran).toBe(false);
    expect(res.reason).toBe('backend URL not configured');
    expect(calls.length).toBe(0);
  });

  it('aborts when the heartbeat fails (never trusts navigator.onLine)', async () => {
    const rec = await queueRecord();
    handler = () => {
      throw new Error('network down');
    };
    const res = await flushQueue();
    expect(res.ran).toBe(false);
    expect(res.reason).toBe('heartbeat failed');
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('pending');
  });

  it('sends Idempotency-Key = clientRecordId and advances to synced on 200', async () => {
    const rec = await queueRecord();
    const res = await flushQueue();
    expect(res.recordsSynced).toBe(1);
    const intake = calls.find((c) => c.url.includes('/field-intake'));
    expect(intake).toBeDefined();
    expect((intake?.init?.headers as Record<string, string>)['Idempotency-Key']).toBe(rec.clientRecordId);
    const row = await db.submissions.get(rec.clientRecordId);
    expect(row?.syncStatus).toBe('synced');
    expect(row?.syncedAtUtc).toBeTruthy();
  });

  it('treats 409 already-exists as synced (exactly-once, no duplicate)', async () => {
    const rec = await queueRecord();
    handler = (url) => (url.includes('/field-intake') ? json(409, { status: 'exists' }) : json(200));
    const res = await flushQueue();
    expect(res.recordsSynced).toBe(1);
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('synced');
  });

  it('4xx validation → failedPermanent, surfaced, and does not block later records', async () => {
    const bad = await queueRecord({ assetTag: 'BAD' });
    const good = await queueRecord({ assetTag: 'GOOD' });
    handler = (url, init) => {
      if (url.includes('/field-intake')) {
        const body = JSON.parse(String(init?.body)) as Submission;
        return body.assetTag === 'BAD'
          ? json(422, { status: 'error', code: 'validation', message: 'bad asset' })
          : json(200, { status: 'ok' });
      }
      return json(200);
    };
    const res = await flushQueue();
    expect(res.recordsPermanent).toBe(1);
    expect(res.recordsSynced).toBe(1);
    const badRow = await db.submissions.get(bad.clientRecordId);
    expect(badRow?.syncStatus).toBe('failedPermanent');
    expect(badRow?.lastError).toBe('bad asset');
    expect((await db.submissions.get(good.clientRecordId))?.syncStatus).toBe('synced');
  });

  it('5xx → failed with attemptCount++ and a scheduled backoff', async () => {
    const rec = await queueRecord();
    handler = (url) => (url.includes('/field-intake') ? json(500) : json(200));
    const res = await flushQueue();
    expect(res.recordsFailed).toBe(1);
    const row = await db.submissions.get(rec.clientRecordId);
    expect(row?.syncStatus).toBe('failed');
    expect(row?.attemptCount).toBe(1);
    expect(row?.nextAttemptAtUtc).toBeTruthy();
    expect(new Date(row!.nextAttemptAtUtc!).getTime()).toBeGreaterThan(Date.now());
  });

  it('skips failed records still inside their backoff window', async () => {
    const rec = await queueRecord();
    await db.submissions.update(rec.clientRecordId, {
      syncStatus: 'failed',
      attemptCount: 1,
      nextAttemptAtUtc: new Date(Date.now() + 60_000).toISOString(),
    });
    const res = await flushQueue();
    expect(res.recordsSynced).toBe(0);
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('failed');
  });

  it('maxAttempts (8) exhausted → failedPermanent', async () => {
    const rec = await queueRecord();
    await db.submissions.update(rec.clientRecordId, { syncStatus: 'failed', attemptCount: 7, nextAttemptAtUtc: null });
    handler = (url) => (url.includes('/field-intake') ? json(500) : json(200));
    const res = await flushQueue();
    expect(res.recordsPermanent).toBe(1);
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('failedPermanent');
  });

  it('401 → refreshes token once and retries the record', async () => {
    const rec = await queueRecord();
    let intakeCalls = 0;
    handler = (url, init) => {
      if (url.includes('/auth/refresh')) return json(200, { token: 'tok-2' });
      if (url.includes('/field-intake')) {
        intakeCalls++;
        const auth = (init?.headers as Record<string, string>)['Authorization'];
        return auth === 'Bearer tok-2' ? json(200, { status: 'ok' }) : json(401);
      }
      return json(200);
    };
    const res = await flushQueue();
    expect(intakeCalls).toBe(2);
    expect(res.recordsSynced).toBe(1);
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('synced');
    expect((await db.meta.get('authToken'))?.value).toBe('tok-2');
  });

  it('drains an offline backlog in submissionSequence order', async () => {
    await queueRecord({ assetTag: 'FIRST' });
    await queueRecord({ assetTag: 'SECOND' });
    await queueRecord({ assetTag: 'THIRD' });
    const order: string[] = [];
    handler = (url, init) => {
      if (url.includes('/field-intake')) order.push((JSON.parse(String(init?.body)) as Submission).assetTag);
      return json(200, { status: 'ok' });
    };
    await flushQueue();
    expect(order).toEqual(['FIRST', 'SECOND', 'THIRD']);
  });

  it('uploads photos only after the record is synced; photo failure leaves record synced', async () => {
    const rec = await queueRecord();
    await db.photos.put({
      photoId: 'ph-1',
      clientRecordId: rec.clientRecordId,
      blob: new Blob(['x'], { type: 'image/jpeg' }),
      filename: `${rec.clientRecordId}_1.jpg`,
      uploaded: false,
      byteSize: 1,
      dateTakenUtc: '2026-07-17T10:00:00.000Z',
      inspectorName: 'Dipo O.',
      photoDescription: 'Corroded base plate',
    });
    handler = (url) => (url.includes('/field-photo') ? json(500) : json(200, { status: 'ok' }));
    const res = await flushQueue();
    expect(res.recordsSynced).toBe(1);
    expect(res.photosFailed).toBe(1);
    expect((await db.submissions.get(rec.clientRecordId))?.syncStatus).toBe('synced');
    expect((await db.photos.get('ph-1'))?.uploaded).toBe(false);

    // next flush retries just the photo (PRD edge case: record synced, photo retried)
    handler = () => json(200, { status: 'ok' });
    const res2 = await flushQueue();
    expect(res2.photosUploaded).toBe(1);
    expect((await db.photos.get('ph-1'))?.uploaded).toBe(true);

    // the upload carried the full Photo_Register row: metadata + derived asset context
    const uploads = calls.filter((c) => c.url.includes('/field-photo'));
    const upload = uploads[uploads.length - 1];
    const form = upload?.init?.body as FormData;
    expect(form.get('photoId')).toBe('ph-1');
    expect(form.get('dateTakenUtc')).toBe('2026-07-17T10:00:00.000Z');
    expect(form.get('inspectorName')).toBe('Dipo O.');
    expect(form.get('photoDescription')).toBe('Corroded base plate');
    expect(form.get('assetTag')).toBe(rec.assetTag);
  });
});
