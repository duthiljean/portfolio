import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Sparkles,
  Rocket,
  LineChart,
  BadgeCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import claudeLogo from "@/assets/claude-logo.png";
import chatgptLogo from "@/assets/chatgpt-logo.png";
import vscodeLogo from "@/assets/vscode-logo.svg";
import geminiLogo from "@/assets/gemini-logo.jpeg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  fetchSkills,
  pickLocale,
  type SkillCategory,
  type SkillPill as SkillPillType,
  type SkillsSection,
} from "@/lib/sanity";
import { fallbackSkills } from "@/lib/fallback-content";

const pillLogos: Record<string, string> = {
  Claude: claudeLogo,
  ChatGPT: chatgptLogo,
  "VS Code": vscodeLogo,
  Gemini: geminiLogo,
};

const ICON_MAP = {
  sparkles: Sparkles,
  rocket: Rocket,
  lineChart: LineChart,
  badgeCheck: BadgeCheck,
} as const;

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

const useTilt = (max = 2) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), {
    stiffness: 140,
    damping: 18,
    mass: 0.5,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), {
    stiffness: 140,
    damping: 18,
    mass: 0.5,
  });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return { ref, rx, ry, onPointerMove, onPointerLeave };
};

const SkillPill = ({
  p,
  tooltip,
  isDaily,
  delay,
}: {
  p: SkillPillType;
  tooltip: string;
  isDaily: boolean;
  delay: number;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -40px 0px" }}
          transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -1 }}
          className="group/pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border bg-card text-foreground hover:border-foreground/40 hover:bg-secondary/60 transition-colors cursor-default select-none"
        >
          {p.name === "GitHub" ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-3.5 h-3.5 shrink-0 fill-current text-foreground transition-transform duration-200 group-hover/pill:scale-110"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          ) : pillLogos[p.name] ? (
            <img
              src={pillLogos[p.name]}
              alt=""
              className="w-3.5 h-3.5 rounded-sm shrink-0 transition-transform duration-200 group-hover/pill:scale-110"
              loading="lazy"
            />
          ) : null}
          {p.name}
          {isDaily && (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
          )}
        </motion.span>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent side="top" className="text-xs">
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

