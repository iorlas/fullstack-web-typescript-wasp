.PHONY: bootstrap lint fix check test typecheck dev db migrate

# --- Setup ---

bootstrap:
	@echo "=== Checking prerequisites ==="
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install Node >= 22: https://nodejs.org"; exit 1; }
	@command -v wasp >/dev/null 2>&1 || { echo "❌ Wasp CLI not found. Install: npm i -g @wasp.sh/wasp-cli@latest"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found. Install: https://docs.docker.com/get-docker/"; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "❌ Docker is not running. Start Docker first."; exit 1; }
	@echo "✅ Prerequisites OK"
	@echo ""
	@echo "=== Installing dependencies ==="
	npm install
	cd e2e-tests && npm install
	@echo ""
	@echo "=== Setting up env files ==="
	@if [ ! -f .env.server ]; then \
		cp env.server.example .env.server; \
		echo "✅ Created .env.server from example (edit with real Google OAuth credentials for Google login)"; \
	else \
		echo "✅ .env.server already exists"; \
	fi
	@echo ""
	@echo "=== Installing Playwright browsers ==="
	cd e2e-tests && npx playwright install chromium
	@echo ""
	@echo "=== Compiling Wasp SDK ==="
	wasp compile
	@echo ""
	@echo "=== ✅ Bootstrap complete ==="
	@echo "Run 'make dev' to start developing"

# --- Quality gates ---

lint: typecheck
	agent-harness lint

typecheck:
	wasp compile
	npx tsc --noEmit

fix:
	agent-harness fix

check: lint test

test:
	cd e2e-tests && npm run e2e

# --- Development ---

dev:
	@echo "Starting PostgreSQL + Wasp dev server..."
	@wasp start db &
	@sleep 2
	wasp start

db:
	wasp start db

migrate:
	wasp db migrate-dev
