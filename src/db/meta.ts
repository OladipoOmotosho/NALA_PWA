import { db } from './db';

export async function getMeta<T = string>(key: string): Promise<T | null> {
  const row = await db.meta.get(key);
  return row ? (row.value as T) : null;
}

export async function setMeta(key: string, value: string | number | boolean | null): Promise<void> {
  await db.meta.put({ key, value });
}

/** Device-monotonic counter used to order a backlog flush (PRD §6.1 submissionSequence). */
export async function nextSequence(): Promise<number> {
  return db.transaction('rw', db.meta, async () => {
    const row = await db.meta.get('sequenceCounter');
    const next = (typeof row?.value === 'number' ? row.value : 0) + 1;
    await db.meta.put({ key: 'sequenceCounter', value: next });
    return next;
  });
}

export async function getDeviceId(): Promise<string> {
  let id = await getMeta<string>('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    await setMeta('deviceId', id);
  }
  return id;
}

export function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}
