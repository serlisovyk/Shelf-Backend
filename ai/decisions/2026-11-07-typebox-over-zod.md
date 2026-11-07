# TypeBox (`t`) for validation, not Zod

Date: 2026-11-07 · Status: accepted (not implemented)

## Context

Every route validates its input and declares its responses, and the env is validated at startup.
Elysia ships TypeBox as `t`; Zod is the common alternative and Elysia accepts it through Standard
Schema.

## Decision

- All validation uses `t`: route `params`, `query`, `body`, `headers`, `cookie` and `response`
  schemas, and the env schema in the config.
- Schemas of table rows are derived from the Drizzle tables with `drizzle-typebox`, so a column is
  described once.
- Types come from the schemas (`typeof schema.static`), not from hand-written interfaces.

## Consequences

- One schema gives the runtime check, the TypeScript type and the OpenAPI document; nothing drifts
  between them.
- No Zod, Yup or class-validator (`ai/rules/scope.md`).
- How `drizzle-typebox` is wired in is the database setup's decision.
- Rejected: Zod (a second schema system next to the built-in one, and table schemas would need
  another bridge).
