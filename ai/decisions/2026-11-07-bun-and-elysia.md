# Bun and Elysia

Date: 2026-11-07 · Status: accepted

## Context

The API needs a runtime, a web framework and a test runner, all with first-class TypeScript. The
common alternatives are Node.js with Express, Fastify or Hono, plus a separate TypeScript runner and
test framework.

## Decision

- Bun is the runtime, the package manager (`bun.lock`) and the test runner (`bun test`); it runs the
  TypeScript sources directly, with no build step, and loads `.env` itself.
- Elysia is the web framework: plugins, lifecycle hooks and macros for shared concerns, `t` schemas
  for validation, response types and the OpenAPI document from one definition.
- TypeScript is strict (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`).
- Bun's own APIs are preferred over packages: `Bun.password`, `Bun.env`, `fetch`, `crypto`.

## Consequences

- No npm, yarn or pnpm, no `dotenv`, `nodemon`, `ts-node`, Jest or Vitest (`ai/rules/scope.md`).
- Tests drive the app in-process with `app.handle(new Request(...))`.
- CI and the Docker image use Bun too, never Node.
- Rejected: Express (no types or validation of its own, middleware instead of typed plugins);
  Fastify and Hono on Node (a separate runner, test framework and build step for the same result).
