/** Local records list with per-record sync badges (PRD §7.11). */
import { useLiveQuery } from 'dexie-react-hooks';
import type { Submission, SyncStatus } from '../domain/types';
import { discardSubmission, listActiveRecords } from '../db/submissions';

const BADGE: Record<SyncStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  syncing: 'Syncing…',
  synced: 'Synced',
  failed: 'Retrying',
  failedPermanent: 'Needs attention',
  conflict: 'Conflict',
};

interface Props {
  onEdit: (clientRecordId: string) => void;
}

export function RecordsScreen({ onEdit }: Props) {
  const records = useLiveQuery(listActiveRecords, [], [] as Submission[]);

  if (records.length === 0) {
    return <p className="muted center">No inspections on this device yet.</p>;
  }

  return (
    <div className="records">
      {records.map((r) => (
        <div key={r.clientRecordId} className="record-card">
          <div className="record-head">
            <strong>{r.assetTag || '(no asset)'}</strong>
            <span className={`badge badge-${r.syncStatus}`}>{BADGE[r.syncStatus]}</span>
          </div>
          <div className="record-sub">
            {r.siteCode || 'Site —'} · {r.deficiencyCategory ? r.deficiencyCategory.split(' - ')[0] : 'no category'} ·{' '}
            {r.priorityRating || 'P?'} · {r.inspectionDate}
            {r.photoCount > 0 && <> · 📷 {r.photoCount}</>}
          </div>
          {r.lastError && r.syncStatus !== 'synced' && <div className="record-error">{r.lastError}</div>}
          <div className="record-actions">
            <button type="button" className="btn btn-small" onClick={() => onEdit(r.clientRecordId)}>
              {r.syncStatus === 'draft' ? 'Resume' : 'Edit'}
            </button>
            {r.syncStatus === 'draft' && (
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={() => {
                  if (window.confirm('Discard this draft? It stays on the device (soft delete).')) {
                    void discardSubmission(r.clientRecordId);
                  }
                }}
              >
                Discard
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
