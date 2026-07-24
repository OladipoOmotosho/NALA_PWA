import { useEffect, useState } from 'react';
import { SyncBanner } from './components/SyncBanner';
import { UpdatePrompt } from './components/UpdatePrompt';
import { CaptureScreen } from './screens/CaptureScreen';
import { RecordsHubScreen } from './screens/RecordsHubScreen';
import { startEngine } from './sync/engine';
import { requestPersistentStorage } from './db/storage';
import { cx } from './ui/cx';

/** Two screens total (field-usability decision 2026-07-24): capture, and a
 * records hub that folds in sync diagnostics + settings as collapsibles. */
type Tab = 'capture' | 'records';

export default function App() {
  const [tab, setTab] = useState<Tab>('capture');
  const [editRecordId, setEditRecordId] = useState<string | undefined>(undefined);
  // remounts the capture form for a fresh record
  const [captureKey, setCaptureKey] = useState(0);

  useEffect(() => {
    void requestPersistentStorage();
    return startEngine();
  }, []);

  const newCapture = () => {
    setEditRecordId(undefined);
    setCaptureKey((k) => k + 1);
    setTab('capture');
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <SyncBanner />
      <UpdatePrompt />
      <main className="mx-auto w-full max-w-160 flex-1 px-3 pt-3 pb-24">
        {tab === 'capture' && (
          <CaptureScreen
            key={editRecordId ?? `new-${captureKey}`}
            editRecordId={editRecordId}
            onDone={() => {
              setEditRecordId(undefined);
              setTab('records');
            }}
          />
        )}
        {tab === 'records' && (
          <RecordsHubScreen
            onEdit={(id) => {
              setEditRecordId(id);
              setTab('capture');
            }}
          />
        )}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          className={cx('min-h-14 flex-1 border-none bg-transparent text-sm text-muted', tab === 'capture' && 'font-bold text-teal')}
          onClick={newCapture}
        >
          ➕ New Inspection
        </button>
        <button
          type="button"
          className={cx('min-h-14 flex-1 border-none bg-transparent text-sm text-muted', tab === 'records' && 'font-bold text-teal')}
          onClick={() => setTab('records')}
        >
          📋 Records
        </button>
      </nav>
    </div>
  );
}
