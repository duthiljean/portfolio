import { Mail, Linkedin, Phone, Download, MapPin, Clock, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const Contact = () => {
  const { t, lang } = useLanguage();

  const infoCards = [
    {
      icon: MapPin,
      label: "Bordeaux",
      sub: "France",
    },
    {
      icon: Calendar,
      label: "Sept. 2026",
      sub: lang === "fr" ? "Disponible" : "Available",
    },
    {
      icon: Clock,
      label: "< 24h",
      sub: lang === "fr" ? "Réponse" : "Response",
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-4 md:px-8 bg-primary relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "hsl(var(--accent) / 0.12)" }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full blur-3xl" style={{ background: "hsl(var(--accent) / 0.06)" }} />
      </div>

      <div className="container mx-auto max-w-2xl relative z-10">

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-primary-foreground/80 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {lang === "fr" ? "Disponible dès septembre 2026" : "Available from September 2026"}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl md:text-5xl font-bold text-primary-foreground text-center mb-4 leading-tight tracking-tight"
        >
          {t("contact.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="text-primary-foreground/60 text-lg text-center mb-12 max-w-md mx-auto leading-relaxed"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {t("contact.subtitle")}
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          {infoCards.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.22 + i * 0.07 }}
              className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-4 text-center hover:bg-white/[0.11] transition-colors duration-200"
            >
              <Icon size={16} className="text-accent-light mx-auto mb-2 opacity-75" />
              <div className="text-primary-foreground font-semibold text-sm">{label}</div>
              <div className="text-primary-foreground/45 text-xs mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Primary CTA — Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mb-3"
        >
          <a
            href="mailto:jean.duthil13@gmail.com"
            className="group flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-primary-foreground text-primary shadow-lg hover:shadow-xl hover:scale-[1.015] active:scale-[0.99] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <Mail size={19} className="text-primary" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-primary/45 font-medium mb-0.5 uppercase tracking-wide">
                  {lang === "fr" ? "M'envoyer un email" : "Send me an email"}
                </div>
                <div className="text-primary font-semibold text-sm md:text-base">
                  jean.duthil13@gmail.com
                </div>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0"
            />
          </a>
        </motion.div>

        {/* Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          <a
            href="tel:+33760049011"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white/[0.07] border border-white/[0.12] text-primary-foreground hover:bg-white/[0.14] hover:border-white/25 active:scale-[0.97] transition-all duration-200"
          >
            <Phone size={17} className="text-accent-light opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-medium text-primary-foreground/80">07 60 04 90 11</span>
          </a>
          <a
            href="https://linkedin.com/in/duthiljean"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white/[0.07] border border-white/[0.12] text-primary-foreground hover:bg-white/[0.14] hover:border-white/25 active:scale-[0.97] transition-all duration-200"
          >
            <Linkedin size={17} className="text-accent-light opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-medium text-primary-foreground/80">LinkedIn</span>
          </a>
          <a
            href="/documents/cv-jean-duthil.pdf"
            download
            className="group flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white/[0.07] border border-white/[0.12] text-primary-foreground hover:bg-white/[0.14] hover:border-white/25 active:scale-[0.97] transition-all duration-200"
          >
            <Download size={17} className="text-accent-light opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-medium text-primary-foreground/80">CV (PDF)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary border-t border-white/10 py-6 px-4">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primary-foreground/50">
        <span>&copy; {new Date().getFullYear()} Jean Duthil</span>
        <span>{t("footer.made")}</span>
      </div>
    </footer>
  );
};

export { Contact, Footer };
export default Contact;
