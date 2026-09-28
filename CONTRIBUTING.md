# Contributing to open.outline

Thanks for contributing.

`open.outline` is intentionally small. It builds and inspects document-outline
trees from heading data.

## Before changing code

1. Read `README.md`.
2. Read `AGENTS.md` if you are using an AI coding assistant.
3. Run the test suite.
4. Keep changes focused on the documented public contract.

## Development

```bash
npm test
```

## Pull requests

A pull request should:

- explain the behavior being changed,
- include tests for new or corrected behavior,
- update docs when the public API changes,
- preserve input immutability,
- preserve extra heading metadata,
- avoid unrelated refactors,
- avoid adding dependencies unless there is a compelling reason.

## Design rule

A feature belongs in `open.outline` only if it operates on document-outline
structure without needing Markdown, HTML, DOM APIs, or application-specific
state.
