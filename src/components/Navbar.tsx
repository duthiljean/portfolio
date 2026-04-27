import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/hooks/use-theme";

type CursorPos = { left: number; width: number; opacity: number };

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [cursor, setCursor] = useState<CursorPos>({ left: 0, width: 0, opacity: 0 });
  const { lang, setLang, t } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const navListRef = useRef<HTMLUListElement>(null);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const navLinks = [
    { label: t("nav.about"), href: "#about", id: "about" },
    { label: t("nav.experience"), href: "#experience", id: "experience" },
    { label: t("nav.education"), href: "#education", id: "education" },
    { label: t("nav.skills"), href: "#skills", id: "skills" },
    { label: t("nav.contact"), href: "#contact", id: "contact" },
  ];

  // Section under the cursor: hovered wins, else active
  const litSection = hoveredSection ?? activeSection;

  // Snap cursor to the lit section tab
  const snapCursor = useCallback(() => {
    const list = navListRef.current;
    if (!list) return;
    if (!litSection) {
      setCursor((c) => ({ ...c, opacity: 0 }));
      return;
    }
    const el = list.querySelector<HTMLLIElement>(`[data-section="${litSection}"]`);
    if (!el) {
      setCursor((c) => ({ ...c, opacity: 0 }));
      return;
    }
    setCursor({
      left: el.offsetLeft,
      width: el.getBoundingClientRect().width,
      opacity: 1,
    });
  }, [litSection]);

  useEffect(() => {
    snapCursor();
  }, [snapCursor]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);

        const sections = ["about", "experience", "education", "skills", "contact"];
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120) current = id;
          }
        }
        setActiveSection(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-background/[0.82] backdrop-blur-xl border-b border-border shadow-[0_10px_35px_-30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-foreground origin-left"
          style={{ width: progressWidth }}
        />
      )}

      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <a
          href="#hero"
          aria-label="Jean Duthil"
          className="inline-flex items-center gap-2 text-foreground"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-foreground text-background text-xs font-bold tracking-tight">
            JD
          </span>
          <span className="hidden sm:inline text-sm font-semibold tracking-tight">
            Jean Duthil
          </span>
        </a>

        {/* Desktop — hover cursor nav */}
        <ul
          ref={navListRef}
          onMouseLeave={() => setHoveredSection(null)}
          className="relative hidden md:flex items-center rounded-full border border-border bg-card/[0.82] p-1 shadow-sm backdrop-blur-md"
        >
          <motion.li
            aria-hidden
            animate={cursor}
            transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
            className="absolute top-1 left-0 z-0 h-[calc(100%-0.5rem)] rounded-full bg-foreground pointer-events-none"
          />
          {navLinks.map((l) => {
            const isLit = litSection === l.id;
            return (
              <li
                key={l.href}
                data-section={l.id}
                onMouseEnter={() => setHoveredSection(l.id)}
                className="relative z-10"
              >
                <a
                  href={l.href}
                  aria-current={activeSection === l.id ? "page" : undefined}
                  className={`block px-4 py-1.5 text-xs font-medium uppercase tracking-wide select-none transition-colors duration-200 ${
                    isLit ? "text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
            title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: -45, scale: 0.6 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <span aria-hidden className="h-4 w-px bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Toggle language"
          >
            <Globe size={13} />
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
            className="relative inline-flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: -45, scale: 0.6 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            aria-label="Toggle language"
          >
            <Globe size={15} />
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <button
            type="button"
            className="p-2 text-foreground rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — floating pill panel matching desktop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 top-14 z-40 bg-background/40 backdrop-blur-[2px]"
            />

            {/* Panel */}
            <motion.ul
              id="mobile-navigation"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute top-full right-4 z-50 mt-2 min-w-[240px] rounded-2xl border border-border bg-card p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]"
            >
              {navLinks.map((l) => {
                const isActive = activeSection === l.id;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
