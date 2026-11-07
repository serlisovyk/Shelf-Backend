# Docs Rules

Every task starts by reading the docs, so they stay short. The code is the source of **how**; docs
answer **where** (`ai/map.md`), **what must hold** (`ai/rules/`) and **why** (`ai/decisions/`). The
API contract for clients is the generated OpenAPI document, not a doc.

- **One fact, one home.** Grep before adding a fact; link instead of copying. A doc does not retell
  the code (parameters, response shapes, constants, the endpoint list) or another doc. The map names
  where to look.
- **No history in current docs.** No task numbers, "since MY-…", measurements or check logs: they
  belong to commits, plans, reports and Linear. A rule says what holds now; a decision says why. The one exception is
  a short note on a part a later task will build (a _planned_ mark in the map, a temporary
  exception in a rule): it may name that task (`MY-<n>`), and the task that builds it deletes the
  note.
- **Planned is marked.** The map never presents an unbuilt module, plugin, table or file as existing.
- **No other projects.** A doc never cites or compares with another of the author's projects; a rule
  or a decision stands on its own reasons. The Shelf frontend is named only as this API's client.
- **Name modules, plugins and functions, not file paths,** where that is enough: paths change, names
  last.
- **Limits.** `ai/map.md`: at most 150 lines and 12 KB, a list item at most about 150 characters, a
  table cell at most 80. A rules file: about 150 lines. A decision record: about 30 lines. A task adds
  a line or two per doc, and cuts in the same change when a limit is crossed.
- **Update only what the change made wrong:** a module, plugin, table, folder, env variable, script or
  tooling file added, renamed or removed → the map; a pattern reshaped → the rule; a durable decision
  → a record (criteria in `ai/decisions/README.md`); setup, scripts, env or the public API →
  `README.md`.
- **Links.** Relative, and kept working: a moved or renamed doc updates every link to it in the same
  change.
- **Language.** Everything in `ai/`, `AGENTS.md`, `CLAUDE.md` and `README.md` is English; Linear
  issues are Russian.
