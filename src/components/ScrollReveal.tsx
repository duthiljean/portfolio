import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type TargetAndTransition,
} from "framer-motion";

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale" | "rotate" | "blur";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: AnimationType;
}

const variants: Record<
  AnimationType,
  { initial: TargetAndTransition; animate: TargetAndTransition }
> = {
  "fade-up": {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -3, y: 20 },
    animate: { opacity: 1, rotate: 0, y: 0 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(8px)", y: 15 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
};

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  type = "fade-up",
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.08, margin: "0px 0px -40px 0px" });
  const v = variants[type];

  return (
    <motion.div
      ref={ref}
      initial={v.initial}
      animate={isInView ? v.animate : v.initial}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax wrapper — content moves at different speed than scroll
export const Parallax = ({
  children,
  className = "",
  speed = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

export default ScrollReveal;
