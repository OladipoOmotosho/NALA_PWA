/** SW update flow (PRD §7.1): prompt to reload, never silently swap mid-capture. */
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { Button } from '../ui/Button';
import styles from './UpdatePrompt.module.css';

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
    <div className={styles.prompt} role="alert">
      <span>A new app version is ready.</span>
      <Button size="sm" onClick={() => void updateFn?.(true)}>
        Reload
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setNeedRefresh(false)}>
        Later
      </Button>
    </div>
  );
}
