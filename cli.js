#!/usr/bin/env node
// reconcile CLI -- drive the engine headless. perceive → generate → critique → refine → witness.
import { writeFileSync, mkdirSync } from "node:fs";
import { create, compose } from "./src/reconcile.js";
import { organIds } from "./src/organ.js";
import { svgOfWorld } from "./src/preview.js";

function usage() {
  console.log(`reconcile -- the unified creative-verification engine

  reconcile create <organ> [--seed N] [--scheme S] [--no-refine] [--out DIR]
  reconcile compose <organ,organ,...> [--seed N] [--scheme S] [--out DIR]
  reconcile organs                          list the organ library

organs: ${organIds().join(", ")}
schemes: analogous | triadic | complementary | wide`);
}

function parseFlags(args) {
  const f = {}, pos = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) { const k = a.slice(2); if (k === "no-refine") f.refine = false; else f[k] = args[++i]; }
    else pos.push(a);
  }
  return { f, pos };
}

function emit(world, outDir) {
  console.log(`\nworld ${world.id} · ${world.title}`);
  const t = world.trajectory;
  if (t) console.log(`  reasoning: ${t.steps.length} steps · cohesion ${t.cohesion} · ${t.tag}${t.converged ? " (converged)" : " (best-effort)"}`);
  if (t && t.steps.length) { const acc = t.steps[t.steps.length - 1]; console.log(`  margins: ${Object.entries(acc.margins).map(([k, v]) => `${k}=${(+v).toFixed(2)}`).join(" ")}`); }
  if (world.composition) console.log(`  composition: ${world.composition.tag} ${world.composition.score} (${Object.entries(world.composition.axes).map(([k, v]) => `${k}=${v}`).join(", ")})`);
  if (world.timeline) console.log(`  timeline: period ${world.timeline.period}s · continuity ${world.timeline.continuity.tag} · on-criterion ${world.timeline.on_criterion.tag}`);
  console.log(`  layers: ${world.layers.map((l) => `${l.organ}·${l.render_program.target.split("-")[0]}`).join(", ")}`);
  console.log(`  palette: ${world.palette.join(" ")}`);
  console.log(`  receipt: witness ${world.receipt.witness}`);
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(`${outDir}/world-${world.id}.json`, JSON.stringify(world, null, 2));
    writeFileSync(`${outDir}/world-${world.id}.svg`, svgOfWorld(world));
    console.log(`  wrote ${outDir}/world-${world.id}.json (+ .svg preview)`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const { f, pos } = parseFlags(rest);
const seed = f.seed != null ? parseInt(f.seed, 10) : 0;
try {
  if (cmd === "create") {
    if (!pos[0]) { usage(); process.exit(1); }
    emit(create(pos[0], { seed, scheme: f.scheme || "analogous", refine: f.refine !== false, maxSteps: f.steps ? +f.steps : 24 }), f.out);
  } else if (cmd === "compose") {
    if (!pos[0]) { usage(); process.exit(1); }
    emit(compose(pos[0].split(","), { seed, scheme: f.scheme || "analogous" }), f.out);
  } else if (cmd === "organs") {
    console.log(organIds().join("\n"));
  } else {
    usage();
  }
} catch (e) {
  console.error("error:", e.message);
  process.exit(1);
}
