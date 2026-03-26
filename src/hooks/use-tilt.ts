import { useState, useCallback, useEffect, useRef } from "react";

export const useTilt = (maxTilt = 6) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch || !ref.current) return;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const rect = ref.current!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = ((e.clientY - cy) / (rect.height / 2)) * -maxTilt;
        const y = ((e.clientX - cx) / (rect.width / 2)) * maxTilt;
        setTilt({
          x: Math.max(-maxTilt, Math.min(maxTilt, x)),
          y: Math.max(-maxTilt, Math.min(maxTilt, y)),
        });
      });
    },
    [isTouch, maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return { ref, tilt, onMouseMove, onMouseLeave, isTouch };
};
