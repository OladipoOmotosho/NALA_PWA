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

export type StorePhotoResult =
  | { ok: true; photoId: string; photoCount: number }
  | { ok: false; reason: 'cap' };

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

/**
 * Durable insert of an already-processed blob with Photo_Register metadata.
 *
 * The cap check and the write happen inside the same IndexedDB transaction
 * so they're atomic: IndexedDB serializes overlapping readwrite transactions
 * on the same object store, so two concurrent calls can no longer both
 * observe room under MAX_PHOTOS_PER_RECORD and each insert, exceeding it.
 * This is the single choke point for writing a photo row — callers (incl.
 * addPhoto) always get cap enforcement, they can't bypass it.
 */
export async function storePhoto(clientRecordId: string, blob: Blob): Promise<StorePhotoResult> {
  const inspectorName = (await getMeta<string>('inspectorName')) ?? (await getMeta<string>('engineerEmail')) ?? '';
  const photoId = crypto.randomUUID();
  return db.transaction('rw', db.photos, db.submissions, async (): Promise<StorePhotoResult> => {
    const n = (await db.photos.where('clientRecordId').equals(clientRecordId).count()) + 1;
    if (n > MAX_PHOTOS_PER_RECORD) return { ok: false, reason: 'cap' };
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
    return { ok: true, photoId, photoCount: n };
  });
}

export async function addPhoto(clientRecordId: string, file: File): Promise<AddPhotoResult> {
  if (await photoCaptureBlocked()) return { ok: false, reason: 'quota' };

  let blob: Blob;
  try {
    blob = await downscale(file);
  } catch {
    return { ok: false, reason: 'decode' };
  }

  return storePhoto(clientRecordId, blob);
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
