# AGENTS.md -- Reconcile

## Project Boundary

Reconcile is a zero-dependency Node/browser creative-verification engine. It
turns generator organs into replayable worlds with render programs, criteria,
refinement traces, timelines, and receipts.

## Public Delivery Rules

- Keep `README.md`, `USAGE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `AUTHORS.md`,
  `LICENSE`, `.github/FUNDING.yml`, `.github/workflows/ci.yml`, and the brand
  asset present.
- Keep the Node package publish surface aligned with README references. If the
  README references `docs/brand`, `package.json.files` must include it.
- Do not commit generated `out/`, local demos, credentials, private media,
  purchased fonts, or local-only research packets.
- Public claims must resolve to tests, examples, committed artifacts, or
  documented host responsibilities.

## Developer Verification

Run the native package gate before publishing:

```sh
npm test
```

For browser-facing changes, also serve the repository locally and open
`web/index.html`.
