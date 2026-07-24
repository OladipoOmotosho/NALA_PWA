/** Asset picker: scan/type the Asset ID; Site, Parent Asset and Category
 * prefill from the asset cache when the tag resolves but stay editable —
 * registries are loaded per campaign and are often incomplete in the field. */
import type { Submission } from '../../domain/types';
import { SITES } from '../../domain/lookups';
import { FORM_OPTIONS } from '../../domain/formOptions';
import { Select } from '../fields';
import { Button } from '../../ui/Button';
import { TextInput } from '../../ui/TextInput';
import { Autocomplete } from '../../ui/Autocomplete';
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
        <div className="grow">
          <TextInput
            fieldLabel="Asset ID"
            required
            value={form.assetTag}
            placeholder="Scan or type Asset ID"
            onChangeText={(v) => set('assetTag', v)}
            onBlur={() => onResolve(form.assetTag)}
          />
        </div>
        <Button onClick={onScan}>Scan</Button>
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
        <Autocomplete
          fieldLabel="Parent Asset"
          placeholder="e.g. Blower Building"
          value={form.parentAsset}
          onChangeText={(v) => set('parentAsset', v)}
          suggestions={FORM_OPTIONS.parentAssets}
        />
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
        <Button variant="secondary" onClick={onCopyForward}>
          Copy from previous inspection
        </Button>
      )}
    </section>
  );
}
