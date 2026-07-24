/**
 * Core data entry orchestration (PRD §7.4–§7.7). Section markup lives in
 * components/capture/*; this screen owns form state, asset resolution, GPS,
 * validation, and the durable save.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Submission } from '../domain/types';
import {
  applyDerived,
  getSubmission,
  newSubmission,
  previousForAsset,
  saveSubmission,
  validateForSubmit,
} from '../db/submissions';
import { getAsset } from '../db/assets';
import { getGpsFix } from '../util/gps';
import { Scanner } from '../components/Scanner';
import { AssetSection } from '../components/capture/AssetSection';
import {
  ActionsSection,
  ComponentSection,
  DeficiencySection,
  RiskPrioritySection,
  VisitSection,
  type SetField,
} from '../components/capture/DetailSections';
import { PhotoSection } from '../components/capture/PhotoSection';
import { triggerFlush } from '../sync/engine';
import { Button } from '../ui/Button';

interface Props {
  /** Resume an existing draft/record; undefined = new capture. */
  editRecordId?: string;
  onDone: () => void;
}

export function CaptureScreen({ editRecordId, onDone }: Props) {
  const [form, setForm] = useState<Submission | null>(null);
  const [scanning, setScanning] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const gpsRequested = useRef(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const initial = editRecordId ? await getSubmission(editRecordId) : await newSubmission();
      if (alive && initial) setForm(initial);
    })();
    return () => {
      alive = false;
    };
  }, [editRecordId]);

  // GPS: one non-blocking attempt per capture (PRD §7.6).
  useEffect(() => {
    if (!form || gpsRequested.current || form.locationSource === 'gps') return;
    gpsRequested.current = true;
    void getGpsFix().then((fix) => {
      setForm((f) => (f && f.locationSource !== 'gps' ? { ...f, ...fix } : f));
    });
  }, [form]);

  const set = useCallback<SetField>((key, value) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }, []);

  if (!form) return <p className="muted">Loading…</p>;
  const derived = applyDerived(form);

  const resolveAsset = async (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const asset = await getAsset(trimmed);
    if (asset) {
      setForm((f) =>
        f
          ? {
              ...f,
              assetTag: trimmed,
              siteCode: asset.siteCode,
              parentAsset: asset.parentAsset,
              assetCategory: asset.assetCategory,
              assetUnresolved: false,
              latitude: f.locationSource === 'gps' ? f.latitude : (asset.latitude ?? f.latitude),
              longitude: f.locationSource === 'gps' ? f.longitude : (asset.longitude ?? f.longitude),
            }
          : f,
      );
    } else {
      // Unknown tag offline: still allow save, flag for server resolution (PRD §7.5).
      setForm((f) => (f ? { ...f, assetTag: trimmed, assetUnresolved: true } : f));
    }
  };

  const copyForward = async () => {
    const prev = await previousForAsset(form.assetTag);
    if (!prev) {
      setToast('No previous inspection for this asset on this device.');
      return;
    }
    setForm((f) =>
      f
        ? {
            ...f,
            equipmentType: prev.equipmentType,
            componentType: prev.componentType,
            subComponent: prev.subComponent,
            deficiencyCategory: prev.deficiencyCategory,
            detailedDescription: prev.detailedDescription,
            mechanism: prev.mechanism,
            focusArea: prev.focusArea,
          }
        : f,
    );
    setToast('Copied from previous inspection — review every field.');
  };

  const persist = async (status: 'draft' | 'pending') => {
    if (status === 'pending') {
      const miss = validateForSubmit(derived);
      if (miss.length > 0) {
        setMissing(miss);
        setToast(null);
        return;
      }
    }
    setMissing([]);
    const saved = await saveSubmission(derived, status);
    setForm(saved);
    setSavedAt(Date.now());
    if (status === 'pending') {
      setToast('Saved on device — will sync when back online.');
      void triggerFlush(); // harmless offline: heartbeat fails fast
      onDone();
    } else {
      setToast('Draft saved on device.');
    }
  };

  /** Photos attach to a persisted record; keep drafts as drafts, queued records queued. */
  const ensurePersisted = async () => {
    const saved = await saveSubmission(derived, form.syncStatus === 'draft' ? 'draft' : 'pending');
    setForm(saved);
  };

  return (
    <div className="capture">
      {scanning && (
        <Scanner
          onDetected={(v) => {
            setScanning(false);
            void resolveAsset(v);
          }}
          onClose={() => setScanning(false)}
        />
      )}

      {derived.priorityRating === 'P1' && (
        <div className="p1-banner" role="alert">
          P1 — CRITICAL. Immediate Site Notification is set to Yes. Call the site contact now.
        </div>
      )}

      <AssetSection
        form={form}
        set={set}
        onResolve={(v) => void resolveAsset(v)}
        onScan={() => setScanning(true)}
        onCopyForward={() => void copyForward()}
      />
      <VisitSection form={form} set={set} />
      <ComponentSection form={form} set={set} />
      <DeficiencySection form={form} set={set} />
      <RiskPrioritySection form={form} derived={derived} set={set} />
      <ActionsSection form={form} derived={derived} set={set} />
      <PhotoSection
        clientRecordId={form.clientRecordId}
        ensurePersisted={ensurePersisted}
        onMessage={setToast}
        onCountChange={(n) => set('photoCount', n)}
      />

      {missing.length > 0 && (
        <div className="validation-box" role="alert">
          Required before submit: {missing.join(', ')}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}

      <div className="actionbar">
        <Button variant="secondary" style={{ flex: 1 }} onClick={() => void persist('draft')}>
          Save draft
        </Button>
        <Button style={{ flex: 1 }} onClick={() => void persist('pending')}>
          Save &amp; queue
        </Button>
      </div>
      {savedAt && <p className="muted center">Saved locally at {new Date(savedAt).toLocaleTimeString()}</p>}
    </div>
  );
}
