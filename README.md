<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/HarperZ9/reconcile/main/docs/art/hero-dark.svg">
  <img src="https://raw.githubusercontent.com/HarperZ9/reconcile/main/docs/art/hero-light.svg" alt="reconcile: Turn creative generators into replayable browser worlds. Streamlines of fine lines spiral inward around a bright core." width="100%">
</picture>

# reconcile

Turn creative generators into replayable browser worlds.

```
node cli.js create gyroid --seed 7 --out out
```

[![version: 0.2.0](https://img.shields.io/badge/version-0.2.0-e6e1d6?style=flat-square&labelColor=1a1712)](https://github.com/HarperZ9/reconcile/releases/latest)
[![CI](https://github.com/HarperZ9/reconcile/actions/workflows/ci.yml/badge.svg)](https://github.com/HarperZ9/reconcile/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-FSL--1.1--MIT-e6e1d6?style=flat-square&labelColor=1a1712)](https://github.com/HarperZ9/reconcile/blob/main/LICENSE)
![node 18+](https://img.shields.io/badge/node-18%2B-e6e1d6?style=flat-square&labelColor=1a1712)

## Try it

```bash
node cli.js create gyroid --seed 7 --out out
python -m http.server
```

Then open `web/index.html` in a browser. For the full local workflow, see
[USAGE.md](USAGE.md).

## See it work, step by step

The [animated explainer](https://harperz9.github.io/repo-explainers/reconcile.html)
walks through generating a gyroid world, refining it toward its weakest axis, the best-effort label, the shader program and receipt, and replaying the same id. Every value on it is output from this repository. Its
source is [docs/explainer/index.html](docs/explainer/index.html).

## Watch

No concept film fits this tool closely yet. The walkthrough below covers it in text, with real commands and output.

Video walkthrough: coming with the next release.

## Walkthrough

Install it, run it once, then use the main feature. Each command below is real, and so is its output.

1. **Get it.** Clone it. Node 18 or newer, no install step.

   ```text
   $ git clone https://github.com/HarperZ9/reconcile && cd reconcile
   ```

2. **First run: create a world.** Generate a gyroid at seed 7. It is refined toward its weakest axis and labelled best-effort when it stops short of the target.

   ```text
   $ node cli.js create gyroid --seed 7 --out out
   reasoning: 10 steps · cohesion 0.8624
   margins: clean_freq=1.00 contrast=0.73 complexity=0.79 novelty=1.00
   ```

3. **Compose two generators.** Layer two generators and score the composition.

   ```text
   $ node cli.js compose gyroid,phyllotaxis --seed 7
   composition: 0.5829 (depth_complementarity=0.425, contrast_balance=0.9273)
   ```

4. **See it in a browser.** Serve the folder and open `web/index.html` to run the same engine and render the shader in WebGL.

   ```text
   $ python -m http.server
   ```

## Why it matters

Generative engines are easier to trust when their output is inspectable. Reconcile keeps the generated world, criteria, refinement path, browser render program, and receipt together, so a creative run can be replayed instead of merely admired.

## What to test first

- Generate a `gyroid` world from the CLI and inspect the output JSON and SVG preview.
- Open the browser demo and confirm the same engine module runs client-side.
- Change the seed and confirm the world identity, trajectory, and receipt change deterministically.

## Current status

- **Runtime:** Node 18+ and browser ESM; zero runtime dependencies.
- **Surface:** CLI, library API, direct browser import, WebGL render programs, SVG previews, and receipts.
- **Scope:** Reconcile emits programs and replayable creative records. Native rendering and audio playback remain host responsibilities.

## Technical framing

> The unified creative-verification engine. **One operation -- the reconcile -- over one substrate;
> every generator an organ; the whole loop witnessed.** Zero dependencies; runs in **node and the
> browser** from the same source.

![node](https://img.shields.io/badge/node-%E2%89%A518-blue.svg)
![deps: none](https://img.shields.io/badge/deps-none-success.svg)
[![license: FSL-1.1-MIT](https://img.shields.io/badge/license-FSL--1.1--MIT-blue.svg)](LICENSE)

A generated artifact here is never just "what its seed says." It is **perceived**, **judged against a
criterion it did not author**, **refined toward correct**, optionally **composed** with others and
**choreographed** in time, and **witnessed** -- emitted as a reproducible, re-checkable World. The
single-thread / reconcile thesis as an actual engine.

## The loop

```
perceive → generate → critique → refine → compose → choreograph → witness
```

- **substrate** (`src/expr.js`) -- one closed-form expression algebra (sin/cos/exp/±/×/÷ over u,v,t,x,y,i).
  Every field is an expr: sampled for features, **emitted as GLSL**, and parsed back so the shipped
  shader is provably the verified math (the round-trip grounding proof).
- **organ** (`src/organ.js`, `src/organs/`) -- the unifying abstraction. Every generator is
  `{ make(params)→artifact, criteria, params }`. **7 field** organs (gyroid · quasicrystal · flow ·
  turbulence · metaballs · rings · moiré) emit exprs; **3 form** organs (phyllotaxis · attractor ·
  harmonograph) emit point recipes. One interface; the engine treats them identically.
- **critique** (`features.js` · `criteria.js` · `corpus.js`) -- features → criteria → **cohesion**
  (harmonic mean: correct on every axis, not good-on-average) → **novelty** vs a living corpus.
- **refine** (`src/refine.js`) -- the creation drive. Reflect on the weakest axis; bounded coordinate
  descent toward higher cohesion (which folds in novelty) until **correct**, or honest best-effort.
  The trajectory IS the reasoning.
- **compose** (`src/compose.js`) -- layer organs in depth, scored by a composition criterion.
- **choreograph** (`src/temporal.js`) -- a witnessed motion timeline (seam-continuity + on-criterion).
- **witness** (`src/world.js`) -- a `World`: render programs (GLSL/recipe) + trajectory + timeline +
  composition + palette + a receipt. Deterministic for `(organ, seed)`; node and browser produce the
  **identical** World (same id + witness).

## Use it

### CLI (node, zero install)
```bash
node cli.js create gyroid --seed 7 --out out        # refine -> a witnessed World + SVG preview
node cli.js create quasicrystal --seed 3 --no-refine
node cli.js compose gyroid,phyllotaxis --seed 7      # a layered composite World
node cli.js organs                                   # list the organ library
```

### Library
```js
import { create, compose } from "./src/index.js";
const world = create("turbulence", { seed: 5 });     // perceive→…→witness
//  world.trajectory (the reasoning) · world.timeline · world.layers[].render_program · world.receipt
```

### Live (browser, zero build)
```bash
python -m http.server          # then open /web/index.html
```
The page **imports the engine module directly** and runs the whole loop client-side: pick an organ,
press **create**, watch it refine, render the shipped GLSL in WebGL, and read the verdict + timeline +
receipt -- no server, no dependencies.

## Honest scope

The engine emits **programs as data** and verifies them on CPU -- the native GPU/audio rendering is the
consumer's (the browser compiles the shipped shader). The content hash (`src/hash.js`, cyrb53) is a
sync content digest for identity + tamper-evidence, not cryptographic SHA-256 (a documented v0.2
upgrade). The criteria are grounded aesthetic axes -- a coarse, honest read, not a quality oracle.

## Provenance

Synthesizes and unifies the proven math of **studio-engine** (the strand substrate, the World contract,
the refine primitive) and the **atelier** (the organ library) into one ownable engine. FSL-1.1-MIT
from v0.2.0 (see License below); the author retains copyright.

**Zain Dana Harper** -- small tools with explicit edges. Built with Claude Code; reviewed, tested, owned.

## For developers

Keep the public README, package metadata, and examples aligned with current behavior. Before opening a PR or pushing a release, run the local Node verification path.

```bash
npm install
npm test
```

See [AGENTS.md](AGENTS.md) for the repo-specific operating boundary and
[CHANGELOG.md](CHANGELOG.md) for current delivery status.

## License

From v0.2.0, code is licensed FSL-1.1-MIT. Earlier releases remain under AGPL-3.0-or-later. FSL-1.1-MIT is the Functional Source License, Version 1.1, with MIT as the future licence: each release becomes available under MIT two years after it is made available. See [LICENSE](LICENSE). Every commit in this repository is by the author.

---

Built by **[Zain Dana Harper](https://harperz9.github.io)** in Seattle: evidence-first tools that leave a re-checkable artifact behind. The full workbench is at [Project Telos](https://harperz9.github.io).
