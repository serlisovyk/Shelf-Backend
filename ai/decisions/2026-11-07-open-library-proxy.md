# Open Library behind a caching proxy, no catalog of our own

Date: 2026-11-07 · Status: accepted (not implemented)

## Context

Shelf searches books and shows their details. The data could come from a catalog of our own (an
import of the Open Library dumps) or from the Open Library API. The frontend should not call a third
party directly.

## Decision

- The book catalog is not duplicated: search and book details are proxied from the Open Library API
  and normalized into one `Book` shape.
- Search results are cached in memory for a short time.
- A book that a user puts on a shelf is saved in the `books` table and served from there; it is
  refreshed from Open Library only when it is stale.
- The proxy routes sit behind the auth guard, so the API is not an open proxy; outbound requests
  have a timeout and identify the app in `User-Agent`.
- Covers are links to Open Library's cover service, not proxied images.

## Consequences

- No dump imports, no full-text search of our own, no external cache server (`ai/rules/scope.md`).
- An Open Library failure is answered as `502`, an unknown book as `404`.
- The cache details (sizes, lifetimes) get their own record when the catalog task builds it.
- Rejected: a catalog of our own (gigabytes of data and an import pipeline for a feature Open
  Library already serves).
