# StatusBadge

`src/ui/StatusBadge.tsx` — **built fresh, not adapted.**

## Important caveat

Retayl's `RetaylStatusDropdown.tsx` imports `./RetaylStatusBadge`, which was
**not included** in the files handed over — the same missing-dependency
situation as `Switch`. There was no badge source to tailor.

It's also arguably the wrong shape for this app even if it had been
included: `RetaylStatusDropdown` is a **user-editable** dropdown for
changing a status value (e.g. an order status a staff member picks from a
list). Every status this app displays — a submission's `syncStatus`
(`draft`/`pending`/`syncing`/`synced`/`failed`/`failedPermanent`/`conflict`)
— is **system-derived** by the sync engine; nothing in this app lets a user
manually pick a sync status from a menu. So instead of reconstructing a
generic, missing, user-editable dropdown, this is a plain read-only badge,
typed directly against this project's own `SyncStatus` domain type
(`src/domain/types.ts`) rather than a generic `variant` string.

## Use case

The colored status pill shown per record in `RecordsScreen.tsx` and per
queue entry in `DiagnosticsScreen.tsx` — currently rendered as
`<span className={`badge badge-${status}`}>` with matching CSS classes in
`styles.css`. This component is the same visual result as a typed component
instead of string-templated class names.

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `status` | `SyncStatus` | One of the seven sync states; label and color are looked up internally — nothing else to configure. |

## Usage

```tsx
import { StatusBadge } from '../ui';

<StatusBadge status={record.syncStatus} />
```
