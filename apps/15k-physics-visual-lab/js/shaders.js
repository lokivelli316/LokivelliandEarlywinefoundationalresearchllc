export const RAY_VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAY_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCamPos;
uniform vec3 uCamForward;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform float uTanHalfFov;
uniform float uAspect;
uniform float uL;
uniform float uTraversal;
uniform float uPOverU;
uniform float uQH;
uniform float uZeta;
uniform float uThroatDepthL;
uniform float uThroatConditional;
uniform float uTurbulence;
uniform float uLensStrength;
uniform float uStarBrightness;
uniform float uPlanetBoost;
uniform int uSteps;
#define PI 3.141592653589793
#define AU 1.0
float safeAcosh(float x) {
  x = max(x, 1.0 + 1e-7);
  return log(x + sqrt(max(x * x - 1.0, 0.0)));
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise3(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0,0,0)); float n100 = hash13(i + vec3(1,0,0));
  float n010 = hash13(i + vec3(0,1,0)); float n110 = hash13(i + vec3(1,1,0));
  float n001 = hash13(i + vec3(0,0,1)); float n101 = hash13(i + vec3(1,0,1));
  float n011 = hash13(i + vec3(0,1,1)); float n111 = hash13(i + vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y), mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float fbm5(vec3 p) {
  float a = 0.5; float sum = 0.0;
  for (int i = 0; i < 5; i++) { sum += a * noise3(p); p = p * 2.03 + 11.3; a *= 0.5; }
  return sum;
}
float raySphere(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c; float b = dot(oc, rd); float h = b*b - dot(oc,oc) + r*r;
  if (h < 0.0) return -1.0; h = sqrt(h); float t = -b - h; if (t > 0.0) return t; t = -b + h; return t > 0.0 ? t : -1.0;
}
vec3 starField(vec3 rd) {
  vec3 d = normalize(rd); vec3 q = floor(d * 620.0); float h = hash13(q);
  float star = step(0.997, h) * pow(max(h, 0.0), 40.0);
  float milky = exp(-pow(abs(d.y + 0.12 * sin(d.x * 4.0)), 2.0) * 38.0);
  float dust = fbm5(d * 7.0 + vec3(0.0, uTime * 0.002, 0.0));
  vec3 sky = vec3(0.008, 0.012, 0.028);
  sky += uStarBrightness * star * vec3(1.35, 1.15, 0.95);
  sky += uStarBrightness * milky * (0.035 + 0.09 * dust) * vec3(0.38, 0.52, 0.85);
  return sky;
}
// THROAT_DOMAIN
vec3 renderThroat(vec3 ro, vec3 rd) {
  vec3 col = vec3(0.0); float trans = 1.0; float p2Bias = 1.0 / (1.0 + abs(uPOverU - 1.0));
  for (int i = 0; i < 192; i++) {
    if (i >= uSteps) break;
    float fi = float(i); float t = 0.05 + fi * 0.055; vec3 pos = ro + rd * t;
    float rOverL = max(length(pos) / max(uL, 1e-5), 1.000001); float depth = safeAcosh(rOverL);
    float shell = exp(-0.5 * pow((depth - uThroatDepthL) * 0.42, 2.0));
    float anis = 0.55 + 0.45 * abs(dot(normalize(pos + 1e-4), vec3(0.0,1.0,0.0)));
    float turb = fbm5(pos * (1.4 + 0.08 * depth) + vec3(0.0, 0.0, uTime * 0.08));
    float rho = shell * mix(0.42, 1.35, turb) * mix(0.65, anis, p2Bias) * uTurbulence;
    vec3 emit = mix(vec3(0.10,0.50,0.78), vec3(0.95,0.25,0.62), clamp(uPOverU * 0.5, 0.0, 1.0));
    emit *= 0.30 + 0.70 * uThroatConditional;
    float a = clamp(rho * 0.035, 0.0, 0.18); col += trans * a * emit * (1.0 + 0.15 * uQH + 0.2 * uZeta); trans *= (1.0 - a);
    if (trans < 0.01) break;
  }
  return col + trans * vec3(0.002, 0.006, 0.012);
}
// STAR_DOMAIN
vec3 renderStars(vec3 rd) {
  // VISUALIZATION-APPROXIMATION: this display bend is not promoted as an SME lensing equation.
  float bend = 0.035 * clamp(uLensStrength, 0.0, 4.0);
  vec3 lensed = normalize(rd + bend * vec3(rd.y * rd.y, -rd.x * rd.x, 0.15 * rd.x * rd.y));
  return starField(lensed);
}
vec3 planetColor(int id) {
  if (id == 0) return vec3(5.2, 3.6, 1.5);
  if (id == 1) return vec3(0.18, 0.45, 0.95);
  if (id == 2) return vec3(0.85, 0.24, 0.08);
  return vec3(0.74, 0.55, 0.31);
}
// SOLAR_DOMAIN
vec3 renderSolar(vec3 rd) {
  float phase = uTime * 0.018;
  vec3 ro = vec3(0.0, 0.16, mix(6.2, 1.3, smoothstep(0.63, 1.0, uTraversal))) + uCamPos * 0.025;
  vec3 col = renderStars(rd); float best = 1e9; int hitId = -1;
  vec3 sun = vec3(0.0); vec3 earth = vec3(cos(phase), 0.0, sin(phase));
  vec3 mars = 1.524 * vec3(cos(phase * 0.532 + 1.7), 0.0, sin(phase * 0.532 + 1.7));
  vec3 jup = 5.203 * vec3(cos(phase * 0.084 + 2.4), 0.0, sin(phase * 0.084 + 2.4));
  float t0 = raySphere(ro, rd, sun, 0.00465047 * max(35.0, uPlanetBoost * 0.2));
  float t1 = raySphere(ro, rd, earth, 0.0000426349 * uPlanetBoost);
  float t2 = raySphere(ro, rd, mars, 0.000022657 * uPlanetBoost);
  float t3 = raySphere(ro, rd, jup, 0.000477895 * uPlanetBoost);
  if (t0 > 0.0 && t0 < best) { best = t0; hitId = 0; }
  if (t1 > 0.0 && t1 < best) { best = t1; hitId = 1; }
  if (t2 > 0.0 && t2 < best) { best = t2; hitId = 2; }
  if (t3 > 0.0 && t3 < best) { best = t3; hitId = 3; }
  if (hitId >= 0) {
    vec3 center = hitId == 0 ? sun : (hitId == 1 ? earth : (hitId == 2 ? mars : jup));
    vec3 hp = ro + rd * best; vec3 n = normalize(hp - center);
    float lit = hitId == 0 ? 1.0 : (0.10 + 0.90 * max(dot(n, normalize(-center + vec3(0.001))), 0.0));
    col = planetColor(hitId) * lit;
    if (hitId == 1) {
      float bands = 0.5 + 0.5 * sin(n.y * 24.0 + fbm5(n * 7.0) * 4.0);
      col *= mix(vec3(0.45,0.75,1.0), vec3(0.35,0.62,0.28), smoothstep(0.48,0.62,bands));
    }
  }
  return col;
}
vec3 acesApprox(vec3 x) {
  const float a = 2.51; const float b = 0.03; const float c = 2.43; const float d = 0.59; const float e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / max(uRes.y, 1.0);
  vec3 rd = normalize(uCamForward + p.x * (2.0 * uTanHalfFov) * uCamRight + p.y * (2.0 * uTanHalfFov) * uCamUp);
  vec3 ro = uCamPos;
  vec3 throat = renderThroat(ro, rd); vec3 stars = renderStars(rd); vec3 solar = renderSolar(rd);
  float toStars = smoothstep(0.30, 0.56, uTraversal); float toSolar = smoothstep(0.58, 0.86, uTraversal);
  vec3 col = mix(throat, stars, toStars); col = mix(col, solar, toSolar);
  float vignette = smoothstep(1.25, 0.18, length(p)); col *= mix(0.72, 1.0, vignette);
  gl_FragColor = vec4(acesApprox(col), 1.0);
}
`;
