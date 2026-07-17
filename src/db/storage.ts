/** Storage durability + quota tracking (PRD §5, §9.2). */

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    // ignore — persistence is best-effort
  }
  return false;
}

export interface StorageInfo {
  usage: number;
  quota: number;
  fraction: number;
}

export async function storageInfo(): Promise<StorageInfo> {
  try {
    if (navigator.storage?.estimate) {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return { usage, quota, fraction: quota > 0 ? usage / quota : 0 };
    }
  } catch {
    // fall through
  }
  return { usage: 0, quota: 0, fraction: 0 };
}

/** PRD §9.2: at >80% quota, warn and block new photo capture. */
export async function photoCaptureBlocked(): Promise<boolean> {
  const info = await storageInfo();
  return info.quota > 0 && info.fraction > 0.8;
}

export function formatBytes(n: number): string {
  if (n >= 1 << 30) return `${(n / (1 << 30)).toFixed(2)} GB`;
  if (n >= 1 << 20) return `${(n / (1 << 20)).toFixed(1)} MB`;
  if (n >= 1 << 10) return `${(n / (1 << 10)).toFixed(0)} KB`;
  return `${n} B`;
}
