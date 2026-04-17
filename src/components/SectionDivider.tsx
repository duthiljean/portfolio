import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionDividerProps {
  from?: string;
  to?: string;
  flip?: boolean;
}

const SectionDivider = ({ from = "background", to = "section-alt", flip = false }: SectionDividerProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8]);
  const scaleX = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <div ref={ref} className="relative h-16 md:h-24 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px mx-auto max-w-lg"
        style={{ opacity, scaleX }}
      >
        <div
          className={`h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent ${
            flip ? "rotate-180" : ""
          }`}
        />
      </motion.div>
    </div>
  );
};

export default SectionDivider;
