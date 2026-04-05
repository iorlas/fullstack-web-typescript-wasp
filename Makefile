.PHONY: lint fix check test dev db migrate

lint:
	agent-harness lint

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
