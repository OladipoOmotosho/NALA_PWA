/**
 * Field Reference guidance panel (Dataverse spec §3.1: Taxonomy Guide —
 * "optional... contextual guidance when an inspector is unsure what to
 * look for... has no effect on data capture").
 *
 * This is deliberately read-only and self-contained: Taxonomy's Category >
 * Equipment Type > Component > Subcomponent uses a different, more granular
 * equipment-process vocabulary than the Inspection record's Component Type
 * field (Details sheet), so it is never written back to the form — only
 * shown as a suggested Focus Area + Deficiency Mechanisms for the inspector
 * to cross-reference against their own Deficiency Category / Focus Area
 * picks.
 */
import { useState } from 'react';
import { deficiencyByLabel } from '../../domain/deficiencyReference';
import {
  componentsFor,
  equipmentTypesFor,
  subcomponentsFor,
  taxonomyCategories,
  taxonomyLeaf,
} from '../../domain/taxonomyQuery';
import { Select } from '../fields';
import { Button } from '../../ui/Button';
import p from '../../styles/primitives.module.css';

export function FieldReferenceHelper() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [component, setComponent] = useState('');
  const [subcomponent, setSubcomponent] = useState('');

  const leaf = taxonomyLeaf(category, equipmentType, component, subcomponent);

  return (
    <div className="mt-3">
      <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide' : 'Need help identifying this?'} Field Reference
      </Button>
      {open && (
        <div className="mt-2.5 rounded-md border border-dashed border-line bg-[#1a2438] p-3">
          <p className={p.fieldHint}>
            Guidance only — picks here are not saved on the inspection. Use them to help choose the Deficiency
            Category, Detailed Description, Mechanism and Focus Area above.
          </p>
          <Select
            label="Category"
            value={category}
            options={taxonomyCategories()}
            onChange={(v) => {
              setCategory(v);
              setEquipmentType('');
              setComponent('');
              setSubcomponent('');
            }}
          />
          <Select
            label="Equipment Type"
            value={equipmentType}
            options={equipmentTypesFor(category)}
            onChange={(v) => {
              setEquipmentType(v);
              setComponent('');
              setSubcomponent('');
            }}
          />
          <Select
            label="Component"
            value={component}
            options={componentsFor(category, equipmentType)}
            onChange={(v) => {
              setComponent(v);
              setSubcomponent('');
            }}
          />
          <Select
            label="Subcomponent"
            value={subcomponent}
            options={subcomponentsFor(category, equipmentType, component)}
            onChange={setSubcomponent}
          />
          {leaf && (
            <div className={p.contextGrid}>
              <div className={p.contextItem}>
                <span className={p.contextLabel}>Suggested Focus Area</span>
                <span className={p.contextValue}>{leaf.focusArea}</span>
              </div>
              <div className={p.contextItem}>
                <span className={p.contextLabel}>Suggested Mechanisms</span>
                <span className={p.contextValue}>
                  {leaf.mechanisms.map((m) => deficiencyByLabel(m)?.name ?? m).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
