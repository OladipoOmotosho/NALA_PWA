/** Asset picker + grey read-only context block (the workbook's auto-fill columns). */
import type { Submission } from '../../domain/types';
import { SITES } from '../../domain/lookups';

interface Props {
  form: Submission;
  onTagChange: (tag: string) => void;
  onResolve: (tag: string) => void;
  onSiteChange: (site: string) => void;
  onScan: () => void;
  onCopyForward: () => void;
}

export function AssetSection({ form, onTagChange, onResolve, onSiteChange, onScan, onCopyForward }: Props) {
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
            onChange={(e) => onTagChange(e.target.value)}
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
      <div className="context-grid">
        <div className="context-item">
          <span className="context-label">Site</span>
          {form.assetUnresolved || !form.assetTag ? (
            <select value={form.siteCode} onChange={(e) => onSiteChange(e.target.value)}>
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
            {form.locationSource === 'gps' ? `GPS ±${Math.round(form.gpsAccuracyM ?? 0)} m` : 'GPS unavailable'}
          </span>
        </div>
      </div>
      {form.assetTag && (
        <button type="button" className="btn btn-secondary" onClick={onCopyForward}>
          Copy from previous inspection
        </button>
      )}
    </section>
  );
}
