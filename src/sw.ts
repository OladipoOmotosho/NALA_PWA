/// <reference lib="webworker" />
/**
 * Service worker: app-shell precache (PRD §7.1) + Background Sync flush (Chromium, PRD §7.9).
 * Uses injectManifest so the same flushCore module runs here and in the window.
 */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { flushQueue } from './sync/flushCore';

declare let self: ServiceWorkerGlobalScope;

interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
}

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

// registerType 'prompt': the app shows a reload prompt and posts SKIP_WAITING when accepted.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') void self.skipWaiting();
});

self.addEventListener('sync', ((event: SyncEvent) => {
  if (event.tag === 'flush-queue') {
    event.waitUntil(flushQueue());
  }
}) as EventListener);
