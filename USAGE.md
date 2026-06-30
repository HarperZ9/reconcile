# Reconcile Usage

## Generate A World

```sh
node cli.js create gyroid --seed 7 --out out
```

This writes a replayable world packet and preview under `out/`.

## Compose Worlds

```sh
node cli.js compose gyroid,phyllotaxis --seed 7 --out out
```

The composed world keeps layer order, composition criteria, render programs, and
receipt data together.

## Use As A Library

```js
import { create, compose } from "./src/index.js";

const world = create("turbulence", { seed: 5 });
const composite = compose(["gyroid", "phyllotaxis"], { seed: 7 });
```

## Run The Browser Demo

```sh
python -m http.server
```

Open `web/index.html`. The page imports the same ESM engine directly and renders
the generated program client-side.

## Verify Locally

```sh
npm test
```

Use this command before changing package metadata, README instructions, browser
demo behavior, render programs, or receipt shape.
