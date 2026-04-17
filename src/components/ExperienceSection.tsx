import { useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { track } from "@vercel/analytics";
import { experiences } from "./experienceData";
import { useLanguage } from "@/i18n/LanguageContext";

const expKeys = [
  "roofwander",
  "addetective",
  "adayboat",
  "zeboat",
  "bde",
  "coquille",
  "armees",
];

type FilterId = "all" | "pro" | "project" | "asso";

const categoryOf = (rawType: string): Exclude<FilterId, "all"> => {
  const type = rawType.toLowerCase();
  if (
    type.includes("stage") ||
    type.includes("internship") ||
    type.includes("cdd") ||
    type.includes("fixed-term")
  )
    return "pro";
  if (
    type.includes("projet") ||
    type.includes("project") ||
    type.includes("indépendant") ||
    type.includes("freelance")
  )
    return "project";
  return "asso";
};

/* ─────────── Spotlight hook (no tilt — expandable cards) ─────────── */
const useSpotlight = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${x}%`);
    ref.current.style.setProperty("--my", `${y}%`);
  };
  return { ref, onPointerMove };
};

/* ─────────── ExperienceCard ─────────── */
const ExperienceCard = ({
  exp,
  expKey,
  isOpen,
  onToggle,
  index,
}: {
  exp: (typeof experiences)[0];
  expKey: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const { t } = useLanguage();
  const { ref, onPointerMove } = useSpotlight();

  const title = t(`exp.${expKey}.title`);
  const type = t(`exp.${expKey}.type`);
  const dates = t(`exp.${expKey}.dates`);
  const location = t(`exp.${expKey}.location`);
  const description = t(`exp.${expKey}.description`);
  const isCurrent = dates.includes("Présent") || dates.includes("Present");

  const badges = exp.badges.map((b, i) => ({
    ...b,
    label: t(`exp.${expKey}.badge${i + 1}`) || b.label,
  }));

  const panelId = `exp-panel-${expKey}`;
  const buttonId = `exp-button-${expKey}`;

  // Split description: first line = summary, "→" lines = bullets
  const lines = description.split("\n");
  const summary = !lines[0]?.startsWith("→") ? lines[0] : null;
  const bullets = lines
    .slice(summary ? 1 : 0)
    .filter((l) => l.startsWith("→"))
    .map((l) => l.slice(1).trim());

  return (
    <motion.div
      layout="position"
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2 },
      }}
      className={`saas-card card-spotlight group relative transition-[border-color,box-shadow] duration-300 ${
        isOpen
          ? "border-foreground/20 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
          : "saas-card-hover"
      }`}
    >
      {/* Active accent — 2px left bar on current role */}
      {isCurrent && (
        <span
          aria-hidden
          className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-foreground"
        />
      )}

      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative w-full text-left p-5 md:p-6 flex items-start gap-4 cursor-pointer"
      >
        {/* Logo with hover scale */}
        <div className="relative w-10 h-10 shrink-0">
          {exp.logo ? (
            <motion.img
              src={exp.logo}
              alt=""
              aria-hidden
              loading="lazy"
              className="w-10 h-10 rounded-lg border border-border object-cover"
              whileHover={{ scale: 1.06 }}
              animate={{ scale: isOpen ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted border border-border" aria-hidden />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight">
                  {title}
                </h3>
                {isCurrent && (
                  <span
                    className="relative flex h-1.5 w-1.5 shrink-0"
                    aria-label={t("exp.current")}
                  >
                    <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-foreground/75 font-medium">{exp.company}</span>
                <span className="mx-1.5 text-border">·</span>
                <span>{location}</span>
              </p>

              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-medium bg-muted text-foreground">
                  {type}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {dates}
                </span>
              </div>
            </div>

            <motion.div
              animate={{
                rotate: isOpen ? 180 : 0,
                color: isOpen ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.6)",
              }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="shrink-0 mt-1"
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
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
            <div className="px-5 md:px-6 pb-6 md:pb-7 pl-16 md:pl-[68px]">
              <div className="h-px bg-border mb-5" />

              {/* Summary — stands out */}
              {summary && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm md:text-[15px] font-medium text-foreground leading-relaxed mb-4"
                >
                  {summary}
                </motion.p>
              )}

              {/* Bullets — staggered arrow list */}
              {bullets.length > 0 && (
                <ul className="space-y-2">
                  {bullets.map((b, li) => (
                    <motion.li
                      key={li}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.18 + li * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex gap-2.5 items-start text-sm text-muted-foreground leading-relaxed"
                    >
                      <span
                        className="text-foreground shrink-0 mt-[3px] text-xs"
                        aria-hidden
                      >
                        →
                      </span>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {exp.image && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.2 + bullets.length * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-4 overflow-hidden rounded-lg border border-border"
                >
                  <img
                    src={exp.image}
                    alt={exp.company}
                    loading="lazy"
                    className="w-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]"
                  />
                </motion.div>
              )}

              {/* Footer: badges + site link */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.26 + bullets.length * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-wrap gap-1.5 mt-4 items-center"
              >
                {badges.map((b) =>
                  b.link ? (
                    <a
                      key={b.label}
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border border-border bg-card text-foreground hover:border-foreground/30 hover:-translate-y-px transition-all duration-200"
                    >
                      {b.label}
                      <ArrowUpRight size={10} className="shrink-0" />
                    </a>
                  ) : (
                    <span
                      key={b.label}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                    >
                      {b.label}
                    </span>
                  ),
                )}

                {exp.siteUrl && (
                  <a
                    href={exp.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("project_link_clicked", { target: exp.company })}
                    className="inline-flex items-center gap-1 ml-1 text-[11px] font-medium text-foreground group/link"
                  >
                    <MapPin size={11} />
                    <span className="underline-offset-2 group-hover/link:underline">
                      {exp.company}
                    </span>
                    <ArrowUpRight
                      size={11}
                      className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────── FilterTabs ─────────── */
const FilterTabs = ({
  filter,
  setFilter,
  counts,
  labels,
}: {
  filter: FilterId;
  setFilter: (f: FilterId) => void;
  counts: Record<FilterId, number>;
  labels: Record<FilterId, string>;
}) => {
  const ids: FilterId[] = ["all", "pro", "project", "asso"];

  return (
    <div
      role="tablist"
      aria-label="Filter experiences"
      className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm"
    >
      {ids.map((id) => {
        const active = filter === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => setFilter(id)}
            className="relative z-0 px-3 md:px-3.5 py-1.5 text-[11px] md:text-xs font-medium transition-colors duration-200"
          >
            {active && (
              <motion.span
                layoutId="exp-filter-pill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 bg-foreground rounded-full -z-10"
              />
            )}
            <span
              className={`relative inline-flex items-center gap-1.5 ${
                active ? "text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels[id]}
              <span
                className={`tabular-nums text-[10px] ${
                  active ? "text-background/60" : "text-muted-foreground/60"
                }`}
              >
                {counts[id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ─────────── ExperienceSection ─────────── */
const ExperienceSection = () => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState<FilterId>("all");
  const [openKey, setOpenKey] = useState<string | null>(expKeys[0]);

  const enriched = useMemo(
    () =>
      experiences.map((exp, idx) => {
        const key = expKeys[idx];
        const type = t(`exp.${key}.type`);
        return { exp, key, type, category: categoryOf(type) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );

  const counts: Record<FilterId, number> = useMemo(
    () => ({
      all: enriched.length,
      pro: enriched.filter((e) => e.category === "pro").length,
      project: enriched.filter((e) => e.category === "project").length,
      asso: enriched.filter((e) => e.category === "asso").length,
    }),
    [enriched],
  );

  const labels: Record<FilterId, string> = {
    all: lang === "fr" ? "Tous" : "All",
    pro: "Pro",
    project: lang === "fr" ? "Projets" : "Projects",
    asso: lang === "fr" ? "Assos" : "Orgs",
  };

  const visible = enriched.filter(
    (e) => filter === "all" || e.category === filter,
  );

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 border-t border-border"
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
            {t("exp.title")}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
            {t("exp.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {experiences.length} {t("exp.entries_label")}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-10"
        >
          <LayoutGroup id="exp-filter">
            <FilterTabs
              filter={filter}
              setFilter={setFilter}
              counts={counts}
              labels={labels}
            />
          </LayoutGroup>
        </motion.div>

        {/* Cards — animated reordering on filter change */}
        <LayoutGroup id="exp-list">
          <motion.div className="mt-6 md:mt-8 flex flex-col gap-2.5 md:gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map(({ exp, key }, idx) => (
                <ExperienceCard
                  key={key}
                  exp={exp}
                  expKey={key}
                  index={idx}
                  isOpen={openKey === key}
                  onToggle={() => setOpenKey(openKey === key ? null : key)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {visible.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            {lang === "fr" ? "Aucune expérience dans ce filtre." : "No experience in this filter."}
          </p>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
