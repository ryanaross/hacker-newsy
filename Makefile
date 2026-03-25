.PHONY: dev build preview test install docker-build docker-run clean

YARN := ./scripts/make-yarn.sh

# Clean reinstall (fixes missing @rollup/rollup-* after cross-OS or broken optional installs)
install:
	rm -rf node_modules
	$(YARN) install

dev:
	$(YARN) dev -- --port 5174 --host 0.0.0.0

build:
	$(YARN) build

preview:
	$(YARN) preview

test:
	$(YARN) test

docker-build:
	docker build -t hacker-newsy .

docker-run:
	docker run --rm -p 3000:3000 -v "$$(pwd)/data:/app/data" -e TZ=America/Los_Angeles hacker-newsy

clean:
	rm -rf node_modules build data .svelte-kit tests/.playwright-data
	docker rmi hacker-newsy 2>/dev/null || true
