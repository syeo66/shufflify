help:
	@echo "make build     Build the app."
	@echo "make start     Start the app for development."
	@echo "make clean     Clean the build artifacts."
	@echo "make test      Run tests."

build: node_modules src
	npm run build
	touch dist

start: node_modules
	npm run dev

deploy: node_modules
	git switch main && git push all && git push
	git switch stage && git pull && git merge main && git push all && git push
	git switch main

test: node_modules
	npm run test

######################################################################

node_modules : package-lock.json package.json
	npm install
	touch node_modules
