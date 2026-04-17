import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Zap,
  Target,
  Sparkles,
  MapPin,
  Calendar,
  Globe,
  Repeat,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/* ─────────────── Counter ─────────────── */
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
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span className="text-5xl md:text-6xl font-semibold text-foreground tabular-nums tracking-[-0.04em] leading-none">
      {count}
      {suffix}
    </span>
  );
};

/* ─────────────── useTilt — spotlight + 3D tilt hook ─────────────── */
const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

const useTilt = (maxTilt: number = 4) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useTransform(my, [0, 1], [maxTilt, -maxTilt]);
  const ry = useTransform(mx, [0, 1], [-maxTilt, maxTilt]);
  const springRx = useSpring(rx, SPRING);
  const springRy = useSpring(ry, SPRING);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px);
    my.set(py);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  };

  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return {
    ref,
    bindings: { onPointerMove, onPointerLeave },
    style: prefersReduced
      ? undefined
      : {
          rotateX: springRx,
          rotateY: springRy,
          transformStyle: "preserve-3d" as const,
          transformPerspective: 1200,
        },
    mx,
    my,
  };
};

/* ─────────────── Sparkline ─────────────── */
const Sparkline = ({
  points,
  isInView,
  delay = 0,
  gradId,
}: {
  points: number[];
  isInView: boolean;
  delay?: number;
  gradId: string;
}) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const step = w / (points.length - 1);

  const coords = points.map((p, i) => ({
    x: i * step,
    y: h - ((p - min) / range) * (h - 4) - 2,
  }));
  const last = coords[coords.length - 1];

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full h-8 text-foreground overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradId})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* End-point dot — reveals on card hover */}
      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <circle
          cx={last.x}
          cy={last.y}
          r="5"
          fill="currentColor"
          opacity="0.15"
          className="animate-ping origin-center"
          style={{ transformOrigin: `${last.x}px ${last.y}px` }}
        />
        <circle cx={last.x} cy={last.y} r="2.2" fill="currentColor" />
      </g>
    </svg>
  );
};

/* ─────────────── PhotoCard with parallax ─────────────── */
const PhotoCard = ({
  mx,
  my,
  lang,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  lang: "fr" | "en";
}) => {
  const px = useSpring(useTransform(mx, [0, 1], [8, -8]), SPRING);
  const py = useSpring(useTransform(my, [0, 1], [6, -6]), SPRING);

  return (
    <>
      <div className="relative aspect-[4/5] lg:aspect-auto lg:flex-1 rounded-xl overflow-hidden bg-muted">
        <motion.img
          src="/jean-duthil-photo.jpg"
          alt="Jean Duthil"
          loading="lazy"
          className="w-full h-full object-cover object-top will-change-transform"
          style={{ x: px, y: py, scale: 1.06 }}
        />
        {/* Gradient vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent pointer-events-none"
        />
        {/* Availability badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur-sm border border-border px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {lang === "fr" ? "Dispo sept. 2026" : "Available Sept 2026"}
        </div>
        {/* Location pill */}
        <div className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur-sm border border-border px-2.5 py-1 text-[10px] font-medium text-foreground">
          <MapPin size={11} strokeWidth={2} />
          Bordeaux, FR
        </div>
      </div>
      <div className="mt-3 px-2 pb-1 flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">Jean Duthil</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {lang === "fr" ? "ESSCA · Promo 2028" : "ESSCA · Class of 2028"}
          </div>
        </div>
        <a
          href="https://linkedin.com/in/duthiljean"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors group/link"
          aria-label="LinkedIn"
        >
          LinkedIn
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      </div>
    </>
  );
};

