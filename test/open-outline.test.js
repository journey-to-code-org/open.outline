import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOutline,
  flattenOutline,
  getOutlineDepth,
  countOutlineItems
} from "../src/index.js";

test("buildOutline returns an empty outline for empty input", () => {
  assert.deepEqual(buildOutline([]), []);
});

test("buildOutline handles a single heading", () => {
  assert.deepEqual(buildOutline([{ level: 1, text: "Intro" }]), [
    { level: 1, text: "Intro", children: [] }
  ]);
});

test("buildOutline nests headings by level", () => {
  const result = buildOutline([
    { level: 1, text: "Intro" },
    { level: 2, text: "Install" },
    { level: 3, text: "Windows" },
    { level: 2, text: "Usage" }
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].children.length, 2);
  assert.equal(result[0].children[0].children[0].text, "Windows");
});

test("buildOutline handles same-level headings as siblings", () => {
  const result = buildOutline([
    { level: 2, text: "One" },
    { level: 2, text: "Two" }
  ]);

  assert.equal(result.length, 2);
});

test("buildOutline does not invent skipped levels", () => {
  const result = buildOutline([
    { level: 1, text: "Intro" },
    { level: 3, text: "Deep" }
  ]);

  assert.equal(result[0].children.length, 1);
  assert.equal(result[0].children[0].level, 3);
});

test("buildOutline handles jumps back up several levels", () => {
  const result = buildOutline([
    { level: 1, text: "A" },
    { level: 2, text: "B" },
    { level: 4, text: "C" },
    { level: 1, text: "D" }
  ]);

  assert.equal(result.length, 2);
  assert.equal(result[0].children[0].children[0].text, "C");
  assert.equal(result[1].text, "D");
});

test("buildOutline can start at h2 or deeper", () => {
  const result = buildOutline([
    { level: 2, text: "A" },
    { level: 3, text: "B" }
  ]);

  assert.equal(result[0].level, 2);
  assert.equal(result[0].children[0].level, 3);
});

test("buildOutline preserves extra metadata", () => {
  const result = buildOutline([
    { level: 1, text: "Intro", line: 42, custom: "value" }
  ]);

  assert.equal(result[0].line, 42);
  assert.equal(result[0].custom, "value");
});

test("buildOutline preserves duplicate IDs without enforcing uniqueness", () => {
  const result = buildOutline([
    { level: 1, text: "A", id: "same" },
    { level: 1, text: "B", id: "same" }
  ]);

  assert.equal(result[0].id, "same");
  assert.equal(result[1].id, "same");
});

test("buildOutline does not mutate input", () => {
  const heading = { level: 1, text: "Intro", meta: { stable: true } };
  const headings = [heading];
  const snapshot = structuredClone(headings);

  buildOutline(headings);

  assert.deepEqual(headings, snapshot);
  assert.equal("children" in heading, false);
});

test("flattenOutline returns document order without children by default", () => {
  const outline = buildOutline([
    { level: 1, text: "A" },
    { level: 2, text: "B" },
    { level: 1, text: "C" }
  ]);

  const flat = flattenOutline(outline);

  assert.deepEqual(flat.map((item) => item.text), ["A", "B", "C"]);
  assert.equal("children" in flat[0], false);
});

test("flattenOutline can retain children", () => {
  const outline = buildOutline([
    { level: 1, text: "A" },
    { level: 2, text: "B" }
  ]);

  const flat = flattenOutline(outline, { includeChildren: true });

  assert.ok(Array.isArray(flat[0].children));
  assert.equal(flat[0].children.length, 1);
});

test("getOutlineDepth returns zero for empty outline", () => {
  assert.equal(getOutlineDepth([]), 0);
});

test("getOutlineDepth returns maximum tree depth", () => {
  const outline = buildOutline([
    { level: 1, text: "A" },
    { level: 2, text: "B" },
    { level: 4, text: "C" }
  ]);

  assert.equal(getOutlineDepth(outline), 3);
});

test("countOutlineItems counts recursively", () => {
  const outline = buildOutline([
    { level: 1, text: "A" },
    { level: 2, text: "B" },
    { level: 3, text: "C" },
    { level: 1, text: "D" }
  ]);

  assert.equal(countOutlineItems(outline), 4);
});

test("invalid headings array throws TypeError", () => {
  assert.throws(() => buildOutline(null), TypeError);
});

test("invalid heading objects throw TypeError", () => {
  assert.throws(() => buildOutline([null]), TypeError);
  assert.throws(() => buildOutline(["heading"]), TypeError);
});

test("invalid heading levels throw RangeError", () => {
  assert.throws(() => buildOutline([{ level: 0, text: "A" }]), RangeError);
  assert.throws(() => buildOutline([{ level: 1.5, text: "A" }]), RangeError);
});

test("invalid heading text throws TypeError", () => {
  assert.throws(() => buildOutline([{ level: 1, text: 42 }]), TypeError);
});

test("invalid heading id throws TypeError", () => {
  assert.throws(
    () => buildOutline([{ level: 1, text: "A", id: 42 }]),
    TypeError
  );
});

test("invalid includeChildren option throws TypeError", () => {
  assert.throws(
    () => flattenOutline([], { includeChildren: "yes" }),
    TypeError
  );
});
