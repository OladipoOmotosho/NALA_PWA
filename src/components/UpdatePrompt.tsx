/** SW update flow (PRD §7.1): prompt to reload, never silently swap mid-capture. */
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

let updateFn: ((reload?: boolean) => Promise<void>) | null = null;

export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    updateFn = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });
    return () => {
      updateFn = null;
    };
  }, []);

  if (!needRefresh) return null;
  return (
    <div className="update-prompt" role="alert">
      <span>A new app version is ready.</span>
      <button type="button" className="btn btn-small" onClick={() => void updateFn?.(true)}>
        Reload
      </button>
      <button type="button" className="btn btn-small btn-secondary" onClick={() => setNeedRefresh(false)}>
        Later
      </button>
    </div>
  );
}
