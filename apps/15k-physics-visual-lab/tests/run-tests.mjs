import assert from 'node:assert/strict';
import { CONTROL_DEFS } from '../data/controlRegistry.js';
import { ControlGraph } from '../js/lab/controlGraph.js';
import { computeThirdCleave, safeAcosh, amplitudeTargetProduct } from '../js/adapters/smeMondThirdCleaveAdapter.js';
import { classifyPrima } from '../js/provenance/prima.js';
import { ReceiptLedger } from '../js/provenance/receipts.js';
import { RAY_FRAG } from '../js/shaders.js';
import { buildVisualState } from '../js/adapters/visualAdapter.js';

const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const approx = (actual, expected, eps = 1e-10) => assert.ok(Math.abs(actual - expected) <= eps, `${actual} != ${expected}`);

test('derived controls cannot masquerade as independent', () => {
  const graph = new ControlGraph(CONTROL_DEFS);
  assert.throws(() => graph.setControl('sme.alpha', 99), /DERIVED_CONTROL/);
});

test('exact absolute depth uses arccosh', () => {
  approx(safeAcosh(1), 0, 1e-12);
  approx(safeAcosh(Math.cosh(9)), 9, 1e-10);
});

test('p=2 pressure closure reproduces w=(1-2u)/(1+u)', () => {
  const state = Object.fromEntries(CONTROL_DEFS.map(d => [d.id, d.defaultValue]));
  state['sme.p'] = 2; state['sme.u'] = 1e-6;
  const r = computeThirdCleave(state, { rOverL: Math.cosh(9) });
  approx(r.w, (1 - 2e-6) / (1 + 1e-6), 1e-12);
  approx(r.observerDepthOverL, 9, 1e-8);
});

test('9L identity disengages when p leaves 2', () => {
  const state = Object.fromEntries(CONTROL_DEFS.map(d => [d.id, d.defaultValue]));
  state['sme.p'] = 2; state['sme.horizonAnchored'] = true;
  assert.equal(computeThirdCleave(state).throatCapIdentity, true);
  state['sme.p'] = 2.2;
  const r = computeThirdCleave(state);
  assert.equal(r.throatCapIdentity, false);
  assert.equal(r.status.throat, 'PARAMETRIZED');
});

test('amplitude wall is a product, not a hard-coded qH or zeta', () => {
  const state = Object.fromEntries(CONTROL_DEFS.map(d => [d.id, d.defaultValue]));
  const r = computeThirdCleave(state);
  approx(r.targetAmplitudeProduct, amplitudeTargetProduct(r.wr), 1e-14);
  approx(r.a0OvercH, 1.5 * r.qH * (1 + r.wr) * r.zeta, 1e-14);
});

test('PRIMA compares parent and root and protects derived overrides', () => {
  const graph = new ControlGraph(CONTROL_DEFS);
  const root = graph.snapshot(); const before = graph.snapshot();
  graph.setControl('sme.qH', 0.7); const after = graph.snapshot();
  const normal = classifyPrima({ before, after, root, mutation: { controlId: 'sme.qH' }, definitions: CONTROL_DEFS });
  assert.ok(normal.localDrift > 0); assert.equal(normal.route, 'CANON_CANDIDATE');
  const violation = classifyPrima({ before, after, root, mutation: { controlId: 'sme.alpha', authorityViolation: true }, definitions: CONTROL_DEFS });
  assert.equal(violation.route, 'AUTHORITY_VIOLATION');
});

test('receipt chain detects tampering', async () => {
  const ledger = new ReceiptLedger({ storage: null });
  await ledger.append({ run_id: 'r1', before_state: { a: 1 }, after_state: { a: 2 } });
  await ledger.append({ run_id: 'r2', before_state: { a: 2 }, after_state: { a: 3 } });
  assert.equal((await ledger.verifyChain()).ok, true);
  ledger.receipts[0].after_state.a = 999;
  assert.equal((await ledger.verifyChain()).ok, false);
});

test('visual adapter uses fallback depth without pretending it is the conditional 9L identity', () => {
  const state = Object.fromEntries(CONTROL_DEFS.map(d => [d.id, d.defaultValue]));
  state['sme.p'] = 2.25; state['vis.visualTransitionDepth'] = 7.5;
  const physics = computeThirdCleave(state); const visual = buildVisualState(physics, state);
  assert.equal(physics.throatCapIdentity, false); assert.equal(visual.throatDepthL, 7.5);
  assert.equal(visual.throatConditional, 0); assert.equal(visual.mappingStatus.turbulence, 'VISUALIZATION_ONLY');
});

test('shader preserves exact-depth and multi-domain contracts', () => {
  assert.match(RAY_FRAG, /safeAcosh/); assert.match(RAY_FRAG, /THROAT_DOMAIN/);
  assert.match(RAY_FRAG, /STAR_DOMAIN/); assert.match(RAY_FRAG, /SOLAR_DOMAIN/);
  assert.match(RAY_FRAG, /uPOverU/); assert.match(RAY_FRAG, /uQH/); assert.match(RAY_FRAG, /uZeta/);
});

let failed = 0;
for (const [name, fn] of tests) {
  try { await fn(); console.log(`PASS ${name}`); }
  catch (err) { failed++; console.error(`FAIL ${name}`); console.error(err?.stack || err); }
}
if (failed) { console.error(`\n${failed}/${tests.length} tests failed`); process.exit(1); }
console.log(`\n${tests.length}/${tests.length} tests passed`);
