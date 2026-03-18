import './style.css';
import { setupScene } from './scene';
import { createDesk } from './desk';
import { createPuppy } from './puppy';

function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function init() {
  const container = document.getElementById('canvas-container')!;
  const { renderer, scene, camera, controls, handleResize } = setupScene(container);

  const { group: desk, update: updateDesk } = createDesk();
  scene.add(desk);

  const { group: puppy, update: updatePuppy } = createPuppy();
  scene.add(puppy);

  // Hide spinner
  container.classList.add('loaded');

  // Intro animation state
  let frame = 0;
  const introFrames = 120;
  const dist = 20;

  function animate() {
    requestAnimationFrame(animate);

    if (frame < introFrames) {
      // Eased intro orbit
      const p = frame / introFrames;
      const t = easeOutCirc(p);
      const angle = t * Math.PI * 0.4 + 0.2 * Math.PI;
      camera.position.set(
        dist * Math.sin(angle),
        10 - t * 2,
        dist * Math.cos(angle)
      );
      camera.lookAt(controls.target);
      frame++;
    } else {
      controls.update();
    }

    updateDesk();
    updatePuppy();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', handleResize);
  animate();
}

init();
