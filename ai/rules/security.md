# Security Rules

What every change keeps safe: the user's data, the secrets and the logs. Why the auth works as it
does: decision `own-jwt-auth`. The auth and logger plugins are planned (`ai/map.md`).

## User isolation

- Every query on user data (entries, sessions, notes, settings, stats) is filtered by `user_id`,
  and the `user_id` comes from the auth context only, never from the path, the query or the body.
- Another user's row is answered as `404`, the same as a missing one, never `403`: the API does not
  reveal that it exists.
- An update or a delete filters by `id` **and** `user_id` in the same statement; it never loads by
  `id` first and checks the owner afterwards.
- A route that touches user data uses the auth plugin's macro; a route without it is public on
  purpose, and says so in its `detail`.
- Every module with user data has a test where a second user gets `404` on the first user's rows
  (`ai/rules/testing.md`).

## Auth

- Passwords are hashed with `Bun.password` (argon2id) and compared with `Bun.password.verify`; no
  crypto of our own.
- The access token is short-lived and signed with a fixed algorithm; the refresh token lives in an
  `httpOnly`, `Secure` cookie and is stored only as a hash, with rotation and reuse detection.
- Login answers the same `401` for an unknown email and a wrong password.

## Secrets

- Secrets come from env variables through `config/` only. They are never committed, hard-coded,
  returned in a response or written to a log; `.env.sample` names the key and describes it, without a
  value.
- Tests use their own throwaway values, never a real secret.

## Logs

- A request log line carries the request id (`X-Request-Id`), method, path, status and duration.
- Never log a password, a token, a cookie, the `Authorization` header or a request body of `/auth`.
- A `500` is logged with its stack on the server; the client gets only the error shape
  (`ai/rules/api.md`).

## Outbound and input

- The catalog proxy sits behind the auth guard, so the API is not an open proxy to Open Library;
  every outbound request has a timeout.
- CORS allows only the origins from env, with credentials; never `*`.
- Input is bounded by its schema (lengths, ranges, page limits), so one request cannot ask for
  unbounded work.
