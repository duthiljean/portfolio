import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Linkedin, ArrowDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

const DottedSurface = lazy(() =>
  import("./DottedSurface").then((m) => ({ default: m.DottedSurface })),
);

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

const RoleCarousel = () => {
  const { t } = useLanguage();
  const roles = [t("hero.role1"), t("hero.role2"), t("hero.role3")];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="h-7 relative overflow-hidden inline-block min-w-[180px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 text-sm md:text-base font-medium text-foreground"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center px-5 md:px-8 pt-24 pb-16 overflow-hidden"
    >
      {/* WebGL dotted surface — ambient, scoped to Hero */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, #000 0%, #000 55%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, #000 0%, #000 55%, transparent 95%)",
        }}
      >
        <WebGLErrorBoundary>
          <Suspense
            fallback={
              <div
                className="absolute inset-0 dot-grid-bg opacity-30"
              />
            }
          >
            <DottedSurface />
          </Suspense>
        </WebGLErrorBoundary>
      </div>

      <div className="container mx-auto max-w-4xl relative">
        <div className="flex flex-col items-center text-center">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {t("hero.badge")}
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-border shadow-sm">
              <img
                src="/jean-duthil-photo.jpg"
                alt="Jean Duthil"
                loading="eager"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1] text-foreground"
          >
            Jean Duthil
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-muted-foreground flex items-center gap-1.5 text-sm md:text-base"
          >
            <RoleCarousel />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {t("hero.dateline")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="shimmer-border h-11 px-5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium gap-2 shadow-sm"
            >
              <Mail size={15} />
              {t("hero.cta2")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-11 px-5 rounded-full border-border bg-card hover:bg-muted hover:text-foreground text-foreground text-sm font-medium gap-1.5"
            >
              {t("hero.cta1")}
              <ArrowRight size={15} />
            </Button>
          </motion.div>

          {/* Social inline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex items-center gap-5 text-xs text-muted-foreground"
          >
            <a
              href="https://linkedin.com/in/duthiljean"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Linkedin size={13} />
              LinkedIn
            </a>
            <span className="w-px h-3 bg-border" aria-hidden />
            <a
              href="mailto:jean.duthil13@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Mail size={13} />
              jean.duthil13@gmail.com
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.a
            href="#about"
            aria-label="Scroll to about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 1 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            }}
            className="mt-14 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <ArrowDown size={18} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
