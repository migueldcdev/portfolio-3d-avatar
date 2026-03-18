import * as THREE from 'three';

const COLORS = {
  body: '#f5f0eb',
  belly: '#ffffff',
  nose: '#2d2d2d',
  ear: '#8b5e3c',
  tongue: '#ff8a9e',
  patch: '#6b3a1f',
};

function mat(color: string) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true });
}

export interface PuppyResult {
  group: THREE.Group;
  update: () => void;
}

export function createPuppy(): PuppyResult {
  const group = new THREE.Group();

  // --- Body (lying down, elongated) ---
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.4, 0.55),
    mat(COLORS.body)
  );
  body.position.set(0, 0.22, 0);
  group.add(body);

  // Brown patch on back
  const backPatch = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.05, 0.4),
    mat(COLORS.patch)
  );
  backPatch.position.set(-0.1, 0.44, 0.02);
  group.add(backPatch);

  // Brown patch on side
  const sidePatch = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.02),
    mat(COLORS.patch)
  );
  sidePatch.position.set(0.15, 0.25, 0.28);
  group.add(sidePatch);

  // Belly (slightly lighter underside peeking out)
  const belly = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.1, 0.5),
    mat(COLORS.belly)
  );
  belly.position.set(0, 0.05, 0);
  group.add(belly);

  // --- Head (resting on front paws, tilted slightly) ---
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.32, 0.42),
    mat(COLORS.body)
  );
  head.position.set(0.55, 0.18, 0);
  group.add(head);

  // Brown patch over one eye
  const eyePatch = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.02),
    mat(COLORS.patch)
  );
  eyePatch.position.set(0.6, 0.26, 0.22);
  group.add(eyePatch);

  // Snout
  const snout = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.26),
    mat(COLORS.belly)
  );
  snout.position.set(0.78, 0.13, 0);
  group.add(snout);

  // Nose
  const nose = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.06, 0.1),
    mat(COLORS.nose)
  );
  nose.position.set(0.88, 0.16, 0);
  group.add(nose);

  // Tongue sticking out a tiny bit
  const tongue = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.02, 0.08),
    mat(COLORS.tongue)
  );
  tongue.position.set(0.86, 0.09, 0);
  group.add(tongue);

  // Eyes (closed — flat lines)
  const eyeGeo = new THREE.BoxGeometry(0.08, 0.02, 0.04);
  const eyeMat = mat(COLORS.nose);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.66, 0.28, 0.14);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.66, 0.28, -0.14);
  group.add(eyeR);

  // --- Ears (floppy, hanging down) ---
  const earGeo = new THREE.BoxGeometry(0.14, 0.2, 0.1);
  const earMat = mat(COLORS.ear);

  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(0.48, 0.18, 0.26);
  earL.rotation.z = 0.3;
  group.add(earL);

  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.48, 0.18, -0.26);
  earR.rotation.z = 0.3;
  group.add(earR);

  // --- Front paws (stretched forward, head resting on them) ---
  const pawGeo = new THREE.BoxGeometry(0.2, 0.1, 0.14);
  const pawMat = mat(COLORS.belly);

  const pawFL = new THREE.Mesh(pawGeo, pawMat);
  pawFL.position.set(0.6, 0.05, 0.2);
  group.add(pawFL);

  const pawFR = new THREE.Mesh(pawGeo, pawMat);
  pawFR.position.set(0.6, 0.05, -0.2);
  group.add(pawFR);

  // --- Back paws (tucked beside body) ---
  const pawBL = new THREE.Mesh(pawGeo, pawMat);
  pawBL.position.set(-0.35, 0.05, 0.32);
  group.add(pawBL);

  const pawBR = new THREE.Mesh(pawGeo, pawMat);
  pawBR.position.set(-0.35, 0.05, -0.32);
  group.add(pawBR);

  // --- Tail (curled to the side) ---
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.1, 0.1),
    mat(COLORS.patch)
  );
  tail.position.set(-0.55, 0.2, 0.2);
  tail.rotation.y = 0.4;
  group.add(tail);

  // --- Zzz particles ---
  const zzzCount = 3;
  const zzzParticles: { mesh: THREE.Mesh; baseY: number; delay: number }[] = [];

  for (let i = 0; i < zzzCount; i++) {
    const zTex = createZTexture(0.12 + i * 0.04);
    const zMat = new THREE.MeshBasicMaterial({
      map: zTex,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const s = 0.3 - i * 0.06;
    const zMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(s, s),
      zMat
    );
    const baseY = 0.45 + i * 0.3;
    zMesh.position.set(0.7 + i * 0.1, baseY, 0.3);
    zMesh.rotation.y = Math.PI;
    group.add(zMesh);
    zzzParticles.push({ mesh: zMesh, baseY, delay: i * 0.33 });
  }

  // Position the whole puppy in front of the desk
  group.position.set(0, 0, 1.8);
  group.rotation.y = Math.PI + 0.3;

  // Breathing animation
  let time = 0;

  function update() {
    time += 0.016;

    // Subtle breathing — body scale pulse
    const breathe = Math.sin(time * 1.5) * 0.015;
    body.scale.y = 1 + breathe;
    body.position.y = 0.22 + breathe * 0.5;

    // Zzz float animation
    const cycle = 3.0; // seconds per full zzz cycle
    for (const p of zzzParticles) {
      const t = ((time / cycle + p.delay) % 1);
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      // Fade in then fade out
      mat.opacity = t < 0.2 ? t / 0.2 * 0.6 : (1 - t) / 0.8 * 0.6;
      mat.opacity = Math.max(0, mat.opacity);
      p.mesh.position.y = p.baseY + t * 0.5;
      // Billboard towards camera (rotate to face forward)
      p.mesh.rotation.y = 0;
    }
  }

  return { group, update };
}

function createZTexture(scale: number): THREE.CanvasTexture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Draw a pixel-art "Z"
  ctx.fillStyle = '#aaccff';
  const s = Math.round(size * 0.2);
  const w = size - s * 2;
  const h = 3;

  // Top bar
  ctx.fillRect(s, s, w, h);
  // Diagonal (step pattern — mirrored so it reads as Z when flipped)
  const steps = 4;
  for (let i = 0; i < steps; i++) {
    const x = s + i * (w / steps);
    const y = s + h + i * ((size - s * 2 - h * 2) / steps);
    ctx.fillRect(x, y, w / steps, h);
  }
  // Bottom bar
  ctx.fillRect(s, size - s - h, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}
