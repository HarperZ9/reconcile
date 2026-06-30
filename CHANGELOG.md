# Changelog

## 2026-06-29 - Forward Delivery Contract

- Added `AGENTS.md`, `USAGE.md`, CI, and a Node delivery regression test.
- Added package repository, bugs, homepage, and brand asset publish metadata.
- Added `project-docs/specs/SPEC-reconcile-forward-delivery.md` as the
  implementation receipt for the delivery pass.
- Normalized forward-facing punctuation for public-surface scanner
  compatibility.
- Kept engine behavior, browser module behavior, world shape, render programs,
  and receipt logic unchanged.

## Current Status

- Runtime: Node 18+ and browser ESM with zero runtime dependencies.
- Surfaces: CLI, library API, direct browser import, WebGL render programs, SVG
  previews, world receipts, and static browser demo.
- Verification: `npm test`, including engine tests and forward delivery tests.
