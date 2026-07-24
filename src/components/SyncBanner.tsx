/** Persistent sync status banner (PRD §7.11). */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { countFailedPermanent, countUnsynced } from '../db/submissions';
import { subscribeEngine, triggerFlush, type EngineState } from '../sync/engine';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { cx } from '../ui/cx';

export function SyncBanner() {
  const [engine, setEngine] = useState<EngineState>({ online: navigator.onLine, flushing: false, lastResult: null });
  useEffect(() => subscribeEngine(setEngine), []);

  const unsynced = useLiveQuery(countUnsynced, [], 0);
  const permanent = useLiveQuery(countFailedPermanent, [], 0);

  return (
    <div
      className={cx(
        'sticky top-0 z-20 flex items-center gap-2.5 px-3.5 py-2.5 text-[15px] pt-[calc(10px+env(safe-area-inset-top))]',
        engine.online ? 'bg-[#064e3b]' : 'bg-[#7c2d12]',
      )}
    >
      {engine.flushing ? (
        <Spinner size={14} strokeWidth={2} />
      ) : (
        <span
          className={cx('size-2.5 flex-none rounded-full', engine.online ? 'bg-green' : 'bg-amber')}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 flex-1">
        {engine.flushing
          ? 'Syncing…'
          : engine.online
            ? unsynced > 0
              ? `Online — ${unsynced} to sync`
              : 'Online — all synced'
            : unsynced > 0
              ? `Offline — ${unsynced} saved on device, will sync when back online`
              : 'Offline — records will sync when back online'}
        {permanent > 0 && <strong className="text-[#fecaca]"> · {permanent} need attention</strong>}
      </span>
      <Button size="sm" disabled={engine.flushing} onClick={() => void triggerFlush()}>
        Sync now
      </Button>
    </div>
  );
}
