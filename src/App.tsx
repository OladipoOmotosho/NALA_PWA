import { useEffect, useState } from 'react';
import { SyncBanner } from './components/SyncBanner';
import { UpdatePrompt } from './components/UpdatePrompt';
import { CaptureScreen } from './screens/CaptureScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { DiagnosticsScreen } from './screens/DiagnosticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { startEngine } from './sync/engine';
import { requestPersistentStorage } from './db/storage';

type Tab = 'capture' | 'records' | 'diagnostics' | 'settings';

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
          <RecordsScreen
            onEdit={(id) => {
              setEditRecordId(id);
              setTab('capture');
            }}
          />
        )}
        {tab === 'diagnostics' && <DiagnosticsScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </main>
      <nav className="tabbar">
        <button type="button" className={tab === 'capture' ? 'tab active' : 'tab'} onClick={newCapture}>
          ➕ New
        </button>
        <button type="button" className={tab === 'records' ? 'tab active' : 'tab'} onClick={() => setTab('records')}>
          📋 Records
        </button>
        <button
          type="button"
          className={tab === 'diagnostics' ? 'tab active' : 'tab'}
          onClick={() => setTab('diagnostics')}
        >
          🔧 Sync
        </button>
        <button type="button" className={tab === 'settings' ? 'tab active' : 'tab'} onClick={() => setTab('settings')}>
          ⚙️ Setup
        </button>
      </nav>
    </div>
  );
}
