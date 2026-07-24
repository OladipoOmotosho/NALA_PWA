/** Screen 2 of 2: the records list, with sync diagnostics and settings folded
 * in as collapsible sections — everything that isn't capture lives here. */
import { RecordsScreen } from './RecordsScreen';
import { DiagnosticsScreen } from './DiagnosticsScreen';
import { SettingsScreen } from './SettingsScreen';

const SUMMARY_CLASS =
  "flex min-h-13 cursor-pointer list-none items-center px-3.5 text-base font-semibold [&::-webkit-details-marker]:hidden after:ml-auto after:text-muted after:transition-transform after:duration-150 after:ease-[ease] after:content-['▸'] group-open:after:rotate-90";

interface Props {
  onEdit: (clientRecordId: string) => void;
}

export function RecordsHubScreen({ onEdit }: Props) {
  return (
    <div>
      <RecordsScreen onEdit={onEdit} />
      <details className="group my-3 rounded-xl border border-line bg-card">
        <summary className={SUMMARY_CLASS}>🔧 Sync &amp; diagnostics</summary>
        <div className="px-2 pb-2">
          <DiagnosticsScreen />
        </div>
      </details>
      <details className="group my-3 rounded-xl border border-line bg-card">
        <summary className={SUMMARY_CLASS}>⚙️ Settings</summary>
        <div className="px-2 pb-2">
          <SettingsScreen />
        </div>
      </details>
    </div>
  );
}
