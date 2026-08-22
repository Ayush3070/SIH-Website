import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createNoise3D } from "simplex-noise";

type Sdf = (point: THREE.Vector3) => number;

type Particle = {
  base: THREE.Vector3;
  drift: THREE.Vector3;
  phase: number;
};

type ParticleGroup = {
  mesh: THREE.InstancedMesh;
  material: THREE.MeshBasicMaterial;
  particles: Particle[];
  colorA: THREE.Color;
  colorB: THREE.Color;
  start: number;
  peak: number;
  end: number;
  line?: THREE.LineSegments;
  lineMaterial?: THREE.LineBasicMaterial;
};

const PARTICLES_PER_PHASE = 1900;
const reusableObject = new THREE.Object3D();
const reusableColor = new THREE.Color();
const mouseNdc = new THREE.Vector2(99, 99);
const mouseWorld = new THREE.Vector3(99, 99, 99);

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const smin = (a: number, b: number, k: number) => {
  const h = clamp01(0.5 + (0.5 * (b - a)) / k);
  return THREE.MathUtils.lerp(b, a, h) - k * h * (1 - h);
};
const sdEllipsoid = (p: THREE.Vector3, r: THREE.Vector3) =>
  (Math.sqrt((p.x * p.x) / (r.x * r.x) + (p.y * p.y) / (r.y * r.y) + (p.z * p.z) / (r.z * r.z)) - 1) *
  Math.min(r.x, r.y, r.z);
const sdSphere = (p: THREE.Vector3, radius: number) => p.length() - radius;
const sdCapsule = (p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, radius: number) => {
  const pa = p.clone().sub(a);
  const ba = b.clone().sub(a);
  const h = clamp01(pa.dot(ba) / ba.dot(ba));
  return pa.sub(ba.multiplyScalar(h)).length() - radius;
};
const sdBox = (p: THREE.Vector3, b: THREE.Vector3) => {
  const q = new THREE.Vector3(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)).sub(b);
  return new THREE.Vector3(Math.max(q.x, 0), Math.max(q.y, 0), Math.max(q.z, 0)).length() + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0);
};

const sdfMask: Sdf = (p) => {
  const head = sdEllipsoid(p, new THREE.Vector3(1.18, 1.58, 0.42));
  const chin = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, -0.8, 0.05)), new THREE.Vector3(0.72, 0.55, 0.38));
  const nose = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, -0.05, 0.42)), new THREE.Vector3(0.22, 0.34, 0.28));
  const leftEye = sdEllipsoid(p.clone().sub(new THREE.Vector3(-0.42, 0.35, 0.32)), new THREE.Vector3(0.25, 0.12, 0.16));
  const rightEye = sdEllipsoid(p.clone().sub(new THREE.Vector3(0.42, 0.35, 0.32)), new THREE.Vector3(0.25, 0.12, 0.16));
  const mouth = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, -0.62, 0.34)), new THREE.Vector3(0.46, 0.08, 0.12));
  return Math.max(smin(smin(head, chin, 0.22), nose, 0.16), -Math.min(leftEye, rightEye, mouth));
};

const sdfBrain: Sdf = (p) => {
  const base = sdEllipsoid(p, new THREE.Vector3(1.32, 0.9, 0.82));
  const foldA = Math.sin(p.x * 15.0 + Math.sin(p.y * 4.0)) * 0.035;
  const foldB = Math.sin(p.y * 18.0 + p.z * 9.0) * 0.025;
  const midGroove = -sdBox(p.clone().sub(new THREE.Vector3(0, 0.05, 0.1)), new THREE.Vector3(0.045, 1.0, 0.9));
  return Math.max(base + foldA + foldB, -midGroove);
};

const sdfBone: Sdf = (p) => {
  const shaft = sdCapsule(p, new THREE.Vector3(0, -1.15, 0), new THREE.Vector3(0, 1.15, 0), 0.22);
  const topA = sdSphere(p.clone().sub(new THREE.Vector3(-0.22, 1.22, 0)), 0.36);
  const topB = sdSphere(p.clone().sub(new THREE.Vector3(0.27, 1.08, 0.02)), 0.32);
  const lowA = sdSphere(p.clone().sub(new THREE.Vector3(-0.25, -1.12, 0)), 0.32);
  const lowB = sdSphere(p.clone().sub(new THREE.Vector3(0.25, -1.22, 0.02)), 0.36);
  return smin(smin(smin(smin(shaft, topA, 0.2), topB, 0.18), lowA, 0.18), lowB, 0.2);
};

