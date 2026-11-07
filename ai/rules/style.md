# Style Rules

Prettier decides the formatting (`bun run format`) and ESLint the type-aware checks (`bun run lint`);
these are the rules they do not. They follow the author's code style standard plus this project's
naming.

## TypeScript

- Strict mode stays on, with `noUncheckedIndexedAccess`: handle the `undefined`, do not assert it away.
- No `any`, no `as` cast to silence the compiler, no `@ts-ignore` or `@ts-expect-error`. An unknown
  value is `unknown` and narrowed.
- Type-only imports use `import type` (ESLint enforces it, `verbatimModuleSyntax` needs it).
- Types are inferred where they can be: from a `t` schema (`typeof schema.static`), a Drizzle table
  (`typeof table.$inferSelect`) or the app (`typeof app`). A hand-written type does not repeat one.
- `type` for shapes; `interface` only when declaration merging is the point.
- An unused parameter starts with `_`.

## General

- **No comments in code**, in TypeScript and in the root configs. Names and small functions say what
  the code does; a durable "why" goes to a rule, `ai/map.md` or a decision record.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`:** a name, a literal, one call or a boolean of names. A `reduce`, a `map`, a
  comparison or a ternary is computed into a `const` first:

  ```ts
  const bookIds = entries.map(({ bookId }) => bookId)
  const hasEntries = bookIds.length > 0

  return { bookIds, hasEntries }
  ```

- **Named conditions:** a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isRevoked`, `hasCover`).
- No magic numbers or strings: a value used in more than one place, or a limit, is a named constant
  (`ACCESS_TOKEN_TTL`, `SEARCH_CACHE_TTL_MS`).
- **Blank lines group steps** (read, compute, write). A multi-line statement is its own paragraph; a
  guard is its own paragraph, together with a `const` made only for it.
- Destructure in callbacks (`({ id, title }) =>`), not a repeated `item.id`.
- Parameter names say what they are (`userId`, `bookId`), not a bare `x` or `data`.
- **Functions:** an exported top-level function is a function declaration; an arrow function is for a
  callback, an Elysia route handler or a small local helper.

## Files, names and imports

- Files and folders are kebab-case. A module folder holds `index.ts`, `service.ts` and `model.ts`;
  tests are `<subject>.test.ts`.
- Names: types and classes PascalCase, functions camelCase verbs, constants `UPPER_SNAKE_CASE`,
  Elysia instances and plugins camelCase after their module (`entries`, `authPlugin`). Database
  columns are snake_case, TypeScript keys camelCase.
- Code outside the importer's folder is imported through the `@` aliases of `tsconfig.json`
  (`@app`, `@config`, `@db`, `@lib/*`, `@modules/*`, `@plugins/*`), never through `../`. A sibling
  file in the same folder is imported as `./name`. No file extensions in imports.
- **Import order:** packages (`elysia`, `drizzle-orm`, `bun:test`), then `@` aliases, then `./`
  siblings. Nothing enforces it, so a review checks it.
- Named exports only, except where a tool needs a default (configs).
