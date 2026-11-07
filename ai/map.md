# Repo map

Navigation only: where things live and who owns what. How it works is in the code, why in
`ai/decisions/`. A part marked _planned_ does not exist yet: the task that builds it replaces the
mark with what was built.

## Repo

- `src/` — all sources (below); `src/index.ts` is the entry (`bun run start`; `bun run dev` adds
  `--watch`).
- `tests/` — `bun test` suites, `<subject>.test.ts`; `smoke.test.ts` checks `GET /health`.
- `package.json` — `packageManager` and `engines` pin Bun; scripts `dev`, `start`, `typecheck`, `lint`,
  `lint:fix`, `format`, `format:check`, `prepare` (Husky), `test`. `bun.lock` is the only lockfile.
- `tsconfig.json` — strict TypeScript, `noEmit`, the `@` path aliases (below).
- `eslint.config.js` — ESLint flat config: recommended rules, `typescript-eslint` strict and
  stylistic type-checked, `consistent-type-imports`, Prettier.
- `.prettierrc`, `.prettierignore` — Prettier.
- `.husky/pre-commit`, `.lintstagedrc.json` — the pre-commit hook: lint-staged runs ESLint and Prettier
  on the staged files.
- `.env.sample` — every environment variable with a description; `.env*` is git-ignored.
- `README.md` — setup, scripts, the public API; `AGENTS.md` — the entry point for agents, `CLAUDE.md`
  points to it.
- `ai/` — agent docs: this map, `rules/`, `decisions/`, `linear-task-template.md`.
- `.claude/worktrees/` — one git worktree per task when tasks run in parallel; ignored by git.
- _Planned:_ `docker-compose.yml` (Postgres for dev and tests), `drizzle.config.ts`, `Dockerfile`,
  `.dockerignore`, `.github/workflows/` (CI).

## Request flow

`index.ts` starts the server; `app.ts` builds the Elysia app and exports it (and its type) for the
tests. A request goes plugin chain (planned: request id and logger, CORS, errors, auth) → module
route → `t` validation → service → Drizzle → PostgreSQL, and any error ends in the errors plugin.
The layer rules are in `ai/rules/architecture.md`.

## Sources (`src/`)

| Folder / file          | Holds                                                            |
| ---------------------- | ---------------------------------------------------------------- |
| `index.ts`             | the entry: `app.listen` on `PORT`                                |
| `app.ts`               | the app assembly; today it holds the `GET /health` route itself  |
| `config/` _(planned)_  | the one reader of env variables, validated with `t` at startup   |
| `plugins/` _(planned)_ | shared Elysia plugins: errors, logger, CORS, OpenAPI, auth guard |
| `modules/` _(planned)_ | one folder per feature: `index.ts`, `service.ts`, `model.ts`     |
| `db/` _(planned)_      | the Drizzle client, the schema, migrations, the seed             |
| `lib/` _(planned)_     | the Open Library client, the cache, helpers without HTTP         |

## Modules (planned)

Every module is `src/modules/<name>/`, mounted under `/api/v1` with its own `prefix`.

| Module     | Prefix      | Holds                                                     |
| ---------- | ----------- | --------------------------------------------------------- |
| `health`   | `/health`   | liveness, then a database check                           |
| `auth`     | `/auth`     | register, login, refresh, logout, me                      |
| `users`    | —           | the user record behind `auth`                             |
| `books`    | `/books`    | search and one book, proxied from Open Library and cached |
| `entries`  | `/entries`  | shelves (`want`, `reading`, `read`), progress, rating     |
| `sessions` | `/sessions` | reading sessions: date, pages, minutes                    |
| `notes`    | `/notes`    | notes on a book on the user's shelf                       |
| `settings` | `/settings` | theme, yearly goal, timezone                              |
| `stats`    | `/stats`    | metrics, heatmap and streaks, computed in SQL             |

## Endpoints

| Endpoint      | Handler                                              |
| ------------- | ---------------------------------------------------- |
| `GET /health` | inline in `app.ts`: `{ status: 'ok' }`, no `/api/v1` |

The API docs will be generated from the route schemas at `/docs` (planned).

## Database (planned)

PostgreSQL through Drizzle ORM; migrations by drizzle-kit, kept in the repo. Tables, by module:

| Table              | Holds                                                       |
| ------------------ | ----------------------------------------------------------- |
| `users`            | email (unique, lowercase), password hash, name              |
| `refresh_tokens`   | the SHA-256 hash of a refresh token, its family, expiry     |
| `books`            | books saved from Open Library, keyed by the work id         |
| `entries`          | a book on a user's shelf, progress, rating; unique per user |
| `reading_sessions` | a user's reading on a date: pages, minutes                  |
| `notes`            | a user's note on a book, with an optional page              |
| `user_settings`    | theme, yearly goal, timezone; one row per user              |

## Path aliases

Declared in `tsconfig.json` (`paths`); Bun resolves them at runtime. Rules in `ai/rules/style.md`.

| Alias        | Resolves to                                 |
| ------------ | ------------------------------------------- |
| `@app`       | `src/app.ts`                                |
| `@config`    | `src/config/index.ts` (folder planned)      |
| `@db`        | `src/db/index.ts` (folder planned)          |
| `@lib/*`     | `src/lib/*` (folder planned)                |
| `@modules/*` | `src/modules/*` (folder planned)            |
| `@plugins/*` | `src/plugins/*` (planned, alias and folder) |

## Environment

All keys are in `.env.sample`; Bun loads `.env` by itself, no `dotenv`. Today: `NODE_ENV`, `PORT`.
Planned with the config: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `CORS_ORIGINS`.

## Not in this project

- GraphQL, WebSocket or realtime, OAuth providers, an admin panel, microservices, a book catalog of
  its own: `ai/rules/scope.md`.
- A repository layer: services query Drizzle directly.
- Node-only tooling: npm, `dotenv`, `nodemon`, `ts-node`, Jest or Vitest.
