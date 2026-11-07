# Testing Rules

The project keeps an automated suite on `bun test`. A change of behavior comes with tests in the same
change; a bug fix starts with a test that reproduces it.

## How

- Tests drive the real app in-process: `app.handle(new Request(...))` on the app exported from
  `@app`. No listening server, no port.
- Files live in `tests/`, named `<subject>.test.ts`; imports use the `@` aliases.
- `describe` names the unit (`'entries'`, `'auth plugin'`); `it` says the behavior
  (`'answers 404 for an entry of another user'`).
- A test is changed only when the behavior it describes changed on purpose; never deleted or skipped
  to make a run green.

## What to test

- Routes: status, body shape, and the error cases: schema failure, missing row, no or bad token.
- Services: the feature logic, including transitions and edge cases (empty list, limits, dates at a
  timezone boundary).
- User isolation: every module with user data has a test where a second user gets `404` on the first
  user's rows (`ai/rules/security.md`).
- Auth: an expired, a forged and a wrong-algorithm token, refresh rotation and reuse detection.
- Plugins: the error shape for every kind of error, the request id, CORS.
- `lib/`: the Open Library normalization (empty fields → `null`), cache hits, upstream errors and
  timeouts.

## What not to test by default

- Plain constants and `t` schemas without logic.
- Drizzle itself or the generated migrations.
- Log output, beyond "a secret is not in it".

## Database

- Tests that touch the database run against a separate test database (planned with the database
  setup), never the dev or the production one: migrations run before the suite, tables are cleaned
  between tests.
- Data for a test is created through the API or a small helper, not by a shared fixture dump.

## External services

- Open Library is never called from a test: `fetch` is mocked, per test.
- Time-dependent logic takes the time from the test (`setSystemTime` from `bun:test`), not from the
  wall clock.
