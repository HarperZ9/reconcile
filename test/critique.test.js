import { test } from "node:test";
import assert from "node:assert";
import { pointFeatures, fieldFeatures } from "../src/features.js";
import { score, cohesion, tag } from "../src/criteria.js";
import { Corpus } from "../src/corpus.js";
import * as ex from "../src/expr.js";

test("pointFeatures: metrics in 0..1, coverage rises with spread", () => {
  const pts = [];
  for (let i = 0; i < 400; i++) pts.push([Math.cos(i) * ((i % 20) / 20), Math.sin(i * 1.3) * ((i % 17) / 17)]);
  const f = pointFeatures(pts);
  for (const k of ["coverage", "centroid_offset", "contrast", "entropy"]) assert.ok(f[k] >= 0 && f[k] <= 1, k);
  assert.ok(f.coverage > 0.2);
});

test("fieldFeatures: metrics in 0..1 for a sinusoidal field", () => {
  const e = ex.add(ex.sin(ex.mul(ex.v("u"), 6)), ex.cos(ex.mul(ex.v("v"), 6)));
  const f = fieldFeatures(e, 0);
  for (const k of ["coverage", "centroid_offset", "contrast", "entropy"]) assert.ok(f[k] >= 0 && f[k] <= 1, k);
});

test("criteria: clean_freq rewards integers; cohesion is the harmonic mean; tags", () => {
  assert.ok(score("clean_freq", {}, { freq: 6 }) > 0.99);
  assert.ok(score("clean_freq", {}, { freq: 6.5 }) < 0.1);
  assert.ok(cohesion([0.9, 0.9, 0.1]) < 0.3);                 // one weak axis tanks it
  assert.ok(cohesion([0.9, 0.9, 0.1]) < cohesion([0.6, 0.6, 0.6]));
  assert.equal(tag(0.95), "verified");
  assert.equal(tag(0.7), "unverifiable");
  assert.equal(tag(0.3), "refuted");
});

test("corpus: novelty 1 when empty, ~0 after storing the same vector, high for a far one", () => {
  const c = new Corpus();
  const f = { coverage: 0.5, centroid_offset: 0.2, contrast: 0.5, entropy: 0.7 };
  assert.equal(c.novelty(f), 1);
  c.add(f);
  assert.ok(c.novelty(f) < 0.05);
  assert.ok(c.novelty({ coverage: 0.95, centroid_offset: 0.95, contrast: 0.05, entropy: 0.05 }) > 0.3);
});
