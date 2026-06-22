import { test } from "node:test";
import assert from "node:assert";
import "../src/organs/index.js"; // register organs
import { getOrgan, defParams } from "../src/organ.js";
import { refine, evaluate } from "../src/refine.js";
import { Corpus } from "../src/corpus.js";

test("refine emits a witnessed trajectory and never worsens the best-so-far", () => {
  const o = getOrgan("gyroid");
  const start = { ...defParams(o), freq: 6.5 };
  const r = refine(o, start, { maxSteps: 20, corpus: new Corpus() });
  assert.ok(r.trajectory.length >= 1);
  const startCoh = evaluate(o, start, new Corpus()).cohesion;
  assert.ok(r.cohesion >= startCoh - 1e-9);
  for (const s of r.trajectory) assert.ok("weakest" in s && "cohesion" in s && "margins" in s);
  assert.ok(["verified", "unverifiable", "refuted"].includes(r.tag));
});

test("refine pushes a detuned frequency toward clean (clean_freq rises off 0)", () => {
  const o = getOrgan("gyroid");
  const start = { ...defParams(o), freq: 6.5 };
  const startClean = evaluate(o, start, new Corpus()).margins.clean_freq;
  assert.ok(startClean < 0.05);
  const r = refine(o, start, { maxSteps: 24, corpus: new Corpus() });
  assert.ok(r.margins.clean_freq > 0.3, `clean_freq only reached ${r.margins.clean_freq}`);
});

test("refine is deterministic for the same start + empty corpus", () => {
  const o = getOrgan("rings");
  const a = refine(o, defParams(o), { maxSteps: 12, corpus: new Corpus() });
  const b = refine(o, defParams(o), { maxSteps: 12, corpus: new Corpus() });
  assert.deepEqual(a.params, b.params);
  assert.equal(a.cohesion, b.cohesion);
});
