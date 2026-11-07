# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo. `CLAUDE.md` and
any other tool-specific entry point point here: keep shared knowledge in `ai/`, not duplicated per
tool.

## Project

The REST API of Shelf, the reading tracker built on ljsf: users and auth, a book catalog proxied
from Open Library with a cache, shelves and reading progress, reading sessions, notes, settings and
statistics. Bun, Elysia and strict TypeScript, PostgreSQL behind Drizzle ORM, validation with
Elysia's `t` (TypeBox), its own JWT auth, `bun test`. Keep the code clean, practical and proportional
to the project size: one API, one database, feature modules, no enterprise layers.

- Repo: <https://github.com/serlisovyk/Shelf-Backend>
- Tasks: Linear, project [Shelf-Backend](https://linear.app/serhii-lisovyk-workspace/project/shelf-backend-a21ed28cffd3)
  (team `MY`, issues `MY-<n>`, label `Backend`)
- The frontend is the Shelf app in the ljsf monorepo, a separate repo with its own rules and
  workflow; it talks only to this API. Changes there are separate tasks, not part of backend work.

## Read First

- `ai/map.md`: where the app, modules, plugins, tables, env variables and tooling live, what is
  still planned and what the project deliberately does **not** have. Read it before exploring the
  code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` for the module layers and
  boundaries, `api.md` for validation, errors and responses, `security.md` for user isolation,
  secrets and logs, `style.md` for TypeScript, `testing.md` for tests, `scope.md` for what not to add
  without an explicit request.
- `ai/rules/definition-of-done.md`: the gate before a change is handed over; `ai/rules/docs.md`: one
  fact one home, size limits, no history in docs.
- `ai/superpowers/` is the archive of past plans and specs: read only the plan or spec of the feature
  you change.

## Decisions

`ai/decisions/` records durable decisions and **why** they were made. Start from its `README.md`
index and read the records of what you touch before proposing to change or "restore" anything:
rules say what to do now, decisions say why. Reversing one means a new dated record, not editing the
old one.

Propose a new record, without being asked, when a decision meets the criteria in that `README.md`.

## Workflow

`ai/workflow.md` is the end-to-end flow for a Linear task: orient → plan (+ spec when API behavior
changes) → implement → docs → verify → Definition of Done → self-review → report → author approval →
local merge into `main`.

The parts that never bend:

- Never commit task work directly on `main`: use a `my-<n>-<slug>` branch with an English slug, never
  Linear's `gitBranchName`; one worktree per parallel task under `.claude/worktrees/`.
- Write a **plan** for anything non-trivial, and a **spec** when observable API behavior changes,
  under `ai/superpowers/`: one commit, before any code.
- Nothing is merged and no issue is marked `Done` without the author's explicit approval.
- Merges happen locally into `main` (rebase, then fast-forward), then `main` is pushed. No pull
  requests, no pushed feature branches, and never a force-push of `main` (decision
  `local-merge-without-pr`).
- Never bypass the pre-commit hook (`--no-verify`): it runs lint-staged (ESLint and Prettier on the
  staged files); fix what it reports.
- Commits follow Conventional Commits in English (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
  `build:`, `ci:`, `chore:`): specific, never `update` or `changes`.
- A change of behavior comes with tests in the same change; a bug fix starts with a test that
  reproduces it.

Prompts to start agent sessions live in `ai/prompts/` (index in `ai/prompts/README.md`):
`orchestrator.md` runs several tasks from one session, `task.md` runs a single task. Linear issues
follow `ai/linear-task-template.md`.

## Working Principles

- Prefer small, focused changes.
- A feature lands in the layer that owns it (`ai/rules/architecture.md`): routes and schemas in the
  module's `index.ts` and `model.ts`, logic and queries in its `service.ts`, shared HTTP concerns in
  `src/plugins/`.
- Every query on user data is scoped to the current user (`ai/rules/security.md`).
- Follow the existing folder structure, file naming and patterns.
- Do not add new abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- If a request conflicts with these rules, follow the user's explicit request and mention the
  tradeoff.

## Project Defaults

- Package manager and runtime: Bun (version pinned in `package.json`); `bun.lock` is the only
  lockfile, never edited by hand. Install with `bun install --frozen-lockfile`; plain `bun install`
  only when a dependency changes.
- Stack: Bun, Elysia, TypeScript (strict), PostgreSQL with Drizzle ORM, `t` (TypeBox) schemas.
- Sources: everything under `src/`; `src/index.ts` is the entry, `src/app.ts` assembles the app.
  `ai/map.md` shows where each part lives.
- Imports: the `@` path aliases from `tsconfig.json`, never `../` (`ai/rules/style.md`).
- Tests: `bun test`, in-process through `app.handle(new Request(...))` (`ai/rules/testing.md`).
- Formatting: Prettier (`.prettierrc`); `bun run format` applies it.

## Commands

```bash
bun install --frozen-lockfile   # install dependencies and the Git hooks
bun run dev                     # dev server with file watching
bun run typecheck               # tsc --noEmit
bun run lint                    # ESLint (lint:fix to auto-fix)
bun run format                  # apply Prettier (format:check to verify only)
bun test                        # run the test suite
```

## Language

- Chat with the author in Russian.
- Code, commit messages and `ai/` docs stay in English.
- Linear issues are written in Russian, following `ai/linear-task-template.md`.

## Verification

Run before handing over any change:

```bash
bun run format:check
bun run lint
bun run typecheck
bun test
```

- If formatting was changed, run `bun run format`; `bun run lint:fix` fixes the lint findings it can.
- A change to a route, a schema, a service or an error is also called by hand against a running
  server, the error cases included ("Manual API check" below): a green test run does not prove an
  endpoint works.
- If a check cannot be run, report that clearly. Do not claim the project works, tests or formats
  correctly unless the command ran successfully.

### Manual API check

Every task runs its own server on its own port, never the author's server, database, `.env` or
compose stack:

```bash
PORT=<port> bun run dev
```

Call the endpoints with curl, the happy path and the error cases, then stop the server. Once the
database lands (MY-363), the server also gets its own throwaway Postgres container with its own name
and host port, migrated before the check and stopped after it:

```bash
docker run -d --rm --name shelf-pg-my-<n> -e POSTGRES_USER=shelf -e POSTGRES_PASSWORD=shelf -e POSTGRES_DB=shelf -p <db-port>:5432 postgres:17-alpine
docker stop shelf-pg-my-<n>
```
