/** Backend + identity configuration (token in IndexedDB meta, cleared on logout — PRD §9.3). */
import { useEffect, useState } from 'react';
import { getMeta, setMeta } from '../db/meta';
import { TextInput } from '../ui/TextInput';
import { Button } from '../ui/Button';
import p from '../styles/primitives.module.css';

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
    <div>
      <section className={p.card}>
        <h2>Backend</h2>
        <TextInput
          fieldLabel="Backend URL (n8n webhook base)"
          inputMode="url"
          placeholder="https://example.app.n8n.cloud/webhook"
          value={backendUrl}
          onChangeText={setBackendUrl}
        />
        <TextInput fieldLabel="Bearer token" secureTextEntry value={token} onChangeText={setToken} />
      </section>

      <section className={p.card}>
        <h2>Identity</h2>
        <TextInput fieldLabel="Engineer email" inputMode="email" value={engineerEmail} onChangeText={setEngineerEmail} />
        <TextInput
          fieldLabel="Inspector name (prefills the form)"
          value={inspectorName}
          onChangeText={setInspectorName}
        />
      </section>

      <section className={p.card}>
        <h2>Device</h2>
        <p className={p.muted}>
          Persistent storage:{' '}
          {persisted === null ? 'unknown' : persisted ? 'granted — data protected from eviction' : 'not granted (best-effort)'}
        </p>
        <div className={p.btnCol}>
          <Button onClick={() => void save()}>Save settings</Button>
          <Button variant="secondary" onClick={() => void logout()}>
            Log out (clear token)
          </Button>
        </div>
        {saved && <p className={p.toast}>Settings saved.</p>}
      </section>
    </div>
  );
}
