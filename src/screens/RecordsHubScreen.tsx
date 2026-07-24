/** Screen 2 of 2: the records list, with sync diagnostics and settings folded
 * in as collapsible sections — everything that isn't capture lives here. */
import { RecordsScreen } from './RecordsScreen';
import { DiagnosticsScreen } from './DiagnosticsScreen';
import { SettingsScreen } from './SettingsScreen';
import styles from './RecordsHubScreen.module.css';

interface Props {
  onEdit: (clientRecordId: string) => void;
}

export function RecordsHubScreen({ onEdit }: Props) {
  return (
    <div>
      <RecordsScreen onEdit={onEdit} />
      <details className={styles.collapse}>
        <summary>🔧 Sync &amp; diagnostics</summary>
        <DiagnosticsScreen />
      </details>
      <details className={styles.collapse}>
        <summary>⚙️ Settings</summary>
        <SettingsScreen />
      </details>
    </div>
  );
}
