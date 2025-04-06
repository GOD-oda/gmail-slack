.PHONY: deploy
deploy:
	pnpm install
	pnpm build
	clasp push