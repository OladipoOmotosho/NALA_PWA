/** Asset picker: scan/type the Asset ID; Site, Parent Asset and Category
 * prefill from the asset cache when the tag resolves but stay editable —
 * registries are loaded per campaign and are often incomplete in the field. */
import type { Submission } from '../../domain/types';
import { SITES } from '../../domain/lookups';
import { FORM_OPTIONS } from '../../domain/formOptions';
import { Select } from '../fields';
import type { SetField } from './DetailSections';

interface Props {
  form: Submission;
  set: SetField;
  onResolve: (tag: string) => void;
  onScan: () => void;
  onCopyForward: () => void;
}

export function AssetSection({ form, set, onResolve, onScan, onCopyForward }: Props) {
  return (
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
            onBlur={(e) => onResolve(e.target.value)}
          />
        </label>
        <button type="button" className="btn" onClick={onScan}>
          Scan
        </button>
      </div>
      {form.assetUnresolved && form.assetTag && (
        <p className="warn">Asset not in the local cache — saved as manual entry, flagged for server resolution.</p>
      )}
      <div className="grid-2">
        <Select label="Site" value={form.siteCode} options={SITES} onChange={(v) => set('siteCode', v)} />
        <Select
          label="Category"
          value={form.assetCategory}
          options={[...FORM_OPTIONS.categories]}
          onChange={(v) => set('assetCategory', v)}
        />
      </div>
      <div className="grid-2">
        <label className="field">
          <span className="field-label">Parent Asset</span>
          <input
            type="text"
            value={form.parentAsset}
            placeholder="e.g. Blower Building"
            list="parent-asset-options"
            onChange={(e) => set('parentAsset', e.target.value)}
          />
          <datalist id="parent-asset-options">
            {FORM_OPTIONS.parentAssets.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <div className="field">
          <span className="field-label">Location</span>
          <div className="context-item">
            <span className="context-value">
              {form.locationSource === 'gps' ? `GPS ±${Math.round(form.gpsAccuracyM ?? 0)} m` : 'GPS unavailable'}
            </span>
          </div>
        </div>
      </div>
      {form.assetTag && (
        <button type="button" className="btn btn-secondary btn-small" onClick={onCopyForward}>
          Copy from previous inspection
        </button>
      )}
    </section>
  );
}
