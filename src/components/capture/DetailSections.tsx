/** Visit, Component, Deficiency, Risk & priority, and Actions sections (spec §4.2 layout). */
import type { Submission } from '../../domain/types';
import { COMPONENT_TYPES, DEFICIENCY_CATEGORIES, PRIORITIES, RISK_LEVELS } from '../../domain/lookups';
import { Select, YesNo } from '../fields';
import { FieldReferenceHelper } from './FieldReferenceHelper';

export type SetField = <K extends keyof Submission>(key: K, value: Submission[K]) => void;

interface SectionProps {
  form: Submission;
  set: SetField;
}

export function VisitSection({ form, set }: SectionProps) {
  return (
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
      <YesNo label="PPE Requirements Met" value={form.ppeRequirementsMet} onChange={(v) => set('ppeRequirementsMet', v)} />
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
  );
}

export function ComponentSection({ form, set }: SectionProps) {
  const componentType = COMPONENT_TYPES.find((c) => c.name === form.componentType);
  return (
    <section className="card">
      <h2>Component</h2>
      <Select
        label="Component Type"
        required
        value={form.componentType}
        options={COMPONENT_TYPES.map((c) => c.name)}
        onChange={(v) => {
          // changing the parent clears the dependent (spec §4.3)
          set('componentType', v);
          set('subComponent', '');
        }}
      />
      <Select
        label="Sub-Component"
        value={form.subComponent}
        options={componentType?.subComponents ?? []}
        onChange={(v) => set('subComponent', v)}
        placeholder={componentType && componentType.subComponents.length === 0 ? 'None defined for this type' : 'Select…'}
      />
    </section>
  );
}

export function DeficiencySection({ form, set }: SectionProps) {
  const category = DEFICIENCY_CATEGORIES.find((c) => c.label === form.deficiencyCategory);
  return (
    <section className="card">
      <h2>Deficiency</h2>
      <p className="field-hint">Choose the Deficiency Category first — it filters the three lists below.</p>
      <Select
        label="Deficiency Category"
        required
        value={form.deficiencyCategory}
        options={DEFICIENCY_CATEGORIES.map((c) => c.label)}
        onChange={(v) => {
          // changing the category clears all three dependents (spec §4.3)
          set('deficiencyCategory', v);
          set('detailedDescription', '');
          set('mechanism', '');
          set('focusArea', '');
        }}
      />
      {category?.definition && <p className="field-hint">{category.definition}</p>}
      <Select
        label="Detailed Description"
        required
        value={form.detailedDescription}
        options={category?.descriptions ?? []}
        onChange={(v) => set('detailedDescription', v)}
      />
      <Select label="Mechanism" value={form.mechanism} options={category?.mechanisms ?? []} onChange={(v) => set('mechanism', v)} />
      <Select label="Focus Area" value={form.focusArea} options={category?.focusAreas ?? []} onChange={(v) => set('focusArea', v)} />
      <YesNo label="Vibration Present" value={form.vibrationPresent} onChange={(v) => set('vibrationPresent', v)} />
      <FieldReferenceHelper />
    </section>
  );
}

export function RiskPrioritySection({ form, derived, set }: SectionProps & { derived: Submission }) {
  return (
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
  );
}

export function ActionsSection({ form, derived, set }: SectionProps & { derived: Submission }) {
  return (
    <section className="card">
      <h2>Actions</h2>
      <label className="field">
        <span className="field-label">Recommended Action</span>
        <textarea rows={3} value={form.recommendedAction} onChange={(e) => set('recommendedAction', e.target.value)} />
      </label>
      <YesNo
        label="Immediate Site Notification"
        value={derived.immediateSiteNotification}
        onChange={(v) => set('immediateSiteNotification', v)}
        disabled={derived.priorityRating === 'P1'}
        hint={derived.priorityRating === 'P1' ? 'Forced to Yes for P1.' : undefined}
      />
      <YesNo
        label="Further Investigation Required"
        value={form.furtherInvestigationRequired}
        onChange={(v) => set('furtherInvestigationRequired', v)}
      />
      <YesNo label="NDT Required" value={form.ndtRequired} onChange={(v) => set('ndtRequired', v)} />
    </section>
  );
}
