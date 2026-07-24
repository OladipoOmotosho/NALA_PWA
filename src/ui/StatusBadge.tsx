/**
 * NOTE: built fresh, not adapted. Retayl's RetaylStatusDropdown imports
 * `./RetaylStatusBadge`, which wasn't included in the files handed over —
 * so, like Switch, there was no source to tailor. It's also the wrong
 * shape for this app anyway: RetaylStatusDropdown is a user-editable
 * dropdown for changing a status value; every status shown in this app
 * (a submission's syncStatus, draft/pending/synced/failed/...) is
 * system-derived, never user-picked. So this is a plain read-only badge,
 * tailored to this project's SyncStatus domain type rather than a generic
 * `variant` prop.
 *
 * See internal-docs/technical-documentation/StatusBadge.md.
 */
import type { SyncStatus } from '../domain/types';
import { cx } from './cx';
import styles from './StatusBadge.module.css';

const LABEL: Record<SyncStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  syncing: 'Syncing…',
  synced: 'Synced',
  failed: 'Retrying',
  failedPermanent: 'Needs attention',
  conflict: 'Conflict',
};

export interface StatusBadgeProps {
  status: SyncStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={cx(styles.badge, styles[status])}>{LABEL[status]}</span>;
}
