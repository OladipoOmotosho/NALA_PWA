import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../db/db';
import { setMeta } from '../db/meta';
import { newSubmission, saveSubmission } from '../db/submissions';
import { MAX_PHOTOS_PER_RECORD, removePhoto, storePhoto, updatePhotoDescription, type StorePhotoResult } from './photos';

async function makeRecord() {
  const s = await newSubmission();
  return saveSubmission({ ...s, assetTag: 'AST-1' }, 'draft');
}

/** Narrows a StorePhotoResult in tests that expect success, failing loudly otherwise. */
function expectOk(result: StorePhotoResult): Extract<StorePhotoResult, { ok: true }> {
  if (!result.ok) throw new Error(`expected a successful store, got ${JSON.stringify(result)}`);
  return result;
}

beforeEach(async () => {
  await Promise.all([db.submissions.clear(), db.photos.clear(), db.meta.clear()]);
});

describe('storePhoto (Photo_Register parity)', () => {
  it('captures date taken, inspector name and an empty description', async () => {
    await setMeta('inspectorName', 'Dipo O.');
    const rec = await makeRecord();
    const before = Date.now();
    const { photoId, photoCount } = expectOk(await storePhoto(rec.clientRecordId, new Blob(['x'], { type: 'image/jpeg' })));
    expect(photoCount).toBe(1);
    const row = await db.photos.get(photoId);
    expect(row?.inspectorName).toBe('Dipo O.');
    expect(row?.photoDescription).toBe('');
    expect(row?.uploaded).toBe(false);
    expect(new Date(row!.dateTakenUtc).getTime()).toBeGreaterThanOrEqual(before - 1000);
    expect(row?.filename).toBe(`${rec.clientRecordId}_1.jpg`);
  });

  it('falls back to engineer email when no inspector name is set', async () => {
    await setMeta('engineerEmail', 'eng@example.com');
    const rec = await makeRecord();
    const { photoId } = expectOk(await storePhoto(rec.clientRecordId, new Blob(['x'])));
    expect((await db.photos.get(photoId))?.inspectorName).toBe('eng@example.com');
  });

  it('keeps photoCount on the submission in step', async () => {
    const rec = await makeRecord();
    const a = expectOk(await storePhoto(rec.clientRecordId, new Blob(['a'])));
    await storePhoto(rec.clientRecordId, new Blob(['b']));
    expect((await db.submissions.get(rec.clientRecordId))?.photoCount).toBe(2);
    await removePhoto(a.photoId);
    expect((await db.submissions.get(rec.clientRecordId))?.photoCount).toBe(1);
  });

  it('rejects a photo once the record is at MAX_PHOTOS_PER_RECORD', async () => {
    const rec = await makeRecord();
    for (let i = 0; i < MAX_PHOTOS_PER_RECORD; i++) {
      expectOk(await storePhoto(rec.clientRecordId, new Blob([String(i)])));
    }
    const result = await storePhoto(rec.clientRecordId, new Blob(['overflow']));
    expect(result).toEqual({ ok: false, reason: 'cap' });
    expect(await db.photos.where('clientRecordId').equals(rec.clientRecordId).count()).toBe(MAX_PHOTOS_PER_RECORD);
  });

  it('never exceeds the cap under concurrent inserts racing for the last slot', async () => {
    const rec = await makeRecord();
    // Fill to one below the cap sequentially.
    for (let i = 0; i < MAX_PHOTOS_PER_RECORD - 1; i++) {
      expectOk(await storePhoto(rec.clientRecordId, new Blob([String(i)])));
    }

    // Two concurrent calls race for the single remaining slot. Without the
    // count-check and the write sharing one IndexedDB transaction, both
    // could observe room under the cap and both insert — exceeding it.
    const [a, b] = await Promise.all([
      storePhoto(rec.clientRecordId, new Blob(['racer-a'])),
      storePhoto(rec.clientRecordId, new Blob(['racer-b'])),
    ]);

    const succeeded = [a, b].filter((r) => r.ok);
    const capped = [a, b].filter((r) => !r.ok);
    expect(succeeded.length).toBe(1);
    expect(capped).toEqual([{ ok: false, reason: 'cap' }]);
    expect(await db.photos.where('clientRecordId').equals(rec.clientRecordId).count()).toBe(MAX_PHOTOS_PER_RECORD);
  });
});

describe('updatePhotoDescription', () => {
  it('stores the description and re-queues the photo for upload', async () => {
    const rec = await makeRecord();
    const { photoId } = expectOk(await storePhoto(rec.clientRecordId, new Blob(['x'])));
    await db.photos.update(photoId, { uploaded: true });
    await updatePhotoDescription(photoId, 'Corroded base plate, north face');
    const row = await db.photos.get(photoId);
    expect(row?.photoDescription).toBe('Corroded base plate, north face');
    expect(row?.uploaded).toBe(false); // idempotent re-upload updates the register row
  });

  it('is a no-op when the description is unchanged', async () => {
    const rec = await makeRecord();
    const { photoId } = expectOk(await storePhoto(rec.clientRecordId, new Blob(['x'])));
    await db.photos.update(photoId, { uploaded: true, photoDescription: 'same' });
    await updatePhotoDescription(photoId, 'same');
    expect((await db.photos.get(photoId))?.uploaded).toBe(true);
  });
});
