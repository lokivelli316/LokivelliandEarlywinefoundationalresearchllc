# 15K-Knob Physics Visual Lab — SME-MOND Traversal

A static, shader-first scientific visualization and experiment console coupling a typed physics control graph to an SME-MOND Third Cleave visualization. It preserves scientific status, mutation receipts, and PRIMA ancestry instead of turning a rendered branch into a theory claim.

## Start

Clone the parent repository **with submodules** so the pinned local Three.js runtime is present:

```bash
git clone --recurse-submodules <repository>
cd LokivelliandEarlywinefoundationalresearchllc
python3 -m http.server 8000
```

Then open `/apps/15k-physics-visual-lab/` on that local server.

Do not open `index.html` directly with `file://`; ES modules and WebXR require an HTTP(S) origin.

## Controls

Desktop flight:
- `W/S` forward/back
- `A/D` strafe
- `R/F` up/down
- `Q/E` roll
- mouse drag = local yaw/pitch
- mouse wheel = change flight speed
- Shift = boost

Mobile gets a touch flight pad. WebXR is exposed through the Three.js VR button when supported.

## Scientific status boundary

This app deliberately keeps the source status visible:
- Third Cleave document: auditor candidate
- exact cosh absolute-depth map: erratum closed; uses `arccosh`
- p=2 Weyl profile: conditional
- P/U≈1: conditional p=2 closure behavior
- exact 9L throat identity: conditional on p=2 + horizon anchoring + transition definition
- amplitude closure: open/reduced to a product
- `a0=cH/(2π)`: conditional hypothesis/target
- visualizer: experimental surface

The shader maps computed state to visible structure. That mapping is not allowed to redefine the theory.

## Receipts

Raw range input updates are live. A committed input `change` writes one append-only SHA-256 hash-chained receipt containing before/after state, dependency snapshot, code hash, observables, kill classification, and PRIMA route. Receipts are retained in browser local storage.

## Tests

```bash
cd apps/15k-physics-visual-lab
node tests/run-tests.mjs
node tests/verify_static.mjs
```

Static tests are not GPU evidence. Browser/GPU/WebXR verification must be recorded separately.
