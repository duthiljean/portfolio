import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Mail, Linkedin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTilt } from "@/hooks/use-tilt";

const nameText = "Jean Duthil";

const WordReveal = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateX: 40 }}
            animate={{ y: "0%", rotateX: 0 }}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const RoleCarousel = () => {
  const { t } = useLanguage();
  const roles = [t("hero.role1"), t("hero.role2"), t("hero.role3")];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-8 md:h-10 relative overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.span
            key={roles[index]}
            initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 text-lg sm:text-xl md:text-2xl font-semibold text-foreground"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Underline animé qui se déploie à chaque changement de rôle */}
      <motion.div
        key={`ul-${index}`}
        className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const { ref, tilt, onMouseMove, onMouseLeave } = useTilt(10);

  return (
    <section
      id="hero"
      className="min-h-[100svh] flex items-center justify-center px-4 pt-14 pb-6 relative overflow-hidden"
    >
      {/* Fond gradient animé */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Blobs flottants — CSS only for GPU compositing */}
      <div className="absolute top-20 -left-32 w-64 md:w-96 h-64 md:h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none will-change-transform animate-blob-1" />
      <div className="absolute bottom-20 -right-32 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none will-change-transform animate-blob-2" />

      <div className="container mx-auto text-center max-w-3xl relative z-10">

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative inline-block"
            style={{ perspective: "500px" }}
          >
            {/* Glow ambiant */}
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-125 pointer-events-none" />
            {/* Anneau gradient */}
            <div className="relative p-[3px] rounded-full bg-gradient-to-br from-accent/70 via-accent to-primary/50 shadow-lg">
              <div className="p-[2px] rounded-full bg-background">
                <motion.img
                  src="/jean-duthil-photo.jpg"
                  alt="Jean Duthil"
                  loading="eager"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full object-cover object-top block"
                  animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    scale: tilt.x !== 0 || tilt.y !== 0 ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nom */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-gradient">
          <WordReveal text={nameText} />
        </h1>

        {/* Carousel de rôles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 md:mt-4"
        >
          <RoleCarousel />
        </motion.div>

        {/* Badge disponibilité */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 md:mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-green-700"
        >
          <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 shrink-0">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-green-500" />
          </span>
          {t("hero.badge")}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0"
        >
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
          >
            {t("hero.cta1")}
            <ArrowRight size={15} className="shrink-0" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border-2 border-primary/20 text-primary font-semibold text-sm hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.97] transition-all duration-200"
          >
            <Mail size={15} className="shrink-0" />
            {t("hero.cta2")}
          </a>
        </motion.div>

        {/* Liens sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <a
            href="https://linkedin.com/in/duthiljean"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-muted-foreground border border-border/50 bg-card/60 hover:text-accent hover:border-accent/30 hover:bg-card transition-all duration-200 shadow-sm"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
          <span className="w-px h-4 bg-border/60" />
          <a
            href="mailto:jean.duthil13@gmail.com"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-muted-foreground border border-border/50 bg-card/60 hover:text-accent hover:border-accent/30 hover:bg-card transition-all duration-200 shadow-sm"
          >
            <Mail size={14} />
            jean.duthil13@gmail.com
          </a>
        </motion.div>

        {/* Flèche bas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 md:mt-10"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-flex text-muted-foreground/40 hover:text-accent transition-colors"
          >
            <ArrowDown size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
