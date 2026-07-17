/** Backend + identity configuration (token in IndexedDB meta, cleared on logout — PRD §9.3). */
import { useEffect, useState } from 'react';
import { getMeta, setMeta } from '../db/meta';

export function SettingsScreen() {
  const [backendUrl, setBackendUrl] = useState('');
  const [engineerEmail, setEngineerEmail] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [token, setToken] = useState('');
  const [saved, setSaved] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      setBackendUrl((await getMeta<string>('backendUrl')) ?? '');
      setEngineerEmail((await getMeta<string>('engineerEmail')) ?? '');
      setInspectorName((await getMeta<string>('inspectorName')) ?? '');
      setToken((await getMeta<string>('authToken')) ?? '');
      if (navigator.storage?.persisted) setPersisted(await navigator.storage.persisted());
    })();
  }, []);

  const save = async () => {
    await setMeta('backendUrl', backendUrl.trim());
    await setMeta('engineerEmail', engineerEmail.trim());
    await setMeta('inspectorName', inspectorName.trim());
    await setMeta('authToken', token.trim() || null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const logout = async () => {
    await setMeta('authToken', null);
    await setMeta('authTokenExpiry', null);
    setToken('');
  };

  return (
    <div className="settings">
      <section className="card">
        <h2>Backend</h2>
        <label className="field">
          <span className="field-label">Backend URL (n8n webhook base)</span>
          <input
            type="url"
            value={backendUrl}
            placeholder="https://example.app.n8n.cloud/webhook"
            onChange={(e) => setBackendUrl(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Bearer token</span>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} />
        </label>
      </section>

      <section className="card">
        <h2>Identity</h2>
        <label className="field">
          <span className="field-label">Engineer email</span>
          <input type="email" value={engineerEmail} onChange={(e) => setEngineerEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Inspector name (prefills the form)</span>
          <input type="text" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} />
        </label>
      </section>

      <section className="card">
        <h2>Device</h2>
        <p className="muted">
          Persistent storage:{' '}
          {persisted === null ? 'unknown' : persisted ? 'granted — data protected from eviction' : 'not granted (best-effort)'}
        </p>
        <div className="btn-col">
          <button type="button" className="btn btn-primary" onClick={() => void save()}>
            Save settings
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => void logout()}>
            Log out (clear token)
          </button>
        </div>
        {saved && <p className="toast">Settings saved.</p>}
      </section>
    </div>
  );
}
