import * as THREE from 'three';

const COLORS = {
  deskTop: '#e0a86e',
  deskLegs: '#c4823a',
  monitorFrame: '#2d2d2d',
  stand: '#aaaaaa',
  keyboard: '#3a3a3a',
  mug: '#f5f5f5',
  coffee: '#3e2723',
};

function mat(color: string) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true });
}

function pixelTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// --- Texture generators ---

function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2b2d42';
  ctx.fillRect(0, 0, 256, 160);

  const lines = [
    { indent: 0, color: '#c792ea', width: 60 },
    { indent: 1, color: '#f78c6c', width: 80 },
    { indent: 1, color: '#82aaff', width: 50 },
    { indent: 2, color: '#c3e88d', width: 70 },
    { indent: 2, color: '#89ddff', width: 40 },
    { indent: 2, color: '#f78c6c', width: 90 },
    { indent: 1, color: '#82aaff', width: 35 },
    { indent: 0, color: '#c792ea', width: 0 },
    { indent: 0, color: '#c792ea', width: 55 },
    { indent: 1, color: '#ffcb6b', width: 65 },
    { indent: 2, color: '#c3e88d', width: 45 },
    { indent: 2, color: '#89ddff', width: 75 },
    { indent: 1, color: '#82aaff', width: 30 },
    { indent: 0, color: '#c792ea', width: 0 },
    { indent: 0, color: '#ffcb6b', width: 48 },
    { indent: 1, color: '#f78c6c', width: 85 },
  ];

  const lineHeight = 8;
  const startY = 10;
  const startX = 12;
  const indentSize = 14;

  for (let i = 0; i < lines.length; i++) {
    const { indent, color, width } = lines[i];
    if (width === 0) continue;
    ctx.fillStyle = color;
    ctx.fillRect(startX + indent * indentSize, startY + i * lineHeight, width, 4);
    if (width > 50 && i % 3 === 0) {
      ctx.fillStyle = '#89ddff';
      ctx.fillRect(startX + indent * indentSize + width + 6, startY + i * lineHeight, 30, 4);
    }
  }

  ctx.fillStyle = '#4a4a6a';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillRect(4, startY + i * lineHeight, 4, 4);
  }

  return pixelTexture(canvas);
}

function createTSLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 32, 32);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2, 2, 28, 28);

  ctx.fillStyle = '#3178c6';
  ctx.fillRect(4, 6, 14, 3);
  ctx.fillRect(9, 6, 4, 18);
  ctx.fillRect(19, 6, 9, 3);
  ctx.fillRect(19, 14, 9, 3);
  ctx.fillRect(19, 22, 9, 3);
  ctx.fillRect(19, 6, 3, 11);
  ctx.fillRect(25, 14, 3, 11);

  return pixelTexture(canvas);
}

function createRocketLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 64, 64);

  const cx = 32;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 2, 6, 4, 4);
  ctx.fillRect(cx - 4, 10, 8, 4);
  ctx.fillRect(cx - 5, 14, 10, 24);

  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(cx - 2, 20, 4, 4);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 10, 32, 5, 10);
  ctx.fillRect(cx + 5, 32, 5, 10);
  ctx.fillRect(cx - 3, 38, 6, 4);

  ctx.fillStyle = '#ff6b6b';
  ctx.fillRect(cx - 2, 42, 4, 6);
  ctx.fillStyle = '#ffd93d';
  ctx.fillRect(cx - 1, 48, 2, 5);

  return pixelTexture(canvas);
}

function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0b0d2a';
  ctx.fillRect(0, 0, 128, 128);

  const starColors = ['#ffffff', '#fffbe6', '#c8d8ff', '#ffd6a5'];
  for (let i = 0; i < 80; i++) {
    const sx = Math.round(Math.random() * 128);
    const sy = Math.round(Math.random() * 128);
    ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
    ctx.fillRect(sx, sy, Math.random() > 0.85 ? 2 : 1, Math.random() > 0.85 ? 2 : 1);
  }

  for (let i = 0; i < 5; i++) {
    const sx = 10 + Math.round(Math.random() * 108);
    const sy = 10 + Math.round(Math.random() * 108);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx, sy, 2, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(sx - 2, sy, 1, 2);
    ctx.fillRect(sx + 2, sy, 1, 2);
    ctx.fillRect(sx, sy - 2, 2, 1);
    ctx.fillRect(sx, sy + 2, 2, 1);
  }

  return pixelTexture(canvas);
}

// --- Scene builder ---

export interface DeskResult {
  group: THREE.Group;
  update: () => void;
}

