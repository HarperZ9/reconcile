# Spec: Reconcile Forward Delivery Contract

## Objective

Bring Reconcile to the shared Project Telos public/developer delivery floor while
preserving its zero-dependency Node/browser engine behavior.

## Requirements

- [x] Add root `AGENTS.md`, `USAGE.md`, `CHANGELOG.md`, CI workflow, and a Node
  delivery regression test.
- [x] Keep README public-facing while linking deeper usage and developer status
  docs.
- [x] Include README brand assets in the package publish allowlist.
- [x] Add package repository, bugs, and homepage metadata.
- [x] Normalize forward-facing punctuation so the public-surface scanner reports
  a clean public/developer boundary.

## Technical Approach

Use a documentation, metadata, CI, and test-only patch. Keep `npm test` as the
native developer gate by adding `test/forward-delivery.test.js`; avoid adding
runtime dependencies or changing engine modules.

## Files Modified

- `AGENTS.md` - repo-specific operating boundary.
- `USAGE.md` - public and developer command path.
- `CHANGELOG.md` - current status and delivery history.
- `.github/workflows/ci.yml` - Node 24 CI workflow.
- `test/forward-delivery.test.js` - executable delivery contract.
- `README.md` and `package.json` - public/developer links and metadata.
- Existing docs/source/browser copy - punctuation normalization only.

## Success Criteria

- [x] `npm test` passes.
- [x] `python -m public_surface_sweeper . --workspace --json` reports `MATCH`.
- [x] `git diff --check` exits 0.

## Blockers

None identified.

## Status: IMPLEMENTED
