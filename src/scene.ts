import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SceneSetup {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  controls: OrbitControls;
  handleResize: () => void;
}

export function setupScene(container: HTMLElement): SceneSetup {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1a1a2e');

  const { camera, handleResize } = createCamera(container);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 10, 7);
  scene.add(directional);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  controls.target.set(0, 1, 0);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.update();

  function handleResizeFull() {
    handleResize();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  return { renderer, scene, camera, controls, handleResize: handleResizeFull };
}

function createCamera(container: HTMLElement) {
  const scH = container.clientHeight;
  const scale = (scH * 0.005 + 4.8) * 0.77;
  const aspect = container.clientWidth / container.clientHeight;

  const camera = new THREE.OrthographicCamera(
    -scale * aspect,
    scale * aspect,
    scale,
    -scale,
    0.01,
    50000
  );

  const angle = 0.2 * Math.PI;
  camera.position.set(20 * Math.sin(angle), 10, 20 * Math.cos(angle));
  camera.lookAt(0, 1, 0);

  function handleResize() {
    const scH = container.clientHeight;
    const scale = (scH * 0.005 + 4.8) * 0.77;
    const aspect = container.clientWidth / container.clientHeight;
    camera.left = -scale * aspect;
    camera.right = scale * aspect;
    camera.top = scale;
    camera.bottom = -scale;
    camera.updateProjectionMatrix();
  }

  return { camera, handleResize };
}
