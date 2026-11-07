# Architecture Rules

All sources live in `src/`; Bun runs the TypeScript directly, there is no build step. `ai/map.md`
says where every folder lives and what is still planned; `ai/rules/api.md` covers validation, errors
and responses, `ai/rules/security.md` user isolation and secrets.

## Layers

A request flows one way: plugins → module route → `t` validation → service → Drizzle. Each part has
one job:

| Layer                       | Owns                                                            | Must not                                           |
| --------------------------- | --------------------------------------------------------------- | -------------------------------------------------- |
| `index.ts`                  | starting the server                                             | hold routes or logic                               |
| `app.ts`                    | the app assembly: plugins, the `/api/v1` group, module mounting | call `listen`; hold a feature's routes             |
| `config/`                   | reading and validating env variables                            | be bypassed by a direct `Bun.env` or `process.env` |
| `plugins/`                  | shared HTTP concerns: errors, logger, CORS, OpenAPI, auth       | know about a feature                               |
| `modules/<name>/index.ts`   | an Elysia instance with a `prefix`: routes, schemas, `detail`   | query the database; hold business logic            |
| `modules/<name>/model.ts`   | the module's `t` schemas and the types inferred from them       | hold logic or import a service                     |
| `modules/<name>/service.ts` | the feature logic and its Drizzle queries                       | know about HTTP: context, `set`, status, headers   |
| `db/`                       | the Drizzle client, the schema, migrations, the seed            | know about HTTP or a module                        |
| `lib/`                      | external clients and helpers: Open Library, cache               | know about HTTP or a module                        |

## Modules

- One feature, one folder: `src/modules/<name>/` with `index.ts`, `service.ts` and `model.ts`. A file
  appears only when the module needs it; a module without routes has no `index.ts`.
- `index.ts` exports one Elysia instance named after the module, with a `prefix`; `app.ts` mounts it.
  A route reads the validated input, calls the service and returns its result.
- A service function takes plain values (the user id, the validated body) and returns plain data. It
  signals a failure by throwing an error class from the errors plugin (`NotFoundError`,
  `ConflictError`, …); it never sets a status or builds a response.
- A module uses another module only through its service, never through its routes.
- Shared HTTP behavior goes into a plugin with a `name`, so Elysia deduplicates it; a module that
  needs the auth context uses the auth plugin's macro (`ai/rules/security.md`).

## Data access

- Services use Drizzle directly; there is no repository layer.
- Writes that belong together run in one `db.transaction`.
- Aggregates and statistics are computed in SQL, not by loading rows into JavaScript.
- A list that matches nothing is not an error.
- Schema conventions: `uuid` primary keys, `created_at` and `updated_at` as `timestamptz`, snake_case
  in the database, every foreign key with an explicit `onDelete`. The schema changes only through a
  drizzle-kit migration committed to the repo, never `push` against production.

## Configuration

- Env variables are read only in `config/`, validated with a `t` schema at startup; an invalid env
  stops the start with a clear message. Until the config lands, `index.ts` reads `PORT` directly
  (MY-362).
- `.env.sample` lists every key; `.env*` stays out of git.

## Boundaries

- `app.ts` exports the app without starting it, so the tests drive it in-process.
- Plugins and modules are mounted explicitly in `app.ts`; no auto-discovery.
- No `try/catch` in a route or a service unless it has a real local recovery path; errors travel to
  the errors plugin.
- Only the seed and the test helpers may wipe tables, and never against a database they were not
  pointed at explicitly.
- No new layer, abstraction or pattern from `ai/rules/scope.md` without an explicit request.
