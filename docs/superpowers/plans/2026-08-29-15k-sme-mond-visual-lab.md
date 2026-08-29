# 15K SME-MOND Visual Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a runnable static SPA that connects a typed physics control graph to a real-time SME-MOND Third Cleave visualization with receipts and PRIMA lineage.

**Architecture:** A pure-JS control/dependency engine owns theory state. The SME-MOND adapter computes conditional/derived quantities, then a separate visual adapter produces shader uniforms. The renderer consumes those uniforms but cannot redefine the theory. Mutation receipts are SHA-256 hash chained and PRIMA compares each run to both parent and root.

**Tech Stack:** Vanilla HTML/CSS/ES modules, Three.js r185 via local git submodule, GLSL, WebXR, Node built-in test runner style (no npm dependency required).

**Spec:** `docs/superpowers/specs/2026-08-29-15k-sme-mond-visual-lab-design.md`

## Global Constraints
- Do not build 15,000 literal sliders.
- Derived controls cannot masquerade as independent controls.
- `p=2`, `P/U≈1`, `9L`, and `a0=cH/(2π)` retain their source status.
- Visual mappings are labeled visualization mappings, not equations.
- No remote runtime dependency for Three.js; pin r185 locally through `vendor/three/`.
- Existing site files remain untouched during this feature branch build.
- Browser/GPU verification cannot be claimed from static tests.

---

### Task 1: Pure physics/control core
**Files:**
- Create `apps/15k-physics-visual-lab/js/lab/controlGraph.js`
- Create `apps/15k-physics-visual-lab/js/adapters/smeMondThirdCleaveAdapter.js`
- Create `apps/15k-physics-visual-lab/data/controlRegistry.js`
- Test `apps/15k-physics-visual-lab/tests/run-tests.mjs`

**Interfaces:**
- `ControlGraph(definitions, initialState)`
- `setControl(id, value, {allowDerivedOverride})`
- `snapshot()` / `get(id)`
- `computeThirdCleave(state)` returns derived physics + status ledger.

- [ ] Write tests proving derived-control enforcement, exact `acosh` depth, p=2 pressure relation, amplitude expression, and conditional 9L disengagement.
- [ ] Run `node apps/15k-physics-visual-lab/tests/run-tests.mjs` and confirm the core tests fail before implementation.
- [ ] Implement the registry, graph validation, dependency propagation, and Third Cleave adapter.
- [ ] Rerun tests and require PASS.

### Task 2: Receipts and PRIMA
**Files:**
- Create `apps/15k-physics-visual-lab/js/provenance/receipts.js`
- Create `apps/15k-physics-visual-lab/js/provenance/prima.js`
- Extend `tests/run-tests.mjs`

**Interfaces:**
- `ReceiptLedger.append(payload)` -> hash-chained receipt
- `ReceiptLedger.verifyChain()` -> `{ok, index?}`
- `classifyPrima({before, after, root, mutation, definitions})` -> route/drift object

- [ ] Add failing tests for hash-chain tamper detection and child↔parent/root drift.
- [ ] Implement deterministic canonical JSON hashing and append-only browser/local-memory ledger behavior.
- [ ] Implement PRIMA route logic including `AUTHORITY_VIOLATION` for protected derived-control override.
- [ ] Rerun tests and require PASS.

### Task 3: Shader and visual adapter
**Files:**
- Create `apps/15k-physics-visual-lab/js/shaders.js`
- Create `apps/15k-physics-visual-lab/js/adapters/visualAdapter.js`
- Extend `tests/run-tests.mjs`

**Interfaces:**
- `buildVisualState(physics, controls)` -> normalized uniform state
- `RAY_VERT`, `RAY_FRAG`

- [ ] Add static tests for exact `acosh`/safe domain code, throat/star/solar domains, and required uniforms.
- [ ] Implement camera-relative procedural throat FBM, conditional boundary, starfield, and analytic SDF planetary spheres.
- [ ] Keep lensing/turbulence mappings explicitly visualization-layer values.
- [ ] Rerun tests and require PASS.

### Task 4: Renderer, 6DOF, XR, and UI
**Files:**
- Create `apps/15k-physics-visual-lab/index.html`
- Create `apps/15k-physics-visual-lab/css/style.css`
- Create `apps/15k-physics-visual-lab/js/main.js`
- Create `apps/15k-physics-visual-lab/js/flightController.js`
- Create `apps/15k-physics-visual-lab/js/ui/controlBoard.js`
- Create `apps/15k-physics-visual-lab/js/ui/telemetry.js`

**Interfaces:**
- `FlightController(camera, domElement)` with quaternion yaw/pitch/roll and translation.
- `mountControlBoard(...)` commits one receipt on each control `change` while `input` updates the live shader.
- `mountTelemetry(...)` renders scientific and renderer status.

- [ ] Implement static terminal layout and local import map.
- [ ] Instantiate `WebGLRenderer({antialias:false,powerPreference:'high-performance',logarithmicDepthBuffer:true})` and enable XR.
- [ ] Wire the fullscreen ShaderMaterial, local Three imports, camera-relative per-frame uniforms, and deterministic quality limits.
- [ ] Wire desktop/touch 6DOF and XR controller gamepad translation.
- [ ] Wire hierarchical controls, dependency/status inspector, amplitude wall, telemetry, and receipt log.
- [ ] Run static package tests and require PASS.

### Task 5: Local Three pin and release truth
**Files:**
- Create root `.gitmodules`
- Add gitlink `vendor/three` pinned to official Three.js r185 commit `2431a09f46f34c560bc8e44b33be0e567723d5b9`
- Create `apps/15k-physics-visual-lab/README.md`
- Create `apps/15k-physics-visual-lab/LINEAGE.md`
- Create `apps/15k-physics-visual-lab/START_HERE.md`
- Create `apps/15k-physics-visual-lab/tests/verify_static.mjs`

- [ ] Verify every documented runtime path exists in the tree/submodule contract.
- [ ] Verify import-map paths resolve after `git clone --recurse-submodules`.
- [ ] Run `node tests/run-tests.mjs` and `node tests/verify_static.mjs`.
- [ ] Record GPU/WebXR verification as `UNKNOWN/ENVIRONMENT-BLOCKED` unless an actual browser/GPU harness is available.
- [ ] Commit the verified tree on the feature branch; do not merge to main automatically.