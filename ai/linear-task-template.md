# Linear task template (Shelf-Backend)

Every Linear issue for this repo follows the structure below. **The issue itself is written in
Russian**: the title, the section headings exactly as shown, the body, and the checklist lines. This
file explains each section in English. The `linear-tasks` skill uses it as the source of structure
when creating issues.

Drop empty or irrelevant sections: no placeholders. Sections marked _(optional)_ are added only when
there is something to say.

Issue metadata: project **Shelf-Backend**, team `MY`, labels `Backend` plus the type (`Feature` /
`Improvement` / `Bug` / `Infra` / `AI`, and `Auth` for auth work), the milestone matching the area of
work (1. Фундамент, 2. Авторизация, 3. Каталог, 4. Данные пользователя, 5. Статистика и
контракт, 6. Документация и полировка), state `Todo`. Use a "blocked by" relation only for a real
technical dependency; otherwise "related".

The title stays short; specifics go into the body. An API issue names the module or the endpoints.

---

## Порядок _(optional)_

Which issues (`MY-<n>`) this one comes after and why, which run alongside it, and which issues build
on it. A change the Shelf frontend needs names its ljsf issue.

## Зачем

The problem or gap today and what should change. One or two paragraphs, grounded in the code (module,
plugin, table, current behavior), focused on what a client of the API sees.

## Что сделать

A numbered list of concrete steps:

- which modules, plugins, tables and `lib/` helpers are touched; a new table with its columns, keys,
  indexes and `onDelete`;
- the endpoints: method and path, the `t` schemas of the input, the response shape, status codes and
  error codes: schema failure, missing row, another user's row, no token, conflict, upstream failure;
- user isolation and other security points (`ai/rules/security.md`);
- the tests to write;
- anything to be decided in the plan: phrase it as «решить в плане»; the assignee then stops after
  the plan and waits for the author's approval.

## Решения автора (<date>) _(optional)_

The author's answers given before the work starts: final for the assignee.

## Готово когда

Observable criteria that can be checked by hand: not "done", but "when X is requested, the API
answers Y".

## Риски и крайние случаи _(optional)_

What can break: data migration, timezones, concurrent writes, Open Library limits, and which other
issues or the frontend it affects.

## Вне скоупа _(optional)_

What is deliberately excluded; adjacent work goes into separate issues, linked.

## Обязательно проверить и обновить

Keep the relevant lines, delete the rest. Copy them into the issue as-is:

- [ ] Тесты: поведение покрыто, для данных пользователя — тест изоляции (чужая запись → 404)
- [ ] Миграция drizzle-kit в репо, если изменилась схема БД
- [ ] OpenAPI — схемы `response` и `detail` у новых и изменённых роутов
- [ ] `README.md` — настройка, скрипты, env, публичный API
- [ ] `ai/map.md` — если добавлен, переименован или удалён модуль, плагин, таблица, папка, env-переменная, скрипт или файл инструментов
- [ ] `ai/rules/*` — если изменился паттерн
- [ ] `ai/decisions/` — датированная запись, если зафиксировано долгоживущее решение

## Проверка

Copy into the issue, one line per check under "Verification" in `AGENTS.md`, plus the manual line for
an API change:

- [ ] `bun run format:check`
- [ ] `bun run lint`
- [ ] `bun run typecheck`
- [ ] `bun test`
- [ ] Прогнано руками: запросы к каждому затронутому эндпоинту (curl) на `bun run dev`, включая ошибки (валидация, 401, 404, чужая запись)
