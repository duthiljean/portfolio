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
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  fetchAbout,
  fetchProfile,
  pickLocale,
  type About as AboutDoc,
  type AboutStat,
  type Profile,
} from "@/lib/sanity";
import { fallbackAbout, fallbackProfile } from "@/lib/fallback-content";

const STAT_ICONS = [Target, Zap];
const STAT_TRENDS = [
  [8, 20, 45, 90, 145, 210, 260, 315, 360, 400],
  [0, 1, 3, 6, 9, 13, 18, 22, 27, 30],
];

const parseStatValue = (raw: string | undefined): { value: number; suffix: string } => {
  if (!raw) return { value: 0, suffix: "" };
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: parseFloat(match[1]) || 0, suffix: match[2] };
};

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

const PhotoCard = ({
  mx,
  my,
  lang,
  profile,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  lang: "fr" | "en";
  profile?: Profile | null;
}) => {
  const px = useSpring(useTransform(mx, [0, 1], [8, -8]), SPRING);
  const py = useSpring(useTransform(my, [0, 1], [6, -6]), SPRING);

  const photoSrc = profile?.photo || "/jean-duthil-photo.jpg";
  const name = profile?.name || "Jean Duthil";
  const linkedIn = profile?.socials?.find((s) => s.platform === "linkedin")?.url;

  return (
    <>
      <div className="relative aspect-[4/5] lg:aspect-auto lg:flex-1 lg:min-h-[440px] rounded-xl overflow-hidden bg-muted">
        <motion.img
          src={photoSrc}
          alt={name}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top will-change-transform"
          style={{
            x: px,
            y: py,
            scale: 1.06,
            backfaceVisibility: "hidden",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none"
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur-sm border border-border px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {lang === "fr" ? "Dispo sept. 2026" : "Available Sept 2026"}
        </div>
        <div className="absolute left-3 right-3 bottom-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-base font-semibold text-white leading-tight tracking-[-0.01em] drop-shadow-sm">
              {name}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-white/85">
              <MapPin size={10} strokeWidth={2.2} />
              Bordeaux, FR
            </div>
          </div>
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white transition-colors group/link"
              aria-label="LinkedIn"
            >
              LinkedIn
              <ArrowUpRight
                size={12}
                className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
      <div className="mt-3 px-2 pb-1 flex items-center justify-between">
        <div className="text-[11px] text-muted-foreground">
          {lang === "fr" ? "ESSCA · Promo 2027" : "ESSCA · Class of 2027"}
        </div>
        <div className="text-[11px] text-muted-foreground tabular-nums">
          {lang === "fr" ? "20 ans" : "20 yrs"}
        </div>
      </div>
    </>
  );
};

const StatCard = ({
  stat,
  index,
  isInView,
  lang,
}: {
  stat: AboutStat;
  index: number;
  isInView: boolean;
  lang: "fr" | "en";
}) => {
  const { ref, bindings, style } = useTilt(3);
  const Icon = STAT_ICONS[index] ?? Target;
  const { value, suffix } = parseStatValue(stat.value);
  const trend = STAT_TRENDS[index] ?? STAT_TRENDS[0];
  const kicker = pickLocale(stat.trend, lang) || (lang === "fr" ? "Stat" : "Stat");
  const label = pickLocale(stat.label, lang);

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
          maskImage: "radial-gradient(ellipse at top right, #000 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top right, #000 0%, transparent 70%)",
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
            {kicker}
          </div>
        </div>
        <div className="mt-6 md:mt-7">
          <Counter target={value} suffix={suffix} isInView={isInView} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        <div className="mt-5 text-foreground/60 group-hover:text-foreground/90 transition-colors duration-300">
          <Sparkline
            points={trend}
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
  profile,
}: {
  isInView: boolean;
  lang: "fr" | "en";
  profile?: Profile | null;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !ref.current) return;
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

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="saas-card saas-card-hover card-spotlight group p-3 lg:row-span-2 flex flex-col"
    >
      <PhotoCard mx={mx} my={my} lang={lang} profile={profile} />
    </motion.div>
  );
};

