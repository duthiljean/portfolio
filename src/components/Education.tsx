import { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ArrowUpRight,
  GraduationCap,
  Award,
  BadgeCheck,
  Sparkle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import esscaLogo from "@/assets/essca-logo.jpeg";
import moocCert from "@/assets/mooc-creative-box-cert.webp";
import anthropicLogo from "@/assets/anthropic-logo.png";
import competencesMetiersLogo from "@/assets/competences-metiers-logo.jpeg";
import { useLanguage } from "@/i18n/LanguageContext";

/* ─────────── Sub-certifications ─────────── */
const anthropicCerts = [
  { title: "Claude 101", link: "https://verify.skilljar.com/c/3r3qkq4786i3" },
  { title: "Claude Code in Action", link: "https://verify.skilljar.com/c/fgsjkvmybimm" },
  { title: "Introduction to Claude Cowork", link: "https://verify.skilljar.com/c/5dmj2uzcgpku" },
];

/* ─────────── Spotlight hook ─────────── */
const useSpotlight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const onPointerMove = (e: React.PointerEvent<T>) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${x}%`);
    ref.current.style.setProperty("--my", `${y}%`);
  };
  return { ref, onPointerMove };
};

/* ─────────── Progress bar — animated degree timeline ─────────── */
const DegreeProgress = ({ lang }: { lang: "fr" | "en" }) => {
  const progress = useMemo(() => {
    const start = new Date(2023, 8, 1).getTime(); // Sept 1, 2023
    const end = new Date(2026, 5, 30).getTime(); // June 30, 2026
    const now = Date.now();
    return Math.min(1, Math.max(0, (now - start) / (end - start)));
  }, []);

  const pct = progress * 100;
  const done = progress >= 1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums mb-2.5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-foreground/60" />
          {lang === "fr" ? "Sept. 2023" : "Sept. 2023"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {lang === "fr" ? "Juin 2026" : "June 2026"}
          <span className="h-1 w-1 rounded-full bg-foreground/60" />
        </span>
      </div>

      <div className="relative h-1 rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-foreground"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.15, type: "spring", stiffness: 320, damping: 22 }}
          style={{ left: `${pct}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-foreground ring-[3px] ring-background" />
          </span>
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 1.3, duration: 0.3 }}
        className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground"
      >
        <span className="tabular-nums">
          {Math.round(pct)}% {lang === "fr" ? "complété" : "completed"}
        </span>
        <span className="inline-flex items-center gap-1 text-foreground font-medium">
          {done ? (
            <>
              <BadgeCheck size={11} />
              {lang === "fr" ? "Diplômé" : "Graduated"}
            </>
          ) : (
            <>
              <Sparkle size={10} className="fill-current" />
              {lang === "fr" ? "En cours" : "In progress"}
            </>
          )}
        </span>
      </motion.div>
    </div>
  );
};

/* ─────────── Degree card — full width hero ─────────── */
const DegreeCard = () => {
  const { t, lang } = useLanguage();
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="saas-card saas-card-hover card-spotlight group relative overflow-hidden p-6 md:p-8"
    >
      {/* Dot grid ambient */}
      <div
        aria-hidden
        className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 65%)",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
        {/* Left: school + degree */}
        <div className="flex items-start gap-4">
          <motion.img
            src={esscaLogo}
            alt=""
            aria-hidden
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-border shrink-0 object-cover"
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <GraduationCap
                size={11}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />
              {t("edu.degree_kicker")}
            </div>
            <h3 className="mt-2 text-xl md:text-2xl font-semibold text-foreground leading-tight tracking-[-0.025em]">
              ESSCA School of Management
            </h3>
            <p
              className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md"
              style={{ textWrap: "pretty" } as React.CSSProperties}
            >
              {t("edu.degree")}
            </p>
          </div>
        </div>

        {/* Right: dates */}
        <div className="md:text-right shrink-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {lang === "fr" ? "Promotion" : "Class of"}
          </div>
          <div className="mt-1.5 text-3xl md:text-4xl font-semibold tabular-nums tracking-[-0.035em] leading-none text-foreground">
            {t("edu.dates")}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {lang === "fr" ? "Bachelor · 3 ans" : "Bachelor · 3 years"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mt-7 md:mt-8 pt-6 border-t border-border">
        <DegreeProgress lang={lang as "fr" | "en"} />
      </div>

      {/* BDE footer chip */}
      <div className="relative mt-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors group-hover:border-foreground/20">
          <Award size={11} className="text-foreground" />
          {t("edu.bde")}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          Bordeaux, FR
        </span>
      </div>
    </motion.div>
  );
};