const sdfSkull: Sdf = (p) => {
  const cranium = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, 0.32, 0)), new THREE.Vector3(1.05, 1.08, 0.82));
  const jaw = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, -0.78, 0.05)), new THREE.Vector3(0.72, 0.52, 0.56));
  const leftEye = sdEllipsoid(p.clone().sub(new THREE.Vector3(-0.35, 0.12, 0.58)), new THREE.Vector3(0.25, 0.25, 0.24));
  const rightEye = sdEllipsoid(p.clone().sub(new THREE.Vector3(0.35, 0.12, 0.58)), new THREE.Vector3(0.25, 0.25, 0.24));
  const nose = sdEllipsoid(p.clone().sub(new THREE.Vector3(0, -0.2, 0.62)), new THREE.Vector3(0.18, 0.28, 0.2));
  let skull = Math.max(smin(cranium, jaw, 0.22), -Math.min(leftEye, rightEye, nose));

  for (let i = 0; i < 8; i += 1) {
    const x = (i - 3.5) * 0.11;
    const tooth = sdBox(p.clone().sub(new THREE.Vector3(x, -1.13, 0.5)), new THREE.Vector3(0.035, 0.18, 0.08));
    skull = smin(skull, tooth, 0.035);
  }
  return skull;
};

function gradient(point: THREE.Vector3, sdf: Sdf) {
  const e = 0.005;
  return new THREE.Vector3(
    sdf(new THREE.Vector3(point.x + e, point.y, point.z)) - sdf(new THREE.Vector3(point.x - e, point.y, point.z)),
    sdf(new THREE.Vector3(point.x, point.y + e, point.z)) - sdf(new THREE.Vector3(point.x, point.y - e, point.z)),
    sdf(new THREE.Vector3(point.x, point.y, point.z + e)) - sdf(new THREE.Vector3(point.x, point.y, point.z - e)),
  ).normalize();
}

function projectToSurface(seed: THREE.Vector3, sdf: Sdf, iterations = 8) {
  const point = seed.clone();
  for (let i = 0; i < iterations; i += 1) {
    const d = sdf(point);
    point.sub(gradient(point, sdf).multiplyScalar(d));
  }
  return point;
}

