# 15K-Knob Physics Visual Lab — SME-MOND Traversal Design

## Goal
Build an additive, static-hostable scientific WebGL application that couples a typed 15K-style dependency graph to a real-time SME-MOND Third Cleave visualization while preserving conditional/open physics status, immutable experiment receipts, and PRIMA ancestry.

## Source authority
1. 15K-Knob Physics Laboratory handoff/inventory supplied in chat.
2. SME-MOND v12.3/v1 Fork B Third Cleave Auditor Candidate v0.9.1 from Drive.
3. GARGANTUA Scientific WebGL/GLSL Source Dossier / Chef's Kiss transit pattern from Drive.
4. PMAE/control-decomposition and Physicist Playground/TTF material from Drive as additive donors only.

## Authority boundaries
- Visual output is not theory authority.
- `p=2` and `P/U≈1` are conditional branch assumptions, not sealed derivations.
- `9L` is enabled only when the p=2 + horizon-tied conditions are active.
- `a0=cH/(2π)` is a conditional target; the UI exposes the unresolved `q_H ζ` amplitude wall.
- Derived controls remain derived. Experimental override of a protected derived control is an explicit branch/authority event.
- Survival never becomes proof.

## Architecture
`ControlGraph -> Constraint/Dependency propagation -> SME-MOND theory adapter -> Observable state -> Visual adapter -> GLSL uniforms`.

The shader never owns theory state. The adapter computes physical/conditional quantities; a separate visual adapter maps those quantities to turbulence, lensing, throat geometry, and color with provenance labels.

## Runtime
- Vanilla HTML/CSS/ES modules.
- Three.js r185 pinned as a git submodule at `vendor/three/`; local import map points to `build/three.module.js` and `examples/jsm/`.
- Fullscreen shader plane; camera-relative ray construction; logarithmic depth buffer retained as a renderer safeguard, not treated as a substitute for local coordinate domains.
- Custom quaternion 6DOF controller for keyboard/pointer/touch, plus WebXR session support.
- One reversible traversal coordinate blends throat -> boundary -> deep space -> procedural Solar System.

## Prototype control bank
The first executable registry is intentionally small (roughly 20–40 controls) but data-driven. Controls are typed as independent, derived, categorical, constrained, theory-local, or visualization-only. The registry is designed to scale without changing the graph engine.

## Receipts
Committed mutations generate SHA-256 hash-chained receipts containing before/after state, mutation, dependency snapshot, runtime code hash, observables, kill results, scientific result class, PRIMA local/root drift, route, and promotion status. Slider `input` events update visuals live; `change` commits one scientific mutation receipt.

## PRIMA
Every branch stores root/parent identity. Parameter mutations compare child↔parent and child↔root. Protected-control mutation routes to `AUTHORITY_VIOLATION`; ordinary experiments route to candidate/experimental/high-drift states. No route auto-promotes.

## UI
Spacecraft-terminal layout with:
- telemetry HUD,
- hierarchical THEORY → SECTOR → CONTROL tree,
- dependency inspector,
- amplitude-wall panel,
- scientific status ledger,
- exploration/receipt log,
- PRIMA route/drift display,
- mobile flight controls.

## Verification
Node tests cover adapter equations, derived-control enforcement, 9L disengagement, result classification, PRIMA routing, and receipt hash chaining. Static verifier checks package paths/import-map contracts and shader definitions. Browser/GPU/XR verification is a separate gate and must remain `UNKNOWN/ENVIRONMENT-BLOCKED` if no browser/GPU harness is available.