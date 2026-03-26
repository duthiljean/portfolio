import { useState } from "react";
import { ChevronDown, MapPin, ExternalLink } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { experiences } from "./experienceData";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTilt } from "@/hooks/use-tilt";

const expKeys = [
  "roofwander", "addetective", "adayboat", "zeboat", "bde", "coquille", "armees",
];

const typeStyles: Record<string, string> = {
  "Stage":                   "bg-blue-50 text-blue-600 border-blue-200/70",
  "Internship":              "bg-blue-50 text-blue-600 border-blue-200/70",
  "CDD":                     "bg-violet-50 text-violet-600 border-violet-200/70",
  "Fixed-term contract":     "bg-violet-50 text-violet-600 border-violet-200/70",
  "Projet entrepreneurial":  "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  "Entrepreneurial project": "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  "Associatif":              "bg-amber-50 text-amber-600 border-amber-200/70",
  "Student association":     "bg-amber-50 text-amber-600 border-amber-200/70",
  "Indépendant":             "bg-purple-50 text-purple-600 border-purple-200/70",
  "Freelance":               "bg-purple-50 text-purple-600 border-purple-200/70",
};

const getTypeStyle = (type: string) =>
  typeStyles[type] ?? "bg-muted/60 text-muted-foreground border-border/50";

const ExperienceCard = ({
  exp,
  index,
  total,
  isOpen,
  onToggle,
  expKey,
}: {
  exp: (typeof experiences)[0];
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  expKey: string;
}) => {
  const { t } = useLanguage();
  const { ref, tilt, onMouseMove, onMouseLeave } = useTilt(4);

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

  return (
    <ScrollReveal delay={0.06 + index * 0.05}>
      <div className="relative pl-6 sm:pl-8 md:pl-10 pb-8 sm:pb-10 last:pb-0">
        {/* Ligne verticale statique de fond */}
        {index < total - 1 && (
          <div className="absolute left-[7px] md:left-[11px] top-3 bottom-0 w-0.5 bg-border/60" />
        )}

        {/* Dot timeline */}
        <div className="absolute left-0 md:left-1 top-2 w-4 h-4">
          {isCurrent && (
            <motion.span
              className="absolute inset-0 rounded-full bg-accent/30"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <motion.div
            className="relative w-4 h-4 rounded-full bg-accent border-[3px] border-background shadow-sm"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: 0.08 + index * 0.05,
            }}
            whileHover={{ scale: 1.35 }}
          />
        </div>

        {/* Tilt wrapper sur div */}
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ perspective: "800px" }}
        >
          <motion.button
            onClick={onToggle}
            whileTap={{ scale: 0.997 }}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full text-left bg-card rounded-xl p-4 sm:p-5 shadow-sm border border-border/50 cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,translate,border-color] duration-300 hover:border-accent/20"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                {exp.logo && (
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    loading="lazy"
                    className="w-9 h-9 rounded-lg shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors leading-tight">
                      {title}
                    </h3>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/70 shrink-0">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                    {exp.siteUrl ? (
                      <a
                        href={exp.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeStyle(type)}`}
                    >
                      {type}
                    </span>
                    <span className="text-[11px] text-muted-foreground/70">{dates}</span>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="shrink-0 mt-1"
              >
                <ChevronDown size={16} className="text-muted-foreground sm:w-[18px] sm:h-[18px]" />
              </motion.div>
            </div>

            {/* Contenu expandable */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto", transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
                  exit={{ height: 0, transition: { duration: 0.2, ease: [0.55, 0.085, 0.68, 0.53] } }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <div className="pt-3 sm:pt-4 border-t border-border/60 mt-3 sm:mt-4">
                      {/* Location */}
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3 bg-muted/40 rounded-full px-2.5 py-1">
                        <MapPin size={11} className="text-accent" />
                        {location}
                      </div>

                      {/* Description */}
                      <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-1.5">
                        {description.split("\n").map((line, li) => {
                          if (line.startsWith("→")) {
                            return (
                              <div key={li} className="flex gap-2 items-start">
                                <span className="text-accent font-bold shrink-0 mt-px">→</span>
                                <span>{line.slice(1).trim()}</span>
                              </div>
                            );
                          }
                          return (
                            <p key={li} className="font-medium text-foreground/75 mb-2">
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {/* Image */}
                      {exp.image && (
                        <img
                          src={exp.image}
                          alt={exp.company}
                          loading="lazy"
                          className="w-full rounded-lg mt-4 shadow-sm"
                        />
                      )}

                      {/* Badges avec stagger */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                        {badges.map((b, bi) =>
                          b.link ? (
                            <motion.a
                              key={b.label}
                              href={b.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, scale: 0.8, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: bi * 0.06,
                                type: "spring",
                                stiffness: 400,
                                damping: 22,
                              }}
                              whileHover={{ scale: 1.05 }}
                              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-accent text-accent-foreground hover:brightness-110 transition-all duration-200 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {b.label}
                              <ExternalLink size={10} className="shrink-0" />
                            </motion.a>
                          ) : (
                            <motion.span
                              key={b.label}
                              initial={{ opacity: 0, scale: 0.8, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: bi * 0.06,
                                type: "spring",
                                stiffness: 400,
                                damping: 22,
                              }}
                              className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-accent/10 text-accent border border-accent/15"
                            >
                              {b.label}
                            </motion.span>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </ScrollReveal>
  );
};

const ExperienceSection = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-16 md:py-28 px-4 md:px-8 section-alt-bg">
      <div className="container mx-auto max-w-2xl">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 sm:mb-12 text-center">
            {t("exp.title")}
          </h2>
        </ScrollReveal>

        <div ref={sectionRef} className="relative">
          {/* Ligne animée au scroll */}
          <motion.div
            className="absolute left-[7px] md:left-[11px] top-3 w-0.5 bg-accent/40 origin-top pointer-events-none"
            style={{ scaleY: lineScaleY, height: "calc(100% - 1.5rem)" }}
          />

          {experiences.map((exp, i) => (
            <ExperienceCard
              key={exp.company + exp.dates}
              exp={exp}
              index={i}
              total={experiences.length}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              expKey={expKeys[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
