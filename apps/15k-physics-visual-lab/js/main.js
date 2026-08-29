import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { CONTROL_DEFS } from '../data/controlRegistry.js';
import { ControlGraph } from './lab/controlGraph.js';
import { computeThirdCleave, safeAcosh, ADAPTER_VERSION } from './adapters/smeMondThirdCleaveAdapter.js';
import { buildVisualState } from './adapters/visualAdapter.js';
import { ReceiptLedger, computeRuntimeCodeHash } from './provenance/receipts.js';
import { classifyPrima } from './provenance/prima.js';
import { RAY_VERT, RAY_FRAG } from './shaders.js';
import { FlightController } from './flightController.js';
import { mountControlBoard, renderDependencyTrace } from './ui/controlBoard.js';
import { mountTelemetry, renderScientificStatus, renderAmplitudeWall, renderReceiptLog } from './ui/telemetry.js';

const BUILD_VERSION = '15K-SME-MOND-LAB-0.1.0';
const STORAGE_STATE = '15k_lab_state_v1';
const ROOT_ID = 'SME_MOND_THIRD_CLEAVE_ROOT_v0.9.1_VISLAB_0.1';
const canvas = document.querySelector('#view');
const fatal = document.querySelector('#fatal');
function showFatal(label, error) { fatal.hidden = false; fatal.textContent = `${label}\n\n${error?.stack || error}`; }
function loadState() { try { const data = JSON.parse(localStorage.getItem(STORAGE_STATE) || '{}'); return data && typeof data === 'object' ? data : {}; } catch { return {}; } }
function persistState(state) { try { localStorage.setItem(STORAGE_STATE, JSON.stringify(state)); } catch {} }
const randomId = () => globalThis.crypto?.randomUUID?.() || `run-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const domainFor = (tau) => tau < 0.34 ? 'THROAT' : tau < 0.58 ? 'BOUNDARY' : tau < 0.83 ? 'DEEP SPACE' : 'SOLAR SYSTEM';

async function boot() {
  const canonicalGraph = new ControlGraph(CONTROL_DEFS);
  const canonicalPhysics = computeThirdCleave(canonicalGraph.snapshot());
  canonicalGraph.applyDerived(canonicalPhysics.controlValues);
  const rootState = canonicalGraph.snapshot();

  const graph = new ControlGraph(CONTROL_DEFS, loadState());
  const ledger = new ReceiptLedger();
  let physics = computeThirdCleave(graph.snapshot());
  graph.applyDerived(physics.controlValues);
  let visual = buildVisualState(physics, graph.snapshot());
  let pendingBefore = null, pendingControl = null;
  let currentRunId = ledger.receipts.at(-1)?.run_id || null;
  let currentPrimaRoute = ledger.receipts.at(-1)?.prima?.route || 'ROOT';
  const codeHash = await computeRuntimeCodeHash([BUILD_VERSION, ADAPTER_VERSION, RAY_VERT, RAY_FRAG, JSON.stringify(CONTROL_DEFS)]);

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias:false, powerPreference:'high-performance', logarithmicDepthBuffer:true }); }
  catch (error) { showFatal('WEBGL RENDERER CONSTRUCTION FAILED', error); return; }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.001, 1e6);
  camera.position.set(0, 0.24, 4.2);
  camera.quaternion.setFromEuler(new THREE.Euler(-0.03, 0, 0, 'YXZ'));
  const controls = new FlightController(camera, renderer.domElement);
  const uniforms = {
    uRes:{value:new THREE.Vector2(1,1)},uTime:{value:0},uCamPos:{value:new THREE.Vector3()},uCamForward:{value:new THREE.Vector3(0,0,-1)},uCamRight:{value:new THREE.Vector3(1,0,0)},uCamUp:{value:new THREE.Vector3(0,1,0)},uTanHalfFov:{value:Math.tan(THREE.MathUtils.degToRad(camera.fov*.5))},uAspect:{value:camera.aspect},uL:{value:graph.get('sme.L')},uTraversal:{value:visual.traversal},uPOverU:{value:visual.pOverU},uQH:{value:visual.qH},uZeta:{value:visual.zeta},uThroatDepthL:{value:visual.throatDepthL},uThroatConditional:{value:visual.throatConditional},uTurbulence:{value:visual.turbulence},uLensStrength:{value:visual.lensStrength},uStarBrightness:{value:visual.starBrightness},uPlanetBoost:{value:visual.planetBoost},uSteps:{value:visual.steps}
  };
  const material = new THREE.ShaderMaterial({vertexShader:RAY_VERT,fragmentShader:RAY_FRAG,uniforms,depthTest:false,depthWrite:false});
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), material); quad.frustumCulled=false; scene.add(quad);
  const camPos=new THREE.Vector3(),camForward=new THREE.Vector3(),camRight=new THREE.Vector3(),camUp=new THREE.Vector3();
  quad.onBeforeRender=(_r,_s,drawCamera)=>{drawCamera.getWorldPosition(camPos);drawCamera.getWorldDirection(camForward).normalize();camRight.set(1,0,0).applyQuaternion(drawCamera.quaternion).normalize();camUp.set(0,1,0).applyQuaternion(drawCamera.quaternion).normalize();uniforms.uCamPos.value.copy(camPos);uniforms.uCamForward.value.copy(camForward);uniforms.uCamRight.value.copy(camRight);uniforms.uCamUp.value.copy(camUp);const e=drawCamera.projectionMatrix.elements;uniforms.uTanHalfFov.value=1/Math.max(Math.abs(e[5]),1e-6);uniforms.uAspect.value=Math.abs(e[5]/Math.max(e[0],1e-6));};

  const telemetry=mountTelemetry(document.querySelector('#hud'));
  const controlRoot=document.querySelector('#control-board'),traceRoot=document.querySelector('#dependency-trace'),statusRoot=document.querySelector('#scientific-status'),amplitudeRoot=document.querySelector('#amplitude-wall'),receiptRoot=document.querySelector('#receipt-log');
  function applyAmplitudeLink(changedId){if(!graph.get('lab.amplitudeLinked'))return;const calc=computeThirdCleave(graph.snapshot());const target=calc.targetAmplitudeProduct;if(!Number.isFinite(target))return;if(changedId==='sme.qH')graph.setControl('sme.zeta',target/Math.max(graph.get('sme.qH'),1e-9));if(changedId==='sme.zeta')graph.setControl('sme.qH',target/Math.max(graph.get('sme.zeta'),1e-9));}
  function recompute({refreshUI=true}={}){const state=graph.snapshot();const rOverL=Math.max(camera.position.length()/Math.max(state['sme.L'],1e-8),1.000001);physics=computeThirdCleave(state,{rOverL});graph.applyDerived(physics.controlValues);visual=buildVisualState(physics,graph.snapshot());uniforms.uL.value=graph.get('sme.L');uniforms.uTraversal.value=visual.traversal;uniforms.uPOverU.value=visual.pOverU;uniforms.uQH.value=visual.qH;uniforms.uZeta.value=visual.zeta;uniforms.uThroatDepthL.value=visual.throatDepthL;uniforms.uThroatConditional.value=visual.throatConditional;uniforms.uTurbulence.value=visual.turbulence;uniforms.uLensStrength.value=visual.lensStrength;uniforms.uStarBrightness.value=visual.starBrightness;uniforms.uPlanetBoost.value=visual.planetBoost;uniforms.uSteps.value=visual.steps;if(refreshUI){board.refresh(graph.snapshot());renderScientificStatus(statusRoot,physics);renderAmplitudeWall(amplitudeRoot,physics);}persistState(graph.snapshot());}
  function beginMutation(id){if(pendingControl!==id){pendingBefore=graph.snapshot();pendingControl=id;}}
  function liveMutation(id,value){try{if(!pendingBefore)beginMutation(id);graph.setControl(id,value);applyAmplitudeLink(id);recompute();}catch(error){console.warn('Mutation rejected',error);}}
  async function commitMutation(id,value){const before=pendingBefore||graph.snapshot();let mutationEvent;try{mutationEvent=graph.setControl(id,value);applyAmplitudeLink(id);recompute();}catch(error){console.warn('Commit rejected',error);pendingBefore=null;pendingControl=null;return;}const after=graph.snapshot();const prima=classifyPrima({before,after,root:rootState,mutation:{controlId:id,authorityViolation:mutationEvent.authorityViolation,resultClass:physics.resultClass},definitions:CONTROL_DEFS});const runId=randomId();const receipt=await ledger.append({run_id:runId,timestamp:new Date().toISOString(),project:'15K-Knob Physics Visual Lab',theory_id:'SME_MOND_THIRD_CLEAVE',theory_version:'v12.3/v1 Fork B Third Cleave Auditor Candidate v0.9.1',root_canonical_id:ROOT_ID,parent_id:currentRunId||ROOT_ID,generation_depth:ledger.receipts.length+1,dataset_ids:['SPARC_RAR_REFERENCE_BAND'],dataset_hashes:['SOURCE_REFERENCE_ONLY_NO_LOCAL_DATASET_IMPORT'],selected_controls:[id],before_state:before,mutation:{controlId:id,before:before[id],after:after[id],linkedAmplitude:graph.get('lab.amplitudeLinked')},after_state:after,dependency_snapshot:graph.dependencySnapshot(),code_hash:codeHash,solver:'SME-MOND Third Cleave algebraic adapter + GLSL visualization mapper',solver_version:ADAPTER_VERSION,random_seed:null,observables:{observer_depth_over_L:physics.observerDepthOverL,p_over_u:physics.w,a0_si:physics.a0SI,target_a0_si:physics.targetA0SI,amplitude_product:physics.amplitudeProduct,target_amplitude_product:physics.targetAmplitudeProduct},residuals:{amplitude_fraction:physics.amplitudeResidualFraction},fit_metrics:{},invariance_scores:{},kill_criteria:['FINITE_STATE','SPARC_SYSTEMATIC_ENVELOPE','P2_9L_CONDITIONALITY'],kill_results:{resultClass:physics.resultClass,reason:physics.resultReason},result_class:physics.resultClass,scientific_status:physics.status,prima,promotion_status:'NOT_PROMOTED',human_notes:''});currentRunId=receipt.run_id;currentPrimaRoute=prima.route;pendingBefore=null;pendingControl=null;renderReceiptLog(receiptRoot,ledger.receipts);}
  const board=mountControlBoard({root:controlRoot,definitions:CONTROL_DEFS,graph,onBegin:beginMutation,onInput:liveMutation,onCommit:commitMutation,onTrace(id){renderDependencyTrace(traceRoot,id,CONTROL_DEFS,graph.snapshot());document.querySelector('[data-tab="trace"]')?.click();}});
  document.querySelectorAll('.panel-tabs button').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('.panel-tabs button').forEach((b)=>b.classList.toggle('active',b===button));const trace=button.dataset.tab==='trace';controlRoot.style.display=trace?'none':'';traceRoot.classList.toggle('active',trace);}));
  const params=document.querySelector('#params'),receiptsPanel=document.querySelector('#receipts');document.querySelector('#toggle-controls').addEventListener('click',()=>params.classList.toggle('open'));document.querySelector('#toggle-log').addEventListener('click',()=>receiptsPanel.classList.toggle('open'));document.querySelectorAll('[data-close]').forEach((button)=>button.addEventListener('click',()=>document.querySelector(`#${button.dataset.close}`)?.classList.remove('open')));
  document.querySelector('#verify-ledger').addEventListener('click',async()=>{const result=await ledger.verifyChain();const out=document.querySelector('#ledger-status');out.textContent=result.ok?`CHAIN OK / ${ledger.receipts.length} RECEIPTS`:`CHAIN FAIL @ ${result.index}: ${result.reason}`;out.style.color=result.ok?'var(--ok)':'var(--danger)';});
  renderer.domElement.addEventListener('webglcontextlost',(event)=>{event.preventDefault();renderer.setAnimationLoop(null);showFatal('WEBGL CONTEXT LOST','Rendering stopped. Reload to rebuild GPU resources; local experiment state is preserved.');});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  let cssWidth=0,cssHeight=0;function resize(){const dpr=Math.min(devicePixelRatio||1,innerWidth<700?1.5:2);const maxPixels=innerWidth<700?2100000:4100000;const cap=Math.sqrt(maxPixels/Math.max(innerWidth*innerHeight,1));renderer.setPixelRatio(Math.min(dpr,cap));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();const size=renderer.getDrawingBufferSize(uniforms.uRes.value);cssWidth=size.x;cssHeight=size.y;}addEventListener('resize',resize,{passive:true});resize();recompute();renderReceiptLog(receiptRoot,ledger.receipts);if(CONTROL_DEFS.length)renderDependencyTrace(traceRoot,CONTROL_DEFS[0].id,CONTROL_DEFS,graph.snapshot());
  let last=performance.now(),fps=60,hudAccumulator=0;renderer.setAnimationLoop((now)=>{try{const dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;fps+=((1/dt)-fps)*.08;controls.update(dt);controls.updateXR(renderer,dt);uniforms.uTime.value=now/1000;if(uniforms.uRes.value.x!==cssWidth||uniforms.uRes.value.y!==cssHeight){const s=renderer.getDrawingBufferSize(uniforms.uRes.value);cssWidth=s.x;cssHeight=s.y;}hudAccumulator+=dt;if(hudAccumulator>=.1){hudAccumulator=0;const L=Math.max(graph.get('sme.L'),1e-8);const rOverL=Math.max(camera.position.length()/L,1.000001);physics.observerDepthOverL=safeAcosh(rOverL);telemetry.update({physics,visual,fps,altitude:camera.position.length(),runId:currentRunId,primaRoute:currentPrimaRoute,domain:domainFor(visual.traversal),cameraSpeed:controls.baseSpeed});}renderer.render(scene,camera);if(!document.body.classList.contains('ready'))requestAnimationFrame(()=>document.body.classList.add('ready'));}catch(error){renderer.setAnimationLoop(null);showFatal('RENDER LOOP EXCEPTION',error);}});
  setTimeout(()=>document.body.classList.add('ready'),9000);
}
boot().catch((error)=>showFatal('STARTUP FAILURE',error));
