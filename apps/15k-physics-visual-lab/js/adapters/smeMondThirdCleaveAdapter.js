export const ADAPTER_VERSION = 'SME-MOND-THIRD-CLEAVE-v0.9.1-adapter-0.1';

const C = 299792458;
const MPC_M = 3.085677581491367e22;
const PI = Math.PI;
const P2_TOL = 1e-6;
const SPARC_SYSTEMATIC_LOW = 0.96e-10;
const SPARC_SYSTEMATIC_HIGH = 1.44e-10;

export function safeAcosh(x) {
  const clamped = Math.max(Number(x) || 1, 1);
  return Math.acosh(clamped);
}

export function pressureRatioForPowerLaw(p, u) {
  const pp = Number(p);
  const uu = Number(u);
  const denom = 2 * pp - 6 - 2 * uu;
  if (Math.abs(denom) < 1e-12) return Number.NaN;
  return (4 * uu - pp) / denom;
}

export function radialEOSFromPressureRatio(w) {
  return (1 + 2 * w) / 3;
}

export function amplitudeTargetProduct(wr) {
  const denom = 3 * PI * (1 + wr);
  return Math.abs(denom) > 1e-15 ? 1 / denom : Number.NaN;
}

export function computeThirdCleave(state, observer = {}) {
  const H0 = Number(state['sme.H0']);
  const p = Number(state['sme.p']);
  const u = Number(state['sme.u']);
  const qH = Number(state['sme.qH']);
  const zeta = Number(state['sme.zeta']);
  const horizonAnchored = Boolean(state['sme.horizonAnchored']);
  const L = Math.max(Number(state['sme.L']) || 1, 1e-12);
  const rOverL = Math.max(Number(observer.rOverL) || Math.cosh(2), 1);

  const w = pressureRatioForPowerLaw(p, u);
  const wr = radialEOSFromPressureRatio(w);
  const alpha = 2 / p;
  const p2 = Number.isFinite(p) && Math.abs(p - 2) <= P2_TOL;
  const throatCapIdentity = p2 && horizonAnchored;
  const throatCapL = throatCapIdentity ? 9 : null;
  const observerDepthOverL = safeAcosh(rOverL);

  const H = (H0 * 1000) / MPC_M;
  const cH = C * H;
  const aWOvercH = 1.5 * qH * (1 + wr);
  const a0OvercH = aWOvercH * zeta;
  const targetA0OvercH = 1 / (2 * PI);
  const a0SI = a0OvercH * cH;
  const targetA0SI = targetA0OvercH * cH;
  const amplitudeProduct = qH * zeta;
  const targetAmplitudeProduct = amplitudeTargetProduct(wr);
  const amplitudeResidual = a0OvercH - targetA0OvercH;
  const amplitudeResidualFraction = targetA0OvercH !== 0 ? amplitudeResidual / targetA0OvercH : Number.NaN;

  const finite = [w, wr, alpha, a0SI, targetA0SI, amplitudeProduct, targetAmplitudeProduct].every(Number.isFinite);
  const relativeProductError = finite && targetAmplitudeProduct !== 0
    ? Math.abs(amplitudeProduct - targetAmplitudeProduct) / Math.abs(targetAmplitudeProduct)
    : Number.POSITIVE_INFINITY;

  let resultClass = 'BREAK_REGION';
  let resultReason = 'Non-finite or incompatible parameter state.';
  if (finite) {
    if (relativeProductError <= 0.01) {
      resultClass = 'DEGENERATE_REGION';
      resultReason = 'The amplitude target constrains a product q_H·ζ; multiple component choices remain degenerate.';
    } else if (a0SI >= SPARC_SYSTEMATIC_LOW && a0SI <= SPARC_SYSTEMATIC_HIGH) {
      resultClass = 'SURVIVOR_REGION';
      resultReason = 'Calculated acceleration lies inside the cited SPARC systematic envelope; survival is not proof.';
    } else {
      resultClass = 'BREAK_REGION';
      resultReason = 'Calculated acceleration lies outside the cited SPARC systematic envelope for this experimental state.';
    }
  }

  const status = {
    document: 'AUDITOR_CANDIDATE',
    absoluteDepth: 'CLOSED_AS_ERRATUM',
    pProfile: p2 ? 'CONDITIONAL' : 'PARAMETRIZED',
    pressureClosure: 'CONDITIONAL',
    throat: throatCapIdentity ? 'CONDITIONAL' : 'PARAMETRIZED',
    amplitude: 'OPEN_REDUCED',
    a0Target: 'CONDITIONAL_HYPOTHESIS',
    visualizer: 'EXPERIMENTAL_SURFACE'
  };

  return {
    H0, H, cH, L, p, u, qH, zeta, w, wr, alpha,
    observerDepthOverL, throatCapIdentity, throatCapL,
    aWOvercH, a0OvercH, targetA0OvercH, a0SI, targetA0SI,
    amplitudeProduct, targetAmplitudeProduct, amplitudeResidual, amplitudeResidualFraction,
    relativeProductError, empiricalBandSI: [SPARC_SYSTEMATIC_LOW, SPARC_SYSTEMATIC_HIGH],
    resultClass, resultReason, status,
    controlValues: {
      'sme.w': w,
      'sme.wr': wr,
      'sme.alpha': alpha,
      'sme.amplitudeProduct': amplitudeProduct,
      'sme.targetAmplitudeProduct': targetAmplitudeProduct,
      'sme.a0': a0SI,
      'sme.targetA0': targetA0SI,
      'sme.amplitudeResidual': amplitudeResidualFraction,
      'sme.throatCapL': throatCapL
    }
  };
}
