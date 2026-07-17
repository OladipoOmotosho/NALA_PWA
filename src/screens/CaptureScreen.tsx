/**
 * Core data entry (PRD §7.4–§7.7; layout mirrors the Dataverse spec §4.2 sections).
 * Cascades replicate the workbook: Deficiency Category filters Description /
 * Mechanism / Focus Area; Component Type filters Sub-Component. Changing the
 * parent clears the dependents (spec §4.3).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Submission } from '../domain/types';
import {
  COMPONENT_TYPES,
  DEFICIENCY_CATEGORIES,
  PRIORITIES,
  RISK_LEVELS,
  SITES,
} from '../domain/lookups';
import { applyDerived, newSubmission, previousForAsset, saveSubmission, validateForSubmit } from '../db/submissions';
import { addPhoto, removePhoto, MAX_PHOTOS_PER_RECORD } from '../util/photos';
import { getGpsFix } from '../util/gps';
import { Scanner } from '../components/Scanner';
import { triggerFlush } from '../sync/engine';

interface Props {
  /** Resume an existing draft/record; undefined = new capture. */
  editRecordId?: string;
  onDone: () => void;
}

type YesNoField =
  | 'ppeRequirementsMet'
  | 'vibrationPresent'
  | 'immediateSiteNotification'
  | 'furtherInvestigationRequired'
  | 'ndtRequired';

