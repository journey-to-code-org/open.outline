# AI agent guidance

AI-assisted contributions are allowed, but contributors remain responsible for
correctness, scope, tests, and understanding the change.

Before editing:

1. Read `README.md`, `CONTRIBUTING.md`, and the relevant tests.
2. Inspect the current implementation.
3. Restate the exact scope and acceptance criteria.
4. Identify edge cases in outline nesting and flattening.

During implementation:

- Keep the project dependency-free unless a maintainer explicitly approves otherwise.
- Never add Markdown/HTML parsing, slug generation, rendering, or DOM behavior.
- Never mutate caller-provided arrays or heading objects.
- Preserve arbitrary extra metadata on heading objects.
- Keep skipped-level behavior deterministic and documented.
- Add/update tests with every behavior change.
- Avoid unrelated refactors.

Completion reports should include:

- what changed,
- files affected,
- tests run,
- remaining limitations or follow-up work.
