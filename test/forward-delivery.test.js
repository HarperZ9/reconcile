import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function exists(path) {
  try {
    return statSync(join(root, path)).isFile();
  } catch {
    return false;
  }
}

test("public and developer delivery files exist", () => {
  const required = [
    "README.md",
    "USAGE.md",
    "CHANGELOG.md",
    "AUTHORS.md",
    "CONTRIBUTING.md",
    "LICENSE",
    "AGENTS.md",
    ".github/FUNDING.yml",
    ".github/workflows/ci.yml",
    "docs/brand/reconcile-hero.png",
    "project-docs/specs/SPEC-reconcile-forward-delivery.md",
  ];

  assert.deepEqual(required.filter((path) => !exists(path)), []);
});

test("README serves public and developer audiences", () => {
  const text = read("README.md");

  for (const heading of ["## Try it", "## Why it matters", "## For developers"]) {
    assert.ok(text.includes(heading), `missing ${heading}`);
  }
  assert.ok(text.includes("docs/brand/reconcile-hero.png"));
  assert.ok(text.toLowerCase().includes("replayable browser worlds"));
  assert.ok(text.includes("USAGE.md"));
  assert.ok(text.includes("CHANGELOG.md"));
  assert.ok(text.includes("npm test"));
});

test("package metadata carries public repository and brand asset", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.repository.url, "git+https://github.com/HarperZ9/reconcile.git");
  assert.equal(pkg.bugs.url, "https://github.com/HarperZ9/reconcile/issues");
  assert.equal(pkg.homepage, "https://github.com/HarperZ9/reconcile#readme");
  assert.ok(pkg.files.includes("docs/brand"));
});

test("usage and changelog describe the current verification path", () => {
  const usage = read("USAGE.md");
  const changelog = read("CHANGELOG.md");

  assert.ok(usage.includes("Generate A World"));
  assert.ok(usage.includes("Verify Locally"));
  assert.ok(changelog.includes("Forward Delivery Contract"));
  assert.ok(changelog.includes("SPEC-reconcile-forward-delivery.md"));
});
