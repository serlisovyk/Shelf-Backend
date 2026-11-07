# Decisions

Durable project decisions: why a choice was made, with a date. One decision per file, named
`YYYY-MM-DD-<slug>.md`. Format: a title, a `Date: … · Status: …` line, then `Context` →
`Decision` → `Consequences`; short and specific (about 30 lines, `ai/rules/docs.md`), rejected
alternatives with their reason, no check logs.

How this differs from `ai/rules/`: **rules** state what to do now (current law, rewritten as it
changes). **Decisions** state _why_, with a date. A record's text is not rewritten or deleted; only
its `Status` line changes.

The point: an agent (or a human) does not relitigate settled questions or "helpfully" restore
something that was deliberately rejected.

## Status

- `accepted` — in force and built.
- `accepted (not implemented)` — agreed now, built by a later task; that task sets it to `accepted`.
- `superseded by <file>` — replaced by a newer record; its line in the index moves to the
  Superseded group.

## Changing a decision

A refinement or a reversal is a **new record** that restates what stays in force, so the reader needs
only the newest one. The old record only changes its `Status` line to `superseded by <file>`.

## When to add a record

Propose one as soon as the decision surfaces, without being asked, and only for:

- a standing constraint ("we will not do X", "always / never Y");
- a feature the author deliberately rejected, in a dated record of its own;
- a tradeoff accepted over a named alternative, one a future agent would likely undo;
- a goal agreed now and built later (`accepted (not implemented)`);
- a convention chosen where an obvious alternative existed.

Not decisions: one-off task details, plain current-state facts, a choice nobody would reverse,
anything `ai/rules/` and `ai/map.md` already cover. Do not create noise records.

## Records

The records in force, by topic; a Superseded group is added when the first record is replaced, each
with the record that replaced it.

### Project and process

- [A separate repo for the backend](2026-11-07-separate-backend-repo.md)
- [Merge locally into `main`, no pull requests; only `main` is pushed](2026-11-07-local-merge-without-pr.md)

### Stack

- [Bun and Elysia](2026-11-07-bun-and-elysia.md)
- [TypeBox (`t`) for validation, not Zod](2026-11-07-typebox-over-zod.md)

### Auth and catalog

- [Our own JWT auth, no auth library](2026-11-07-own-jwt-auth.md)
- [Open Library behind a caching proxy, no catalog of our own](2026-11-07-open-library-proxy.md)
