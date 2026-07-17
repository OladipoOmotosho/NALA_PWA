import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../db/db';
import { setMeta } from '../db/meta';
import { newSubmission, saveSubmission } from '../db/submissions';
import { removePhoto, storePhoto, updatePhotoDescription } from './photos';

async function makeRecord() {
  const s = await newSubmission();
  return saveSubmission({ ...s, assetTag: 'AST-1' }, 'draft');
}

beforeEach(async () => {
  await Promise.all([db.submissions.clear(), db.photos.clear(), db.meta.clear()]);
});

describe('storePhoto (Photo_Register parity)', () => {
  it('captures date taken, inspector name and an empty description', async () => {
    await setMeta('inspectorName', 'Dipo O.');
    const rec = await makeRecord();
    const before = Date.now();
    const { photoId, photoCount } = await storePhoto(rec.clientRecordId, new Blob(['x'], { type: 'image/jpeg' }));
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
    const { photoId } = await storePhoto(rec.clientRecordId, new Blob(['x']));
    expect((await db.photos.get(photoId))?.inspectorName).toBe('eng@example.com');
  });

  it('keeps photoCount on the submission in step', async () => {
    const rec = await makeRecord();
    const a = await storePhoto(rec.clientRecordId, new Blob(['a']));
    await storePhoto(rec.clientRecordId, new Blob(['b']));
    expect((await db.submissions.get(rec.clientRecordId))?.photoCount).toBe(2);
    await removePhoto(a.photoId);
    expect((await db.submissions.get(rec.clientRecordId))?.photoCount).toBe(1);
  });
});

describe('updatePhotoDescription', () => {
  it('stores the description and re-queues the photo for upload', async () => {
    const rec = await makeRecord();
    const { photoId } = await storePhoto(rec.clientRecordId, new Blob(['x']));
    await db.photos.update(photoId, { uploaded: true });
    await updatePhotoDescription(photoId, 'Corroded base plate, north face');
    const row = await db.photos.get(photoId);
    expect(row?.photoDescription).toBe('Corroded base plate, north face');
    expect(row?.uploaded).toBe(false); // idempotent re-upload updates the register row
  });

  it('is a no-op when the description is unchanged', async () => {
    const rec = await makeRecord();
    const { photoId } = await storePhoto(rec.clientRecordId, new Blob(['x']));
    await db.photos.update(photoId, { uploaded: true, photoDescription: 'same' });
    await updatePhotoDescription(photoId, 'same');
    expect((await db.photos.get(photoId))?.uploaded).toBe(true);
  });
});
