const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function buildVisualState(physics, controls) {
  const traversal = clamp(Number(controls['vis.traversal']) || 0, 0, 1);
  const labGain = Number(controls['lab.gain']) || 0;
  const squelch = clamp(Number(controls['lab.squelch']) || 0, 0, 1);
  const turbulenceGain = Math.max(0, Number(controls['vis.turbulenceGain']) || 0);
  const lensGain = Math.max(0, Number(controls['vis.lensGain']) || 0);
  const starBrightness = Math.max(0, Number(controls['vis.starBrightness']) || 0);
  const fallbackDepth = Math.max(1, Number(controls['vis.visualTransitionDepth']) || 9);
  const target = Math.max(Math.abs(physics.targetA0OvercH), 1e-12);
  const normalizedAmplitude = clamp(Math.abs(physics.a0OvercH) / target, 0, 4);
  const trueScale = controls['vis.planetScaleMode'] === 'TRUE_SCALE';
  const planetBoost = trueScale ? 1 : Math.max(1, Number(controls['vis.planetRadiusBoost']) || 1);

  return {
    traversal,
    pOverU: Number.isFinite(physics.w) ? physics.w : 0,
    qH: physics.qH,
    zeta: physics.zeta,
    throatDepthL: physics.throatCapIdentity ? 9 : fallbackDepth,
    throatConditional: physics.throatCapIdentity ? 1 : 0,
    turbulence: turbulenceGain * labGain * (1 - squelch),
    lensStrength: normalizedAmplitude * lensGain,
    starBrightness,
    planetBoost,
    steps: Math.round(clamp(Number(controls['render.steps']) || 96, 48, 192)),
    mappingStatus: {
      turbulence: 'VISUALIZATION_ONLY',
      lensStrength: 'VISUALIZATION_APPROXIMATION',
      planetBoost: trueScale ? 'TRUE_SCALE' : 'VISUALIZATION_ONLY'
    }
  };
}
