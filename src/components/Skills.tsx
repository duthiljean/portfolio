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
  ArrowUpRight,
} from "lucide-react";
import claudeLogo from "@/assets/claude-logo.png";
import chatgptLogo from "@/assets/chatgpt-logo.png";
import cursorLogo from "@/assets/cursor-logo.png";
import geminiLogo from "@/assets/gemini-logo.jpeg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/i18n/LanguageContext";

/* ─────────── Logo map ─────────── */
const pillLogos: Record<string, string> = {
  Claude: claudeLogo,
  ChatGPT: chatgptLogo,
  Cursor: cursorLogo,
  Gemini: geminiLogo,
};

const dailyUseTools = new Set(["Claude", "ChatGPT", "Cursor", "Gemini"]);

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

/* ─────────── Tilt hook (subtle 3D) ─────────── */
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

/* ─────────── Types ─────────── */
type PillData = { name: string; tooltip: string };
type Category = {
  title: string;
  description: string;
  icon: typeof Sparkles;
  pills: PillData[];
  kicker: string;
};

/* ─────────── Skill pill ─────────── */
const SkillPill = ({
  p,
  isDaily,
  delay,
}: {
  p: PillData;
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
          {pillLogos[p.name] && (
            <img
              src={pillLogos[p.name]}
              alt=""
              className="w-3.5 h-3.5 rounded-sm shrink-0 transition-transform duration-200 group-hover/pill:scale-110"
              loading="lazy"
            />
          )}
          {p.name}
          {isDaily && (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
          )}
        </motion.span>
      </TooltipTrigger>
      {p.tooltip && (
        <TooltipContent side="top" className="text-xs">
          {p.tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

/* ─────────── Daily stack featured rail ─────────── */
const DailyStackCard = () => {
  const { ref: spotRef, onPointerMove: onSpotMove } = useSpotlight<HTMLDivElement>();
  const { ref: tiltRef, rx, ry, onPointerMove: onTiltMove, onPointerLeave } = useTilt(2);

  const dailyTools = [
    { name: "Claude", logo: claudeLogo, use: "Raisonnement & code" },
    { name: "ChatGPT", logo: chatgptLogo, use: "Recherche & idées" },
    { name: "Gemini", logo: geminiLogo, use: "Analyse & synthèse" },
    { name: "Cursor", logo: cursorLogo, use: "Éditeur IA" },
  ];

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
        {/* Dot-grid mask top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(closest-side, #000 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, #000 30%, transparent 80%)",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
          {/* Label side */}
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
                EN DIRECT
              </div>
              <div className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">
                Stack quotidien
              </div>
              <div className="mt-0.5 text-[12px] text-muted-foreground leading-snug">
                Outils utilisés chaque jour pour concevoir, coder et expédier.
              </div>
            </div>
          </div>

          {/* Logo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-2.5 flex-1 md:max-w-[540px]">
            {dailyTools.map((tool, i) => (
              <Tooltip key={tool.name}>
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
                    <img
                      src={tool.logo}
                      alt=""
                      loading="lazy"
                      className="h-5 w-5 rounded-[5px] shrink-0 transition-transform duration-200 group-hover/tool:scale-110"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-foreground truncate">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate leading-tight">
                        {tool.use}
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
                  Usage quotidien
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────── Category card ─────────── */
const CategoryCard = ({
  cat,
  index,
}: {
  cat: Category;
  index: number;
}) => {
  const Icon = cat.icon;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const dailyCount = cat.pills.filter((p) => dailyUseTools.has(p.name)).length;

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
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
            className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center group-hover/cat:bg-foreground group-hover/cat:text-background transition-colors"
          >
            <Icon size={15} strokeWidth={2} />
          </motion.div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {cat.kicker}
          </div>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
          <span className="text-foreground">{cat.pills.length}</span>
          {dailyCount > 0 && (
            <span className="ml-0.5 inline-flex items-center gap-0.5 text-emerald-600">
              · <span className="relative flex h-1 w-1"><span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" /></span>{dailyCount}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-base md:text-lg font-semibold tracking-tight text-foreground">
        {cat.title}
      </h3>

      <p
        className="mt-2 text-sm text-muted-foreground leading-relaxed"
        style={{ textWrap: "pretty" }}
      >
        {cat.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {cat.pills.map((p, pi) => (
          <SkillPill
            key={p.name}
            p={p}
            isDaily={dailyUseTools.has(p.name)}
            delay={0.1 + pi * 0.03}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────── Main Skills section ─────────── */
const Skills = () => {
  const { t } = useLanguage();

  const tooltipDaily = t("skills.tooltip.daily");
  const tooltipProject = t("skills.tooltip.project");
  const tooltipOp = t("skills.tooltip.operational");

  const categories: Category[] = [
    {
      title: t("skills.cat1.title"),
      description: t("skills.cat1.desc"),
      icon: Sparkles,
      kicker: "AXE 01",
      pills: [
        { name: "Claude", tooltip: tooltipDaily },
        { name: "ChatGPT", tooltip: tooltipDaily },
        { name: "Gemini", tooltip: tooltipDaily },
        { name: "Cursor", tooltip: tooltipDaily },
        { name: "Claude Code", tooltip: tooltipProject },
        { name: "Prompt Engineering", tooltip: tooltipProject },
      ],
    },
    {
      title: t("skills.cat2.title"),
      description: t("skills.cat2.desc"),
      icon: Rocket,
      kicker: "AXE 02",
      pills: [
        { name: "Business Dev", tooltip: tooltipOp },
        { name: "Growth Hacking", tooltip: tooltipProject },
        { name: "Partnerships B2B", tooltip: tooltipOp },
        { name: "CRM", tooltip: tooltipProject },
        { name: "SEO", tooltip: tooltipProject },
        { name: "Acquisition", tooltip: tooltipOp },
      ],
    },
    {
      title: t("skills.cat3.title"),
      description: t("skills.cat3.desc"),
      icon: LineChart,
      kicker: "AXE 03",
      pills: [
        { name: t("skills.pill.saas"), tooltip: tooltipProject },
        { name: "Product Thinking", tooltip: tooltipProject },
        { name: "No-code", tooltip: tooltipProject },
        { name: "Data Analysis", tooltip: tooltipProject },
      ],
    },
  ];

  const totalTools = categories.reduce((acc, c) => acc + c.pills.length, 0);

  return (
    <TooltipProvider delayDuration={200}>
      <section
        id="skills"
        className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 border-t border-border"
      >
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
                <span className="h-1 w-1 rounded-full bg-foreground/60" />
                {t("skills.kicker")}
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
                {t("skills.title")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {t("skills.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              <span className="tabular-nums text-foreground">
                {totalTools}
              </span>
              <span>outils · 3 axes</span>
            </div>
          </motion.div>

          {/* Daily stack featured rail */}
          <div className="mt-10 md:mt-12">
            <DailyStackCard />
          </div>

          {/* Category cards */}
          <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.title} cat={cat} index={i} />
            ))}
          </div>

          {/* Legend */}
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
            {t("skills.legend")}
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default Skills;
