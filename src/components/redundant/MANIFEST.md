# Redundant components — manifest

Original component files from Dipo's "retayl" project, kept here for reference
only. **Excluded from the TypeScript project and ESLint** (see
`tsconfig.app.json`'s `exclude` and `eslint.config.js`'s `ignores`) — they
reference `react-native`, `@retayl/hooks`, `@retayl/utils`, `@retayl/fonts`,
`@retayl/icons`, `@retayl/redux`, `@mui/*`, and `lucide-react`, none of which
are dependencies of this project, so they will never compile here. They are
not dead code to clean up later — they're the source material the `ui/`
library was tailored from, kept for audit/reference.

For every file below, one of two things happened:

- **→ ui/X** — adapted into the tailored library at `src/ui/`. See
  `internal-docs/technical-documentation/X.md` for what changed and why.
- **Excluded** — a reason is given. Nothing here was silently dropped.

## Adapted into `src/ui/`

| Original file(s) | → | Notes |
| --- | --- | --- |
| `RetaylButton.tsx`, `RetaylButton.helpers.ts`, `useRetaylButtonStyles.ts` | `ui/Button.tsx` | `RetaylButtonContent.tsx` and `useRetaylButtonProps.ts` were referenced by the original but not included in the files handed over — reconstructed from usage. Dropped the buttonDropdown variant and the disabled-state tooltip (dead code — state was set but never flipped true). |
| `RetaylText.tsx`, `RetaylText.module.css` (empty placeholder) | `ui/Text.tsx` | Dropped the Matter font-family weight mapping (font not bundled here) and responsive font-size scaling (this app has no breakpoints to scale against). |
| `RetaylCheckbox.tsx` | `ui/Checkbox.tsx` | React Native `Animated.spring` → CSS transition. Sizes bumped to the 48px touch-target convention. |
| `RetaylRadio.tsx` | `ui/Radio.tsx` | Same treatment as Checkbox. |
| `RetaylSwitch.tsx` | `ui/Switch.tsx` | **Built fresh, not adapted** — the original is a 3-line re-export of `RetaylSwitchBase.tsx`, which was not included in the files handed over. No source existed to tailor. |
| `RetaylTextInput.web.tsx`, `RetaylTextInput.types.ts`, `useRetaylTextInput.ts` | `ui/TextInput.tsx` | One of the most directly portable — already plain HTML input/textarea. Dropped `sanitizeByInputType` (from the missing `@retayl/hooks`) and autoCapitalize/returnKeyType (React Native virtual-keyboard-only concepts). |
| `RetaylSelect.tsx`, `.types.ts`, `RetaylSelectDropdown.tsx`, `RetaylSelectOptionItem.tsx`, `RetaylSelectStyles.ts`, `useRetaylSelect.ts`, `useRetaylSelectMemoStyles.ts` | `ui/Select.tsx` | Six files consolidated into one (the original's split served that monorepo's per-file line-count lint rule, which doesn't apply here). Dropped backend-search mode, "add more options"/"header action" rows, per-item icon/image slots, configurable scrollbar style. `useWebStyleTag` (missing dependency) replaced with an inline `<style>` approach where needed. |
| `RetaylModal.tsx`, `.types.ts`, `.styles.ts`, `RetaylModalContent.tsx` | `ui/Modal.tsx` | Four files consolidated. Dropped modal stacking (`stackLevel` — this app never shows 2+ modals at once), `keyboardAware` (React Native-only), and the slide/scale animation-type switch (kept one fade+scale transition). |
| `RetaylTooltip.tsx` | `ui/Tooltip.tsx` | Dropped the `Platform.OS` native/web branching — this project is web-only. Portal + position-flip logic kept. |
| `RetaylCircularProgress.tsx` | `ui/Spinner.tsx` | Renamed — "Spinner" fits this app's actual uses (indeterminate loading, sync-in-progress) better than "CircularProgress", which implies the determinate-percentage use case this app never needs (kept anyway, costs nothing). |
| `RetaylAutocomplete.tsx`, `RetaylAutocompleteDropdown.tsx`, `RetaylAutocompleteHooks.ts`, `RetaylAutocompleteStyles.ts` | `ui/Autocomplete.tsx` | Re-architected, not just ported: the original clears its query back to empty after selection (built for "type to search server-side, click to add a chip"). This app's actual use (Parent Asset) needs a controlled free-text value with local static suggestions — no debounce, no server `onSearch`, no `minSearchLength`. Keyboard nav (↑/↓/Enter/Escape) kept. |
| — (none; new) | `ui/StatusBadge.tsx` | **Built fresh.** `RetaylStatusDropdown.tsx` imports `RetaylStatusBadge.tsx`, which was not included in the files handed over. It's also the wrong shape for this app regardless: `RetaylStatusDropdown` is a *user-editable* dropdown; every status this app shows (`SyncStatus`) is system-derived, never user-picked. Built a plain read-only badge instead, typed directly against the `SyncStatus` domain type. |

## Excluded (no `ui/` equivalent)

| File(s) | Why |
| --- | --- |
| `RetaylBackButton.tsx` | No navigation stack — this app is two flat tab screens (Capture / Records), never a push/pop stack a back button would control. |
| `RetaylButtonDropdown.tsx`, `useRetaylButtonDropdown.ts` | Split-button (button + attached dropdown menu) — no such control exists anywhere in this app's UI today. |
| `RetaylMultiSelect.tsx` | No multi-select field anywhere in the Inspection form or elsewhere. |
| `RetaylCheckboxSelect.tsx` | Same as MultiSelect — overlapping duplicate concept, no use case. |
| `RetaylTagInput.tsx`, `retaylTagInput.module.css` | No tag-entry field in this app. |
| `RetaylSearchInput.tsx`, `.types.ts`, `.spec.tsx` | No dedicated search screen exists yet (the Dataverse spec's "Asset Browser" search was never built). `ui/Autocomplete.tsx`'s search box already covers the one place this app filters a list by typing. |
| `RetaylSearchableDropdown.tsx`, `smartdropdown.module.css` | Overlapping duplicate of Select/Autocomplete; no distinct use case identified. |
| `RetaylCustomSearchComponent.tsx` | Same — another overlapping search/dropdown variant. |
| `RetaylDropdownMenu.web.tsx` | Overlaps Select/ButtonDropdown; no standalone context-menu use case in this app. |
| `RetaylImageUploader.tsx` | This app already has a more sophisticated, PRD-driven photo pipeline (`src/util/photos.ts`): client-side downscaling, storage-quota checks, an atomic per-record cap, IndexedDB persistence, and full Photo_Register metadata (date taken, inspector, description). A generic single-image uploader would be a regression, not a replacement. |
| `RetaylDatePicker.tsx` | Pulls in `@mui/x-date-pickers`, `@mui/material`, and `luxon` — a genuinely heavy new dependency footprint for one field. This app's native `<input type="date">` (in `VisitSection`) is simpler, has zero dependencies, and uses the OS's own date picker UI on mobile — arguably *better* for gloved outdoor field use than a custom JS date picker. Also depends on a missing `AnimatedLabel` file. |
| `RetaylWebModal.tsx` | A simpler, unused-by-`RetaylModal` duplicate of the same portal/overlay/scroll-lock pattern `RetaylModal.tsx` already implements itself. One Modal, not two. |
| `RetaylSuccessModal.tsx` | The file's own doc comment says `@deprecated Use <RetaylModal variant="success" /> instead` — folded into `ui/Modal.tsx`'s variant system directly. |
| `RetaylStatusDropdown.tsx` | User-editable status dropdown; this app's statuses are all system-derived (`SyncStatus`), never user-picked. Also depends on the missing `RetaylStatusBadge.tsx`. |
| `ToastContainer.tsx`, `ToastContainer.md` | Requires a Redux store (`react-redux` + `@retayl/redux`) — this app has no Redux anywhere; toasts are already handled with plain local `useState` per screen. |
| `TooltipContent.tsx` | Requires `@mui/material` — same heavy-dependency concern as DatePicker; `ui/Tooltip.tsx` already covers this need with zero new dependencies. |
| `RETAYLMODAL_GUIDE.md`, `RETAYLMODAL_README.md` | Documentation for the original Retayl monorepo's modal system (references `@retayl/components`, a `.native.tsx` variant, a migration guide that isn't present) — superseded by `internal-docs/technical-documentation/Modal.md`. |

## Files missing from the original transfer

These were imported by name but never included, discovered while adapting:

- `RetaylButtonContent.tsx`, `useRetaylButtonProps.ts` (needed by `RetaylButton.tsx`)
- `useWebStyleTag.ts` (needed by `RetaylSelect.tsx`, `RetaylTextInput.web.tsx`)
- `RetaylStatusBadge.tsx` (needed by `RetaylStatusDropdown.tsx`)
- `RetaylSwitchBase.tsx` (needed by `RetaylSwitch.tsx` — its *entire* implementation)
- `AnimatedLabel` (needed by `RetaylDatePicker.tsx`)

If any of these turn out to matter (most likely `RetaylSwitchBase`, since `ui/Switch.tsx` was built without a reference), send them over and the adapted version can be reconciled against the real original.
