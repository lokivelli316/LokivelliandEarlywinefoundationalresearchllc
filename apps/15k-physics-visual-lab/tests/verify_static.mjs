import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)); const root = resolve(here, '..');
const required=['index.html','css/style.css','js/main.js','js/shaders.js','js/flightController.js','js/lab/controlGraph.js','js/adapters/smeMondThirdCleaveAdapter.js','js/adapters/visualAdapter.js','js/provenance/receipts.js','js/provenance/prima.js','js/ui/controlBoard.js','js/ui/telemetry.js','data/controlRegistry.js','README.md','LINEAGE.md','START_HERE.md'];
for(const rel of required) await access(resolve(root,rel));
const html=await readFile(resolve(root,'index.html'),'utf8');const main=await readFile(resolve(root,'js/main.js'),'utf8');const shader=await readFile(resolve(root,'js/shaders.js'),'utf8');const readme=await readFile(resolve(root,'README.md'),'utf8');
assert.match(html,/\.\.\/\.\.\/vendor\/three\/build\/three\.module\.js/);assert.match(html,/\.\.\/\.\.\/vendor\/three\/examples\/jsm\//);assert.doesNotMatch(html.match(/<script type="importmap">([\s\S]*?)<\/script>/)?.[1]||'',/https?:\/\//);assert.match(main,/logarithmicDepthBuffer:\s*true/);assert.match(main,/renderer\.xr\.enabled\s*=\s*true/);assert.match(main,/setAnimationLoop/);assert.match(main,/computeThirdCleave/);assert.match(main,/buildVisualState/);assert.match(main,/ReceiptLedger/);assert.match(main,/classifyPrima/);assert.match(main,/const canonicalGraph = new ControlGraph\(CONTROL_DEFS\)/);assert.match(shader,/safeAcosh/);assert.match(shader,/THROAT_DOMAIN/);assert.match(shader,/STAR_DOMAIN/);assert.match(shader,/SOLAR_DOMAIN/);assert.match(readme,/--recurse-submodules/);
let vendorStatus='UNKNOWN / submodule not materialized in this local verification workspace';try{await access(resolve(root,'../../vendor/three/build/three.module.js'));vendorStatus='PRESENT';}catch{}
console.log('STATIC CONTRACT PASS');console.log(`LOCAL THREE RUNTIME: ${vendorStatus}`);console.log('GPU / WEBXR RUNTIME: UNKNOWN until real browser/device execution');