function sampleSurface(sdf: Sdf, count: number, spread: THREE.Vector3) {
  const particles: Particle[] = [];
  let guard = 0;
  while (particles.length < count && guard < count * 35) {
    guard += 1;
    const seed = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(spread.x),
      THREE.MathUtils.randFloatSpread(spread.y),
      THREE.MathUtils.randFloatSpread(spread.z),
    );
    const point = projectToSurface(seed, sdf);
    if (Number.isFinite(point.x) && point.length() < 2.4) {
      particles.push({
        base: point,
        drift: new THREE.Vector3(Math.random() * 40, Math.random() * 40, Math.random() * 40),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  return particles;
}

function phaseWeight(progress: number, start: number, peak: number, end: number) {
  const fadeIn = THREE.MathUtils.smoothstep(progress, start, peak);
  const fadeOut = 1 - THREE.MathUtils.smoothstep(progress, peak, end);
  return clamp01(Math.min(fadeIn, fadeOut));
}

function createParticleGroup(
  scene: THREE.Object3D,
  particles: Particle[],
  colors: [string, string],
  timing: [number, number, number],
) {
  const geometry = new THREE.IcosahedronGeometry(0.018, 1);
  const material = new THREE.MeshBasicMaterial({
    color: colors[0],
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, particles.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);
  return {
    mesh,
    material,
    particles,
    colorA: new THREE.Color(colors[0]),
    colorB: new THREE.Color(colors[1]),
    start: timing[0],
    peak: timing[1],
    end: timing[2],
  };
}

function buildBrainLines(particles: Particle[]) {
  const positions: number[] = [];
  for (let i = 0; i < 260; i += 1) {
    const a = particles[Math.floor(Math.random() * particles.length)].base;
    const b = particles[Math.floor(Math.random() * particles.length)].base;
    if (a.distanceTo(b) < 0.34) {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: "#67f8ff",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return { line: new THREE.LineSegments(geometry, material), material };
}

export default function ThreePortalBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#030511", 0.08);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 80);
    camera.position.set(0, 0, 5.2);

    const root = new THREE.Group();
    scene.add(root);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.55, 0.12));

    const noise3D = createNoise3D();
    const mask = createParticleGroup(root, sampleSurface(sdfMask, PARTICLES_PER_PHASE, new THREE.Vector3(2.5, 3.2, 1.4)), ["#78f7ff", "#ffffff"], [0, 0.08, 0.29]);
    const brain = createParticleGroup(root, sampleSurface(sdfBrain, PARTICLES_PER_PHASE, new THREE.Vector3(2.8, 2.1, 1.9)), ["#46f6ff", "#ffffff"], [0.2, 0.36, 0.55]);
    const bone = createParticleGroup(root, sampleSurface(sdfBone, PARTICLES_PER_PHASE, new THREE.Vector3(2.0, 3.0, 1.4)), ["#ffb14a", "#ff304f"], [0.48, 0.64, 0.78]);
    const skull = createParticleGroup(root, sampleSurface(sdfSkull, PARTICLES_PER_PHASE, new THREE.Vector3(2.5, 2.8, 2.0)), ["#c77dff", "#ff4fd8"], [0.72, 0.9, 1]);
    const groups: ParticleGroup[] = [mask, brain, bone, skull];

    const brainLines = buildBrainLines(brain.particles);
    brain.line = brainLines.line;
    brain.lineMaterial = brainLines.material;
    root.add(brainLines.line);

    const bgStars = sampleSurface((p) => sdSphere(p, 3.6), 900, new THREE.Vector3(7, 7, 7));
    const stars = createParticleGroup(scene, bgStars, ["#263dff", "#67f8ff"], [0, 0.5, 1]);
    stars.material.opacity = 0.25;

    let scrollProgress = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let frameId = 0;
    const clock = new THREE.Clock();

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = clamp01(window.scrollY / maxScroll);
    };

    const updatePointer = (event: PointerEvent) => {
      mouseNdc.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNdc.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseWorld.set(mouseNdc.x, mouseNdc.y, 0.35).unproject(camera);
      targetTiltY = mouseNdc.x * 0.28;
      targetTiltX = -mouseNdc.y * 0.16;
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("resize", resize);
    updateScroll();
    resize();

    const renderGroup = (group: ParticleGroup, elapsed: number) => {
      const weight = phaseWeight(scrollProgress, group.start, group.peak, group.end);
      const colorMix = THREE.MathUtils.smoothstep(scrollProgress, group.start, group.end);
      group.material.opacity = weight * 0.9;
      group.material.color.copy(reusableColor.copy(group.colorA).lerp(group.colorB, colorMix));
      group.mesh.scale.setScalar(THREE.MathUtils.lerp(0.65, 1.08, weight));
      group.mesh.visible = weight > 0.01;

      if (group.line && group.lineMaterial) {
        group.line.visible = weight > 0.01;
        group.line.scale.copy(group.mesh.scale);
        group.line.rotation.copy(group.mesh.rotation);
        group.lineMaterial.opacity = weight * 0.28;
      }

      if (weight <= 0.01) return;

      for (let i = 0; i < group.particles.length; i += 1) {
        const particle = group.particles[i];
        const p = particle.base.clone();
        const n = particle.base.clone().normalize();
        const drift = noise3D(
          particle.drift.x + elapsed * 0.1,
          particle.drift.y + elapsed * 0.1,
          particle.drift.z,
        ) * 0.035;
        p.addScaledVector(particle.base.clone().normalize(), drift);

        const dist = p.distanceTo(mouseWorld);
        if (dist < 1.25) {
          const push = (1 - dist / 1.25) * 0.42 * (0.65 + Math.sin(elapsed * 7.5 + dist * 4.0) * 0.35);
          p.add(p.clone().sub(mouseWorld).normalize().multiplyScalar(push));
        } else {
          p.addScaledVector(n, Math.sin(elapsed * 0.9 + particle.phase) * 0.006);
        }

        reusableObject.position.copy(p);
        reusableObject.scale.setScalar(THREE.MathUtils.lerp(0.55, 1.35, weight));
        reusableObject.updateMatrix();
        group.mesh.setMatrixAt(i, reusableObject.matrix);
      }
      group.mesh.instanceMatrix.needsUpdate = true;
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      frameId = window.requestAnimationFrame(animate);
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, targetTiltX + scrollProgress * Math.PI * 0.08, 0.055);
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, targetTiltY + scrollProgress * Math.PI * 1.45, 0.045);
      root.rotation.z = Math.sin(elapsed * 0.16) * 0.04;

      for (const group of groups) renderGroup(group, elapsed);

      stars.mesh.rotation.y += 0.0009;
      stars.mesh.rotation.x += 0.00035;
      composer.render();
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("resize", resize);
      host.removeChild(renderer.domElement);
      composer.dispose();
      renderer.dispose();
      for (const group of [...groups, stars]) {
        group.mesh.geometry.dispose();
        group.material.dispose();
        if (group.line) group.line.geometry.dispose();
        if (group.lineMaterial) group.lineMaterial.dispose();
      }
    };
  }, []);

  return <div ref={hostRef} className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-canvas" />;
}
