# Definition of Done

A change is done when all of the following hold. Use it as the gate before handing a change over for
approval.

## Code

- New code follows `ai/rules/architecture.md`, `ai/rules/api.md`, `ai/rules/security.md` and
  `ai/rules/style.md`: the module and layer that own it, `@` aliases, no `../`, no `any`.
- Every route validates its input with `t` and declares its `response` schemas and `detail`.
- Every query on user data is filtered by the `user_id` of the auth context.
- Errors are the error classes, answered in the API error shape; no secret, token or password in a
  response or a log.
- Env variables only through `config/`.
- No comments in code.
- Stale code, schemas, constants and messages left behind by the change are removed.
- Nothing from `ai/rules/scope.md` slipped in.

## Database

- A schema change comes with its drizzle-kit migration, committed in the same change.
- The migration runs on an empty database and on one with data.

## Tests

- New or changed behavior has tests (`ai/rules/testing.md`); a bug fix starts with a test that
  reproduces it.
- A module with user data has its isolation test.
- No test touches Open Library or a database other than the test one; none was changed, skipped or
  deleted only to make it pass.

## Docs (in the same change, as `ai/rules/docs.md` says)

- `README.md`: only if setup, scripts, env or the public API changed.
- `ai/map.md`: only if a module, plugin, table, folder, env variable, script or tooling file was
  added, renamed or removed; a _planned_ mark is replaced by what was built.
- `ai/rules/*`: only if the change reshaped a pattern.
- `ai/decisions/`: a new dated record if the change meets the criteria in its `README.md`.
- Every relative link in the docs still resolves.

## Verification

- Every check listed under "Verification" in `AGENTS.md` passes.
- A change to an endpoint, a schema or an error was called by hand against a running server, error
  cases included: green tests do not prove it works.
- Reported: what changed, which commands were run, whether they passed, and anything that could not
  be verified. Never claim the project works, tests or formats correctly unless the command was run
  and passed.

## Commits

- Logical commits, Conventional Commits in English, specific (never `update` or `changes`).
- `git status` and `git diff` inspected before each commit; the pre-commit hook is never bypassed.
