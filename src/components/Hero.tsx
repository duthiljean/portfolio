import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  ArrowDown,
  BriefcaseBusiness,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { fetchProfile, pickLocale, type Profile } from "@/lib/sanity";
import { fallbackProfile } from "@/lib/fallback-content";

const DottedSurface = lazy(() =>
  import("./DottedSurface").then((m) => ({ default: m.DottedSurface })),
);

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

const RoleCarousel = ({ roles }: { roles: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  if (!roles.length) return null;

  return (
    <div className="h-8 relative overflow-hidden inline-flex min-w-[220px] justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 text-sm md:text-base font-medium text-foreground"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const scrollToId = (href?: string) => {
  if (!href) return;
  if (href.startsWith("#")) {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = href;
  }
};

const socialIcon = (platform: string) => {
  if (platform === "linkedin") return <Linkedin size={13} />;
  if (platform === "github") return <Github size={13} />;
  if (platform === "email" || platform === "phone") return <Mail size={13} />;
  return null;
};

const socialLabel = (platform: string, url: string) => {
  if (platform === "email") return url.replace(/^mailto:/, "");
  if (platform === "phone") return url.replace(/^tel:/, "");
  if (platform === "linkedin") return "LinkedIn";
  if (platform === "github") return "GitHub";
  return platform;
};

const Hero = () => {
  const { lang } = useLanguage();
  const { data: profileData } = useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const profile = profileData ?? fallbackProfile;
  const roles = (profile?.roles ?? []).map((r) => pickLocale(r, lang));
  const photoSrc = profile?.photo || "/jean-duthil-photo.jpg";
  const name = profile?.name || "Jean Duthil";
  const badge = pickLocale(profile?.badge, lang);
  const dateline = pickLocale(profile?.dateline, lang);
  const ctaPrimaryLabel = pickLocale(profile?.ctaPrimary?.label, lang);
  const ctaSecondaryLabel = pickLocale(profile?.ctaSecondary?.label, lang);
  const socials = profile?.socials ?? [];
  const signals = [
    {
      icon: BriefcaseBusiness,
      label: lang === "fr" ? "Mission actuelle" : "Current mission",
      value: "Roofwander · Bruxelles",
    },
    {
      icon: Sparkles,
      label: lang === "fr" ? "Recherche" : "Looking for",
      value: lang === "fr" ? "Alternance · Sept. 2026" : "Internship · Sept. 2026",
    },
    {
      icon: MapPin,
      label: lang === "fr" ? "Base" : "Base",
      value: "Bordeaux · Marseille · Bruxelles",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[96svh] flex items-center justify-center px-5 md:px-8 pt-24 pb-12 overflow-hidden hero-atmosphere"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, #000 0%, #000 55%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, #000 0%, #000 55%, transparent 95%)",
        }}
      >
        <WebGLErrorBoundary>
          <Suspense
            fallback={<div className="absolute inset-0 dot-grid-bg opacity-30" />}
          >
            <DottedSurface />
          </Suspense>
        </WebGLErrorBoundary>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"
      />

      <div className="container mx-auto max-w-6xl relative">
        <div className="flex flex-col items-center text-center">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {badge}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full p-1 bg-background/80 border border-border shadow-[0_18px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-1 ring-foreground/10"
              />
              <img
                src={photoSrc}
                alt={name}
                loading="eager"
                className="h-full w-full rounded-full object-cover object-top"
              />
              <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] leading-[0.96] text-foreground"
          >
            {name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-muted-foreground flex items-center justify-center gap-1.5 text-sm md:text-base"
          >
            <RoleCarousel roles={roles} />
          </motion.div>

          {dateline && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-2xl text-sm md:text-lg text-muted-foreground leading-relaxed"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {dateline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col sm:flex-row gap-2.5 w-full max-w-sm sm:max-w-none sm:w-auto"
          >
            {ctaSecondaryLabel && (
              <Button
                size="lg"
                onClick={() => scrollToId(profile?.ctaSecondary?.href)}
                className="shimmer-border h-11 px-5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium gap-2 shadow-[0_12px_36px_-20px_rgba(0,0,0,0.65)]"
              >
                <Mail size={15} />
                {ctaSecondaryLabel}
              </Button>
            )}
            {ctaPrimaryLabel && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToId(profile?.ctaPrimary?.href)}
                className="h-11 px-5 rounded-full border-border bg-card/85 hover:bg-muted hover:text-foreground text-foreground text-sm font-medium gap-1.5 backdrop-blur"
              >
                {ctaPrimaryLabel}
                <ArrowRight size={15} />
              </Button>
            )}
          </motion.div>

          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              {socials
                .filter((s) => s.platform === "linkedin" || s.platform === "email" || s.platform === "github")
                .map((s) => (
                  <a
                    key={s._key ?? s.platform}
                    href={s.url}
                    target={s.platform === "email" || s.platform === "phone" ? undefined : "_blank"}
                    rel={s.platform === "email" || s.platform === "phone" ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-2.5 py-1.5 hover:border-foreground/25 hover:text-foreground transition-colors backdrop-blur"
                  >
                    {socialIcon(s.platform)}
                    {socialLabel(s.platform, s.url)}
                  </a>
                ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-border/80 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.45)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px">
              {signals.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group bg-background/85 px-4 py-4 text-left backdrop-blur-md transition-colors hover:bg-card"
                >
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Icon size={12} className="text-foreground/70 transition-transform group-hover:-rotate-3" />
                    {label}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground leading-tight">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.a
            href="#about"
            aria-label="Scroll to about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 1 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            }}
            className="mt-14 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <ArrowDown size={18} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
