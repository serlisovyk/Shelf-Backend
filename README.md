# Shelf Backend

📚 REST API for Shelf, the reading tracker built on ljsf.

Shelf Backend is a standalone API that the Shelf frontend talks to instead of `localStorage`. It is built on Bun and Elysia with strict TypeScript; features live in self-contained modules under `src/modules/`.

## ✨ Features

- Elysia app assembled in `src/app.ts` and tested in-process via `app.handle(new Request(...))`
- `GET /health` liveness check
- Strict TypeScript (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) with `@`-prefixed path aliases
- ESLint (`typescript-eslint` strict, type-checked) and Prettier, enforced on commit

## 🧰 Tech Stack

- Bun
- Elysia
- TypeScript
- bun test
- ESLint, typescript-eslint
- Prettier
- Husky, lint-staged

## 📁 Project Structure

```text
src/
  app.ts     Elysia app assembly, exported for tests
  index.ts   entry point: starts the HTTP server
tests/       bun test suites
```

Path aliases are declared in `tsconfig.json` (`paths`): `@app`, `@config`, `@db`, `@lib/*`, `@modules/*`.

## ⚙️ Environment Variables

Create a `.env` file in the project root. Use `.env.sample` as the list of required keys. Bun loads `.env` automatically (no `dotenv`); the tests do not need it.

```env
NODE_ENV=development

PORT=3000
```

## 🚀 Scripts

Install dependencies (also installs the Git hooks):

```bash
bun install
```

Start the dev server with file watching:

```bash
bun run dev
```

Start without watching:

```bash
bun run start
```

Type-check the project:

```bash
bun run typecheck
```

Lint (`lint:fix` to auto-fix):

```bash
bun run lint
```

Format (`format:check` to verify only):

```bash
bun run format
```

Run tests:

```bash
bun test
```

## 🔄 CI

The pre-commit hook runs ESLint and Prettier on staged files via Husky + lint-staged (`.lintstagedrc.json`).

## 🔌 API Endpoints

```text
GET /health
```
