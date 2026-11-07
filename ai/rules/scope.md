# Scope Rules

Shelf-Backend is one REST API for one frontend. Grow it by what Shelf needs, without turning it into
an enterprise template.

## Do Not Add Without Explicit Request

- GraphQL, tRPC, gRPC, WebSocket or any realtime channel
- OAuth or social login providers, an auth library or an auth service (decision `own-jwt-auth`)
- A book catalog of our own, Open Library dumps (decision `open-library-proxy`)
- An admin panel
- Microservices, a message queue, background job workers
- A repository layer or a dependency injection container
- A second validation library (Zod, Yup, class-validator; decision `typebox-over-zod`)
- A second ORM or a query builder next to Drizzle
- Redis or another external cache: the search cache lives in memory, saved books in Postgres
- Node-only tooling: npm, yarn or pnpm, `dotenv`, `nodemon`, `ts-node`, Jest, Vitest
- Metrics or logging platforms

## Dependencies

- Runtime: `elysia` today. Planned with their tasks: `@elysiajs/cors`, `@elysiajs/openapi`,
  `@elysiajs/jwt`, `drizzle-orm`, `drizzle-typebox`; `drizzle-kit` as a dev dependency.
- Another dependency needs the author's explicit yes and, if it is a lasting choice, a decision
  record. Prefer what Bun already has: `Bun.password`, `Bun.env`, `fetch`, `crypto`, `bun:test`.

## Prefer

- Small incremental changes, one module at a time
- Clear module boundaries and explicit mounting
- Elysia's own mechanisms (plugins, macros, lifecycle hooks, `t`) over hand-rolled middleware
- Direct, readable Drizzle queries; SQL for aggregates
- Focused helpers with tests when behavior is non-trivial

## Tradeoffs

- If a feature is unused by Shelf, do not implement it just in case.
- If an abstraction hides more than it clarifies, do not add it.
- Keep database changes explicit: a migration in the repo, never a silent `push`.
