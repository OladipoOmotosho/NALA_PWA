/** Visit, Component, Deficiency, Risk & priority, and Actions sections (spec §4.2 layout). */
import type { Submission } from "../../domain/types";
import {
  COMPONENT_TYPES,
  DEFICIENCY_CATEGORIES,
  PRIORITIES,
  RISK_LEVELS,
} from "../../domain/lookups";
import { CONSEQUENCE_LEVELS, LIKELIHOOD_LEVELS } from "../../domain/riskMatrix";
import { Select, YesNo } from "../fields";
import { TextInput } from "../../ui/TextInput";
import { FieldReferenceHelper } from "./FieldReferenceHelper";
import p from "../../styles/primitives.module.css";

export type SetField = <K extends keyof Submission>(
  key: K,
  value: Submission[K],
) => void;

interface SectionProps {
  form: Submission;
  set: SetField;
}

export function VisitSection({ form, set }: SectionProps) {
  return (
    <section className={p.card}>
      <h2>Visit details</h2>
      <div className={p.grid2}>
        <label className={p.field}>
          <span className={p.fieldLabel}>
            Inspection Date<span className={p.req}> *</span>
          </span>
          <input
            type="date"
            value={form.inspectionDate}
            onChange={(e) => set("inspectionDate", e.target.value)}
          />
        </label>
        <TextInput
          fieldLabel="Inspector Name"
          required
          value={form.inspectorName}
          onChangeText={(v) => set("inspectorName", v)}
        />
      </div>
      <div className={p.grid2}>
        <YesNo
          label="PPE Requirements Met"
          value={form.ppeRequirementsMet}
          onChange={(v) => set("ppeRequirementsMet", v)}
        />
        <TextInput
          fieldLabel="Equipment Type"
          placeholder="Free text"
          value={form.equipmentType}
          onChangeText={(v) => set("equipmentType", v)}
          infoMessage="Free text — the workbook's Yes/No validation on this column was a template defect."
        />
      </div>
    </section>
  );
}

export function ComponentSection({ form, set }: SectionProps) {
  const componentType = COMPONENT_TYPES.find(
    (c) => c.name === form.componentType,
  );
  return (
    <section className={p.card}>
      <h2>Component</h2>
      <div className={p.grid2}>
        <Select
          label="Component Type"
          required
          value={form.componentType}
          options={COMPONENT_TYPES.map((c) => c.name)}
          onChange={(v) => {
            // changing the parent clears the dependent (spec §4.3)
            set("componentType", v);
            set("subComponent", "");
          }}
        />
        <Select
          label="Sub-Component"
          value={form.subComponent}
          options={componentType?.subComponents ?? []}
          onChange={(v) => set("subComponent", v)}
          placeholder={
            componentType && componentType.subComponents.length === 0
              ? "None defined"
              : "Select…"
          }
        />
      </div>
    </section>
  );
}

export function DeficiencySection({ form, set }: SectionProps) {
  const category = DEFICIENCY_CATEGORIES.find(
    (c) => c.label === form.deficiencyCategory,
  );
  return (
    <section className={p.card}>
      <h2>Deficiency</h2>
      <p className={p.fieldHint}>
        Choose the Deficiency Category first — it filters the three lists below.
      </p>
      <Select
        label="Deficiency Category"
        required
        value={form.deficiencyCategory}
        options={DEFICIENCY_CATEGORIES.map((c) => c.label)}
        onChange={(v) => {
          // changing the category clears all three dependents (spec §4.3)
          set("deficiencyCategory", v);
          set("detailedDescription", "");
          set("mechanism", "");
          set("focusArea", "");
        }}
      />
      {category?.definition && (
        <p className={p.fieldHint}>{category.definition}</p>
      )}
      <Select
        label="Detailed Description"
        required
        value={form.detailedDescription}
        options={category?.descriptions ?? []}
        onChange={(v) => set("detailedDescription", v)}
      />
      <div className={p.grid2}>
        <Select
          label="Mechanism"
          value={form.mechanism}
          options={category?.mechanisms ?? []}
          onChange={(v) => set("mechanism", v)}
        />
        <Select
          label="Focus Area"
          value={form.focusArea}
          options={category?.focusAreas ?? []}
          onChange={(v) => set("focusArea", v)}
        />
      </div>
      <YesNo
        label="Vibration Present"
        value={form.vibrationPresent}
        onChange={(v) => set("vibrationPresent", v)}
      />
      <FieldReferenceHelper />
    </section>
  );
}

export function RiskPrioritySection({
  form,
  derived,
  set,
}: SectionProps & { derived: Submission }) {
  return (
    <section className={p.card}>
      <h2>Risk &amp; priority</h2>
      <div className={p.grid2}>
        <Select
          label="Consequence Severity"
          required
          value={form.consequenceSeverity}
          options={[...CONSEQUENCE_LEVELS]}
          onChange={(v) =>
            set("consequenceSeverity", v as Submission["consequenceSeverity"])
          }
        />
        <Select
          label="Likelihood"
          required
          value={form.likelihood}
          options={[...LIKELIHOOD_LEVELS]}
          onChange={(v) => set("likelihood", v as Submission["likelihood"])}
        />
      </div>
      <Select
        label="Most-Affected Consequence"
        value={form.mostAffectedConsequence}
        options={[...RISK_LEVELS]}
        onChange={(v) =>
          set(
            "mostAffectedConsequence",
            v as Submission["mostAffectedConsequence"],
          )
        }
      />
      <div className={p.contextGrid}>
        <div className={p.contextItem}>
          <span className={p.contextLabel}>Risk Rank (matrix)</span>
          <span className={p.contextValue}>{derived.riskRank ?? "—"}</span>
        </div>
        <div className={p.contextItem}>
          <span className={p.contextLabel}>Risk Rating</span>
          <span className={p.contextValue}>{derived.riskRating || "—"}</span>
        </div>
      </div>
      <Select
        label="Priority Rating"
        disabled
        value={derived.priorityRating}
        options={[...PRIORITIES]}
        onChange={() => undefined}
        placeholder="Auto-assigned"
        hint="Assigned by the Glencore matrix from Consequence × Likelihood (P1: 20–25 · P2: 15–19 · P3: 10–14 · P4: 5–9 · P5: 1–4)."
      />
      <div className={p.contextItem}>
        <span className={p.contextLabel}>Priority Description (derived)</span>
        <span className={p.contextValue}>
          {derived.priorityDescription || "—"}
        </span>
      </div>
    </section>
  );
}

export function ActionsSection({
  form,
  derived,
  set,
}: SectionProps & { derived: Submission }) {
  return (
    <section className={p.card}>
      <h2>Actions</h2>
      <TextInput
        fieldLabel="Recommended Action"
        multiline
        value={form.recommendedAction}
        onChangeText={(v) => set("recommendedAction", v)}
      />
      <YesNo
        label="Immediate Site Notification"
        value={derived.immediateSiteNotification}
        onChange={(v) => set("immediateSiteNotification", v)}
        disabled={derived.priorityRating === "P1"}
        hint={
          derived.priorityRating === "P1" ? "Forced to Yes for P1." : undefined
        }
      />
      <div className={p.grid2}>
        <YesNo
          label="Further Investigation Required"
          value={form.furtherInvestigationRequired}
          onChange={(v) => set("furtherInvestigationRequired", v)}
        />
        <YesNo
          label="NDT Required"
          value={form.ndtRequired}
          onChange={(v) => set("ndtRequired", v)}
        />
      </div>
    </section>
  );
}
