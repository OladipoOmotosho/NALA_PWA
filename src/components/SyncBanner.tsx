/** Persistent sync status banner (PRD §7.11). */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { subscribeEngine, triggerFlush, type EngineState } from '../sync/engine';

export function SyncBanner() {
  const [engine, setEngine] = useState<EngineState>({ online: navigator.onLine, flushing: false, lastResult: null });
  useEffect(() => subscribeEngine(setEngine), []);

  const unsynced = useLiveQuery(
    () =>
      db.submissions
        .where('syncStatus')
        .anyOf('pending', 'syncing', 'failed')
        .and((r) => !r.isDeleted)
        .count(),
    [],
    0,
  );
  const permanent = useLiveQuery(
    () =>
      db.submissions
        .where('syncStatus')
        .equals('failedPermanent')
        .and((r) => !r.isDeleted)
        .count(),
    [],
    0,
  );

  const cls = engine.online ? 'banner online' : 'banner offline';
  return (
    <div className={cls}>
      <span className="banner-dot" aria-hidden="true" />
      <span className="banner-text">
        {engine.flushing
          ? 'Syncing…'
          : engine.online
            ? unsynced > 0
              ? `Online — ${unsynced} to sync`
              : 'Online — all synced'
            : unsynced > 0
              ? `Offline — ${unsynced} saved on device, will sync when back online`
              : 'Offline — records will sync when back online'}
        {permanent > 0 && <strong className="banner-alert"> · {permanent} need attention</strong>}
      </span>
      <button
        type="button"
        className="btn btn-small"
        disabled={engine.flushing}
        onClick={() => void triggerFlush()}
      >
        Sync now
      </button>
    </div>
  );
}
