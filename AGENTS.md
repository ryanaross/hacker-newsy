# AGENTS.md — guidance for AI / automation

## What this repo is

**hacker-newsy** is a SvelteKit 2 app that displays Hacker News via **HNPWA** (`api.hnpwa.com`). A **SQLite** database (`better-sqlite3`) stores single-user state: read IDs, highlight patterns, and saved article URLs. Saved URLs can be exported on demand to **`data/saved-urls.txt`** via the settings panel or API.

## Commands

| Task | Command |
|------|---------|
| Dev server (Makefile port) | `make dev` → port **5174** |
| Default dev | `yarn dev` → port **5173** |
| Typecheck | `yarn check` |
| Lint / format | `yarn lint` / `yarn format` |
| Tests | `yarn test` (Playwright + Vitest) |
| Unit only | `yarn test:unit` |
| Integration only | `yarn test:integration` |
| Production build | `yarn build` → output in `build/` |
| Run production build | `node build/index.js` (port from env, default **3000**) |

## Layout & conventions

- **Routes**: `src/routes/` — file-based routing (`[category=category]`, `item/[id]`, etc.).
- **UI**: Tailwind + shadcn-style components under `src/lib/components/ui/`.
- **Global styles / tokens**: `src/app.pcss`.
- **Server-only code**: `src/lib/server/` — import only from `+server.ts`, `+page.server.ts`, `hooks.server.ts`, etc. Do not import from client components.
- **Shared client logic**: `src/lib/*.ts` (e.g. `matchHighlight.ts`).
- **Client stores**: `src/lib/stores/` (`userState.ts`, `items.ts`, `features.ts`).

## Logging & debugging

- Prefer **server-side** logging via `src/lib/server/logger.ts` (`logger.info`, `logger.warn`, `logger.error`, `logger.debug`).
- **`DEBUG=true`** enables `debug` level logs.
- **`NODE_ENV=production`** makes logs single-line JSON (easier to grep / ship).
- Every HTTP request is logged in `hooks.server.ts` with method, path, status, duration.
- Avoid adding `console.log` in UI for business logic; use the logger on the server.

## Persistence paths

| Artifact | Default location |
|----------|-------------------|
| SQLite | `DB_PATH` or `./data/hn.db` |
| Saved URL export | `dirname(DB_PATH)/saved-urls.txt` (for `:memory:` DB, `./data/saved-urls.txt`) |

`data/` is gitignored; create via app or `mkdir -p data`.

## API (same origin)

- `GET/POST /api/read` — list / mark read (`POST` body `{ id: number }`).
- `DELETE /api/read/:id` — mark unread.
- `GET/POST /api/highlights` — list / add pattern (`POST` `{ pattern: string }`).
- `DELETE /api/highlights/:id`
- `GET/POST /api/saved` — list IDs / save (`POST` `{ id, url, title? }`).
- `DELETE /api/saved/:id`
- `POST /api/saved/export` — export saved URLs to `saved-urls.txt`.

## Tests

- **Vitest**: `src/**/*.test.ts`, Node environment, `DB_PATH=:memory:` from `vite.config.ts`.
- **Playwright**: `tests/*.spec.ts`; `tests/global-setup.ts` wipes `tests/.playwright-data/`; preview server gets `DB_PATH` under that directory.

## Common pitfalls

1. **`better-sqlite3` must be external** for SSR (`vite.config.ts` → `ssr.external`).
2. **Don’t import `$lib/server/*` in `.svelte` client components** — use API routes + `fetch` or pass data via `load`.
3. **Settings mutations** should call `invalidateAll()` after successful API writes so `+layout.server.ts` refetches.
4. **Docker**: image uses `entrypoint.sh` + `su-exec` for `PUID`/`PGID`; mount `/app/data` for persistence.

## Related docs

- [`README.md`](README.md) — user-facing setup & env vars  
- [`UPGRADING.md`](UPGRADING.md) — architectural delta for forks  
- [`.env.example`](.env.example) — environment template  
