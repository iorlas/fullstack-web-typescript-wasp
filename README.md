# fullstack-web-typescript-wasp

Fullstack TypeScript web app template optimized for AI-assisted development.

Built with [Wasp](https://wasp.sh) v0.22 — React 19, Node.js/Express, PostgreSQL, Tailwind CSS 4.

## What's included

- **Auth** — Google OAuth + email/password (built-in, zero config for dev)
- **Task CRUD** — Full working example: queries, actions, components, pages
- **E2E tests** — Playwright with automatic DB + app lifecycle via wasp-app-runner
- **Quality gates** — Biome linting/formatting, TypeScript strict mode, agent-harness checks, pre-commit hooks
- **AI-ready** — CLAUDE.md with dev commands, TDD workflow, feature creation guide

## Quick start

```bash
git clone https://github.com/iorlas/fullstack-web-typescript-wasp.git
cd fullstack-web-typescript-wasp
make bootstrap    # installs deps, env files, Playwright browsers, compiles SDK
```

Then:

```bash
make dev          # starts PostgreSQL + dev server
```

App runs at http://localhost:3000.

## Prerequisites

- **Node.js** >= 22
- **Docker** (running) — for PostgreSQL
- **Wasp CLI** — `npm i -g @wasp.sh/wasp-cli@latest`

`make bootstrap` verifies all prerequisites and sets everything up.

## Development workflow

```bash
make fix          # auto-fix formatting
make lint         # wasp compile → tsc → biome → agent-harness
make test         # starts DB + app → runs Playwright e2e → tears down
make check        # lint + test (full quality gate)
```

### Adding a new feature

1. Define model in `schema.prisma`
2. `wasp db migrate-dev`
3. Declare queries/actions in `main.wasp`
4. `wasp compile` (generates TypeScript types)
5. Implement in `src/<feature>/`
6. Write e2e tests in `e2e-tests/tests/`
7. `make check`

See [CLAUDE.md](CLAUDE.md) for detailed documentation.

## Project structure

```
main.wasp            App config (routes, pages, queries, actions, auth)
schema.prisma        Database models (Prisma)
src/
  auth/              Google OAuth + email/password auth pages
  tasks/             Task CRUD example (follow this pattern)
  shared/            Reusable UI components
e2e-tests/           Playwright e2e tests
Makefile             Dev commands (bootstrap, lint, fix, test, check)
CLAUDE.md            AI agent instructions
```

## Google OAuth setup (optional)

Email/password auth works out of the box. For Google login:

1. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
2. Set redirect URI to `http://localhost:3001/auth/google/callback`
3. Edit `.env.server` with your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