/* ─────────── Certification card ─────────── */
type CertKind = "anthropic" | "mooc" | "ai";

const CertCard = ({
  kind,
  isOpen,
  onToggle,
  index,
}: {
  kind: CertKind;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const { t, lang } = useLanguage();
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  const config = {
    anthropic: {
      logo: anthropicLogo,
      name: "Anthropic",
      org: t("edu.anthropic.count"),
      badge: { label: "3", tone: "foreground" as const },
      verified: true,
      expandable: true,
    },
    mooc: {
      logo: esscaLogo,
      name: "MOOC Creative Box",
      org: t("edu.mooc.org"),
      badge: null,
      verified: true,
      expandable: true,
    },
    ai: {
      logo: competencesMetiersLogo,
      name: "AI Training — Prompt Engineering",
      org: t("edu.ai.org"),
      badge: null,
      verified: false,
      expandable: false,
    },
  }[kind];

  const panelId = `cert-panel-${kind}`;
  const buttonId = `cert-button-${kind}`;

  const Header = (
    <div className="flex items-start gap-3">
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="shrink-0"
      >
        <img
          src={config.logo}
          alt=""
          aria-hidden
          className="w-10 h-10 rounded-lg border border-border object-cover"
        />
      </motion.div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="text-sm font-semibold text-foreground leading-tight">
            {config.name}
          </h4>
          {config.verified && (
            <BadgeCheck
              size={13}
              className="text-foreground shrink-0"
              aria-label={lang === "fr" ? "Vérifié" : "Verified"}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">
          {config.org}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {config.badge && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-foreground text-background text-[11px] font-semibold tabular-nums">
            {config.badge.label}
          </span>
        )}
        {config.expandable && (
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
              color: isOpen
                ? "hsl(var(--foreground))"
                : "hsl(var(--muted-foreground) / 0.6)",
            }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <ChevronDown size={15} />
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`saas-card card-spotlight group relative transition-[border-color,box-shadow] duration-300 ${
        isOpen
          ? "border-foreground/20 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
          : "saas-card-hover"
      }`}
    >
      {config.expandable ? (
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full text-left p-5"
        >
          {Header}
        </button>
      ) : (
        <div className="p-5">{Header}</div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && config.expandable && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.22, delay: 0.08 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.22, ease: [0.55, 0.085, 0.68, 0.53] },
                opacity: { duration: 0.1 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px bg-border mb-4" />

              {kind === "anthropic" && (
                <div className="flex flex-wrap gap-1.5">
                  {anthropicCerts.map((c, i) => (
                    <motion.a
                      key={c.title}
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.15 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group/chip inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-border bg-card text-foreground hover:border-foreground/30 hover:-translate-y-px transition-all duration-200"
                    >
                      {c.title}
                      <ArrowUpRight
                        size={10}
                        className="shrink-0 transition-transform duration-200 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5"
                      />
                    </motion.a>
                  ))}
                </div>
              )}

              {kind === "mooc" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  <img
                    src={moocCert}
                    alt="MOOC Creative Box certificate"
                    loading="lazy"
                    className="w-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────── Education section ─────────── */
const Education = () => {
  const { t, lang } = useLanguage();
  const [openCert, setOpenCert] = useState<string | null>(null);

  const certs: CertKind[] = ["anthropic", "mooc", "ai"];

  return (
    <section
      id="education"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 section-alt-bg border-t border-border"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
            <span className="h-1 w-1 rounded-full bg-foreground/60" />
            {t("edu.title")}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
            {t("edu.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {t("edu.dateline")}
          </p>
        </motion.div>

        {/* Degree hero card */}
        <div className="mt-10 md:mt-14">
          <DegreeCard />
        </div>

        {/* Certifications header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-10 flex items-baseline justify-between gap-4"
        >
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t("edu.certs")}
          </h3>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {certs.length} · 5 {lang === "fr" ? "programmes" : "programs"}
          </span>
        </motion.div>

        {/* Cert grid */}
        <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {certs.map((kind, i) => (
            <CertCard
              key={kind}
              kind={kind}
              index={i}
              isOpen={openCert === kind}
              onToggle={() => setOpenCert(openCert === kind ? null : kind)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
