# fullstack-web-typescript-wasp

Fullstack TypeScript web app template built with [Wasp](https://wasp.sh) v0.22.

## Stack

- **Framework:** Wasp 0.22 (React 19 + Node.js + Express)
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS 4
- **Auth:** Email (Dummy provider in dev)
- **E2E Tests:** Playwright + wasp-app-runner

## Project Structure

```
main.wasp          # App config: routes, pages, queries, actions, auth
schema.prisma      # Database models (Prisma)
src/               # Application source code
  auth/            # Auth pages (login, signup, password reset)
  tasks/           # Task CRUD (pages, components, queries, actions)
  tags/            # Tag CRUD (components, queries, actions)
  shared/          # Shared UI components (Button, Dialog, Header, Input)
  App.tsx          # Root component
e2e-tests/         # Playwright e2e tests (separate package)
```

## Dev Commands

```bash
# Start development
wasp start db                         # Start PostgreSQL (Docker)
wasp db migrate-dev                   # Run database migrations
wasp start                            # Start dev server (client :3000, server :3001)

# Database
wasp db studio                        # Open Prisma Studio GUI

# Quality gates
make fix                              # Auto-fix (biome format + lint fix)
make lint                             # wasp compile → tsc → agent-harness lint
make test                             # Start DB + app → Playwright → tear down
make check                            # lint + test (full gate)

# Build
wasp build                            # Production build
```

## Development Process

### Agent workflow (TDD)

1. Read spec/ticket
2. Write failing e2e test in `e2e-tests/tests/`
3. Implement feature: schema → `wasp db migrate-dev` → queries/actions → UI
4. `make check` — verifies lint + type check + e2e tests pass
5. Refactor, re-run `make check`

### How verification works

| Step | Command | What it does |
|------|---------|-------------|
| Fix | `make fix` | Biome auto-fix + format |
| Typecheck | `make typecheck` | `wasp compile` (generates SDK) → `tsc --noEmit` |
| Lint | `make lint` | typecheck + agent-harness (biome lint/format, conftest, yamllint) |
| Test | `make test` | Starts PostgreSQL + Wasp app via wasp-app-runner → Playwright → tears down |
| Full gate | `make check` | lint + test |

### How e2e tests work

Playwright's `webServer` config uses `@wasp.sh/wasp-app-runner` which automatically:
1. Starts a PostgreSQL container (Docker)
2. Runs `wasp db migrate-dev`
3. Starts `wasp start` non-interactively
4. Waits for the app to be ready
5. Tears everything down after tests complete

No manual service management needed. Just run `make test`.

### Troubleshooting

- **tsc errors about `wasp/*` modules:** Run `wasp compile` first (or `make typecheck`)
- **e2e tests hang:** Ensure Docker is running (`docker info`)
- **Port conflicts:** Kill existing processes on :3000/:3001 or let wasp-app-runner handle it

## Wasp Concepts

- **`main.wasp`** — DSL config: routes, pages, queries (read), actions (write), auth, jobs
- **`schema.prisma`** — Prisma schema for database models
- **Queries** — Server functions for reading data. Declared in `main.wasp`, implemented in `src/*/queries.ts`. Used client-side via `useQuery` hook (auto-cached, auto-invalidated)
- **Actions** — Server functions for writing data. Declared in `main.wasp`, implemented in `src/*/actions.ts`. Called directly from client. Auto-invalidates related queries
- **Pages** — React components bound to routes via `main.wasp`
- **Auth** — Built-in, configured in `main.wasp`. `authRequired: true` on pages protects them

## Adding a New Feature

1. Define models in `schema.prisma`
2. Run `wasp db migrate-dev` to apply schema changes
3. Declare queries/actions in `main.wasp` with entity bindings
4. Implement server functions in `src/<feature>/queries.ts` and `src/<feature>/actions.ts`
5. Create page component in `src/<feature>/`
6. Add route + page in `main.wasp`
7. Write e2e tests in `e2e-tests/tests/`
8. Run `make check` to verify everything

## Code Style

- TypeScript strict mode
- Biome for linting and formatting (configured in `biome.json`)
- Tailwind for styling (no CSS modules)
- Follow existing patterns in `src/tasks/` for new features
