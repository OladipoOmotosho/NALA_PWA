/** Photo capture pipeline (PRD §7.7): downscale client-side, store Blob in IndexedDB.
 * Each row carries the Photo_Register metadata (date taken, inspector, description). */
import { db } from '../db/db';
import { getMeta } from '../db/meta';
import { photoCaptureBlocked } from '../db/storage';

export const MAX_PHOTOS_PER_RECORD = 6;
export const MAX_DIMENSION_PX = 1600;
export const JPEG_QUALITY = 0.7;

export type AddPhotoResult =
  | { ok: true; photoId: string; photoCount: number }
  | { ok: false; reason: 'quota' | 'cap' | 'decode' };

async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  return blob ?? file;
}

/** Durable insert of an already-processed blob with Photo_Register metadata. */
export async function storePhoto(clientRecordId: string, blob: Blob): Promise<{ photoId: string; photoCount: number }> {
  const inspectorName = (await getMeta<string>('inspectorName')) ?? (await getMeta<string>('engineerEmail')) ?? '';
  const photoId = crypto.randomUUID();
  const photoCount = await db.transaction('rw', db.photos, db.submissions, async () => {
    const n = (await db.photos.where('clientRecordId').equals(clientRecordId).count()) + 1;
    await db.photos.put({
      photoId,
      clientRecordId,
      blob,
      filename: `${clientRecordId}_${n}.jpg`,
      uploaded: false,
      byteSize: blob.size,
      dateTakenUtc: new Date().toISOString(),
      inspectorName,
      photoDescription: '',
    });
    await db.submissions.update(clientRecordId, { photoCount: n });
    return n;
  });
  return { photoId, photoCount };
}

export async function addPhoto(clientRecordId: string, file: File): Promise<AddPhotoResult> {
  if (await photoCaptureBlocked()) return { ok: false, reason: 'quota' };
  const count = await db.photos.where('clientRecordId').equals(clientRecordId).count();
  if (count >= MAX_PHOTOS_PER_RECORD) return { ok: false, reason: 'cap' };

  let blob: Blob;
  try {
    blob = await downscale(file);
  } catch {
    return { ok: false, reason: 'decode' };
  }

  const stored = await storePhoto(clientRecordId, blob);
  return { ok: true, ...stored };
}

/** Editing the description re-queues the photo for upload — the backend is
 * idempotent on photoId, so the register row is updated, never duplicated. */
export async function updatePhotoDescription(photoId: string, photoDescription: string): Promise<void> {
  const photo = await db.photos.get(photoId);
  if (!photo || photo.photoDescription === photoDescription) return;
  await db.photos.update(photoId, { photoDescription, uploaded: false });
}

export function listPhotos(clientRecordId: string) {
  return db.photos.where('clientRecordId').equals(clientRecordId).toArray();
}

export async function removePhoto(photoId: string): Promise<void> {
  await db.transaction('rw', db.photos, db.submissions, async () => {
    const photo = await db.photos.get(photoId);
    if (!photo) return;
    await db.photos.delete(photoId);
    const n = await db.photos.where('clientRecordId').equals(photo.clientRecordId).count();
    await db.submissions.update(photo.clientRecordId, { photoCount: n });
  });
}
