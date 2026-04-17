import { useEffect, useRef } from "react";
import * as THREE from "three";

// WebGL particle field — crisp circular points, soft drift, cursor repulsion
const ParticleField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSize = () => ({
      w: container.clientWidth,
      h: container.clientHeight,
    });
    let { w, h } = getSize();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const COUNT = window.innerWidth < 768 ? 1600 : 3600;
    const SPREAD_X = 1600;
    const SPREAD_Y = 1000;
    const SPREAD_Z = 500;

    const positions = new Float32Array(COUNT * 3);
    const origins = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X;
      const y = (Math.random() - 0.5) * SPREAD_Y;
      const z = (Math.random() - 0.5) * SPREAD_Z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      origins[i * 3] = x;
      origins[i * 3 + 1] = y;
      origins[i * 3 + 2] = z;
      sizes[i] = Math.random() * 3.2 + 1.8;
      alphas[i] = Math.random() * 0.3 + 0.35;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uPixelRatio: { value: dpr },
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x3b82f6) },
        uColorB: { value: new THREE.Color(0x8b5cf6) },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aAlpha;
        attribute float aPhase;
        uniform float uPixelRatio;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPixelRatio * (380.0 / -mv.z);
          float twinkle = 0.75 + sin(uTime * 1.8 + aPhase) * 0.25;
          vAlpha = aAlpha * twinkle;
          float t = smoothstep(-500.0, 500.0, position.x + position.y);
          vColor = mix(uColorA, uColorB, t * 0.35);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = 1.0 - smoothstep(0.15, 0.5, d);
          gl_FragColor = vec4(vColor, edge * vAlpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse → world plane projection
    const mouseNDC = new THREE.Vector2(-10, -10);
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let mouseActive = false;

    const onMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseActive = true;
    };
    const onLeave = () => {
      mouseActive = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      const next = getSize();
      w = next.w;
      h = next.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const REPEL_RADIUS = 160;
    const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS;
    const REPEL_STRENGTH = 90;
    const RETURN = 0.045;

    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const arr = positionAttr.array as Float32Array;
    let raf = 0;
    let time = 0;

    const tick = () => {
      time += 0.006;
      material.uniforms.uTime.value = time;

      if (mouseActive) {
        raycaster.setFromCamera(mouseNDC, camera);
        raycaster.ray.intersectPlane(plane, mouseWorld);
      }

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const ox = origins[ix];
        const oy = origins[ix + 1];
        const oz = origins[ix + 2];
        const ph = phases[i];

        const tx = ox + Math.sin(time + ph) * 2.2;
        const ty = oy + Math.cos(time * 0.8 + ph) * 2.2;
        const tz = oz;

        let x = arr[ix];
        let y = arr[ix + 1];
        let z = arr[ix + 2];

        if (mouseActive) {
          const dx = x - mouseWorld.x;
          const dy = y - mouseWorld.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_RADIUS_SQ) {
            const d = Math.sqrt(d2) || 0.01;
            const f = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
            x += (dx / d) * f * 0.18;
            y += (dy / d) * f * 0.18;
          }
        }

        arr[ix] = x + (tx - x) * RETURN;
        arr[ix + 1] = y + (ty - y) * RETURN;
        arr[ix + 2] = z + (tz - z) * RETURN;
      }
      positionAttr.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    />
  );
};

export default ParticleField;
