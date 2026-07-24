/** Screen 2 of 2: the records list, with sync diagnostics and settings folded
 * in as collapsible sections — everything that isn't capture lives here. */
import { RecordsScreen } from './RecordsScreen';
import { DiagnosticsScreen } from './DiagnosticsScreen';
import { SettingsScreen } from './SettingsScreen';

interface Props {
  onEdit: (clientRecordId: string) => void;
}

export function RecordsHubScreen({ onEdit }: Props) {
  return (
    <div className="records-hub">
      <RecordsScreen onEdit={onEdit} />
      <details className="collapse">
        <summary>🔧 Sync &amp; diagnostics</summary>
        <DiagnosticsScreen />
      </details>
      <details className="collapse">
        <summary>⚙️ Settings</summary>
        <SettingsScreen />
      </details>
    </div>
  );
}
