import { test } from "node:test";
import assert from "node:assert";
import * as ex from "../src/expr.js";

test("eval: const, var, unary, variadic", () => {
  assert.equal(ex.evalExpr(ex.c(3)), 3);
  assert.equal(ex.evalExpr(ex.v("u"), { u: 0.5 }), 0.5);
  assert.ok(Math.abs(ex.evalExpr(ex.add(ex.sin(ex.c(0)), ex.cos(ex.c(0)))) - 1) < 1e-12);
  assert.equal(ex.evalExpr(ex.mul(2, 3, 4)), 24);
  assert.equal(ex.evalExpr(ex.add(1, 2, 3, 4)), 10);
});

test("eval: division stays finite (the metaballs guard)", () => {
  assert.ok(Number.isFinite(ex.evalExpr(ex.div(1, 0))));
});

test("GLSL round-trip: parse(emit(e)) eval-equals e (the grounding proof)", () => {
  const exprs = [
    ex.sub(ex.mul(ex.v("u"), 2.0), ex.div(ex.v("v"), 3.0)),
    ex.mul(ex.sin(ex.add(ex.mul(4, ex.v("u")), ex.sin(ex.mul(4, ex.v("v"))))), ex.cos(ex.v("t"))),
    ex.add(ex.mul(ex.c(-2.5), ex.v("u")), ex.c(-1.0)),
    ex.exp(ex.neg(ex.absx(ex.v("u")))),
  ];
  for (const e of exprs) {
    const back = ex.parseGLSL(ex.emitGLSL(e));
    for (const [u, v, t] of [[-0.7, 0.3, 0], [0.2, -0.5, 1.1], [0.9, 0.9, 0.4]]) {
      assert.ok(Math.abs(ex.evalExpr(e, { u, v, t }) - ex.evalExpr(back, { u, v, t })) < 1e-6,
        `round-trip mismatch for ${ex.emitGLSL(e)}`);
    }
  }
});

test("sha: stable + distinct", () => {
  assert.equal(ex.sha(ex.mul(ex.v("u"), ex.c(2))), ex.sha(ex.mul(ex.v("u"), ex.c(2))));
  assert.notEqual(ex.sha(ex.mul(ex.v("u"), ex.c(2))), ex.sha(ex.mul(ex.v("u"), ex.c(3))));
});

test("sampleField: shape + monotonic in u", () => {
  const grid = ex.sampleField(ex.v("u"), 4, 0);
  assert.equal(grid.length, 16);
  assert.ok(grid[0] < grid[3]);
});
