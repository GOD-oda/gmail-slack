.PHONY: deploy
deploy:
	npm install
	npm run build
	clasp push