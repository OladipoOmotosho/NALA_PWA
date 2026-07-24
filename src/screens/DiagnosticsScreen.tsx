/** Diagnostics / admin (PRD §7.12): queue states, retry, JSON export, storage, guarded purge. */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { exportSnapshot, listQueue, purgeSynced, requeueFailed, storeCounts } from '../db/submissions';
import { countAssets } from '../db/assets';
import { storageInfo, formatBytes, type StorageInfo } from '../db/storage';
import { getMeta } from '../db/meta';
import { triggerFlush, syncAssets } from '../sync/engine';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import p from '../styles/primitives.module.css';

const PURGE_DAYS = 30;

export function DiagnosticsScreen() {
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [lastFlushAt, setLastFlushAt] = useState<string | null>(null);
  const [lastAssetSyncAt, setLastAssetSyncAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const refreshMeta = () => {
    void storageInfo().then(setStorage);
    void getMeta<string>('lastFlushAt').then(setLastFlushAt);
    void getMeta<string>('lastAssetSyncAt').then(setLastAssetSyncAt);
  };
  useEffect(refreshMeta, []);

  const queue = useLiveQuery(listQueue, [], []);
  const counts = useLiveQuery(
    async () => ({ ...(await storeCounts()), assets: await countAssets() }),
    [],
    null,
  );

  const retryFailed = async () => {
    await requeueFailed();
    const result = await triggerFlush();
    setMessage(result.ran ? `Flush ran: ${result.recordsSynced} synced, ${result.recordsFailed} retrying.` : `Flush skipped: ${result.reason}`);
    refreshMeta();
  };

  const exportJson = async () => {
    const payload = JSON.stringify(await exportSnapshot(), null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `nala-queue-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const purge = async () => {
    setShowPurgeConfirm(false);
    const n = await purgeSynced(PURGE_DAYS);
    setMessage(`Purged ${n} fully-synced record(s).`);
  };

  const refreshAssets = async () => {
    const res = await syncAssets();
    setMessage(res.ok ? `Asset cache refreshed: ${res.count} assets.` : 'Asset sync failed (offline or backend unavailable).');
    refreshMeta();
  };

  return (
    <div>
      <section className={p.card}>
        <h2>Storage</h2>
        {storage && storage.quota > 0 ? (
          <>
            <p>
              {formatBytes(storage.usage)} of {formatBytes(storage.quota)} used ({Math.round(storage.fraction * 100)}%)
            </p>
            {storage.fraction > 0.8 && <p className={p.warn}>Over 80% — new photo capture is blocked.</p>}
          </>
        ) : (
          <p className={p.muted}>Storage estimate unavailable.</p>
        )}
        {counts && (
          <p className={p.muted}>
            {counts.total} records ({counts.synced} synced, {counts.deleted} discarded) · {counts.photos} photos (
            {counts.photosPending} awaiting upload) · {counts.assets} cached assets
          </p>
        )}
        <p className={p.muted}>
          Last flush: {lastFlushAt ? new Date(lastFlushAt).toLocaleString() : 'never'} · Asset cache:{' '}
          {lastAssetSyncAt ? new Date(lastAssetSyncAt).toLocaleString() : 'never synced'}
        </p>
      </section>

      <section className={p.card}>
        <h2>Queue ({queue.length})</h2>
        {queue.length === 0 && <p className={p.muted}>Queue empty — everything synced.</p>}
        {queue.map((r) => (
          <div key={r.clientRecordId} className="border-b border-line py-2 text-[15px]">
            <span className="font-mono text-muted">#{r.submissionSequence}</span> <strong>{r.assetTag || '(no asset)'}</strong>{' '}
            <StatusBadge status={r.syncStatus} />
            <span className={p.muted}> attempts: {r.attemptCount}</span>
            {r.lastError && <div className={p.errorText}>{r.lastError}</div>}
          </div>
        ))}
      </section>

      <section className={p.card}>
        <h2>Actions</h2>
        <div className={p.btnCol}>
          <Button onClick={() => void retryFailed()}>Retry failed now</Button>
          <Button onClick={() => void refreshAssets()}>Refresh asset cache</Button>
          <Button variant="secondary" onClick={() => void exportJson()}>
            Export queue to JSON
          </Button>
          <Button variant="danger" onClick={() => setShowPurgeConfirm(true)}>
            Purge synced &gt; {PURGE_DAYS} days
          </Button>
        </div>
        {message && <p className={p.toast}>{message}</p>}
      </section>

      <Modal
        isVisible={showPurgeConfirm}
        onClose={() => setShowPurgeConfirm(false)}
        variant="warning"
        title="Purge old synced records?"
        message={`Records synced more than ${PURGE_DAYS} days ago, with all photos uploaded, will be permanently removed from this device. This cannot be undone.`}
        primaryButton={{ text: 'Purge', variant: 'danger', onPress: () => void purge() }}
        secondaryButton={{ text: 'Cancel', onPress: () => setShowPurgeConfirm(false) }}
      />
    </div>
  );
}