const DailyStackCard = ({
  tools,
  lang,
  legend,
}: {
  tools: NonNullable<SkillsSection["dailyStack"]>;
  lang: "fr" | "en";
  legend: string;
}) => {
  const { ref: spotRef, onPointerMove: onSpotMove } = useSpotlight<HTMLDivElement>();
  const { ref: tiltRef, rx, ry, onPointerMove: onTiltMove, onPointerLeave } = useTilt(2);

  return (
    <motion.div
      ref={tiltRef}
      onPointerMove={(e) => {
        onTiltMove(e);
        onSpotMove(e);
      }}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1200 }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div
        ref={spotRef}
        className="saas-card card-spotlight relative overflow-hidden p-5 md:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage: "radial-gradient(closest-side, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(closest-side, #000 30%, transparent 80%)",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
          <div className="flex items-start gap-3 md:max-w-[260px]">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-foreground text-background flex items-center justify-center">
              <Sparkles size={15} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {lang === "fr" ? "EN DIRECT" : "LIVE"}
              </div>
              <div className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">
                {lang === "fr" ? "Stack quotidien" : "Daily stack"}
              </div>
              <div className="mt-0.5 text-[12px] text-muted-foreground leading-snug">
                {lang === "fr"
                  ? "Outils utilisés chaque jour pour concevoir, coder et expédier."
                  : "Tools used daily to design, code and ship."}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-2.5 flex-1 md:max-w-[540px]">
            {tools.map((tool, i) => {
              const logo = tool.logo || pillLogos[tool.name];
              return (
                <Tooltip key={tool._key ?? tool.name}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.18 + i * 0.06,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ y: -2 }}
                      className="group/tool relative flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 hover:border-foreground/30 hover:bg-secondary/60 transition-colors cursor-default"
                    >
                      {logo && (
                        <img
                          src={logo}
                          alt=""
                          loading="lazy"
                          className="h-5 w-5 rounded-[5px] shrink-0 transition-transform duration-200 group-hover/tool:scale-110"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-foreground truncate">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate leading-tight">
                          {pickLocale(tool.use, lang)}
                        </div>
                      </div>
                      <BadgeCheck
                        size={12}
                        className="text-foreground/70 shrink-0"
                        strokeWidth={2.2}
                      />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {legend}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryCard = ({
  cat,
  index,
  lang,
  dailyToolNames,
  tooltips,
}: {
  cat: SkillCategory;
  index: number;
  lang: "fr" | "en";
  dailyToolNames: Set<string>;
  tooltips: Record<string, string>;
}) => {
  const Icon = ICON_MAP[cat.icon ?? "sparkles"] ?? Sparkles;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const pills = cat.pills ?? [];
  const dailyCount = pills.filter((p) => dailyToolNames.has(p.name)).length;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group/cat saas-card saas-card-hover card-spotlight p-6 md:p-7 flex flex-col relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
            className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center group-hover/cat:bg-foreground group-hover/cat:text-background transition-colors"
          >
            <Icon size={15} strokeWidth={2} />
          </motion.div>
          {cat.kicker && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.kicker}
            </div>
          )}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
          <span className="text-foreground">{pills.length}</span>
          {dailyCount > 0 && (
            <span className="ml-0.5 inline-flex items-center gap-0.5 text-emerald-600">
              · <span className="relative flex h-1 w-1"><span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" /></span>{dailyCount}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-base md:text-lg font-semibold tracking-tight text-foreground">
        {pickLocale(cat.title, lang)}
      </h3>

      <p
        className="mt-2 text-sm text-muted-foreground leading-relaxed"
        style={{ textWrap: "pretty" }}
      >
        {pickLocale(cat.description, lang)}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {pills.map((p, pi) => (
          <SkillPill
            key={p._key ?? p.name}
            p={p}
            tooltip={tooltips[p.tooltipType ?? "project"] ?? ""}
            isDaily={dailyToolNames.has(p.name)}
            delay={0.1 + pi * 0.03}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { lang } = useLanguage();
  const { data: skillsData } = useQuery<SkillsSection | null>({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const skills = skillsData ?? fallbackSkills;
  const categories = skills.categories ?? [];
  const dailyStack = skills.dailyStack ?? [];
  const dailyToolNames = new Set(dailyStack.map((t) => t.name));

  const tooltips: Record<string, string> = {
    daily: lang === "fr" ? "Usage quotidien" : "Daily use",
    project: lang === "fr" ? "Appliqué en projet" : "Applied in projects",
    operational: lang === "fr" ? "Expérience opérationnelle" : "Operational experience",
  };

  const kicker = pickLocale(skills.kicker, lang);
  const title = pickLocale(skills.title, lang);
  const subtitle = pickLocale(skills.subtitle, lang);
  const legend = pickLocale(skills.legend, lang);

  const totalTools = categories.reduce((acc, c) => acc + (c.pills?.length ?? 0), 0);

  return (
    <TooltipProvider delayDuration={200}>
      <section
        id="skills"
        className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 border-t border-border"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div className="max-w-2xl">
              {kicker && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
                  <span className="h-1 w-1 rounded-full bg-foreground/60" />
                  {kicker}
                </div>
              )}
              {title && (
                <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              <span className="tabular-nums text-foreground">{totalTools}</span>
              <span>{lang === "fr" ? `outils · ${categories.length} axes` : `tools · ${categories.length} axes`}</span>
            </div>
          </motion.div>

          {dailyStack.length > 0 && (
            <div className="mt-10 md:mt-12">
              <DailyStackCard tools={dailyStack} lang={lang as "fr" | "en"} legend={legend} />
            </div>
          )}

          <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat._key ?? i}
                cat={cat}
                index={i}
                lang={lang as "fr" | "en"}
                dailyToolNames={dailyToolNames}
                tooltips={tooltips}
              />
            ))}
          </div>

          {legend && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {legend}
            </motion.div>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
};

export default Skills;
