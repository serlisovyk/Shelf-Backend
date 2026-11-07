# Our own JWT auth, no auth library

Date: 2026-11-07 · Status: accepted (not implemented)

## Context

Shelf becomes multi-user: every shelf, session and note belongs to a user. Auth could come from a
library or a hosted service (better-auth, Lucia, Auth.js, Clerk, Supabase Auth) or be built on
Elysia's JWT plugin and Bun's password hashing.

## Decision

- Auth is built in this repo on `@elysiajs/jwt` and `Bun.password` (argon2id).
- A short-lived access token, sent as `Authorization: Bearer` and kept in the frontend's memory.
- A long-lived refresh token in an `httpOnly`, `Secure` cookie, stored only as a hash, rotated on
  every refresh, with reuse detection that revokes the whole token family.
- An auth plugin puts the user into the context and offers a macro for protected routes.
- Email and password only.

## Consequences

- The auth flow is fully visible and tested in the repo; its details (lifetimes, cookie attributes,
  CSRF protection) get their own record when the auth task builds it.
- No OAuth providers or social login (`ai/rules/scope.md`).
- Rejected: an auth library or service (hides the flow this project is meant to show, and adds a
  dependency or a vendor for a single email-and-password login).
