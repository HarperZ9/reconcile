# reconcile

> The unified creative-verification engine. **One operation — the reconcile — over one substrate;
> every generator an organ; the whole loop witnessed.** Zero dependencies; runs in **node and the
> browser** from the same source.

![node](https://img.shields.io/badge/node-%E2%89%A518-blue.svg)
![deps: none](https://img.shields.io/badge/deps-none-success.svg)
![license: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)

A generated artifact here is never just "what its seed says." It is **perceived**, **judged against a
criterion it did not author**, **refined toward correct**, optionally **composed** with others and
**choreographed** in time, and **witnessed** — emitted as a reproducible, re-checkable World. The
single-thread / reconcile thesis as an actual engine.

## The loop

```
perceive → generate → critique → refine → compose → choreograph → witness
```

- **substrate** (`src/expr.js`) — one closed-form expression algebra (sin/cos/exp/±/×/÷ over u,v,t,x,y,i).
  Every field is an expr: sampled for features, **emitted as GLSL**, and parsed back so the shipped
  shader is provably the verified math (the round-trip grounding proof).
- **organ** (`src/organ.js`, `src/organs/`) — the unifying abstraction. Every generator is
  `{ make(params)→artifact, criteria, params }`. **7 field** organs (gyroid · quasicrystal · flow ·
  turbulence · metaballs · rings · moiré) emit exprs; **3 form** organs (phyllotaxis · attractor ·
  harmonograph) emit point recipes. One interface; the engine treats them identically.
- **critique** (`features.js` · `criteria.js` · `corpus.js`) — features → criteria → **cohesion**
  (harmonic mean: correct on every axis, not good-on-average) → **novelty** vs a living corpus.
- **refine** (`src/refine.js`) — the creation drive. Reflect on the weakest axis; bounded coordinate
  descent toward higher cohesion (which folds in novelty) until **correct**, or honest best-effort.
  The trajectory IS the reasoning.
- **compose** (`src/compose.js`) — layer organs in depth, scored by a composition criterion.
- **choreograph** (`src/temporal.js`) — a witnessed motion timeline (seam-continuity + on-criterion).
- **witness** (`src/world.js`) — a `World`: render programs (GLSL/recipe) + trajectory + timeline +
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
receipt — no server, no dependencies.

## Honest scope

The engine emits **programs as data** and verifies them on CPU — the native GPU/audio rendering is the
consumer's (the browser compiles the shipped shader). The content hash (`src/hash.js`, cyrb53) is a
sync content digest for identity + tamper-evidence, not cryptographic SHA-256 (a documented v0.2
upgrade). The criteria are grounded aesthetic axes — a coarse, honest read, not a quality oracle.

## Provenance

Synthesizes and unifies the proven math of **studio-engine** (the strand substrate, the World contract,
the refine primitive) and the **atelier** (the organ library) into one ownable engine. AGPL-3.0; the
author retains copyright (commercial terms available).

**Zain Dana Harper** — small tools with explicit edges. Built with Claude Code; reviewed, tested, owned.
