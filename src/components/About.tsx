import { useRef, useState, useEffect } from "react";
import { MapPin, Briefcase, Cpu, Globe, Phone, Calendar } from "lucide-react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const Counter = ({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(target);
        setDone(true);
      }
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <motion.span
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent tabular-nums inline-block"
      animate={done ? { scale: [1, 1.12, 1] } : {}}
      transition={done ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : {}}
    >
      {count}
      {suffix}
    </motion.span>
  );
};

const About = () => {
  const { t } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.1, margin: "0px 0px -40px 0px" });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.1, margin: "0px 0px -40px 0px" });

  const stats = [
    { value: 400, suffix: "+", label: t("about.stat1"), icon: MapPin },
    { value: 30, suffix: "", label: t("about.stat2"), icon: Briefcase },
    { value: 3, suffix: "", label: t("about.stat3"), icon: Cpu },
  ];

  const infos = [
    { icon: MapPin, label: t("about.location") },
    { icon: Phone, label: t("about.phone"), href: "tel:+33760049011" },
    { icon: Calendar, label: t("about.rhythm") },
    { icon: Globe, label: t("about.languages") },
  ];

  return (
    <section id="about" className="py-16 md:py-28 px-4 md:px-8 section-alt-bg">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
            {t("about.title")}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
            style={{ textWrap: "pretty" }}
          >
            {t("about.description")}
          </p>
        </ScrollReveal>

        {/* Info pills */}
        <div ref={infoRef} className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2">
          {infos.map((info, i) => {
            const pill = (
              <motion.span
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={isInfoInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: i * 0.07,
                  type: "spring",
                  stiffness: 350,
                  damping: 22,
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border/50 text-xs sm:text-sm text-muted-foreground shadow-sm hover:border-accent/30 hover:text-foreground transition-all duration-200"
              >
                <info.icon size={13} className="text-accent shrink-0" />
                {info.label}
              </motion.span>
            );

            return info.href ? (
              <a
                key={info.label}
                href={info.href}
                className="hover:scale-[1.03] transition-transform duration-200"
              >
                {pill}
              </a>
            ) : (
              <span key={info.label}>{pill}</span>
            );
          })}
        </div>

        {/* Stats — carte unifiée avec séparateurs */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 28 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-14 bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-3 divide-x divide-border/50">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-5 sm:p-6 md:p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-300" />

                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300"
                  style={{ perspective: "200px" }}
                >
                  <motion.div
                    animate={isStatsInView ? { rotateY: [0, 360] } : {}}
                    transition={
                      isStatsInView
                        ? { duration: 0.7, ease: "easeInOut", delay: 0.3 + i * 0.1 }
                        : {}
                    }
                  >
                    <s.icon size={15} className="text-accent" />
                  </motion.div>
                </div>

                <Counter target={s.value} suffix={s.suffix} isInView={isStatsInView} />

                <p className="mt-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
