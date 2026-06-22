// Organ — the unifying abstraction. Every generator, field or form, is one shape:
//   { id, label, kind:"field"|"points", params:[{k,min,max,step,def}], axes:[criterion...], make(p)->artifact }
// A field organ's artifact carries an `expr` (-> GLSL, sampled for features); a form organ's carries
// `points` (+ a recipe). The engine treats all organs identically — generate, judge, refine, compose.
import { featuresOf } from "./features.js";

export function defParams(organ) {
  const o = {}; for (const p of organ.params) o[p.k] = p.def; return o;
}
export function clampParams(organ, params) {
  const o = defParams(organ);
  for (const p of organ.params) {
    const x = params?.[p.k];
    if (x != null && !Number.isNaN(Number(x))) o[p.k] = Math.max(p.min, Math.min(p.max, Number(x)));
  }
  return o;
}
export function makeArtifact(organ, params) { return organ.make(clampParams(organ, params)); }
export function organFeatures(organ, params) { return featuresOf(makeArtifact(organ, params)); }

// registry
const REG = new Map();
export function register(...organs) { for (const o of organs) REG.set(o.id, o); return organs; }
export function getOrgan(id) { return REG.get(id); }
export function allOrgans() { return [...REG.values()]; }
export function organIds() { return [...REG.keys()]; }
