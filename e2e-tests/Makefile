.PHONY: lint fix test check security-audit bootstrap

lint:
	agent-harness lint

fix:
	agent-harness fix

test:
	npm test

security-audit:
	agent-harness security-audit

check: lint test security-audit

bootstrap: ## First-time setup after clone
	# Install project dependencies (e.g., pnpm install, npm install)
	agent-harness init --apply
	@if command -v prek >/dev/null; then prek install; \
	elif command -v pre-commit >/dev/null; then pre-commit install; \
	else echo "Install prek (brew install prek) or pre-commit for git hooks"; fi
	@echo "Done. Run 'make check' to verify."
