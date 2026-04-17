import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Linkedin,
  Phone,
  Loader2,
  MapPin,
  Clock,
  Calendar,
  ArrowUpRight,
  Check,
  Copy,
  Sparkle,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

const EMAIL = "jean.duthil13@gmail.com";

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

/* ─────────── Tilt hook ─────────── */
const useTilt = (max = 2.5) => {
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

/* ─────────── Live local time (Paris) ─────────── */
const useParisClock = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    }),
  );
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Paris",
        }),
      );
    };
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

/* ─────────── Primary Email Card ─────────── */
const EmailHero = ({ mailto }: { mailto: string }) => {
  const { ref: spotRef, onPointerMove: onSpotMove } = useSpotlight<HTMLDivElement>();
  const { ref: tiltRef, rx, ry, onPointerMove: onTiltMove, onPointerLeave } = useTilt(2.5);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      track("contact_email_copied");
      toast.success("Email copié", {
        description: "Collé dans le presse-papiers.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copie impossible");
    }
  };

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
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-3"
    >
      <div
        ref={spotRef}
        className="saas-card card-spotlight relative overflow-hidden p-6 md:p-8 h-full flex flex-col justify-between"
      >
        {/* Dot-grid mask */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 opacity-[0.35]"
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

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Mail size={11} />
              Écris-moi
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-foreground/20 bg-foreground/[0.04] px-2 py-0.5 text-[10px] font-medium text-foreground">
              <Sparkle size={10} strokeWidth={2.2} className="fill-foreground" />
              Canal préféré
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copier l'email"
            className="group/email mt-6 flex items-start gap-2 text-left"
          >
            <span className="text-2xl md:text-[32px] font-semibold tracking-[-0.025em] break-all text-foreground leading-tight">
              {EMAIL}
            </span>
            <span className="mt-1.5 md:mt-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground group-hover/email:border-foreground/30 group-hover/email:text-foreground transition-colors">
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center justify-center text-foreground"
                  >
                    <Check size={12} strokeWidth={2.4} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center justify-center"
                  >
                    <Copy size={12} strokeWidth={2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Le chemin le plus court pour un échange. Réponse sous 24h ouvrées.
          </p>
        </div>

        <div className="relative mt-8 flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            onClick={() => {
              track("contact_email_clicked");
              window.location.href = mailto;
            }}
            className="shimmer-border h-11 px-5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium gap-2 shadow-sm"
          >
            <Mail size={15} />
            Envoyer un email
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleCopy}
            className="h-11 px-5 rounded-full text-sm font-medium gap-2"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="c"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Check size={15} strokeWidth={2.4} />
                  Copié
                </motion.span>
              ) : (
                <motion.span
                  key="d"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Copy size={15} />
                  Copier l'adresse
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────── Status card (live time + details) ─────────── */
const StatusCard = () => {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const time = useParisClock();

  const rows = [
    { icon: MapPin, label: "Localisation", value: "Bordeaux, FR" },
    { icon: Calendar, label: "Disponibilité", value: "Sept. 2026" },
    { icon: Clock, label: "Heure locale", value: `${time} CET`, live: true },
  ];

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-2 saas-card card-spotlight p-6 md:p-7 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Statut
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          En recherche
        </div>
      </div>

      <ul className="mt-5 space-y-3.5">
        {rows.map(({ icon: Icon, label, value, live }, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.26 + i * 0.06, duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon size={13} className="text-foreground" strokeWidth={2} />
              </div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums inline-flex items-center gap-1.5">
              {value}
              {live && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
              )}
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted-foreground leading-relaxed">
        Rythme alternance : <span className="text-foreground font-medium">2 sem. entreprise · 1 sem. école</span>
      </div>
    </motion.div>
  );
};

/* ─────────── PDF file card (Vercel-style monochrome) ─────────── */
const PdfFileCard = () => (
  <div aria-hidden className="relative size-fit">
    <div className="absolute -right-1 -bottom-0.5 z-10 rounded-[3px] px-1 py-[1px] text-[7px] font-bold uppercase tracking-wider bg-foreground text-background shadow-sm">
      PDF
    </div>
    <div className="relative z-0 w-9 h-11 space-y-[3px] rounded-[5px] bg-card ring-1 ring-border p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex">
        <div className="bg-foreground/25 h-[2px] w-2/3 rounded-full" />
      </div>
      <div className="flex gap-0.5">
        <div className="bg-foreground/10 h-[2px] w-1/3 rounded-full" />
        <div className="bg-foreground/10 h-[2px] w-1/3 rounded-full" />
      </div>
      <div className="flex gap-0.5">
        <div className="bg-foreground/10 h-[2px] w-1/2 rounded-full" />
        <div className="bg-foreground/10 h-[2px] w-1/4 rounded-full" />
      </div>
      <div className="flex gap-0.5">
        <div className="bg-foreground/10 h-[2px] w-1/3 rounded-full" />
        <div className="bg-foreground/10 h-[2px] w-1/3 rounded-full" />
      </div>
      <div className="flex">
        <div className="bg-foreground/10 h-[2px] w-2/5 rounded-full" />
      </div>
    </div>
  </div>
);

/* ─────────── CV Tile (featured, with PdfFileCard) ─────────── */
const CvTile = ({
  onClick,
  disabled,
  loading,
  delay,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  delay: number;
}) => {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Télécharger le CV en PDF"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="block text-left disabled:cursor-wait"
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className="saas-card saas-card-hover card-spotlight p-5 md:p-6 flex items-center justify-between group h-full relative overflow-hidden disabled:opacity-60"
      >
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={{ rotate: -6, y: -1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="shrink-0"
          >
            {loading ? (
              <div className="w-9 h-11 rounded-[5px] bg-card ring-1 ring-border flex items-center justify-center">
                <Loader2 size={14} className="animate-spin text-foreground" />
              </div>
            ) : (
              <PdfFileCard />
            )}
          </motion.div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">
              {loading ? "Génération…" : "Télécharger le CV"}
            </div>
            <div className="text-xs text-muted-foreground truncate tabular-nums">
              PDF · ~120 Ko
            </div>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
        />
      </div>
    </motion.button>
  );
};

/* ─────────── Action tile ─────────── */
type ActionTileProps = {
  icon: typeof Linkedin;
  title: string;
  sub: string;
  delay: number;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  external?: boolean;
  ariaLabel?: string;
};
const ActionTile = ({
  icon: Icon,
  title,
  sub,
  delay,
  href,
  onClick,
  disabled,
  loading,
  external,
  ariaLabel,
}: ActionTileProps) => {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  const inner = (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="saas-card saas-card-hover card-spotlight p-5 md:p-6 flex items-center justify-between group h-full relative overflow-hidden disabled:opacity-60"
    >
      <div className="flex items-center gap-3 min-w-0">
        <motion.div
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ type: "spring", stiffness: 340, damping: 20 }}
          className="w-9 h-9 shrink-0 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Icon size={15} strokeWidth={2} />
          )}
        </motion.div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{title}</div>
          <div className="text-xs text-muted-foreground truncate">{sub}</div>
        </div>
      </div>
      <ArrowUpRight
        size={16}
        className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
      />
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
    className: "block",
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button
      {...motionProps}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${motionProps.className} text-left disabled:cursor-wait`}
    >
      {inner}
    </motion.button>
  );
};

/* ─────────── Main Contact section ─────────── */
const Contact = () => {
  const { lang } = useLanguage();
  const [generating, setGenerating] = useState(false);

  const handleDownloadCV = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const { generateCV } = await import("@/lib/generate-cv");
      await generateCV(lang);
      track("cv_downloaded", { lang });
      toast.success("CV téléchargé", {
        description: "Vérifie ton dossier Téléchargements.",
      });
    } catch (err) {
      console.error("CV generation failed:", err);
      toast.error("Échec du téléchargement", {
        description: "Réessaie dans un instant.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const mailto = (() => {
    const subject = "Opportunité d'alternance — Septembre 2026";
    const body = `Salut Jean,\n\nJe te contacte concernant une opportunité d'alternance chez [ENTREPRISE] à partir de septembre 2026.\n\nPoste : [INTITULÉ]\nRythme : 2 semaines entreprise / 1 semaine école\nLieu : [LOCALISATION]\n\nQuelques mots sur le contexte :\n[...]\n\nTu serais dispo pour un échange cette semaine ?\n\nÀ bientôt,\n[NOM]`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 md:py-28 px-5 md:px-8 border-t border-border"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Dispo dès sept. 2026
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
              On travaille ensemble ?
            </h2>
            <p
              className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Alternance Business Dev, Product ou IA appliquée — 2 semaines entreprise / 1 semaine école. Toujours partant pour un café ou un appel.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            <span className="inline-flex items-center gap-1 text-foreground">
              <Clock size={11} strokeWidth={2.2} />
              &lt; 24h
            </span>
            <span>· réponse</span>
          </div>
        </motion.div>

        {/* Bento */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <EmailHero mailto={mailto} />
          <StatusCard />

          <ActionTile
            icon={Linkedin}
            title="LinkedIn"
            sub="@duthiljean"
            delay={0.24}
            href="https://linkedin.com/in/duthiljean"
            external
            onClick={() => track("project_link_clicked", { target: "linkedin" })}
          />
          <ActionTile
            icon={Phone}
            title="Téléphone"
            sub="07 60 04 90 11"
            delay={0.3}
            href="tel:+33760049011"
            onClick={() => track("contact_phone_clicked")}
          />
          <CvTile
            onClick={handleDownloadCV}
            disabled={generating}
            loading={generating}
            delay={0.36}
          />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 px-5 md:px-8 bg-background">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Jean Duthil</span>
        <span>Construit avec l'IA</span>
      </div>
    </footer>
  );
};

export { Contact, Footer };
export default Contact;
