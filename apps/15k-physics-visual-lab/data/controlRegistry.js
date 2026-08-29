const PI = Math.PI;

export const CONTROL_DEFS = [
  {
    id: 'sme.H0', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Cosmology',
    label: 'Hubble Parameter', symbol: 'H₀', type: 'independent', defaultValue: 70,
    min: 50, max: 90, step: 0.1, units: 'km s⁻¹ Mpc⁻¹', mutable: true,
    authorityStatus: 'PARAMETRIZED', sourceStatus: 'SOURCE_BACKED', protected: false,
    description: 'Fork B target convention is shown at H0=70; the expression scales linearly with the selected H0.'
  },
  {
    id: 'sme.L', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Geometry',
    label: 'Throat Scale', symbol: 'L', type: 'independent', defaultValue: 1,
    min: 0.1, max: 10, step: 0.01, units: 'normalized', mutable: true,
    authorityStatus: 'PARAMETRIZED', sourceStatus: 'SOURCE_BACKED', protected: false
  },
  {
    id: 'sme.p', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Weyl Closure',
    label: 'Weyl Power-Law Exponent', symbol: 'p', type: 'independent', defaultValue: 2,
    min: 0.5, max: 4, step: 0.01, units: '', mutable: true,
    authorityStatus: 'CONDITIONAL', sourceStatus: 'SOURCE_BACKED', protected: false,
    description: 'p=2 is a conditional branch, not derived from Bianchi plus isotropy.'
  },
  {
    id: 'sme.u', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Weyl Closure',
    label: 'Asymptotic Speed Ratio', symbol: 'u=v∞²/c²', type: 'independent', defaultValue: 1e-6,
    min: 0, max: 0.01, step: 0.000001, units: '', mutable: true,
    authorityStatus: 'PARAMETRIZED', sourceStatus: 'SOURCE_BACKED', protected: false
  },
  {
    id: 'sme.qH', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Horizon Normalization', symbol: 'q_H', type: 'independent', defaultValue: 1,
    min: 0.01, max: 2, step: 0.001, units: '', mutable: true,
    authorityStatus: 'OPEN_REDUCED', sourceStatus: 'SOURCE_BACKED', protected: false
  },
  {
    id: 'sme.zeta', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Mode Projection', symbol: 'ζ', type: 'independent', defaultValue: 1 / (2 * PI),
    min: 0.001, max: 0.25, step: 0.0001, units: '', mutable: true,
    authorityStatus: 'OPEN', sourceStatus: 'SOURCE_BACKED', protected: false,
    description: 'The historical 1/(2π) projection remains open and is not promoted as an SME-specific derivation.'
  },
  {
    id: 'sme.horizonAnchored', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Transition',
    label: 'Horizon-Tied Transition', symbol: 'R_AH anchor', type: 'categorical', defaultValue: true,
    options: [true, false], mutable: true,
    authorityStatus: 'OPEN_PARAMETRIZED', sourceStatus: 'SOURCE_BACKED', protected: false
  },
  {
    id: 'sme.w', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Weyl Closure',
    label: 'Dark Pressure Ratio', symbol: 'P/U=w', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'DERIVED', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.p', 'sme.u']
  },
  {
    id: 'sme.wr', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Weyl Closure',
    label: 'Effective Radial EOS', symbol: 'w_r', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'DERIVED', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.w']
  },
  {
    id: 'sme.alpha', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Transition',
    label: 'Transition Exponent', symbol: 'α=2/p', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'CONDITIONAL_CANDIDATE', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.p']
  },
  {
    id: 'sme.amplitudeProduct', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Current Amplitude Product', symbol: 'q_H ζ', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'DERIVED', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.qH', 'sme.zeta']
  },
  {
    id: 'sme.targetAmplitudeProduct', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Target Amplitude Product', symbol: '[q_H ζ]target', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'OPEN_REDUCED', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.wr']
  },
  {
    id: 'sme.a0', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Calculated Acceleration', symbol: 'a₀(calc)', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'DERIVED', sourceStatus: 'SOURCE_BACKED', protected: true,
    units: 'm s⁻²', dependencies: ['sme.H0', 'sme.qH', 'sme.zeta', 'sme.wr']
  },
  {
    id: 'sme.targetA0', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Fork B Target', symbol: 'cH/(2π)', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'CONDITIONAL_HYPOTHESIS', sourceStatus: 'SOURCE_BACKED', protected: true,
    units: 'm s⁻²', dependencies: ['sme.H0']
  },
  {
    id: 'sme.amplitudeResidual', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Amplitude Wall',
    label: 'Amplitude Residual', symbol: 'Δa₀/a₀', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'DIAGNOSTIC', sourceStatus: 'DERIVED', protected: true,
    dependencies: ['sme.a0', 'sme.targetA0']
  },
  {
    id: 'sme.throatCapL', theoryId: 'SME_MOND_THIRD_CLEAVE', sector: 'Transition',
    label: 'Throat-Cap Separation', symbol: 'Δn/L', type: 'derived', defaultValue: null,
    mutable: false, authorityStatus: 'CONDITIONAL', sourceStatus: 'SOURCE_BACKED', protected: true,
    dependencies: ['sme.p', 'sme.horizonAnchored']
  },
  {
    id: 'lab.amplitudeLinked', theoryId: 'LAB', sector: 'Experiment',
    label: 'Link q_H·ζ to Target', symbol: 'LINK', type: 'categorical', defaultValue: false,
    options: [true, false], mutable: true, authorityStatus: 'EXPERIMENTAL', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'lab.gain', theoryId: 'LAB', sector: 'Experiment',
    label: 'Sector Gain', symbol: 'GAIN', type: 'independent', defaultValue: 1,
    min: 0, max: 3, step: 0.01, mutable: true, authorityStatus: 'EXPERIMENTAL', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'lab.squelch', theoryId: 'LAB', sector: 'Experiment',
    label: 'Sector Squelch', symbol: 'SQUELCH', type: 'independent', defaultValue: 0,
    min: 0, max: 1, step: 0.01, mutable: true, authorityStatus: 'EXPERIMENTAL', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.traversal', theoryId: 'VISUALIZER', sector: 'Traversal',
    label: 'Traversal Coordinate', symbol: 'τ', type: 'visualization', defaultValue: 0.18,
    min: 0, max: 1, step: 0.001, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.turbulenceGain', theoryId: 'VISUALIZER', sector: 'Throat',
    label: 'Turbulence Gain', symbol: 'FBM gain', type: 'visualization', defaultValue: 1,
    min: 0, max: 3, step: 0.01, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.lensGain', theoryId: 'VISUALIZER', sector: 'Deep Space',
    label: 'Lensing Display Gain', symbol: 'lens gain', type: 'visualization', defaultValue: 1,
    min: 0, max: 3, step: 0.01, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.starBrightness', theoryId: 'VISUALIZER', sector: 'Deep Space',
    label: 'Star Brightness', symbol: 'star gain', type: 'visualization', defaultValue: 1,
    min: 0, max: 3, step: 0.01, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.visualTransitionDepth', theoryId: 'VISUALIZER', sector: 'Traversal',
    label: 'Fallback Transition Depth', symbol: 'Δn_vis/L', type: 'visualization', defaultValue: 9,
    min: 1, max: 20, step: 0.1, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false,
    description: 'Used only when the conditional physical 9L identity is disengaged.'
  },
  {
    id: 'vis.planetScaleMode', theoryId: 'VISUALIZER', sector: 'Solar System',
    label: 'Planet Scale Mode', symbol: 'SDF scale', type: 'categorical', defaultValue: 'VISIBILITY_SCALE',
    options: ['TRUE_SCALE', 'VISIBILITY_SCALE'], mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'vis.planetRadiusBoost', theoryId: 'VISUALIZER', sector: 'Solar System',
    label: 'Visibility Radius Boost', symbol: 'R boost', type: 'visualization', defaultValue: 280,
    min: 1, max: 1200, step: 1, mutable: true, authorityStatus: 'VISUALIZATION_ONLY', sourceStatus: 'ENGINEERING', protected: false
  },
  {
    id: 'render.steps', theoryId: 'RENDERER', sector: 'Quality',
    label: 'Raymarch Steps', symbol: 'steps', type: 'visualization', defaultValue: 112,
    min: 48, max: 192, step: 1, mutable: true, authorityStatus: 'RENDER_ONLY', sourceStatus: 'ENGINEERING', protected: false
  }
];

export const CONTROL_DEF_MAP = new Map(CONTROL_DEFS.map((d) => [d.id, d]));