export function createDesk(): DeskResult {
  const group = new THREE.Group();

  // Carpet
  const carpet = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.04, 3.5),
    new THREE.MeshBasicMaterial({ map: createCarpetTexture() })
  );
  carpet.position.set(0, -0.02, 0.2);
  group.add(carpet);

  // Desk top
  const top = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 2), mat(COLORS.deskTop));
  top.position.y = 1.5;
  group.add(top);

  // Desk legs
  const legGeo = new THREE.BoxGeometry(0.18, 1.5, 0.18);
  const legMat = mat(COLORS.deskLegs);
  for (const [x, z] of [[-1.8, -0.8], [1.8, -0.8], [-1.8, 0.8], [1.8, 0.8]] as const) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.75, z);
    group.add(leg);
  }

  // Monitor
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.12), mat(COLORS.monitorFrame));
  bezel.position.set(0, 2.9, -0.3);
  group.add(bezel);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 1.2),
    new THREE.MeshBasicMaterial({ map: createScreenTexture() })
  );
  screen.position.set(0, 2.9, -0.235);
  group.add(screen);

  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), mat(COLORS.stand));
  neck.position.set(0, 2.0, -0.3);
  group.add(neck);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 6), mat(COLORS.stand));
  base.position.set(0, 1.6, -0.3);
  group.add(base);

  // Rocket logo on monitor back
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.6),
    new THREE.MeshBasicMaterial({ map: createRocketLogoTexture(), transparent: true })
  );
  logo.position.set(0, 2.9, -0.365);
  logo.rotation.y = Math.PI;
  group.add(logo);

  // Keyboard body
  const kbBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.7), mat(COLORS.keyboard));
  kbBody.position.set(0, 1.58, 0.55);
  group.add(kbBody);

  // Keys (RGB animated)
  const keyGeo = new THREE.BoxGeometry(0.1, 0.04, 0.1);
  const keys: { mesh: THREE.Mesh; col: number; row: number }[] = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 12; c++) {
      const key = new THREE.Mesh(keyGeo, new THREE.MeshStandardMaterial({ color: '#555555', flatShading: true }));
      key.position.set(-0.72 + c * 0.135, 1.62, 0.33 + r * 0.14);
      group.add(key);
      keys.push({ mesh: key, col: c, row: r });
    }
  }

  // Coffee mug
  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.156, 0.36, 6), mat(COLORS.mug));
  mugBody.position.set(1.5, 1.75, 0.2);
  group.add(mugBody);

  const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.156, 0.156, 0.024, 6), mat(COLORS.coffee));
  coffee.position.set(1.5, 1.92, 0.2);
  group.add(coffee);

  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.168, 0.072), mat(COLORS.mug));
  handle.position.set(1.72, 1.75, 0.2);
  group.add(handle);

  // Bottom book (orange)
  const book2Rot = 0.35;
  const book2Cover = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.74), mat('#e8590c'));
  book2Cover.position.set(-1.48, 1.57, -0.6);
  book2Cover.rotation.y = book2Rot;
  group.add(book2Cover);

  const book2Pages = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.06, 0.76), mat('#fffbe6'));
  book2Pages.position.set(-1.48 + Math.cos(book2Rot) * 0.03, 1.57, -0.6 - Math.sin(book2Rot) * 0.03);
  book2Pages.rotation.y = book2Rot;
  group.add(book2Pages);

  // Top book (TypeScript blue)
  const bookRot = 0.15;
  const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.7), mat('#3178c6'));
  bookCover.position.set(-1.5, 1.69, -0.6);
  bookCover.rotation.y = bookRot;
  group.add(bookCover);

  const bookPages = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.72), mat('#ffffff'));
  bookPages.position.set(-1.5 + Math.cos(bookRot) * 0.03, 1.69, -0.6 - Math.sin(bookRot) * 0.03);
  bookPages.rotation.y = bookRot;
  group.add(bookPages);

  const tsLogo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.3),
    new THREE.MeshBasicMaterial({ map: createTSLogoTexture(), transparent: true })
  );
  tsLogo.position.set(-1.5, 1.755, -0.6);
  tsLogo.rotation.x = -Math.PI / 2;
  tsLogo.rotation.z = -bookRot;
  group.add(tsLogo);

  // Steam particles
  const steamGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const steamParticles: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];

  for (let i = 0; i < 8; i++) {
    const steamMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 });
    const particle = new THREE.Mesh(steamGeo, steamMat);
    const offset = Math.random() * Math.PI * 2;
    const speed = 0.003 + Math.random() * 0.003;
    particle.position.set(
      1.5 + (Math.random() - 0.5) * 0.1,
      1.95 + Math.random() * 0.5,
      0.2 + (Math.random() - 0.5) * 0.1
    );
    group.add(particle);
    steamParticles.push({ mesh: particle, speed, offset });
  }

  // Animation state
  const rgbColor = new THREE.Color();
  let kbTime = 0;

  function update() {
    // Keyboard RGB wave
    kbTime += 0.016;
    for (const k of keys) {
      const wave = kbTime * 2 + k.col * 0.3 + k.row * 0.15;
      rgbColor.setHSL((wave % (Math.PI * 2)) / (Math.PI * 2), 0.4, 0.35);
      (k.mesh.material as THREE.MeshStandardMaterial).color.copy(rgbColor);
    }

    // Steam
    for (const p of steamParticles) {
      p.mesh.position.y += p.speed;
      p.mesh.position.x = 1.5 + Math.sin(p.mesh.position.y * 8 + p.offset) * 0.04;

      const m = p.mesh.material as THREE.MeshBasicMaterial;
      m.opacity = Math.max(0, 0.5 - (p.mesh.position.y - 1.95) * 0.7);

      if (m.opacity <= 0) {
        p.mesh.position.set(
          1.5 + (Math.random() - 0.5) * 0.1,
          1.95,
          0.2 + (Math.random() - 0.5) * 0.1
        );
      }
    }
  }

  return { group, update };
}
