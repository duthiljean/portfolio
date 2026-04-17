import { useEffect, useRef } from "react";
import * as THREE from "three";

// Rippling dot-grid surface — WebGL three.js, scoped to parent (absolute, not fixed)
export const DottedSurface = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const SEPARATION = 115;
    const AMOUNTX = 38;
    const AMOUNTY = 50;
    const HALF_W = (AMOUNTX * SEPARATION) / 2;
    const HALF_H = (AMOUNTY * SEPARATION) / 2;
    // Gaussian sigma ≈ 460 in world units → wide, soft influence
    const SIGMA_SQ_2 = 2 * 460 * 460;
    const CUTOFF_DIST_SQ = 1600000; // beyond this, exp(-x) ≈ 0; skip calc

    const getSize = () => ({
      w: container.clientWidth,
      h: container.clientHeight,
    });
    let { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
    camera.position.set(0, 340, 1180);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - HALF_W,
          0,
          iy * SEPARATION - HALF_H,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x0a0a0a,
      size: 3.6,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    // Read --foreground token and drive material color so particles adapt to theme.
    const applyThemeColor = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      // expected "H S% L%"
      const m = raw.match(/^(-?\d*\.?\d+)\s+(-?\d*\.?\d+)%\s+(-?\d*\.?\d+)%$/);
      if (!m) return;
      const h = parseFloat(m[1]) / 360;
      const s = parseFloat(m[2]) / 100;
      const l = parseFloat(m[3]) / 100;
      material.color.setHSL(h, s, l);
      const isDark = document.documentElement.classList.contains("dark");
      material.opacity = isDark ? 0.55 : 0.8;
    };
    applyThemeColor();

    const themeObserver = new MutationObserver(applyThemeColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Pointer vs tilt: coarse-pointer devices (phones) have no cursor, so we
    // drive the ripple from deviceorientation instead.
    const isCoarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    const targetCursor = new THREE.Vector2(0, 0);
    const cursor = new THREE.Vector2(0, 0);
    let targetIntensity = 0;
    let intensity = 0;

    /* ---------- Desktop: cursor → world raycast ---------- */
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        targetIntensity = 0;
        return;
      }
      ndc.x = (x / rect.width) * 2 - 1;
      ndc.y = -((y / rect.height) * 2 - 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hitPoint)) {
        targetCursor.x = hitPoint.x;
        targetCursor.y = hitPoint.z;
        targetIntensity = 1;
      }
    };

    const handlePointerLeave = () => {
      targetIntensity = 0;
    };

    /* ---------- Mobile: device tilt (gamma=roll, beta=pitch) ---------- */
    let baselineBeta: number | null = null;
    let baselineGamma: number | null = null;
    const TILT_RANGE_DEG = 28; // ±28° from baseline maps to full ripple reach
    const MAX_X = HALF_W * 0.55; // don't push ripple past the visible area
    const MAX_Y = HALF_H * 0.55;
    const clamp = (v: number, a: number, b: number) =>
      v < a ? a : v > b ? b : v;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (baselineBeta === null || baselineGamma === null) {
        baselineBeta = e.beta;
        baselineGamma = e.gamma;
        return;
      }
      const dBeta = clamp((e.beta - baselineBeta) / TILT_RANGE_DEG, -1, 1);
      const dGamma = clamp((e.gamma - baselineGamma) / TILT_RANGE_DEG, -1, 1);
      // Gamma (left/right) → world X. Beta (forward/back) → world Z.
      targetCursor.x = dGamma * MAX_X;
      targetCursor.y = -dBeta * MAX_Y;
      targetIntensity = 1;
    };

    type DOEventCtor = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied" | "default">;
    };

    const enableOrientation = () => {
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
    };

    let iosPermissionPrompt: (() => void) | null = null;

    if (isCoarse) {
      const DOE = (typeof DeviceOrientationEvent !== "undefined"
        ? DeviceOrientationEvent
        : null) as DOEventCtor | null;

      if (DOE && typeof DOE.requestPermission === "function") {
        // iOS 13+ — permission must come from a user gesture, so attach
        // a one-shot touch listener that requests it and then hooks up.
        iosPermissionPrompt = () => {
          DOE.requestPermission!()
            .then((state) => {
              if (state === "granted") enableOrientation();
            })
            .catch(() => {
              /* user denied or context insecure — silently fall back */
            });
        };
        window.addEventListener("touchstart", iosPermissionPrompt, {
          once: true,
          passive: true,
        });
      } else {
        // Android / other: just listen, events flow without permission.
        enableOrientation();
      }
    } else {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("blur", handlePointerLeave);
    }

    let count = 0;
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      // Slow cursor lerp + intensity fade → buttery follow, no jitter
      cursor.x += (targetCursor.x - cursor.x) * 0.06;
      cursor.y += (targetCursor.y - cursor.y) * 0.06;
      intensity += (targetIntensity - intensity) * 0.05;

      const arr = geometry.attributes.position.array as Float32Array;
      const activeRipple = intensity > 0.002;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        const px = ix * SEPARATION - HALF_W;
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const ambient =
            Math.sin((ix + count) * 0.3) * 38 +
            Math.sin((iy + count) * 0.5) * 38;

          let ripple = 0;
          if (activeRipple) {
            const pz = iy * SEPARATION - HALF_H;
            const dx = px - cursor.x;
            const dz = pz - cursor.y;
            const distSq = dx * dx + dz * dz;
            if (distSq < CUTOFF_DIST_SQ) {
              const dist = Math.sqrt(distSq);
              const envelope = Math.exp(-distSq / SIGMA_SQ_2);
              // Concentric rings (water drop) + soft central bump, all enveloped
              ripple =
                (Math.sin(dist * 0.013 - count * 2.4) * 65 + envelope * 38) *
                envelope *
                intensity;
            }
          }

          arr[i * 3 + 1] = ambient + ripple;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.06;
    };

    const renderStatic = () => {
      renderer.render(scene, camera);
    };

    const onResize = () => {
      const next = getSize();
      w = next.w;
      h = next.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) renderStatic();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    if (prefersReducedMotion) {
      renderStatic();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      if (isCoarse) {
        window.removeEventListener("deviceorientation", handleOrientation);
        if (iosPermissionPrompt) {
          window.removeEventListener("touchstart", iosPermissionPrompt);
        }
      } else {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("blur", handlePointerLeave);
      }
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
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    />
  );
};

export default DottedSurface;