/* ─────────────── Tiltable card components ─────────────── */
const StatCard = ({
  stat,
  index,
  isInView,
}: {
  stat: {
    value: number;
    suffix: string;
    label: string;
    kicker: string;
    icon: typeof Target;
    trend: number[];
  };
  index: number;
  isInView: boolean;
}) => {
  const { ref, bindings, style } = useTilt(3);
  const Icon = stat.icon;
  return (
    <motion.div
      ref={ref}
      {...bindings}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className="saas-card saas-card-hover card-spotlight group p-6 md:p-7 relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <Icon
              size={11}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            />
            {stat.kicker}
          </div>
        </div>
        <div className="mt-6 md:mt-7">
          <Counter target={stat.value} suffix={stat.suffix} isInView={isInView} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
        <div className="mt-5 text-foreground/60 group-hover:text-foreground/90 transition-colors duration-300">
          <Sparkline
            points={stat.trend}
            isInView={isInView}
            delay={0.35 + index * 0.1}
            gradId={`spark-${index}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const PhotoCardWrapper = ({
  isInView,
  lang,
}: {
  isInView: boolean;
  lang: "fr" | "en";
}) => {
  const { ref, bindings, style, mx, my } = useTilt(2.5);
  return (
    <motion.div
      ref={ref}
      {...bindings}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className="saas-card saas-card-hover card-spotlight group p-3 lg:row-span-2 flex flex-col"
    >
      <PhotoCard mx={mx} my={my} lang={lang} />
    </motion.div>
  );
};

const NowCard = ({
  isInView,
  t,
  lang,
}: {
  isInView: boolean;
  t: (key: string) => string;
  lang: "fr" | "en";
}) => {
  const { ref, bindings, style } = useTilt(2);
  const items = [
    { title: t("about.now_1_title"), desc: t("about.now_1_desc"), active: true },
    { title: t("about.now_2_title"), desc: t("about.now_2_desc"), active: false },
  ];
  return (
    <motion.div
      ref={ref}
      {...bindings}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className="saas-card saas-card-hover card-spotlight group p-6 md:p-7 lg:col-span-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles
            size={11}
            strokeWidth={2}
            className="transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110"
          />
          {t("about.now_label")}
        </div>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      </div>

      <ul className="mt-6 relative space-y-5">
        <span
          aria-hidden
          className="absolute left-[5px] top-2.5 bottom-2.5 w-px bg-border"
        />
        {items.map((item, i) => (
          <li key={i} className="relative pl-6">
            <span
              aria-hidden
              className={
                item.active
                  ? "absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-foreground ring-[3px] ring-foreground/10 transition-all duration-300 group-hover:ring-[5px] group-hover:ring-foreground/15"
                  : "absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-card border border-border"
              }
            />
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-sm font-semibold text-foreground leading-snug">
                {item.title}
              </div>
              {item.active && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground shrink-0">
                  {lang === "fr" ? "En cours" : "Ongoing"}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {item.desc}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

/* ─────────────── About ─────────────── */
const About = () => {
  const { t, lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });

  const stats = [
    {
      value: 400,
      suffix: "+",
      label: t("about.stat1"),
      kicker: lang === "fr" ? "Prospection" : "Outreach",
      icon: Target,
      trend: [8, 20, 45, 90, 145, 210, 260, 315, 360, 400],
    },
    {
      value: 30,
      suffix: "",
      label: t("about.stat2"),
      kicker: lang === "fr" ? "Conversion" : "Conversion",
      icon: Zap,
      trend: [0, 1, 3, 6, 9, 13, 18, 22, 27, 30],
    },
  ];

  const facts = [
    { icon: MapPin, label: lang === "fr" ? "Localisation" : "Location", value: t("about.location") },
    { icon: Calendar, label: lang === "fr" ? "Disponibilité" : "Availability", value: "Sept. 2026" },
    { icon: Repeat, label: lang === "fr" ? "Rythme" : "Rhythm", value: t("about.rhythm") },
    { icon: Globe, label: lang === "fr" ? "Langues" : "Languages", value: t("about.languages") },
  ];

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 section-alt-bg border-t border-border"
    >
      <div className="container mx-auto max-w-5xl" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
            <span className="h-1 w-1 rounded-full bg-foreground/60" />
            {t("about.kicker")}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
            {t("about.headline1")} {t("about.headline2")}
            <span className="text-muted-foreground"> — {t("about.headline3")}</span>
          </h2>
          <p
            className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            {t("about.bio")}
          </p>
        </motion.div>

        {/* Asymmetric bento */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard stat={stats[0]} index={0} isInView={isInView} />
          <StatCard stat={stats[1]} index={1} isInView={isInView} />
          <PhotoCardWrapper isInView={isInView} lang={lang as "fr" | "en"} />
          <NowCard isInView={isInView} t={t} lang={lang as "fr" | "en"} />
        </div>

        {/* Facts strip — unified card with internal dividers + per-cell spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 md:mt-4 saas-card overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="group relative bg-card p-4 md:p-5 transition-colors duration-300 hover:bg-muted/40"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  <Icon
                    size={11}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:scale-110 group-hover:text-foreground"
                  />
                  {label}
                </div>
                <div className="mt-2 text-sm md:text-base font-semibold text-foreground leading-tight">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