function YesNo({
  label,
  value,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        <button
          type="button"
          className={value === true ? 'seg active' : 'seg'}
          disabled={disabled}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={value === false ? 'seg active' : 'seg'}
          disabled={disabled}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  required,
  placeholder = 'Select…',
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="req"> *</span>}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CaptureScreen({ editRecordId, onDone }: Props) {
  const [form, setForm] = useState<Submission | null>(null);
  const [scanning, setScanning] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gpsRequested = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const initial = editRecordId ? await db.submissions.get(editRecordId) : await newSubmission();
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

  const photos = useLiveQuery(
    () => (form ? db.photos.where('clientRecordId').equals(form.clientRecordId).toArray() : []),
    [form?.clientRecordId],
    [],
  );

  const set = useCallback(<K extends keyof Submission>(key: K, value: Submission[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }, []);

  const setYesNo = (key: YesNoField, v: boolean) => set(key, v);

  if (!form) return <p className="muted">Loading…</p>;
  const derived = applyDerived(form);

  const category = DEFICIENCY_CATEGORIES.find((c) => c.label === form.deficiencyCategory);
  const componentType = COMPONENT_TYPES.find((c) => c.name === form.componentType);

  const resolveAsset = async (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const asset = await db.assets.get(trimmed);
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

  const onPhotoPicked = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // ensure the record exists before attaching photos
    await saveSubmission(derived, form.syncStatus === 'draft' ? 'draft' : 'pending');
    for (const file of Array.from(files)) {
      const res = await addPhoto(form.clientRecordId, file);
      if (!res.ok) {
        setToast(
          res.reason === 'quota'
            ? 'Storage is nearly full — photo capture is blocked. Text capture still works.'
            : res.reason === 'cap'
              ? `Photo cap reached (${MAX_PHOTOS_PER_RECORD} per record).`
              : 'Could not read that image.',
        );
        break;
      }
      set('photoCount', res.photoCount);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
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

      <section className="card">
        <h2>Asset</h2>
        <div className="row">
          <label className="field grow">
            <span className="field-label">
              Asset ID<span className="req"> *</span>
            </span>
            <input
              type="text"
              value={form.assetTag}
              placeholder="Scan or type Asset ID"
              onChange={(e) => set('assetTag', e.target.value)}
              onBlur={(e) => void resolveAsset(e.target.value)}
            />
          </label>
          <button type="button" className="btn" onClick={() => setScanning(true)}>
            Scan
          </button>
        </div>
        {form.assetUnresolved && form.assetTag && (
          <p className="warn">Asset not in the local cache — saved as manual entry, flagged for server resolution.</p>
        )}
        <div className="context-grid">
          <div className="context-item">
            <span className="context-label">Site</span>
            {form.assetUnresolved || !form.assetTag ? (
              <select value={form.siteCode} onChange={(e) => set('siteCode', e.target.value)}>
                <option value="">Select site…</option>
                {SITES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span className="context-value">{form.siteCode || '—'}</span>
            )}
          </div>
          <div className="context-item">
            <span className="context-label">Parent Asset</span>
            <span className="context-value">{form.parentAsset || '—'}</span>
          </div>
          <div className="context-item">
            <span className="context-label">Category</span>
            <span className="context-value">{form.assetCategory || '—'}</span>
          </div>
          <div className="context-item">
            <span className="context-label">Location</span>
            <span className="context-value">
              {form.locationSource === 'gps'
                ? `GPS ±${Math.round(form.gpsAccuracyM ?? 0)} m`
                : 'GPS unavailable'}
            </span>
          </div>
        </div>
        {form.assetTag && (
          <button type="button" className="btn btn-secondary" onClick={() => void copyForward()}>
            Copy from previous inspection
          </button>
        )}
      </section>

      <section className="card">
        <h2>Visit details</h2>
        <label className="field">
          <span className="field-label">
            Inspection Date<span className="req"> *</span>
          </span>
          <input type="date" value={form.inspectionDate} onChange={(e) => set('inspectionDate', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">
            Inspector Name<span className="req"> *</span>
          </span>
          <input type="text" value={form.inspectorName} onChange={(e) => set('inspectorName', e.target.value)} />
        </label>
        <YesNo label="PPE Requirements Met" value={form.ppeRequirementsMet} onChange={(v) => setYesNo('ppeRequirementsMet', v)} />
        <label className="field">
          <span className="field-label">Equipment Type</span>
          <input
            type="text"
            value={form.equipmentType}
            placeholder="Free text (workbook Yes/No validation was a template defect)"
            onChange={(e) => set('equipmentType', e.target.value)}
          />
        </label>
      </section>

      <section className="card">
        <h2>Component</h2>
        <Select
          label="Component Type"
          required
          value={form.componentType}
          options={COMPONENT_TYPES.map((c) => c.name)}
          onChange={(v) => setForm((f) => (f ? { ...f, componentType: v, subComponent: '' } : f))}
        />
        <Select
          label="Sub-Component"
          value={form.subComponent}
          options={componentType?.subComponents ?? []}
          onChange={(v) => set('subComponent', v)}
          placeholder={componentType && componentType.subComponents.length === 0 ? 'None defined for this type' : 'Select…'}
        />
      </section>

      <section className="card">
        <h2>Deficiency</h2>
        <p className="field-hint">Choose the Deficiency Category first — it filters the three lists below.</p>
        <Select
          label="Deficiency Category"
          required
          value={form.deficiencyCategory}
          options={DEFICIENCY_CATEGORIES.map((c) => c.label)}
          onChange={(v) =>
            setForm((f) =>
              f ? { ...f, deficiencyCategory: v, detailedDescription: '', mechanism: '', focusArea: '' } : f,
            )
          }
        />
        {category?.definition && <p className="field-hint">{category.definition}</p>}
        <Select
          label="Detailed Description"
          required
          value={form.detailedDescription}
          options={category?.descriptions ?? []}
          onChange={(v) => set('detailedDescription', v)}
        />
        <Select
          label="Mechanism"
          value={form.mechanism}
          options={category?.mechanisms ?? []}
          onChange={(v) => set('mechanism', v)}
        />
        <Select
          label="Focus Area"
          value={form.focusArea}
          options={category?.focusAreas ?? []}
          onChange={(v) => set('focusArea', v)}
        />
        <YesNo label="Vibration Present" value={form.vibrationPresent} onChange={(v) => setYesNo('vibrationPresent', v)} />
      </section>

      <section className="card">
        <h2>Risk &amp; priority</h2>
        <Select
          label="Consequence Severity"
          required
          value={form.consequenceSeverity}
          options={[...RISK_LEVELS]}
          onChange={(v) => set('consequenceSeverity', v as Submission['consequenceSeverity'])}
        />
        <Select
          label="Most-Affected Consequence"
          value={form.mostAffectedConsequence}
          options={[...RISK_LEVELS]}
          onChange={(v) => set('mostAffectedConsequence', v as Submission['mostAffectedConsequence'])}
        />
        <Select
          label="Likelihood"
          required
          value={form.likelihood}
          options={[...RISK_LEVELS]}
          onChange={(v) => set('likelihood', v as Submission['likelihood'])}
        />
        <div className="context-grid">
          <div className="context-item">
            <span className="context-label">Risk Rank (derived)</span>
            <span className="context-value">{derived.riskRank ?? '—'}</span>
          </div>
          <div className="context-item">
            <span className="context-label">Risk Rating (derived)</span>
            <span className="context-value">{derived.riskRating || '—'}</span>
          </div>
        </div>
        <Select
          label="Priority Rating"
          required
          value={form.priorityRating}
          options={[...PRIORITIES]}
          onChange={(v) => set('priorityRating', v as Submission['priorityRating'])}
        />
        <div className="context-item">
          <span className="context-label">Priority Description (derived)</span>
          <span className="context-value">{derived.priorityDescription || '—'}</span>
        </div>
      </section>

      <section className="card">
        <h2>Actions</h2>
        <label className="field">
          <span className="field-label">Recommended Action</span>
          <textarea
            rows={3}
            value={form.recommendedAction}
            onChange={(e) => set('recommendedAction', e.target.value)}
          />
        </label>
        <YesNo
          label="Immediate Site Notification"
          value={derived.immediateSiteNotification}
          onChange={(v) => setYesNo('immediateSiteNotification', v)}
          disabled={derived.priorityRating === 'P1'}
          hint={derived.priorityRating === 'P1' ? 'Forced to Yes for P1.' : undefined}
        />
        <YesNo
          label="Further Investigation Required"
          value={form.furtherInvestigationRequired}
          onChange={(v) => setYesNo('furtherInvestigationRequired', v)}
        />
        <YesNo label="NDT Required" value={form.ndtRequired} onChange={(v) => setYesNo('ndtRequired', v)} />
      </section>

      <section className="card">
        <h2>
          Photos <span className="muted">({photos.length}/{MAX_PHOTOS_PER_RECORD})</span>
        </h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => void onPhotoPicked(e.target.files)}
        />
        <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
          Add photo
        </button>
        <div className="photo-grid">
          {photos.map((p) => (
            <figure key={p.photoId} className="photo-thumb">
              <img src={URL.createObjectURL(p.blob)} alt={p.filename} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
              <button type="button" className="photo-remove" aria-label="Remove photo" onClick={() => void removePhoto(p.photoId)}>
                ×
              </button>
            </figure>
          ))}
        </div>
      </section>

      {missing.length > 0 && (
        <div className="validation-box" role="alert">
          Required before submit: {missing.join(', ')}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}

      <div className="actionbar">
        <button type="button" className="btn btn-secondary" onClick={() => void persist('draft')}>
          Save draft
        </button>
        <button type="button" className="btn btn-primary" onClick={() => void persist('pending')}>
          Save &amp; queue
        </button>
      </div>
      {savedAt && <p className="muted center">Saved locally at {new Date(savedAt).toLocaleTimeString()}</p>}
    </div>
  );
}
