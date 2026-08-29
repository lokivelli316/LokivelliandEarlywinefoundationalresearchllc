const fmt = (value, digits = 4) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (typeof value === 'number') { const a = Math.abs(value); return (a !== 0 && (a < 1e-3 || a >= 1e5)) ? value.toExponential(3) : value.toFixed(digits); }
  return String(value);
};
export function mountTelemetry(root) {
  const fields = new Map(); root.querySelectorAll('[data-telemetry]').forEach((el) => fields.set(el.dataset.telemetry, el));
  return { update({ physics, visual, fps, altitude, runId, primaRoute, domain, cameraSpeed }) {
    const values = { depth: fmt(physics.observerDepthOverL, 3), radial: fmt(Math.cosh(physics.observerDepthOverL), 3), pressure: fmt(physics.w, 5), p: fmt(physics.p, 3), qh: fmt(physics.qH, 4), zeta: fmt(physics.zeta, 6), product: fmt(physics.amplitudeProduct, 6), steps: String(visual.steps), altitude: fmt(altitude, 2), fps: fmt(fps, 1), domain, run: runId || 'UNCOMMITTED', result: physics.resultClass, route: primaRoute || 'ROOT', speed: fmt(cameraSpeed, 2) };
    for (const [key, value] of Object.entries(values)) if (fields.has(key)) fields.get(key).textContent = value;
  } };
}
export function renderScientificStatus(root, physics) {
  const rows = [['DOCUMENT', physics.status.document],['p PROFILE', physics.status.pProfile],['PRESSURE CLOSURE', physics.status.pressureClosure],['9L THROAT', physics.status.throat],['ABSOLUTE COSH MAP', physics.status.absoluteDepth],['AMPLITUDE CLOSURE', physics.status.amplitude],['a₀=cH/(2π)', physics.status.a0Target],['VISUALIZER', physics.status.visualizer]];
  root.innerHTML = rows.map(([name, status]) => `<div><span>${name}</span><strong data-status="${status}">${status}</strong></div>`).join('');
}
export function renderAmplitudeWall(root, physics) {
  const ratio = physics.targetAmplitudeProduct ? physics.amplitudeProduct / physics.targetAmplitudeProduct : 0;
  root.innerHTML = `<div class="amp-grid"><span>q_H</span><b>${fmt(physics.qH,5)}</b><span>ζ</span><b>${fmt(physics.zeta,7)}</b><span>q_H ζ</span><b>${fmt(physics.amplitudeProduct,7)}</b><span>TARGET PRODUCT</span><b>${fmt(physics.targetAmplitudeProduct,7)}</b><span>P/U</span><b>${fmt(physics.w,6)}</b><span>a₀ CALC</span><b>${fmt(physics.a0SI,5)}</b><span>a₀ TARGET</span><b>${fmt(physics.targetA0SI,5)}</b><span>RESIDUAL</span><b>${fmt(physics.amplitudeResidualFraction*100,2)}%</b></div><div class="amp-track"><i style="width:${Math.max(0,Math.min(100,ratio*50))}%"></i><mark style="left:50%"></mark></div><p>${physics.resultReason}</p>`;
}
export function renderReceiptLog(root, receipts) {
  const recent = [...receipts].reverse().slice(0, 12); if (!recent.length) { root.innerHTML = '<p class="empty-log">No committed mutations yet. Dragging is live; release/change commits a receipt.</p>'; return; }
  root.innerHTML = recent.map((r) => `<button type="button" class="receipt-row" data-receipt="${r.run_id}"><code>${r.run_id?.slice(0,12)||'run'}</code><span>${r.mutation?.controlId||'mutation'}</span><b>${r.result_class||r.status||'—'}</b><em>${r.prima?.route||'—'}</em><small>${r.receipt_hash?.slice(0,10)||''}</small></button>`).join('');
}
