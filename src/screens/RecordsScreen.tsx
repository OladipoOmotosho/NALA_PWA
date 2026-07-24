/** Local records list with per-record sync badges (PRD §7.11). */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Submission } from '../domain/types';
import { discardSubmission, listActiveRecords } from '../db/submissions';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { cx } from '../ui/cx';
import p from '../styles/primitives.module.css';

interface Props {
  onEdit: (clientRecordId: string) => void;
}

export function RecordsScreen({ onEdit }: Props) {
  const records = useLiveQuery(listActiveRecords, [], [] as Submission[]);
  const [discardTarget, setDiscardTarget] = useState<string | null>(null);

  if (records.length === 0) {
    return <p className={cx(p.muted, p.center)}>No inspections on this device yet.</p>;
  }

  return (
    <div>
      {records.map((r) => (
        <div key={r.clientRecordId} className="my-2.5 rounded-xl border border-line bg-card px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <strong>{r.assetTag || '(no asset)'}</strong>
            <StatusBadge status={r.syncStatus} />
          </div>
          <div className="mt-1 text-sm text-muted">
            {r.siteCode || 'Site —'} · {r.deficiencyCategory ? r.deficiencyCategory.split(' - ')[0] : 'no category'} ·{' '}
            {r.priorityRating || 'P?'} · {r.inspectionDate}
            {r.photoCount > 0 && <> · 📷 {r.photoCount}</>}
          </div>
          {r.lastError && r.syncStatus !== 'synced' && <div className={p.errorText}>{r.lastError}</div>}
          <div className="mt-2.5 flex gap-2">
            <Button size="sm" onClick={() => onEdit(r.clientRecordId)}>
              {r.syncStatus === 'draft' ? 'Resume' : 'Edit'}
            </Button>
            {r.syncStatus === 'draft' && (
              <Button size="sm" variant="secondary" onClick={() => setDiscardTarget(r.clientRecordId)}>
                Discard
              </Button>
            )}
          </div>
        </div>
      ))}

      <Modal
        isVisible={discardTarget !== null}
        onClose={() => setDiscardTarget(null)}
        variant="warning"
        title="Discard this draft?"
        message="It stays on the device (soft delete) but leaves the Records list."
        primaryButton={{
          text: 'Discard',
          variant: 'danger',
          onPress: () => {
            if (discardTarget) void discardSubmission(discardTarget);
            setDiscardTarget(null);
          },
        }}
        secondaryButton={{ text: 'Cancel', onPress: () => setDiscardTarget(null) }}
      />
    </div>
  );
}
