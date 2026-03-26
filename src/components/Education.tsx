import { useState } from "react";
import { Award, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import esscaLogo from "@/assets/essca-logo.jpeg";
import moocCert from "@/assets/mooc-creative-box-cert.webp";
import anthropicLogo from "@/assets/anthropic-logo.png";
import competencesMetiersLogo from "@/assets/competences-metiers-logo.jpeg";
import { useLanguage } from "@/i18n/LanguageContext";

interface Certification {
  title: string;
  link?: string;
  image?: string;
}

const anthropicCerts: Certification[] = [
  { title: "Claude 101", link: "https://verify.skilljar.com/c/3r3qkq4786i3" },
  { title: "Claude Code in Action", link: "https://verify.skilljar.com/c/fgsjkvmybimm" },
  { title: "Introduction to Claude Cowork", link: "https://verify.skilljar.com/c/5dmj2uzcgpku" },
];

const otherCerts: Certification[] = [
  { title: "MOOC Creative Box", image: moocCert },
  { title: "AI Training — Prompt Engineering" },
];

const AnthropicCard = ({ delay, isOpen, onToggle }: { delay: number; isOpen: boolean; onToggle: () => void }) => {
  const { t } = useLanguage();
  return (
    <ScrollReveal delay={delay}>
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        className="w-full text-left bg-card rounded-xl p-4 sm:p-5 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <img src={anthropicLogo} alt="Anthropic" className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Anthropic</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {t("edu.anthropic.count")}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <ChevronDown size={14} className="text-muted-foreground shrink-0 mt-0.5 sm:w-4 sm:h-4" />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto", transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ height: 0, transition: { duration: 0.2, ease: [0.55, 0.085, 0.68, 0.53] } }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, y: 4, transition: { duration: 0.12, ease: [0.55, 0.085, 0.68, 0.53] } }}
              >
                <div className="pt-3 sm:pt-4 border-t border-border mt-3 sm:mt-4 space-y-2">
                  {anthropicCerts.map((c) => (
                    <div key={c.title} className="flex items-center gap-2">
                      <Award size={12} className="text-accent shrink-0" />
                      {c.link ? (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-foreground hover:text-accent transition-colors underline underline-offset-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.title}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-foreground">{c.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </ScrollReveal>
  );
};

const CertCard = ({ cert, delay, isOpen, onToggle }: { cert: Certification; delay: number; isOpen: boolean; onToggle: () => void }) => {
  const { t } = useLanguage();
  return (
    <ScrollReveal delay={delay}>
      <motion.button
        onClick={() => cert.image && onToggle()}
        whileTap={cert.image ? { scale: 0.98 } : undefined}
        className={`w-full text-left bg-card rounded-xl p-4 sm:p-5 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${cert.image ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 sm:gap-3">
            {cert.title === "MOOC Creative Box" ? (
              <img src={esscaLogo} alt="ESSCA" className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
            ) : cert.title === "AI Training — Prompt Engineering" ? (
              <img src={competencesMetiersLogo} alt="Compétences et Métiers" className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Award size={15} className="text-accent" />
              </div>
            )}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{cert.title}</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {cert.title === "MOOC Creative Box" ? t("edu.mooc.org") : t("edu.ai.org")}
              </p>
            </div>
          </div>
          {cert.image && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <ChevronDown size={14} className="text-muted-foreground shrink-0 mt-0.5 sm:w-4 sm:h-4" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {isOpen && cert.image && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto", transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ height: 0, transition: { duration: 0.2, ease: [0.55, 0.085, 0.68, 0.53] } }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, y: 4, transition: { duration: 0.12, ease: [0.55, 0.085, 0.68, 0.53] } }}
              >
                <img src={cert.image} alt={cert.title} className="w-full rounded-lg mt-3 sm:mt-4 shadow-sm" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </ScrollReveal>
  );
};

const Education = () => {
  const { t } = useLanguage();
  const [openCertIndex, setOpenCertIndex] = useState<number | null>(null);

  const allCerts = [
    { type: "anthropic" as const },
    ...otherCerts.map((c) => ({ type: "other" as const, cert: c })),
  ];

  return (
    <section id="education" className="py-16 md:py-28 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 sm:mb-12 text-center">{t("edu.title")}</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-card rounded-xl p-5 sm:p-6 md:p-8 shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 max-w-xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <img src={esscaLogo} alt="ESSCA" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">ESSCA School of Management</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {t("edu.degree")}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{t("edu.dates")}</p>
                <p className="text-[11px] sm:text-xs font-medium text-accent mt-2">{t("edu.bde")}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h3 className="text-lg sm:text-xl font-semibold text-primary mt-12 sm:mt-16 mb-4 sm:mb-6 text-center">{t("edu.certs")}</h3>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
          {allCerts.map((item, i) =>
            item.type === "anthropic" ? (
              <AnthropicCard
                key="anthropic"
                delay={0.25}
                isOpen={openCertIndex === i}
                onToggle={() => setOpenCertIndex(openCertIndex === i ? null : i)}
              />
            ) : (
              <CertCard
                key={item.cert!.title}
                cert={item.cert!}
                delay={0.33 + (i - 1) * 0.08}
                isOpen={openCertIndex === i}
                onToggle={() => setOpenCertIndex(openCertIndex === i ? null : i)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
