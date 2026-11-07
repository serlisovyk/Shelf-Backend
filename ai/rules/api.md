# API Rules

The contract every endpoint keeps: validation, errors and responses. Why: decisions
`typebox-over-zod` and `separate-backend-repo`. Layers: `ai/rules/architecture.md`. The plugins named
here are planned (`ai/map.md`); a route written before they land still follows these rules.

## Validation

- Every route declares its input with `t` (TypeBox) schemas from the module's `model.ts`: `params`,
  `query`, `body`, `headers` or `cookie`, whichever it reads. Nothing reaches a service unvalidated.
- Schemas of table rows are derived from the Drizzle tables with `drizzle-typebox`, then picked or
  extended in `model.ts`; a field is not described twice.
- A schema lists exactly the fields a client may send. `id`, `user_id` and timestamps are never
  accepted from a client.
- Strings have a `maxLength`, numbers a range, lists a page limit; formats use `t` formats (`email`,
  `uuid`, `date`) instead of hand-written regexes.
- Types come from the schemas (`typeof schema.static`), never as a second hand-written interface.

## Responses

- Every route declares a `response` schema per status code it answers, errors included, and a
  `detail` (`summary`, `tags`): the OpenAPI document at `/docs` is generated from them and is the
  contract for the frontend.
- The public API lives under `/api/v1`; `/health` and `/docs` stay outside it.
- Status codes: `200` read or update, `201` create, `204` delete with no body, `400` a malformed
  body, `422` input that fails its schema (Elysia's validation status), `401` no or bad token, `404`
  missing or another user's row, `409` conflict, `429` rate limit, `502` an Open Library failure.
- A response carries only public fields: never a password hash, a token hash or an internal id of
  another user.
- Dates go out as ISO 8601 strings; JSON keys are camelCase, while the database stays snake_case.

## Errors

- Every error is answered in one shape by the errors plugin:

  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid request data",
      "details": { "email": "Expected string to match 'email' format" }
    }
  }
  ```

- `code` is `UPPER_SNAKE_CASE` and stable: the frontend branches on it, never on `message`.
  `details` is optional and only for field-level information.
- The plugin maps Elysia's own errors (validation, not found, parse) into this shape, so an unknown
  route or a malformed body looks the same as any other error.
- An operational error is one of the error classes (`NotFoundError`, `ConflictError`,
  `UnauthorizedError`, `ForbiddenError`, …). Anything else is logged with the request id and answered
  as `500 INTERNAL_SERVER_ERROR`, without the stack or the original message in production.
