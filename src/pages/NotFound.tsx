import { lazy, Suspense, Component, type ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { CharReveal, ScrambleText, LineReveal } from "@/components/TextReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const ParticleField = lazy(() => import("@/components/ParticleField"));

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const NotFound = () => {
  const location = useLocation();
  const { lang } = useLanguage();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    console.error("404 — missing route:", location.pathname);
  }, [location.pathname]);

  const heading = lang === "fr" ? "Page introuvable" : "Page not found";
  const tagline =
    lang === "fr"
      ? "Cette route n'existe pas — ou plus. On rentre sur le chemin principal ?"
      : "This route doesn't exist — or not anymore. Shall we head back home?";
  const homeLabel = lang === "fr" ? "Retour à l'accueil" : "Back to home";
  const exploreLabel = lang === "fr" ? "Explorer le portfolio" : "Explore portfolio";

  return (
    <main className="min-h-[100svh] flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Ambient background — particle field or gradient */}
      {!prefersReduced ? (
        <WebGLErrorBoundary fallback={<div className="absolute inset-0 hero-gradient" />}>
          <Suspense fallback={<div className="absolute inset-0 hero-gradient" />}>
            <ParticleField />
          </Suspense>
        </WebGLErrorBoundary>
      ) : (
        <div className="absolute inset-0 hero-gradient" />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, hsl(var(--background)) 100%)",
        }}
      />

      <div className="container mx-auto text-center max-w-xl relative z-10">
        {/* Route pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur-md border border-border/60 text-[11px] font-medium text-muted-foreground mb-6"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" />
          </span>
          <code className="font-mono text-[11px]">{location.pathname}</code>
        </motion.div>

        {/* 404 — giant editorial display */}
        <h1 className="text-8xl sm:text-9xl md:text-[11rem] font-extrabold tracking-tight leading-none text-gradient">
          <CharReveal
            text="4"
            stagger={0.05}
            delay={0.1}
            className="font-display italic font-normal tracking-[-0.02em]"
          />
          <CharReveal text="0" stagger={0.05} delay={0.2} />
          <CharReveal
            text="4"
            stagger={0.05}
            delay={0.3}
            className="font-display italic font-normal tracking-[-0.02em]"
          />
        </h1>

        <LineReveal className="max-w-[140px] mx-auto my-6" delay={0.5} />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl sm:text-2xl font-semibold text-primary mb-3 tracking-tight"
        >
          <ScrambleText text={heading} delay={0.7} speed={25} />
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8"
          style={{ textWrap: "pretty" } as React.CSSProperties}
        >
          {tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <ArrowLeft
              size={15}
              className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
            />
            {homeLabel}
          </Link>
          <Link
            to="/#experience"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-semibold text-sm hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            <Compass
              size={15}
              className="shrink-0 group-hover:rotate-[20deg] transition-transform"
            />
            {exploreLabel}
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
