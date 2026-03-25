# hacker newsy

https://hn.cotyhamilton.com

A pretty Hacker News client with a small SQLite-backed server for personal state (read items, highlight patterns, saved URLs).

## screenshots

![home page](img/home-light.png)
![comments dark](img/comments-dark.png)
![comments light](img/comments-light.png)

## features

- Feature toggles (infinite scroll, theme)
- Light and dark theme
- Pagination or infinite scroll
- Installable as a PWA; offline cache via service worker
- **Read tracking**: opening an item dims it in the list (stored in SQLite)
- **Highlights**: substring rules (title/domain) configured in Settings → highlights
- **Saved URLs**: swipe right to save (or use the bookmark button on desktop); swipe left to remove when already saved. URLs are stored in the DB and mirrored to `data/saved-urls.txt` (one per line)
- Structured **server-side logging** (JSON in production) for easier debugging

## Local development

Requirements: Node 20+, Yarn.

```bash
yarn install
make dev          # Vite on port 5174 (see Makefile)
# or: yarn dev --port 5173
```

Quality:

```bash
yarn check
yarn lint
yarn test         # Playwright + Vitest
```

Data files (created automatically):

- `data/hn.db` — SQLite
- `data/saved-urls.txt` — export list of saved external URLs

## Docker

Build and run:

```bash
make docker-build
make docker-run
```

Example Compose (copy and adjust):

- [`docker-compose.example.yml`](docker-compose.example.yml)

Mount `./data` into the container so the database and `saved-urls.txt` persist.

## Environment variables

| Variable   | Description |
|-----------|-------------|
| `DEBUG`   | `true` / `1` / `yes` enables debug logs |
| `TZ`      | Timezone (e.g. `America/Los_Angeles`); honored by Node |
| `DB_PATH` | SQLite file path; default `./data/hn.db`. Use `:memory:` only for tests |
| `PUID`    | Docker: run Node as this user id (with `PGID`) via `entrypoint.sh` |
| `PGID`    | Docker: group id for `PUID` |

See [`.env.example`](.env.example).

## Makefile targets

| Target          | Description |
|----------------|-------------|
| `make dev`     | `yarn dev --port 5174` |
| `make build`   | Production build |
| `make preview` | Preview production build |
| `make test`    | Unit + integration tests |
| `make docker-build` | Build image `hacker-newsy` |
| `make docker-run`   | Run container on port 3000 with `./data` mounted |
| `make clean`   | Remove `node_modules`, `build`, `data`, `.svelte-kit`, Playwright data, and Docker image `hacker-newsy` |

## built with

- [SvelteKit](https://kit.svelte.dev)
- [shadcn-svelte](https://www.shadcn-svelte.com) / bits-ui
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (SQLite)

## inspiration

- [modern for hacker news](https://www.modernhn.com)
- [hn.svelte.dev](https://hn.svelte.dev)

## Docs for upgrades & agents

- [`UPGRADING.md`](UPGRADING.md) — how this repo gained a SQLite “backend” and what changed
- [`AGENTS.md`](AGENTS.md) — quick orientation for AI agents working in this codebase
