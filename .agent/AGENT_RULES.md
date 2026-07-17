# Agent Rules — Conduit

How an AI agent (and the human) should work on this project. Distilled from how
the TrueHire project was actually run. Read this before touching code.

## Operating mode

1. **Spec-driven.** Before building a feature, there is a `requirements.md`
   (what + acceptance criteria), a `design.md` (how + decisions/trade-offs), and
   a `tasks.md` (numbered, checkboxed, dependency-ordered). Code follows the
   spec; if reality diverges, update the spec.
2. **One task group at a time.** Work the tasks in dependency order. Keep a live
   todo list. One thing in-progress at a time.
3. **Every task group ends with a test task.** "No task is done until its tests
   pass." Bug fixes get a regression test that reproduces the bug first.
4. **Branch per task; never commit to `main`.** `type/short-desc`
   (`feat/...`, `fix/...`, `chore/...`). Open a PR; both CI jobs must be green
   before merge.
5. **Conventional Commits** (see `CONTRIBUTING.md`): `feat|fix|docs|test|
   refactor|perf|chore|ci|build|style`. Imperative summaries. AI-assisted
   commits carry the `Co-Authored-By` trailer.

## Truthfulness (non-negotiable)

6. **Verify, don't claim.** Never say something works without running it. Paste
   real output. If tests fail, say so with the output. If a step was skipped,
   say so.
7. **Investigate before reacting.** When something breaks, read the actual error
   and trace the cause (the TrueHire bugs — slowapi headers, the `logging`
   shadowing, the dead DB behind a "CORS" error — were all misleading on the
   surface). Don't fix the symptom.
8. **Diagnose misleading errors.** Browser "CORS error", a generic 500, a
   green-looking deploy — confirm the real state (curl it, read logs) before
   concluding.
9. **Flag, don't hide, bad news.** Surface failing tests, latent bugs, stale
   config, and honest trade-offs. Recommend; don't rubber-stamp.

## Engineering bar (see ENGINEERING_PRACTICES.md for detail)

10. **Migrations, never hand-edited prod schema.** All schema via the migration
    tool (Flyway). Migrations are ordered, idempotent where possible, and a
    baseline captures existing state non-destructively.
11. **Pin dependencies; reproducible builds.** CI proves the build + tests pass
    on the target runtime.
12. **Tests don't touch real/prod services.** Inject connections; use temp DBs
    (Testcontainers) / mocks. Mark anything needing live external services and
    exclude it from default CI.
13. **Observable degradation.** Fallback paths (e.g. rules vs LLM) log which
    path ran and surface in a health/status endpoint — no silent downgrades.
14. **Privacy first** (this app touches personal email): minimize what leaves
    the machine; default to local processing; document the data flow.

## Cost & scope discipline

15. **Value before users, value before signup, learned-ML last.** (The
    cold-start lessons.) Deterministic rules + public data first; the value
    moment needs no account; anything that needs user-volume data is gated on
    having that volume.
16. **Cut scope ruthlessly.** Ship the narrowest useful slice (PRD §7) before
    breadth. Defer multi-domain, own-destination UI, hosted mode, and LLMs until
    the core loop is dogfooded and working.
17. **Default to the $0 path** (PRD §9). No new paid service without a
    line-item reason. Free tiers / local / self-host first.

## Working with the human

18. **Ask only when genuinely blocked** on a decision that's theirs (a real
    fork with no sensible default). Otherwise pick the obvious option, state it,
    and proceed.
19. **Commit/push/merge only when asked** (or per a standing instruction). On
    `main`, branch first.
20. **Hand-off hygiene.** At the end of a session, summarize what shipped,
    what's verified, what's pending, and the exact next step.
