// The chamber -- drives the reconcile engine live in the browser (the engine IS this page's module).
import { create, compose, getOrgan, makeArtifact, organIds } from "../src/index.js";

const $ = (s) => document.querySelector(s);
let RAF = 0, world = null;

// ---- WebGL: compile a layer's shipped GLSL fragment verbatim ----
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";
const hexRGB = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
function compileField(canvas, rp) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("no WebGL");
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, rp.source));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const pal = rp.uniforms.u_palette.flatMap(hexRGB), vr = rp.value_range || [-1, 1];
  const period = rp.domain.period || 1, anim = rp.domain.animatable;
  const U = (n) => gl.getUniformLocation(prog, n);
  const frame = (ts) => {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U("u_resolution"), canvas.width, canvas.height);
    gl.uniform2f(U("u_value_range"), vr[0], vr[1]);
    gl.uniform3fv(U("u_palette[0]"), new Float32Array(pal));
    gl.uniform1f(U("u_time"), anim ? (ts / 1000) % period : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    RAF = requestAnimationFrame(frame);
  };
  RAF = requestAnimationFrame(frame);
}
function drawPoints(canvas, layer) {
  const g = canvas.getContext("2d"), W = canvas.width = canvas.clientWidth, H = canvas.height = canvas.clientHeight;
  g.clearRect(0, 0, W, H);
  const pts = makeArtifact(getOrgan(layer.organ), layer.params).points, pal = layer.render_program.uniforms.u_palette;
  let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity;
  for (const p of pts) { mnx = Math.min(mnx, p[0]); mxx = Math.max(mxx, p[0]); mny = Math.min(mny, p[1]); mxy = Math.max(mxy, p[1]); }
  const sp = Math.max(mxx - mnx, mxy - mny, 1e-6), pad = W * 0.07, sc = (W - 2 * pad) / sp;
  const ox = (W - (mxx - mnx) * sc) / 2 - mnx * sc, oy = (H - (mxy - mny) * sc) / 2 - mny * sc;
  for (let i = 0; i < pts.length; i++) { g.fillStyle = pal[Math.floor(i / pts.length * pal.length) % pal.length]; g.beginPath(); g.arc(ox + pts[i][0] * sc, oy + pts[i][1] * sc, 1.3, 0, 7); g.fill(); }
}

const blend = (b) => (b === "add" ? "lighten" : ["screen", "multiply", "normal"].includes(b) ? b : "normal");
function render(w) {
  if (RAF) cancelAnimationFrame(RAF), RAF = 0;
  world = w; const stage = $("#stage"); stage.querySelectorAll("canvas").forEach((c) => c.remove());
  const pal = w.palette;
  document.documentElement.style.setProperty("--a", pal[3]); document.documentElement.style.setProperty("--b", pal[2]);
  for (const layer of [...w.layers].sort((a, b) => a.z - b.z)) {
    const c = document.createElement("canvas"); c.style.mixBlendMode = blend(layer.blend); stage.appendChild(c);
    if (layer.render_program.target === "glsl-fragment") { try { compileField(c, layer.render_program); } catch (e) { log("shader: " + e.message, true); } }
    else requestAnimationFrame(() => drawPoints(c, layer));
  }
  // panels
  $("#title").textContent = w.title;
  $("#sw").innerHTML = pal.map((c) => `<i style="background:${c}"></i>`).join("");
  const t = w.trajectory;
  if (t) {
    const acc = t.steps[t.steps.length - 1];
    $("#axes").innerHTML = Object.entries(acc.margins).map(([k, v]) =>
      `<div class="ax${k === acc.weakest ? " w" : ""}"><span>${k}${k === acc.weakest ? " ◀" : ""}</span><span class="bar"><i style="width:${Math.round(v * 100)}%"></i></span><b>${(+v).toFixed(3)}</b></div>`).join("");
    $("#reason").innerHTML = `<b class="tag ${t.tag}">${t.tag}</b> cohesion <b>${t.cohesion}</b> · ${t.steps.length} refine steps · ${t.converged ? "converged" : "best-effort"}`;
  } else { $("#axes").innerHTML = ""; $("#reason").textContent = "--"; }
  $("#tl").innerHTML = w.timeline ? `period ${w.timeline.period}s · continuity <b class="tag ${w.timeline.continuity.tag}">${w.timeline.continuity.tag}</b> · on-criterion <b class="tag ${w.timeline.on_criterion.tag}">${w.timeline.on_criterion.tag}</b>` : "static";
  $("#comp").innerHTML = w.composition ? `composition <b class="tag ${w.composition.tag}">${w.composition.tag}</b> ${w.composition.score}` : "";
  $("#rc").innerHTML = `id ${w.receipt.id} · seed ${w.receipt.seed}<br>organs ${w.receipt.organs.join(", ")}<br>witness ${w.receipt.witness}`;
  log(`world ${w.id} · ${w.layers.length} layer(s)`);
}
function log(m, e) { const el = $("#log"); el.innerHTML += `<span class="${e ? "e" : ""}">${m}</span>\n`; el.scrollTop = el.scrollHeight; }

// ---- wiring ----
const sel = $("#organ"); organIds().forEach((id) => { const o = document.createElement("option"); o.textContent = id; sel.appendChild(o); }); sel.value = "gyroid";
const opts = () => ({ seed: +$("#seed").value, scheme: $("#scheme").value, refine: $("#refine").getAttribute("aria-pressed") === "true" });
$("#create").onclick = () => { try { render(create(sel.value, opts())); } catch (e) { log(e.message, true); } };
$("#composeBtn").onclick = () => { try { render(compose(["gyroid", "phyllotaxis"], opts())); } catch (e) { log(e.message, true); } };
$("#refine").onclick = (e) => { const b = e.currentTarget, on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(on)); b.textContent = "refine: " + (on ? "on" : "off"); };
$("#create").click();
