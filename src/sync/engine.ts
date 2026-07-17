/**
 * App-side sync orchestration (PRD §7.9 trigger sources):
 * Background Sync registration (Chromium), `online` event, visibilitychange,
 * app launch, manual "Sync now", periodic foreground timer.
 */
import { flushQueue, type FlushResult } from './flushCore';
import { health } from './api';
import { getMeta, setMeta } from '../db/meta';
import { db } from '../db/db';
import type { RemoteAsset } from './api';
import { fetchAssets } from './api';

const PERIODIC_MS = 60_000;

type Listener = (state: EngineState) => void;

export interface EngineState {
  online: boolean;
  flushing: boolean;
  lastResult: FlushResult | null;
}

const state: EngineState = { online: navigator.onLine, flushing: false, lastResult: null };
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l({ ...state });
}

export function subscribeEngine(l: Listener): () => void {
  listeners.add(l);
  l({ ...state });
  return () => listeners.delete(l);
}

export async function triggerFlush(): Promise<FlushResult> {
  state.flushing = true;
  emit();
  try {
    const result = await flushQueue();
    state.lastResult = result;
    // The heartbeat inside the flush is the truthiest connectivity signal we have (PRD §7.9).
    if (result.ran) state.online = true;
    else if (result.reason === 'heartbeat failed') state.online = false;
    return result;
  } finally {
    state.flushing = false;
    emit();
  }
}

async function registerBackgroundSync(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker?.ready;
    // Background Sync API — Chromium only; iOS falls back to foreground flush.
    const sync = (reg as unknown as { sync?: { register(tag: string): Promise<void> } }).sync;
    await sync?.register('flush-queue');
  } catch {
    // unsupported — foreground triggers cover it
  }
}

export function startEngine(): () => void {
  const onOnline = () => {
    state.online = true;
    emit();
    void registerBackgroundSync();
    void triggerFlush();
  };
  const onOffline = () => {
    state.online = false;
    emit();
  };
  const onVisible = () => {
    if (document.visibilityState === 'visible') void triggerFlush();
  };

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  document.addEventListener('visibilitychange', onVisible);
  const timer = window.setInterval(() => {
    if (navigator.onLine) void triggerFlush();
  }, PERIODIC_MS);

  // launch trigger
  void triggerFlush();
  void registerBackgroundSync();

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
    document.removeEventListener('visibilitychange', onVisible);
    window.clearInterval(timer);
  };
}

/** Reference-data sync (PRD §7.3): refresh the local asset cache while online. */
export async function syncAssets(): Promise<{ ok: boolean; count: number }> {
  const backendUrl = await getMeta<string>('backendUrl');
  if (!backendUrl) return { ok: false, count: 0 };
  const url = backendUrl.replace(/\/+$/, '');
  if (!(await health(url))) return { ok: false, count: 0 };
  const token = await getMeta<string>('authToken');
  const remote = await fetchAssets({ backendUrl: url, token });
  if (!remote) return { ok: false, count: 0 };
  const rows = remote.map((a: RemoteAsset) => ({
    assetTag: a.assetTag,
    parentAsset: a.parentAsset ?? '',
    assetCategory: a.assetCategory ?? '',
    component: a.component ?? '',
    siteCode: a.siteCode ?? '',
    locationDescription: a.locationDescription ?? '',
    accessNotes: a.accessNotes ?? '',
    latitude: a.latitude ?? null,
    longitude: a.longitude ?? null,
    lastInspectedUtc: a.lastInspectedUtc ?? null,
    isActive: a.isActive ?? true,
  }));
  await db.transaction('rw', db.assets, async () => {
    await db.assets.clear();
    await db.assets.bulkPut(rows);
  });
  await setMeta('lastAssetSyncAt', new Date().toISOString());
  return { ok: true, count: rows.length };
}
