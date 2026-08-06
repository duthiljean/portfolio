import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Lock, Link2, Braces, Quote, ShieldCheck } from "lucide-react";
import cleoScreenshot from "@/assets/cleo-screenshot.jpg";
import cleoLogo from "@/assets/cleo-logo.png";
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
          <span className="tabular-nums">monlivretcleo.fr</span>
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

/* ─────────── Generation pipeline ─────────── */
const PipelineStep = ({
  icon: Icon,
  step,
  title,
  detail,
  index,
}: {
  icon: typeof Link2;
  step: string;
  title: string;
  detail: string;
  index: number;
}) => (
  <motion.li
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-card p-5 md:p-6 transition-colors duration-300 hover:bg-muted/40"
  >
    <div className="flex items-center justify-between gap-2">
      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center transition-colors group-hover:bg-foreground group-hover:text-background">
        <Icon size={14} strokeWidth={2} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums uppercase tracking-wider text-muted-foreground">
        {step}
      </span>
    </div>
    <div className="mt-4 text-sm font-semibold text-foreground leading-tight tracking-[-0.01em]">
      {title}
    </div>
    <p
      className="mt-1.5 text-xs text-muted-foreground leading-relaxed"
      style={{ textWrap: "pretty" } as React.CSSProperties}
    >
      {detail}
    </p>
  </motion.li>
);

/* ─────────── Main section ─────────── */
const CleoShowcase = () => {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  const metrics = [
    { label: fr ? "Livrets créés" : "Booklets created", value: "150+" },
    { label: "Trustpilot", value: fr ? "4,4/5" : "4.4/5" },
    { label: fr ? "Accès voyageur" : "Guest access", value: fr ? "Lien ou QR" : "Link or QR" },
    { label: fr ? "Publication" : "Publishing", value: fr ? "29 € à vie" : "€29 lifetime" },
  ];

  const pipeline = [
    {
      icon: Link2,
      step: "01",
      title: fr ? "L'annonce" : "The listing",
      detail: fr
        ? "L'hôte colle son URL Airbnb, Booking ou Abritel. Récupération de la page via Apify."
        : "The host pastes an Airbnb, Booking or Abritel URL. The page is fetched through Apify.",
    },
    {
      icon: Braces,
      step: "02",
      title: fr ? "Mapping déterministe" : "Deterministic mapping",
      detail: fr
        ? "Photos, équipements, horaires et règles sont extraits par des règles, sans modèle. Pas d'IA là où du code suffit."
        : "Photos, amenities, hours and rules are extracted by rules, no model involved. No AI where plain code does the job.",
    },
    {
      icon: Quote,
      step: "03",
      title: fr ? "LLM sous contrainte" : "Constrained LLM",
      detail: fr
        ? "Le modèle rédige les consignes, mais chaque phrase doit être accompagnée d'un extrait exact de l'annonce source."
        : "The model writes the instructions, but every sentence must carry an exact excerpt from the source listing.",
    },
    {
      icon: ShieldCheck,
      step: "04",
      title: fr ? "Vérification serveur" : "Server-side check",
      detail: fr
        ? "Le serveur recherche l'extrait dans la source. Introuvable ? La consigne est jetée, pas publiée."
        : "The server looks the excerpt up in the source. Not found? The instruction is dropped, never published.",
    },
  ];

  return (
    <section
      id="cleo"
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
            {fr ? "PRODUIT EN LIGNE · UTILISÉ EN VRAI" : "LIVE PRODUCT · REAL USERS"}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex items-center justify-center gap-3"
          >
            <img
              src={cleoLogo}
              alt=""
              className="h-11 w-11 md:h-14 md:w-14 rounded-xl border border-border bg-card p-1.5 shadow-sm object-contain"
            />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
              Cléo
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
            {fr
              ? "Le livret d'accueil numérique des hôtes et des conciergeries. On colle une annonce, le livret se remplit — sans qu'un modèle invente un code d'accès."
              : "The digital welcome book for hosts and property managers. Paste a listing, the booklet fills itself — without a model inventing a door code."}
          </motion.p>
        </div>

        {/* 3D Browser-framed screenshot */}
        <div className="mt-12 md:mt-16">
          <ContainerScroll>
            <BrowserFrame>
              <img
                src={cleoScreenshot}
                alt={
                  fr
                    ? "Page d'accueil de Cléo avec l'aperçu d'un livret côté voyageur"
                    : "Cléo landing page with a guest-facing booklet preview"
                }
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </BrowserFrame>
          </ContainerScroll>
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-8 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border max-w-4xl mx-auto"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-card px-4 py-4 text-center sm:text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </div>
              <div className="mt-1 text-sm md:text-base font-semibold text-foreground">
                {metric.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Generation pipeline — the interesting part */}
        <div className="mt-14 md:mt-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
              <span className="h-1 w-1 rounded-full bg-foreground/60" />
              {fr ? "Sous le capot" : "Under the hood"}
            </div>
            <h3 className="text-2xl md:text-[2rem] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              {fr
                ? "Un livret ne peut pas inventer un code d'accès."
                : "A booklet cannot invent a door code."}
            </h3>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {fr
                ? "Un hôte qui publie une consigne fausse, c'est un voyageur bloqué devant une porte à 23h. La génération est donc construite pour refuser d'écrire ce qu'elle ne peut pas prouver."
                : "A wrong instruction means a guest stuck outside at 11pm. So the generation pipeline is built to refuse anything it cannot prove."}
            </p>
          </motion.div>

          <ol className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {pipeline.map((s, i) => (
              <PipelineStep key={s.step} {...s} index={i} />
            ))}
          </ol>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-[13px] text-muted-foreground leading-relaxed"
          >
            {fr
              ? "Côté voyageur, un assistant répond aux questions à partir du seul contenu du livret, avec un routage d'intention multilingue — pas d'embeddings, inutiles à cette échelle."
              : "On the guest side, an assistant answers questions from the booklet content only, with multilingual intent routing — no embeddings, they earn nothing at this scale."}
          </motion.p>
        </div>

        {/* Stack + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Stack
          </span>
          {["React", "TypeScript", "Supabase", "Stripe", "Apify", "Claude"].map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {chip}
            </span>
          ))}
          <a
            href="https://monlivretcleo.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90 transition-colors ml-1"
          >
            {fr ? "Voir le site" : "Visit site"}
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

export default CleoShowcase;
