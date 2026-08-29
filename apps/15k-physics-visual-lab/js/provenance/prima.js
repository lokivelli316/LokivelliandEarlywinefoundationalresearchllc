function controlDistance(def, a, b) {
  if (Object.is(a, b)) return 0;
  if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
    if (Number.isFinite(def.min) && Number.isFinite(def.max) && def.max > def.min) {
      return Math.min(1, Math.abs(a - b) / (def.max - def.min));
    }
    const scale = Math.max(Math.abs(a), Math.abs(b), 1);
    return Math.min(1, Math.abs(a - b) / scale);
  }
  return 1;
}

function driftBetween(a, b, definitions) {
  let total = 0;
  let count = 0;
  let max = 0;
  const changed = [];
  for (const def of definitions) {
    if (def.type === 'derived') continue;
    const d = controlDistance(def, a[def.id], b[def.id]);
    total += d;
    count += 1;
    if (d > 0) changed.push({ id: def.id, distance: d });
    max = Math.max(max, d);
  }
  return { mean: count ? total / count : 0, max, changed };
}

export function classifyPrima({ before, after, root, mutation = {}, definitions }) {
  const local = driftBetween(before, after, definitions);
  const rootDrift = driftBetween(root, after, definitions);
  const mutatedDef = definitions.find((d) => d.id === mutation.controlId);
  let route = 'CANON_CANDIDATE';
  let reason = 'Low-drift mutation inside current control authority.';
  if (mutation.authorityViolation || (mutatedDef?.protected && mutatedDef.type === 'derived')) {
    route = 'AUTHORITY_VIOLATION';
    reason = 'Mutation crossed a protected derived/canonical authority boundary.';
  } else if (rootDrift.mean >= 0.55 || rootDrift.max >= 0.85) {
    route = mutation.resultClass && mutation.resultClass !== 'BREAK_REGION' ? 'WEIRD_GOLD' : 'HIGH_DRIFT_BRANCH';
    reason = 'Cumulative divergence from the canonical root is high.';
  } else if (['sme.p', 'sme.horizonAnchored', 'lab.amplitudeLinked'].includes(mutation.controlId)) {
    route = 'EXPERIMENTAL_BRANCH';
    reason = 'Mutation changes a conditional branch/closure or an experimental linkage.';
  }
  return {
    localDrift: local.mean, rootDrift: rootDrift.mean,
    localMaxDrift: local.max, rootMaxDrift: rootDrift.max,
    localChanged: local.changed, rootChanged: rootDrift.changed,
    noveltyScore: Math.min(1, rootDrift.mean * 1.35 + rootDrift.max * 0.35),
    route, reason, promotionStatus: 'NOT_PROMOTED'
  };
}
