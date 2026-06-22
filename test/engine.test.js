import { test } from "node:test";
import assert from "node:assert";
import { create, compose } from "../src/reconcile.js";

test("create emits a witnessed World: render program + trajectory + receipt", () => {
  const w = create("gyroid", { seed: 7 });
  assert.equal(w.schema_version, "reconcile/1");
  assert.equal(w.layers.length, 1);
  assert.equal(w.layers[0].render_program.target, "glsl-fragment");
  assert.ok(w.layers[0].render_program.source.includes("field("));
  assert.ok(w.trajectory.steps.length >= 1);
  assert.ok(w.receipt.witness && w.receipt.id);
  assert.ok(["verified", "unverifiable", "refuted"].includes(w.trajectory.tag));
});

test("create is deterministic for (organ, seed)", () => {
  assert.equal(create("rings", { seed: 3 }).id, create("rings", { seed: 3 }).id);
  assert.notEqual(create("rings", { seed: 3 }).id, create("rings", { seed: 4 }).id);
});

test("a form organ yields a point-recipe program", () => {
  const w = create("phyllotaxis", { seed: 1 });
  assert.equal(w.layers[0].render_program.target, "point-recipe");
  assert.ok(w.layers[0].render_program.recipe.mode);
});

test("an animatable field carries a witnessed timeline; metaballs does not", () => {
  const g = create("gyroid", { seed: 2 });
  assert.ok(g.timeline && g.timeline.continuity);
  assert.equal(create("metaballs", { seed: 2 }).timeline, null);
});

test("compose builds a multi-layer World with a composition verdict + distinct depth", () => {
  const w = compose(["gyroid", "phyllotaxis"], { seed: 7 });
  assert.equal(w.layers.length, 2);
  assert.ok(w.composition && ["verified", "unverifiable", "refuted"].includes(w.composition.tag));
  assert.equal(new Set(w.layers.map((l) => l.z)).size, 2);
});

test("World JSON-serializes cleanly (portable artifact)", () => {
  JSON.stringify(create("turbulence", { seed: 5 }));
  JSON.stringify(compose(["rings", "attractor"], { seed: 5 }));
});
