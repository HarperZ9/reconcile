import { test } from "node:test";
import assert from "node:assert";
import { ALL_ORGANS } from "../src/organs/index.js";
import { makeArtifact, organFeatures, defParams } from "../src/organ.js";
import { score, CRIT } from "../src/criteria.js";
import * as ex from "../src/expr.js";

test("every organ makes a valid artifact, 0..1 features, known axes", () => {
  assert.ok(ALL_ORGANS.length >= 10);
  for (const o of ALL_ORGANS) {
    const art = makeArtifact(o, defParams(o));
    assert.ok(art.kind === "field" || art.kind === "points", o.id);
    const f = organFeatures(o, defParams(o));
    for (const k of ["coverage", "centroid_offset", "contrast", "entropy"]) assert.ok(f[k] >= 0 && f[k] <= 1, `${o.id}.${k}`);
    for (const ax of o.axes) assert.ok(CRIT[ax], `${o.id} unknown axis ${ax}`);
  }
});

test("field organ exprs emit GLSL that round-trips to the same values", () => {
  for (const o of ALL_ORGANS) {
    if (o.kind !== "field") continue;
    const e = makeArtifact(o, defParams(o)).expr;
    const back = ex.parseGLSL(ex.emitGLSL(e));
    for (const [u, v, t] of [[-0.6, 0.3, 0], [0.4, -0.5, 0.7]]) {
      assert.ok(Math.abs(ex.evalExpr(e, { u, v, t }) - ex.evalExpr(back, { u, v, t })) < 1e-5, `${o.id} round-trip`);
    }
  }
});

test("structural criteria respond to the right organ params", () => {
  assert.ok(score("clean_freq", {}, { freq: 7 }) > 0.99);
  assert.ok(score("golden_angle", {}, { angle: 137.5 }) > 0.95);
  assert.ok(score("fivefold", {}, { waves: 5 }) > 0.99);
});
