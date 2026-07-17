# Engineering Practices — Conduit (Java/Spring + React)

The standards that worked on TrueHire, translated to this stack. The original
language-agnostic standards are preserved verbatim in `reference-standards/`
(written for Python/FastAPI + React — reuse the principles, adapt the specifics).

## Architecture

- **Layered, dependency-ordered:** `controller → service → repository`.
  Controllers are thin (HTTP + validation); business logic in services;
  persistence behind Spring Data repositories.
- **Strategy pattern for pluggable behavior:** `Classifier` (rule → later LLM),
  `Destination` (Notion → later own UI), `Source` (forward → Gmail). New
  behavior = new implementation, not an `if/else` ladder.
- **DTOs at the boundary;** never expose JPA entities directly in the API.
- **Bean Validation** (`@Valid`, `@NotNull`, …) on inbound DTOs.
- **Keep files small.** If a class/component grows past ~300 lines, split it
  (we learned this decomposing TrueHire's 800-line pages).

## Database & migrations

- **All schema changes via Flyway** (`V<N>__name.sql`), ordered and forward-only
  in prod; a `V1__baseline.sql` captures the initial schema with
  `CREATE TABLE IF NOT EXISTS` semantics so it's safe on an existing DB.
- **Never hand-edit production schema.** No ad-hoc `ALTER` scripts that aren't
  migrations.
- **JPA/Hibernate** for access; avoid N+1 (fetch joins / `@EntityGraph`);
  validate with `spring.jpa.show-sql` in dev.

## Testing

- **JUnit 5 + Mockito** for unit tests; **Testcontainers** for real-Postgres
  integration tests (don't mock the DB when behavior depends on it).
- **Every task ends with tests.** Bug fix → regression test first.
- **Tests never hit real/prod services.** Inject connections; spin a throwaway
  Postgres via Testcontainers; mock outbound HTTP (Notion/LLM).
- **Frontend:** Vitest + React Testing Library — unit-test the pure logic
  (parsers, formatters) and smoke-test the key pages.
- **The classifier needs a labeled fixture set** (your own ~300 emails). Treat
  parsing accuracy as a measured metric, not a vibe.

## Dependencies & builds

- **Pin versions** (Maven/Gradle lockfile or fixed versions). Reproducible
  builds; CI proves they install + tests pass on the target JDK.
- **One build tool** (Maven *or* Gradle) — pick and commit.

## CI (GitHub Actions)

- **`backend` job:** build, lint (Spotless/Checkstyle), `mvn/gradle test`
  (Testcontainers needs Docker on the runner — available by default).
- **`frontend` job:** `tsc --noEmit`, Vitest, build.
- Both **required** before merge (branch protection).
- Exclude tests needing live external creds from default CI (mark them).

## Code quality / linting

- **Spotless** (format) + **Checkstyle** (style) on backend — scope to
  real-bug rules first, tighten incrementally (mirrors how we scoped ruff on
  TrueHire: start with the high-value rules, don't churn the whole codebase).
- **ESLint + TypeScript strict** on frontend.

## Error handling & observability

- **No silent failures.** Catch narrowly; log with context. Fallback paths
  (rules ↔ LLM) log *which* ran.
- **`@ControllerAdvice`** for consistent API error responses (problem-detail
  shape), never leak stack traces to clients.
- **Health/readiness endpoint** that does a *real* dependency check (DB
  round-trip) — a health check must not lie (TrueHire lesson).
- **Structured logging**; never log secrets or full email bodies at info level.

## Security & privacy

- **Bring-your-own-keys:** all credentials (Gmail/Notion/LLM) come from config
  the self-hoster supplies; none committed. `.env`/secrets gitignored.
- **Least data:** store only what's needed; default to local processing; if an
  LLM is used, prefer local (Ollama) and document exactly what is sent.
- **Auth** on the dashboard (Spring Security + JWT) even for single-user.
- **Rate-limit / validate** the inbound webhook (it's a public endpoint).

## Git & commits

- Branch off `main` (`type/short-desc`); PR with green CI; **Conventional
  Commits** (`CONTRIBUTING.md`). Small, focused PRs.

## Definition of done (per task)

- Code + tests written, all green locally and in CI; lint/format clean;
  migration added if schema changed; observable (logs/health) where relevant;
  docs/spec updated; PR opened with a clear description.
