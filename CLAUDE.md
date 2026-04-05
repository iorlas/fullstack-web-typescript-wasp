# fullstack-web-typescript-wasp

Fullstack TypeScript web app template built with [Wasp](https://wasp.sh) v0.22.

## Stack

- **Framework:** Wasp 0.22 (React 19 + Node.js + Express)
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS 4
- **Auth:** Email (Dummy provider in dev)
- **E2E Tests:** Playwright

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
wasp db seed                          # Seed database (if configured)

# Quality gates
make lint                             # Lint (biome + agent-harness)
make fix                              # Auto-fix + lint
make check                            # Full quality gate (lint + test)
make test                             # Run e2e tests
agent-harness lint                    # Direct harness invocation
agent-harness fix                     # Direct harness fix

# E2E tests (requires running app)
cd e2e-tests && npm run e2e           # Run Playwright tests
cd e2e-tests && npm run e2e:ui        # Playwright UI mode
cd e2e-tests && npm run e2e:headed    # Run in headed browser

# Build
wasp build                            # Production build
```

## Wasp Concepts

- **`main.wasp`** — DSL config defining the app: routes, pages, queries (read), actions (write), auth, jobs
- **`schema.prisma`** — Prisma schema for database models
- **Queries** — Server functions for reading data. Declared in `main.wasp`, implemented in `src/*/queries.ts`. Used client-side via `useQuery` hook (auto-cached, auto-invalidated)
- **Actions** — Server functions for writing data. Declared in `main.wasp`, implemented in `src/*/actions.ts`. Called directly from client code. Auto-invalidates related queries
- **Pages** — React components bound to routes via `main.wasp`
- **Auth** — Built-in, configured in `main.wasp`. `authRequired: true` on pages protects them

## Adding a New Feature

1. Define models in `schema.prisma`
2. Run `wasp db migrate-dev` to apply schema changes
3. Declare queries/actions in `main.wasp` with entity bindings
4. Implement server functions in `src/<feature>/queries.ts` and `src/<feature>/actions.ts`
5. Create page component in `src/<feature>/`
6. Add route + page in `main.wasp`
7. Add e2e tests in `e2e-tests/tests/`

## Testing Strategy

- **Unit/integration:** `wasp test client` (Vitest, for React components)
- **E2E:** Playwright in `e2e-tests/` (requires running app + database)
- E2E tests should cover: auth flows, CRUD operations, navigation
- Always run `make check` before committing

## TypeScript & Wasp SDK

Wasp generates TypeScript types at `.wasp/out/sdk/wasp` during `wasp start`. Direct `tsc --noEmit` will fail until the dev server has been run at least once. Type checking happens implicitly through:
- `wasp start` (catches compilation errors in real-time)
- `wasp build` (full type check during production build)

The `agent-harness lint` typecheck step (tsc) will report `wasp/*` module errors — this is expected when the Wasp SDK hasn't been generated yet. Run `wasp start` first to generate the SDK.

## Code Style

- TypeScript strict mode
- Biome for linting and formatting (configured in `biome.json`)
- Tailwind for styling (no CSS modules)
- Follow existing patterns in `src/tasks/` for new features
