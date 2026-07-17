# Contributing to Conduit

Branch, commit, and PR conventions (carried over from TrueHire).

## Branches

- Branch off `main`. Never commit directly to `main`.
- Name: `type/short-description` — e.g. `feat/notion-destination`,
  `fix/classifier-rejection-pattern`, `chore/spotless-config`.

## Commit messages — Conventional Commits

```
<type>(<optional scope>): <imperative summary>

<optional body — what changed and why>

<optional footer — trailers, breaking changes>
```

### Types

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | A new feature / user-facing capability      |
| `fix`      | A bug fix                                   |
| `docs`     | Documentation only                          |
| `test`     | Adding or correcting tests                  |
| `refactor` | Neither fixes a bug nor adds a feature      |
| `perf`     | A performance improvement                   |
| `chore`    | Maintenance: deps, config, tooling          |
| `ci`       | CI/CD configuration                         |
| `build`    | Build system (Maven/Gradle) or dependencies |
| `style`    | Formatting only, no logic change            |
| `revert`   | Reverts a previous commit                   |

> Bug fixes use **`fix`** (the Conventional Commits standard), not `bug`/`bugs`.

### Rules

- Imperative mood ("add", "fix", "remove"), summary ≤ ~72 chars.
- Optional scope: `feat(ingest):`, `fix(classifier):`, `ci(backend):`.
- Breaking change: `!` after type/scope + `BREAKING CHANGE:` footer.
- One logical change per commit.

### Examples

```
feat(ingest): accept forwarded emails via inbound webhook
fix(classifier): stop matching "intern" inside "international"
test(pipeline): add labeled fixtures for the 5 job-email types
ci(backend): add Spotless + Testcontainers Maven job
chore(repo): pin Spring Boot and regenerate the lockfile
```

### AI-assisted commits

```
remove all
```

## Pull requests

- Small and focused. PR title also follows the commit convention.
- Both CI jobs (`backend`, `frontend`) green before merge.

## Local checks before pushing

```bash
# Backend (Maven shown; Gradle equivalent if chosen)
./mvnw spotless:check
./mvnw test

# Frontend
yarn typecheck
yarn test
```
