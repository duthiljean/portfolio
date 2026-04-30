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
import { useQuery } from "@tanstack/react-query";
import esscaLogo from "@/assets/essca-logo.jpeg";
import moocCert from "@/assets/mooc-creative-box-cert.webp";
import anthropicLogo from "@/assets/anthropic-logo.png";
import competencesMetiersLogo from "@/assets/competences-metiers-logo.jpeg";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  fetchEducation,
  pickLocale,
  type Education as EducationDoc,
  type Certification,
  type Degree,
} from "@/lib/sanity";
import { fallbackEducation } from "@/lib/fallback-content";

const FALLBACK_LOGOS: Record<string, string> = {
  anthropic: anthropicLogo,
  mooc: esscaLogo,
  simple: competencesMetiersLogo,
};

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

const DegreeProgress = ({
  lang,
  startDate,
  endDate,
}: {
  lang: "fr" | "en";
  startDate?: string;
  endDate?: string;
}) => {
  const progress = useMemo(() => {
    const start = startDate ? new Date(startDate).getTime() : new Date(2024, 8, 1).getTime();
    const end = endDate ? new Date(endDate).getTime() : new Date(2027, 5, 30).getTime();
    const now = Date.now();
    return Math.min(1, Math.max(0, (now - start) / (end - start)));
  }, [startDate, endDate]);

  const pct = progress * 100;
  const done = progress >= 1;

  const formatDate = (d?: string, fallback?: string) => {
    if (!d) return fallback ?? "";
    const date = new Date(d);
    const month = date.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", {
      month: "short",
    });
    return `${month}. ${date.getFullYear()}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums mb-2.5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-foreground/60" />
          {formatDate(startDate, "Sept. 2024")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {formatDate(endDate, lang === "fr" ? "Juin 2027" : "June 2027")}
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

const DegreeCard = ({
  degree,
  lang,
}: {
  degree: Degree;
  lang: "fr" | "en";
}) => {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const kicker = pickLocale(degree.kicker, lang);
  const name = pickLocale(degree.name, lang);
  const durationLabel = pickLocale(degree.durationLabel, lang);
  const bdeLabel = pickLocale(degree.bdeLabel, lang);
  const logoSrc = degree.schoolLogo || esscaLogo;

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
      <div
        aria-hidden
        className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at top right, #000 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at top right, #000 0%, transparent 65%)",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
        <div className="flex items-start gap-4">
          <motion.img
            src={logoSrc}
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
              {kicker}
            </div>
            <h3 className="mt-2 text-xl md:text-2xl font-semibold text-foreground leading-tight tracking-[-0.025em]">
              {degree.schoolName}
            </h3>
            <p
              className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md"
              style={{ textWrap: "pretty" } as React.CSSProperties}
            >
              {name}
            </p>
          </div>
        </div>

        <div className="md:text-right shrink-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {lang === "fr" ? "Promotion" : "Class of"}
          </div>
          <div className="mt-1.5 text-3xl md:text-4xl font-semibold tabular-nums tracking-[-0.035em] leading-none text-foreground">
            {degree.datesLabel}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{durationLabel}</div>
        </div>
      </div>

      <div className="relative mt-7 md:mt-8 pt-6 border-t border-border">
        <DegreeProgress
          lang={lang}
          startDate={degree.startDate}
          endDate={degree.endDate}
        />
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-2">
        {bdeLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors group-hover:border-foreground/20">
            <Award size={11} className="text-foreground" />
            {bdeLabel}
          </span>
        )}
        {degree.location && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {degree.location}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const CertCard = ({
  cert,
  isOpen,
  onToggle,
  index,
  lang,
}: {
  cert: Certification;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  lang: "fr" | "en";
}) => {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  const logoSrc = cert.logo || FALLBACK_LOGOS[cert.kind];
  const expandable = cert.kind === "anthropic" || cert.kind === "mooc";
  const subCertsCount = cert.subCerts?.length ?? 0;

  const panelId = `cert-panel-${cert._key ?? index}`;
  const buttonId = `cert-button-${cert._key ?? index}`;

  const Header = (
    <div className="flex items-start gap-3">
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="shrink-0"
      >
        <img
          src={logoSrc}
          alt=""
          aria-hidden
          className="w-10 h-10 rounded-lg border border-border object-cover"
        />
      </motion.div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="text-sm font-semibold text-foreground leading-tight">
            {cert.name}
          </h4>
          {cert.verified && (
            <BadgeCheck
              size={13}
              className="text-foreground shrink-0"
              aria-label={lang === "fr" ? "Vérifié" : "Verified"}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">
          {pickLocale(cert.org, lang)}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {cert.kind === "anthropic" && subCertsCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-foreground text-background text-[11px] font-semibold tabular-nums">
            {subCertsCount}
          </span>
        )}
        {expandable && (
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
      {expandable ? (
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
        {isOpen && expandable && (
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

              {cert.kind === "anthropic" && cert.subCerts && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.subCerts.map((c, i) => (
                    <motion.a
                      key={c._key ?? c.title}
                      href={c.url}
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

              {cert.kind === "mooc" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  <img
                    src={cert.certImage || moocCert}
                    alt="Certificate"
                    loading="lazy"
                    className="w-full block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
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

const Education = () => {
  const { lang } = useLanguage();
  const [openCert, setOpenCert] = useState<string | null>(null);

  const { data: educationData } = useQuery<EducationDoc | null>({
    queryKey: ["education"],
    queryFn: fetchEducation,
  });

  const education = educationData ?? fallbackEducation;
  const title = pickLocale(education.title, lang);
  const dateline = pickLocale(education.dateline, lang);
  const certsLabel = pickLocale(education.certsLabel, lang);
  const certifications = education.certifications ?? [];

  return (
    <section
      id="education"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 section-alt-bg border-t border-border"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {title && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
              <span className="h-1 w-1 rounded-full bg-foreground/60" />
              {title}
            </div>
          )}
          {title && (
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
              {title}
            </h2>
          )}
          {dateline && (
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {dateline}
            </p>
          )}
        </motion.div>

        {education.degree && (
          <div className="mt-10 md:mt-14">
            <DegreeCard degree={education.degree} lang={lang as "fr" | "en"} />
          </div>
        )}

        {certifications.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 md:mt-10 flex items-baseline justify-between gap-4"
            >
              <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {certsLabel}
              </h3>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {certifications.length} ·{" "}
                {certifications.reduce((acc, c) => acc + (c.subCerts?.length ?? 1), 0)}{" "}
                {lang === "fr" ? "programmes" : "programs"}
              </span>
            </motion.div>

            <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {certifications.map((cert, i) => {
                const id = cert._key ?? String(i);
                return (
                  <CertCard
                    key={id}
                    cert={cert}
                    index={i}
                    isOpen={openCert === id}
                    onToggle={() => setOpenCert(openCert === id ? null : id)}
                    lang={lang as "fr" | "en"}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Education;
