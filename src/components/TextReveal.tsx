import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// Character-by-character reveal with stagger
export const CharReveal = ({
  text,
  className = "",
  delay = 0,
  stagger = 0.02,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const chars = text.split("");

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Mask reveal — text slides up from behind a clip
export const MaskReveal = ({
  children,
  className = "",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : {}}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Scramble text effect — characters randomly change before settling
export const ScrambleText = ({
  text,
  className = "",
  delay = 0,
  speed = 30,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || hasRun.current) return;
    hasRun.current = true;

    const timeout = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < iteration) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        iteration += 1 / 3;
        if (iteration >= text.length) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

// Horizontal line reveal
export const LineReveal = ({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0.5 }}
      />
    </div>
  );
};