const NowCard = ({
  isInView,
  about,
  lang,
}: {
  isInView: boolean;
  about?: AboutDoc | null;
  lang: "fr" | "en";
}) => {
  const { ref, bindings, style } = useTilt(2);
  const NOW_HINTS_FR = ["depuis avr.", "depuis 2024"];
  const NOW_HINTS_EN = ["since Apr", "since 2024"];
  const hints = lang === "fr" ? NOW_HINTS_FR : NOW_HINTS_EN;
  const items = (about?.nowItems ?? []).map((item, i) => ({
    title: item.title,
    desc: pickLocale(item.description, lang),
    hint: hints[i],
    active: i === 0,
  }));
  const nowLabel = pickLocale(about?.nowLabel, lang);

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
          {nowLabel}
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
              <span className="text-[10px] font-medium tabular-nums tracking-wide text-muted-foreground shrink-0">
                {item.hint}
              </span>
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

const About = () => {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });

  const { data: aboutData } = useQuery<AboutDoc | null>({
    queryKey: ["about"],
    queryFn: fetchAbout,
  });
  const { data: profileData } = useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const about = aboutData ?? fallbackAbout;
  const profile = profileData ?? fallbackProfile;
  const kicker = pickLocale(about?.kicker, lang);
  const headlines = (about?.headlines ?? []).map((h) => pickLocale(h, lang));
  const bio = pickLocale(about?.bio, lang);
  const stats = about?.stats ?? [];

  const facts = [
    {
      icon: MapPin,
      label: lang === "fr" ? "Localisation" : "Location",
      value: pickLocale(about?.location, lang),
    },
    {
      icon: Calendar,
      label: lang === "fr" ? "Disponibilité" : "Availability",
      value: "Sept. 2026",
    },
    {
      icon: Repeat,
      label: lang === "fr" ? "Rythme" : "Rhythm",
      value: pickLocale(about?.rhythm, lang),
    },
    {
      icon: Globe,
      label: lang === "fr" ? "Langues" : "Languages",
      value: pickLocale(about?.languages, lang),
    },
  ];

  return (
    <section
      id="about"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 section-alt-bg border-t border-border"
    >
      <div className="container mx-auto max-w-5xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {kicker && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
              <span className="h-1 w-1 rounded-full bg-foreground/60" />
              {kicker}
            </div>
          )}
          {headlines.length > 0 && (
            <h2 className="text-[2rem] sm:text-4xl md:text-[3.25rem] font-semibold tracking-[-0.04em] leading-[1.02] text-foreground">
              {headlines[0]}
              {headlines[1] && (
                <>
                  <br />
                  {headlines[1]}
                </>
              )}
              {headlines[2] && (
                <>
                  <br />
                  <span className="text-muted-foreground">{headlines[2]}</span>
                </>
              )}
            </h2>
          )}
          {bio && (
            <p
              className="mt-6 text-base md:text-lg text-foreground/75 leading-relaxed max-w-xl"
              style={{ textWrap: "pretty" } as React.CSSProperties}
            >
              {bio}
            </p>
          )}
        </motion.div>

        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {stats[0] && (
            <StatCard stat={stats[0]} index={0} isInView={isInView} lang={lang as "fr" | "en"} />
          )}
          {stats[1] && (
            <StatCard stat={stats[1]} index={1} isInView={isInView} lang={lang as "fr" | "en"} />
          )}
          <PhotoCardWrapper isInView={isInView} lang={lang as "fr" | "en"} profile={profile} />
          <NowCard isInView={isInView} about={about} lang={lang as "fr" | "en"} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 md:mt-4 saas-card overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {facts.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.28 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-card p-4 md:p-5 transition-colors duration-300 hover:bg-muted/40"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-4 bottom-4 w-px bg-foreground/0 group-hover:bg-foreground transition-colors duration-300"
                />
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  <Icon
                    size={11}
                    strokeWidth={2}
                    className="transition-all duration-300 group-hover:scale-110 group-hover:text-foreground"
                  />
                  {label}
                </div>
                <div className="mt-2 text-sm md:text-[0.95rem] font-semibold text-foreground leading-tight tracking-[-0.01em]">
                  {value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
