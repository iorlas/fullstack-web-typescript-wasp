.PHONY: lint fix check test typecheck dev db migrate

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

dev:
	wasp start

db:
	wasp start db

migrate:
	wasp db migrate-dev
