import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import addetectiveScreenshot from "@/assets/addetective-screenshot.webp";
import addetectiveLogo from "@/assets/addetective-logo.svg";
import { useLanguage } from "@/i18n/LanguageContext";

/* ─────────── Browser chrome frame ─────────── */
const BrowserFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full flex flex-col bg-card">
    {/* Chrome bar */}
    <div className="flex items-center gap-2 px-3 md:px-4 h-8 md:h-10 border-b border-border bg-card shrink-0">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-border" />
        <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-border" />
        <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-border" />
      </div>
      {/* URL bar */}
      <div className="flex-1 flex justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary border border-border px-2 py-0.5 md:py-1 text-[10px] md:text-[11px] font-medium text-muted-foreground">
          <Lock size={9} strokeWidth={2.4} />
          <span className="tabular-nums">addetective.fr</span>
        </div>
      </div>
      <div className="w-[38px]" aria-hidden />
    </div>
    {/* Viewport */}
    <div className="flex-1 overflow-hidden bg-secondary">{children}</div>
  </div>
);

/* ─────────── Scroll-reveal 3D card ─────────── */
const ContainerScroll = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    prefersReducedMotion || isMobile ? [0, 0, 0] : [14, 0, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    prefersReducedMotion ? [1, 1, 1] : [0.94, 1, 1],
  );

  return (
    <div ref={containerRef} className="relative" style={{ perspective: "1400px" }}>
      <ShowcaseCard rotate={rotate} scale={scale}>
        {children}
      </ShowcaseCard>
    </div>
  );
};

const ShowcaseCard = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        "0 50px 100px -25px hsl(0 0% 0% / 0.22), 0 18px 32px -12px hsl(0 0% 0% / 0.14)",
      transformStyle: "preserve-3d",
    }}
    className="mx-auto aspect-[16/10] md:aspect-auto md:h-[36rem] w-full max-w-6xl rounded-2xl md:rounded-[26px] border border-border bg-card overflow-hidden"
  >
    {children}
  </motion.div>
);

/* ─────────── Main section ─────────── */
const AddetectiveShowcase = () => {
  const { lang } = useLanguage();
  const metrics = [
    {
      label: lang === "fr" ? "Analyse" : "Analysis",
      value: "30s",
    },
    {
      label: lang === "fr" ? "Entrées" : "Inputs",
      value: lang === "fr" ? "Texte + photos" : "Text + photos",
    },
    {
      label: lang === "fr" ? "Sortie" : "Output",
      value: lang === "fr" ? "Score + négo" : "Score + deal room",
    },
  ];

  return (
    <section
      id="addetective-showcase"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 border-t border-border overflow-hidden"
    >
      {/* Subtle dot-grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {lang === "fr" ? "PROJET VEDETTE · EN PRODUCTION" : "FEATURED PROJECT · LIVE"}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex items-center justify-center gap-3"
          >
            <img
              src={addetectiveLogo}
              alt=""
              className="h-11 w-11 md:h-14 md:w-14 rounded-xl border border-border bg-card p-1.5 shadow-sm"
            />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
              addetective
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {lang === "fr"
              ? "L'IA qui analyse n'importe quelle annonce en 30 secondes — points de vigilance, incohérences et marge de négociation estimée."
              : "AI that reviews any listing in 30 seconds — red flags, inconsistencies and estimated negotiation margin."}
          </motion.p>
        </div>

        {/* 3D Browser-framed screenshot */}
        <div className="mt-12 md:mt-16">
          <ContainerScroll>
            <BrowserFrame>
              <img
                src={addetectiveScreenshot}
                alt="Interface addetective — page d'accueil"
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </BrowserFrame>
          </ContainerScroll>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border max-w-4xl mx-auto"
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-card px-4 py-4 text-center sm:text-left"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </div>
              <div className="mt-1 text-sm md:text-base font-semibold text-foreground">
                {metric.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Stack + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Stack
          </span>
          {["React", "TypeScript", "Supabase", "Tailwind", "Firecrawl"].map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {chip}
            </span>
          ))}
          <a
            href="https://addetective.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90 transition-colors ml-1"
          >
            {lang === "fr" ? "Voir le site" : "Visit site"}
            <ArrowUpRight
              size={12}
              strokeWidth={2.2}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AddetectiveShowcase;
