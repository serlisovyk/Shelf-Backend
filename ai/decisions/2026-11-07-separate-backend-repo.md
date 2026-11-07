# A separate repo for the backend

Date: 2026-11-07 · Status: accepted

## Context

Shelf, the reading tracker, lives in the ljsf monorepo and keeps user data in `localStorage`. It
needs a server for accounts, data shared across devices and statistics. The obvious alternative is an
`apps/api` package inside that monorepo.

## Decision

- The backend is its own repository, Shelf-Backend, with its own README, CI, deploy, Linear project
  and agent docs.
- The frontend talks only to this API, over HTTP; it never calls Open Library or another service
  directly.
- The contract between them is the OpenAPI document generated from this API's route schemas. No
  shared code or shared types: the frontend is JavaScript, the backend TypeScript.

## Consequences

- The monorepo keeps its own tooling (pnpm, plain JavaScript); this repo uses Bun and TypeScript
  without bending either.
- A change that needs both sides is two issues, one per repo, linked.
- The frontend's `localStorage` implementation stays as a demo mode; switching to this API changes
  only its API layer.
- Rejected: `apps/api` in the monorepo (it would mix two runtimes and two languages in one workspace
  and tie the backend's CI and deploy to the frontend's).
