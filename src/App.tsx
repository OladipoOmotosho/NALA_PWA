import { useEffect, useState } from 'react';
import { SyncBanner } from './components/SyncBanner';
import { UpdatePrompt } from './components/UpdatePrompt';
import { CaptureScreen } from './screens/CaptureScreen';
import { RecordsHubScreen } from './screens/RecordsHubScreen';
import { startEngine } from './sync/engine';
import { requestPersistentStorage } from './db/storage';

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
    <div className="app">
      <SyncBanner />
      <UpdatePrompt />
      <main className="content">
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
      <nav className="tabbar">
        <button type="button" className={tab === 'capture' ? 'tab active' : 'tab'} onClick={newCapture}>
          ➕ New Inspection
        </button>
        <button type="button" className={tab === 'records' ? 'tab active' : 'tab'} onClick={() => setTab('records')}>
          📋 Records
        </button>
      </nav>
    </div>
  );
}
