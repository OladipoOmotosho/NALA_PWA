/** Persistent sync status banner (PRD §7.11). */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { countFailedPermanent, countUnsynced } from '../db/submissions';
import { subscribeEngine, triggerFlush, type EngineState } from '../sync/engine';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { cx } from '../ui/cx';
import styles from './SyncBanner.module.css';

export function SyncBanner() {
  const [engine, setEngine] = useState<EngineState>({ online: navigator.onLine, flushing: false, lastResult: null });
  useEffect(() => subscribeEngine(setEngine), []);

  const unsynced = useLiveQuery(countUnsynced, [], 0);
  const permanent = useLiveQuery(countFailedPermanent, [], 0);

  return (
    <div className={cx(styles.banner, engine.online ? styles.online : styles.offline)}>
      {engine.flushing ? <Spinner size={14} strokeWidth={2} /> : <span className={styles.dot} aria-hidden="true" />}
      <span className={styles.text}>
        {engine.flushing
          ? 'Syncing…'
          : engine.online
            ? unsynced > 0
              ? `Online — ${unsynced} to sync`
              : 'Online — all synced'
            : unsynced > 0
              ? `Offline — ${unsynced} saved on device, will sync when back online`
              : 'Offline — records will sync when back online'}
        {permanent > 0 && <strong className={styles.alert}> · {permanent} need attention</strong>}
      </span>
      <Button size="sm" disabled={engine.flushing} onClick={() => void triggerFlush()}>
        Sync now
      </Button>
    </div>
  );
}
