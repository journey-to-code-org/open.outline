# open.outline

Small, dependency-free utilities for building hierarchical document outlines
from flat heading data.

## Install

```bash
npm install @journey-to-code/open-outline
```

## Usage

```js
import {
  buildOutline,
  flattenOutline,
  getOutlineDepth,
  countOutlineItems
} from "@journey-to-code/open-outline";

const headings = [
  { level: 1, text: "Getting Started", id: "getting-started" },
  { level: 2, text: "Installation", id: "installation" },
  { level: 3, text: "Windows", id: "windows" },
  { level: 2, text: "Usage", id: "usage" }
];

const outline = buildOutline(headings);
```

`outline` becomes:

```js
[
  {
    level: 1,
    text: "Getting Started",
    id: "getting-started",
    children: [
      {
        level: 2,
        text: "Installation",
        id: "installation",
        children: [
          {
            level: 3,
            text: "Windows",
            id: "windows",
            children: []
          }
        ]
      },
      {
        level: 2,
        text: "Usage",
        id: "usage",
        children: []
      }
    ]
  }
]
```

## API

### `buildOutline(headings)`

Builds a nested outline from a flat array of heading objects.

Heading requirements:

- `level` must be a positive integer.
- `text` must be a string.
- `id` is optional.
- Extra properties are preserved.
- The input array and heading objects are never mutated.

Skipped levels are preserved without inventing fake headings:

```js
buildOutline([
  { level: 1, text: "Intro" },
  { level: 3, text: "Deep section" }
]);
```

The level-3 heading becomes a child of the level-1 heading.

### `flattenOutline(outline, options?)`

Flattens a nested outline back into document order.

```js
flattenOutline(outline);
```

By default, returned items omit their `children` property.

```js
flattenOutline(outline, {
  includeChildren: true
});
```

### `getOutlineDepth(outline)`

Returns the maximum tree depth.

```js
getOutlineDepth(outline);
// 3
```

Empty outlines return `0`.

### `countOutlineItems(outline)`

Counts all outline items recursively.

```js
countOutlineItems(outline);
// 4
```

## Scope

`open.outline` does not:

- parse Markdown,
- parse HTML,
- generate slugs,
- render table-of-contents markup,
- touch the DOM,
- provide scroll-spy or navigation UI.

Those concerns belong in higher-level tools.

## Runtime

- Node.js 18+
- modern browsers
- ES modules
- zero runtime dependencies

## Development

```bash
npm test
```

## License

MIT
