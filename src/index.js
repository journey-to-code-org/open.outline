function assertArray(value, name) {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected ${name} to be an array`);
  }
}

function assertHeading(heading, index) {
  if (heading === null || typeof heading !== "object" || Array.isArray(heading)) {
    throw new TypeError(`Expected heading at index ${index} to be an object`);
  }

  if (!Number.isInteger(heading.level) || heading.level <= 0) {
    throw new RangeError(
      `Expected heading.level at index ${index} to be a positive integer`
    );
  }

  if (typeof heading.text !== "string") {
    throw new TypeError(
      `Expected heading.text at index ${index} to be a string`
    );
  }

  if (heading.id !== undefined && typeof heading.id !== "string") {
    throw new TypeError(
      `Expected heading.id at index ${index} to be a string when provided`
    );
  }
}

function cloneHeading(heading) {
  return {
    ...heading,
    children: []
  };
}

export function buildOutline(headings) {
  assertArray(headings, "headings");

  headings.forEach(assertHeading);

  const roots = [];
  const stack = [];

  for (const heading of headings) {
    const node = cloneHeading(heading);

    while (
      stack.length > 0 &&
      stack[stack.length - 1].level >= node.level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return roots;
}

function assertOutlineItem(item, path) {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    throw new TypeError(`Expected outline item at ${path} to be an object`);
  }

  if (!Number.isInteger(item.level) || item.level <= 0) {
    throw new RangeError(
      `Expected outline item level at ${path} to be a positive integer`
    );
  }

  if (typeof item.text !== "string") {
    throw new TypeError(`Expected outline item text at ${path} to be a string`);
  }

  if (!Array.isArray(item.children)) {
    throw new TypeError(
      `Expected outline item children at ${path} to be an array`
    );
  }
}

function visitOutline(outline, visitor) {
  assertArray(outline, "outline");

  function visit(items, pathPrefix) {
    items.forEach((item, index) => {
      const path = `${pathPrefix}[${index}]`;
      assertOutlineItem(item, path);
      visitor(item);
      visit(item.children, `${path}.children`);
    });
  }

  visit(outline, "outline");
}

export function flattenOutline(outline, options = {}) {
  const { includeChildren = false } = options;

  if (typeof includeChildren !== "boolean") {
    throw new TypeError("Expected includeChildren to be a boolean");
  }

  const result = [];

  visitOutline(outline, (item) => {
    if (includeChildren) {
      result.push({
        ...item,
        children: [...item.children]
      });
    } else {
      const { children: _children, ...rest } = item;
      result.push({ ...rest });
    }
  });

  return result;
}

export function getOutlineDepth(outline) {
  assertArray(outline, "outline");

  function depth(items, pathPrefix) {
    let max = 0;

    items.forEach((item, index) => {
      const path = `${pathPrefix}[${index}]`;
      assertOutlineItem(item, path);
      max = Math.max(max, 1 + depth(item.children, `${path}.children`));
    });

    return max;
  }

  return depth(outline, "outline");
}

export function countOutlineItems(outline) {
  let count = 0;

  visitOutline(outline, () => {
    count += 1;
  });

  return count;
}
