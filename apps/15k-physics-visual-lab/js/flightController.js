import * as THREE from 'three';
const KEY_BINDINGS = new Map([
  ['KeyW', 'forward'], ['KeyS', 'back'], ['KeyA', 'left'], ['KeyD', 'right'],
  ['KeyR', 'up'], ['KeyF', 'down'], ['KeyQ', 'rollLeft'], ['KeyE', 'rollRight']
]);
export class FlightController {
  constructor(camera, domElement) {
    this.camera = camera; this.domElement = domElement; this.enabled = true;
    this.baseSpeed = 1.3; this.lookSpeed = 0.0024; this.rollSpeed = 1.5; this.boost = 5;
    this.keys = new Set(); this.touchActions = new Set(); this.dragging = false;
    this.lastPointer = new THREE.Vector2(); this._forward = new THREE.Vector3(); this._right = new THREE.Vector3();
    this._up = new THREE.Vector3(); this._move = new THREE.Vector3(); this._axis = new THREE.Vector3(); this._q = new THREE.Quaternion();
    this._onKeyDown = (e) => { if (KEY_BINDINGS.has(e.code) || e.code === 'ShiftLeft' || e.code === 'ShiftRight') { this.keys.add(e.code); if (document.activeElement === document.body) e.preventDefault(); } };
    this._onKeyUp = (e) => this.keys.delete(e.code);
    this._onPointerDown = (e) => { if (e.button !== 0 || e.target !== this.domElement) return; this.dragging = true; this.lastPointer.set(e.clientX, e.clientY); this.domElement.setPointerCapture?.(e.pointerId); };
    this._onPointerMove = (e) => { if (!this.dragging || !this.enabled) return; const dx = e.clientX - this.lastPointer.x; const dy = e.clientY - this.lastPointer.y; this.lastPointer.set(e.clientX, e.clientY); this.rotate(-dx * this.lookSpeed, -dy * this.lookSpeed, 0); };
    this._onPointerUp = (e) => { this.dragging = false; this.domElement.releasePointerCapture?.(e.pointerId); };
    this._onWheel = (e) => { if (e.target !== this.domElement) return; this.baseSpeed = THREE.MathUtils.clamp(this.baseSpeed * Math.exp(-e.deltaY * 0.0012), 0.02, 80); e.preventDefault(); };
    window.addEventListener('keydown', this._onKeyDown, { passive: false }); window.addEventListener('keyup', this._onKeyUp);
    domElement.addEventListener('pointerdown', this._onPointerDown); domElement.addEventListener('pointermove', this._onPointerMove); domElement.addEventListener('pointerup', this._onPointerUp); domElement.addEventListener('pointercancel', this._onPointerUp); domElement.addEventListener('wheel', this._onWheel, { passive: false });
    document.querySelectorAll('[data-flight]').forEach((button) => {
      const action = button.dataset.flight;
      const start = (event) => { event.preventDefault(); this.touchActions.add(action); };
      const stop = (event) => { event.preventDefault(); this.touchActions.delete(action); };
      button.addEventListener('pointerdown', start); button.addEventListener('pointerup', stop); button.addEventListener('pointercancel', stop); button.addEventListener('pointerleave', stop);
    });
  }
  rotate(yaw, pitch, roll) {
    if (yaw) { this._axis.set(0, 1, 0).applyQuaternion(this.camera.quaternion).normalize(); this._q.setFromAxisAngle(this._axis, yaw); this.camera.quaternion.premultiply(this._q); }
    if (pitch) { this._axis.set(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize(); this._q.setFromAxisAngle(this._axis, pitch); this.camera.quaternion.premultiply(this._q); }
    if (roll) { this._axis.set(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize(); this._q.setFromAxisAngle(this._axis, roll); this.camera.quaternion.premultiply(this._q); }
    this.camera.quaternion.normalize();
  }
  update(dt) {
    if (!this.enabled) return;
    const action = (name) => { for (const [code, mapped] of KEY_BINDINGS.entries()) if (mapped === name && this.keys.has(code)) return true; return this.touchActions.has(name); };
    const boosted = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.touchActions.has('boost');
    const speed = this.baseSpeed * (boosted ? this.boost : 1) * dt;
    this.camera.getWorldDirection(this._forward).normalize(); this._right.set(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize(); this._up.set(0, 1, 0).applyQuaternion(this.camera.quaternion).normalize(); this._move.set(0, 0, 0);
    if (action('forward')) this._move.add(this._forward); if (action('back')) this._move.sub(this._forward);
    if (action('right')) this._move.add(this._right); if (action('left')) this._move.sub(this._right); if (action('up')) this._move.add(this._up); if (action('down')) this._move.sub(this._up);
    if (this._move.lengthSq() > 0) this.camera.position.addScaledVector(this._move.normalize(), speed);
    if (action('rollLeft')) this.rotate(0, 0, this.rollSpeed * dt); if (action('rollRight')) this.rotate(0, 0, -this.rollSpeed * dt);
    if (this.touchActions.has('yawLeft')) this.rotate(this.rollSpeed * 0.8 * dt, 0, 0); if (this.touchActions.has('yawRight')) this.rotate(-this.rollSpeed * 0.8 * dt, 0, 0);
    if (this.touchActions.has('pitchUp')) this.rotate(0, this.rollSpeed * 0.8 * dt, 0); if (this.touchActions.has('pitchDown')) this.rotate(0, -this.rollSpeed * 0.8 * dt, 0);
  }
  updateXR(renderer, dt) {
    if (!renderer.xr.isPresenting) return; const session = renderer.xr.getSession(); if (!session) return;
    for (const source of session.inputSources) { const pad = source.gamepad; if (!pad) continue; const x = pad.axes?.[2] ?? pad.axes?.[0] ?? 0; const y = pad.axes?.[3] ?? pad.axes?.[1] ?? 0; if (Math.abs(x) + Math.abs(y) < 0.08) continue; this.camera.getWorldDirection(this._forward).normalize(); this._right.set(1,0,0).applyQuaternion(this.camera.quaternion).normalize(); this.camera.position.addScaledVector(this._right, x * this.baseSpeed * dt); this.camera.position.addScaledVector(this._forward, -y * this.baseSpeed * dt); }
  }
  dispose() {
    window.removeEventListener('keydown', this._onKeyDown); window.removeEventListener('keyup', this._onKeyUp);
    this.domElement.removeEventListener('pointerdown', this._onPointerDown); this.domElement.removeEventListener('pointermove', this._onPointerMove); this.domElement.removeEventListener('pointerup', this._onPointerUp); this.domElement.removeEventListener('pointercancel', this._onPointerUp); this.domElement.removeEventListener('wheel', this._onWheel);
  }
}
