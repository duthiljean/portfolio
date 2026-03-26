import { Bot, Rocket, Lightbulb } from "lucide-react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
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
import { useTilt } from "@/hooks/use-tilt";

const pillLogos: Record<string, string> = {
  Claude: claudeLogo,
  ChatGPT: chatgptLogo,
  Cursor: cursorLogo,
  Gemini: geminiLogo,
};

const dailyUseTools = new Set(["Claude", "ChatGPT", "Cursor", "Gemini"]);

type Pill = { name: string; tooltip: string };
type Category = {
  title: string;
  description: string;
  icon: React.ElementType;
  pills: Pill[];
};

const CategoryCard = ({ cat, index }: { cat: Category; index: number }) => {
  const { ref, tilt, onMouseMove, onMouseLeave } = useTilt(3);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 40,
        scale: isInView ? 1 : 0.96,
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] },
        rotateX: { type: "spring", stiffness: 300, damping: 30 },
        rotateY: { type: "spring", stiffness: 300, damping: 30 },
      }}
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      className="bg-card rounded-2xl p-6 border border-border/50 relative overflow-hidden group hover:shadow-lg hover:border-accent/20 transition-[box-shadow,border-color] duration-300"
    >
      {/* Ligne d'accent animée en haut */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent origin-center"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: index * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Watermark numéroté */}
      <span className="absolute top-3 right-4 text-5xl font-black text-foreground/[0.04] select-none tabular-nums leading-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icône avec rebond à l'entrée */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 18,
          delay: index * 0.12 + 0.15,
        }}
        className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300"
      >
        <cat.icon size={20} className="text-accent" />
      </motion.div>

      <h3 className="font-semibold text-base text-foreground mb-1 tracking-tight">
        {cat.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {cat.description}
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {cat.pills.map((p, pi) => {
          const isDaily = dailyUseTools.has(p.name);
          return (
            <Tooltip key={p.name}>
              <TooltipTrigger asChild>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{
                    delay: index * 0.12 + 0.2 + pi * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                  }}
                  whileHover={{ y: -2, scale: 1.04 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-default select-none ${
                    isDaily
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100 hover:border-emerald-300/80"
                      : "bg-muted/50 text-foreground border-border/40 hover:bg-accent/10 hover:text-accent hover:border-accent/20"
                  }`}
                >
                  {pillLogos[p.name] && (
                    <img
                      src={pillLogos[p.name]}
                      alt=""
                      className="w-4 h-4 rounded-sm shrink-0"
                      loading="lazy"
                    />
                  )}
                  {p.name}
                  {isDaily && (
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
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
        })}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const { t } = useLanguage();

  const tooltipDaily = t("skills.tooltip.daily");
  const tooltipProject = t("skills.tooltip.project");
  const tooltipOp = t("skills.tooltip.operational");

  const categories: Category[] = [
    {
      title: t("skills.cat1.title"),
      description: t("skills.cat1.desc"),
      icon: Bot,
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
      icon: Lightbulb,
      pills: [
        { name: t("skills.pill.saas"), tooltip: tooltipProject },
        { name: "Product Thinking", tooltip: tooltipProject },
        { name: "No-code", tooltip: tooltipProject },
        { name: "Data Analysis", tooltip: tooltipProject },
      ],
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <section id="skills" className="py-20 md:py-32 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-3 text-center tracking-tight">
              {t("skills.title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="text-muted-foreground text-base md:text-lg text-center mb-14 md:mb-16 max-w-xl mx-auto leading-relaxed">
              {t("skills.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.title} cat={cat} index={i} />
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="flex items-center justify-center gap-4 mt-10 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                {t("skills.legend")}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default Skills;
