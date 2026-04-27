import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const getInitialLang = (): Lang => {
  const stored = localStorage.getItem("portfolio-lang");
  if (stored === "fr" || stored === "en") return stored;
  return "fr";
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Lang, Record<string, string>> = {
  fr: {
    // Navbar
    "nav.about": "À propos",
    "nav.experience": "Expériences",
    "nav.education": "Formation",
    "nav.skills": "Compétences",
    "nav.contact": "Contact",

    // Hero
    "hero.badge": "Recherche alternance — Septembre 2026",
    "hero.dateline": "Marseille · Bordeaux · Bruxelles · ’26",
    "hero.cta1": "Voir mon parcours",
    "hero.cta2": "Me contacter",
    "hero.role1": "Builder IA",
    "hero.role2": "Business Developer",
    "hero.role3": "Product Thinker",

    // About
    "about.title": "À propos",
    "about.kicker": "À PROPOS",
    "about.dateline": "BORDEAUX — BRUXELLES — 2026",
    "about.headline1": "Construire des produits.",
    "about.headline2": "Développer des activités.",
    "about.headline3": "Avec l'IA comme levier.",
    "about.bio":
      "Actuellement en stage chez Roofwander à Bruxelles, j'ai aussi lancé AdDetective — un SaaS d'analyse d'annonces propulsé par l'IA. De la prospection à la mise en production.",
    "about.description":
      "Je conçois des produits et développe des activités en utilisant l'IA comme levier — de la prospection à la mise en production. Actuellement en stage chez Roofwander, j'ai aussi lancé AdDetective, un SaaS d'analyse d'annonces propulsé par l'IA.",
    "about.location": "Bordeaux, France",
    "about.phone": "07 60 04 90 11",
    "about.rhythm": "Rythme : 2 sem. entreprise / 1 sem. école",
    "about.languages": "Français (natif) · Anglais (B2) · Espagnol (B1)",
    "about.stat1": "locations gérées",
    "about.stat2": "bateaux gérés",
    "about.stat3": "produits construits avec l'IA",
    "about.now_label": "EN CE MOMENT",
    "about.now_1_title": "Roofwander",
    "about.now_1_desc": "Business Dev · Bruxelles",
    "about.now_2_title": "AdDetective",
    "about.now_2_desc": "SaaS IA · solo",

    // Experience
    "exp.title": "Expériences",
    "exp.current": "En cours",
    "exp.entries_label": "ENTRÉES",

    // Experience entries
    "exp.roofwander.title": "Business Developer & Partnerships",
    "exp.roofwander.type": "Stage",
    "exp.roofwander.dates": "Mars 2026 — Présent",
    "exp.roofwander.location": "Bruxelles, Belgique",
    "exp.roofwander.description":
      "Marketplace de location de tentes de toit entre particuliers et professionnels.\n→ Prospection et closing de partenariats avec revendeurs et marques outdoor\n→ Acquisition et onboarding de propriétaires sur la plateforme\n→ Structuration des process commerciaux et du CRM\n→ Automatisations IA (Claude, Cursor) pour qualifier les leads et accélérer les opérations",
    "exp.roofwander.badge1": "Partenariats B2B",
    "exp.roofwander.badge2": "Growth & SEO",
    "exp.roofwander.badge3": "Automatisations IA",

    "exp.addetective.title": "Fondateur — SaaS IA",
    "exp.addetective.type": "Projet entrepreneurial",
    "exp.addetective.dates": "Janvier 2026 — Présent",
    "exp.addetective.location": "Marseille, France",
    "exp.addetective.description":
      "SaaS d'analyse d'annonces immobilières et véhicules par IA, conçu et développé en solo.\n→ Analyse texte + photos, score de risque, points de vigilance et marge de négociation en 30s\n→ Stack : React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ Développé intégralement avec Cursor et Claude Code, du prototype à la production",
    "exp.addetective.badge1": "Produit solo",
    "exp.addetective.badge2": "SaaS IA",
    "exp.addetective.badge3": "Idée → Prod",

    "exp.adayboat.title": "Boat Manager",
    "exp.adayboat.type": "Stage",
    "exp.adayboat.dates": "Avril — Août 2025",
    "exp.adayboat.location": "Lège-Cap-Ferret, France",
    "exp.adayboat.description":
      "Gestion opérationnelle d'une base nautique en haute saison.\n→ 200+ locations gérées, flotte de 11 bateaux\n→ Parcours client complet : accueil, contrats, briefing sécurité, gestion des incidents\n→ Création des supports de marque et merchandising\n→ Lettre de recommandation du gérant",
    "exp.adayboat.badge1": "11 bateaux",
    "exp.adayboat.badge2": "200+ locations",
    "exp.adayboat.badge3": "Lettre de reco",

    "exp.zeboat.title": "Boat Manager",
    "exp.zeboat.type": "CDD",
    "exp.zeboat.dates": "Juillet — Août 2024",
    "exp.zeboat.location": "Marseille, France",
    "exp.zeboat.description":
      "Gestion d'une flotte de ~19 bateaux sur le Vieux-Port en pleine saison.\n→ 200+ locations gérées sur 2 mois\n→ Préparation, accueil clients, briefing et gestion des retours\n→ Première expérience en gestion de flotte nautique",
    "exp.zeboat.badge1": "~19 bateaux",
    "exp.zeboat.badge2": "200+ locations",

    "exp.bde.title": "Responsable Pôle Événementiel",
    "exp.bde.type": "Associatif",
    "exp.bde.dates": "Janvier 2025 — Janvier 2026",
    "exp.bde.location": "Bordeaux, France",
    "exp.bde.description":
      "→ Organisation d'événements étudiants (soirées, week-ends d'intégration, activités sportives)\n→ Coordination d'équipes et gestion de prestataires\n→ Création de concepts originaux pour animer la vie associative",
    "exp.bde.badge1": "Événementiel",
    "exp.bde.badge2": "Gestion d'équipe",
    "exp.bde.badge3": "BDE 2025",

    "exp.coquille.title": "Co-fondateur",
    "exp.coquille.type": "Indépendant",
    "exp.coquille.dates": "Mars 2023 — Juillet 2024",
    "exp.coquille.location": "Marseille, France",
    "exp.coquille.description":
      "Marque de coques de téléphone inspirées de Marseille, co-fondée à 17 ans.\n→ Création de la marque, design produit et identité visuelle\n→ Mise en place du e-commerce et de la stratégie de communication\n→ Gestion des commandes, stocks et relation client",
    "exp.coquille.badge1": "Entrepreneuriat",
    "exp.coquille.badge2": "E-commerce",
    "exp.coquille.badge3": "Branding",

    "exp.armees.title": "Stagiaire découverte",
    "exp.armees.type": "Stage",
    "exp.armees.dates": "Février — Mars 2021",
    "exp.armees.location": "Toulon, France",
    "exp.armees.description":
      "→ Immersion en base aéronavale : services techniques, unités spécialisées\n→ Échanges avec le personnel civil et militaire sur les métiers de la Défense",
    "exp.armees.badge1": "Défense",
    "exp.armees.badge2": "Stage découverte",

    // Education
    "edu.title": "Formation",
    "edu.dateline": "1 DIPLÔME · 3 CERTIFICATIONS",
    "edu.degree_kicker": "BACHELOR · INTERNATIONAL BUSINESS",
    "edu.degree": "Bachelor en Management International — International Business",
    "edu.dates": "2023 — 2026",
    "edu.bde": "VP du Bureau Des Étudiants",
    "edu.certs": "Certifications",
    "edu.anthropic.count": "3 certifications · 2025",
    "edu.mooc.org": "ESSCA · 2025",
    "edu.ai.org": "Compétences et Métiers · 2024",

    // Skills
    "skills.title": "Ce que je sais faire.",
    "skills.kicker": "COMPÉTENCES",
    "skills.dateline": "3 AXES · USAGE QUOTIDIEN",
    "skills.subtitle": "Construire, développer et optimiser des produits en utilisant l'IA comme levier.",
    "skills.cat1.title": "Construire avec l'IA",
    "skills.cat1.desc": "Outils maîtrisés au quotidien pour concevoir et expédier.",
    "skills.cat2.title": "Développer le business",
    "skills.cat2.desc": "Acquisition, croissance et partenariats opérationnels.",
    "skills.cat3.title": "Concevoir le produit",
    "skills.cat3.desc": "Du cadrage stratégique à la mise en production.",
    "skills.legend": "Usage quotidien",
    "skills.tooltip.daily": "Usage quotidien",
    "skills.tooltip.project": "Appliqué en projet",
    "skills.tooltip.operational": "Expérience opérationnelle",
    "skills.pill.saas": "Développement SaaS",

    // Contact
    "contact.title": "Envie de travailler ensemble ?",
    "contact.subtitle": "Je cherche une alternance à partir de septembre 2026 en Business Dev, Product ou IA appliquée.",
    "contact.download": "Télécharger CV (PDF)",
    "footer.made": "Fait avec React, Tailwind & Framer Motion",
  },
  en: {
    // Navbar
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.skills": "Skills",
    "nav.contact": "Contact",

    // Hero
    "hero.badge": "Looking for an internship — September 2026",
    "hero.dateline": "Marseille · Bordeaux · Brussels · ’26",
    "hero.cta1": "View my background",
    "hero.cta2": "Contact me",
    "hero.role1": "AI Builder",
    "hero.role2": "Business Developer",
    "hero.role3": "Product Thinker",

    // About
    "about.title": "About",
    "about.kicker": "ABOUT",
    "about.dateline": "BORDEAUX — BRUSSELS — 2026",
    "about.headline1": "Build products.",
    "about.headline2": "Grow businesses.",
    "about.headline3": "With AI as the lever.",
    "about.bio":
      "Currently interning at Roofwander in Brussels, I also launched AdDetective — an AI-powered listing analysis SaaS. From prospecting to production.",
    "about.description":
      "I build products and grow businesses using AI as a lever — from prospecting to production. Currently interning at Roofwander, I also launched AdDetective, an AI-powered listing analysis SaaS.",
    "about.location": "Bordeaux, France",
    "about.phone": "07 60 04 90 11",
    "about.rhythm": "Schedule: 2 weeks company / 1 week school",
    "about.languages": "French (native) · English (B2) · Spanish (B1)",
    "about.stat1": "rentals managed",
    "about.stat2": "boats managed",
    "about.stat3": "products built with AI",
    "about.now_label": "CURRENTLY",
    "about.now_1_title": "Roofwander",
    "about.now_1_desc": "Business Dev · Brussels",
    "about.now_2_title": "AdDetective",
    "about.now_2_desc": "AI SaaS · solo",

    // Experience
    "exp.title": "Experience",
    "exp.current": "Current",
    "exp.entries_label": "ENTRIES",

    "exp.roofwander.title": "Business Developer & Partnerships",
    "exp.roofwander.type": "Internship",
    "exp.roofwander.dates": "March 2026 — Present",
    "exp.roofwander.location": "Brussels, Belgium",
    "exp.roofwander.description":
      "Rooftop tent rental marketplace for individuals and professionals.\n→ Prospecting and closing partnerships with retailers and outdoor brands\n→ Acquiring and onboarding owners onto the platform\n→ Structuring sales processes and CRM\n→ AI automations (Claude, Cursor) to qualify leads and accelerate operations",
    "exp.roofwander.badge1": "B2B Partnerships",
    "exp.roofwander.badge2": "Growth & SEO",
    "exp.roofwander.badge3": "AI Automations",

    "exp.addetective.title": "Founder — AI SaaS",
    "exp.addetective.type": "Entrepreneurial project",
    "exp.addetective.dates": "January 2026 — Present",
    "exp.addetective.location": "Marseille, France",
    "exp.addetective.description":
      "AI-powered listing analysis SaaS for real estate and vehicles, designed and built solo.\n→ Text + photo analysis, risk score, red flags and negotiation margin in 30s\n→ Stack: React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ Fully built with Cursor and Claude Code, from prototype to production",
    "exp.addetective.badge1": "Solo product",
    "exp.addetective.badge2": "AI SaaS",
    "exp.addetective.badge3": "Idea → Prod",

    "exp.adayboat.title": "Boat Manager",
    "exp.adayboat.type": "Internship",
    "exp.adayboat.dates": "April — August 2025",
    "exp.adayboat.location": "Lège-Cap-Ferret, France",
    "exp.adayboat.description":
      "Operational management of a boat rental base during peak season.\n→ 200+ rentals managed, fleet of 11 boats\n→ Full customer journey: reception, contracts, safety briefing, incident management\n→ Creation of brand materials and merchandising\n→ Recommendation letter from the manager",
    "exp.adayboat.badge1": "11 boats",
    "exp.adayboat.badge2": "200+ rentals",
    "exp.adayboat.badge3": "Recommendation",

    "exp.zeboat.title": "Boat Manager",
    "exp.zeboat.type": "Fixed-term contract",
    "exp.zeboat.dates": "July — August 2024",
    "exp.zeboat.location": "Marseille, France",
    "exp.zeboat.description":
      "Managing a fleet of ~19 boats on the Old Port during peak season.\n→ 200+ rentals managed over 2 months\n→ Preparation, customer welcome, briefing and returns management\n→ First experience in fleet management",
    "exp.zeboat.badge1": "~19 boats",
    "exp.zeboat.badge2": "200+ rentals",

    "exp.bde.title": "Head of Events",
    "exp.bde.type": "Student association",
    "exp.bde.dates": "January 2025 — January 2026",
    "exp.bde.location": "Bordeaux, France",
    "exp.bde.description":
      "→ Organizing student events (parties, orientation weekends, sports activities)\n→ Team coordination and vendor management\n→ Creating original concepts to energize campus life",
    "exp.bde.badge1": "Events",
    "exp.bde.badge2": "Team management",
    "exp.bde.badge3": "Student union 2025",

    "exp.coquille.title": "Co-founder",
    "exp.coquille.type": "Freelance",
    "exp.coquille.dates": "March 2023 — July 2024",
    "exp.coquille.location": "Marseille, France",
    "exp.coquille.description":
      "Phone case brand inspired by Marseille, co-founded at age 17.\n→ Brand creation, product design and visual identity\n→ E-commerce setup and communication strategy\n→ Order, stock and customer relationship management",
    "exp.coquille.badge1": "Entrepreneurship",
    "exp.coquille.badge2": "E-commerce",
    "exp.coquille.badge3": "Branding",

    "exp.armees.title": "Discovery intern",
    "exp.armees.type": "Internship",
    "exp.armees.dates": "February — March 2021",
    "exp.armees.location": "Toulon, France",
    "exp.armees.description":
      "→ Immersion at a naval air base: technical services, specialized units\n→ Exchanges with civilian and military personnel about Defense careers",
    "exp.armees.badge1": "Defense",
    "exp.armees.badge2": "Discovery internship",

    // Education
    "edu.title": "Education",
    "edu.dateline": "1 DEGREE · 3 CERTIFICATIONS",
    "edu.degree_kicker": "BACHELOR · INTERNATIONAL BUSINESS",
    "edu.degree": "Bachelor in International Management — International Business",
    "edu.dates": "2023 — 2026",
    "edu.bde": "VP of the Student Union",
    "edu.certs": "Certifications",
    "edu.anthropic.count": "3 certifications · 2025",
    "edu.mooc.org": "ESSCA · 2025",
    "edu.ai.org": "Compétences et Métiers · 2024",

    // Skills
    "skills.title": "What I can do.",
    "skills.kicker": "CAPABILITIES",
    "skills.dateline": "3 AXES · DAILY USE",
    "skills.subtitle": "Build, grow and optimize products using AI as a lever.",
    "skills.cat1.title": "Build with AI",
    "skills.cat1.desc": "Tools mastered daily to design and ship.",
    "skills.cat2.title": "Grow the business",
    "skills.cat2.desc": "Acquisition, growth and operational partnerships.",
    "skills.cat3.title": "Design the product",
    "skills.cat3.desc": "From strategic framing to production deployment.",
    "skills.legend": "Daily use",
    "skills.tooltip.daily": "Daily use",
    "skills.tooltip.project": "Applied in projects",
    "skills.tooltip.operational": "Operational experience",
    "skills.pill.saas": "SaaS Development",

    // Contact
    "contact.title": "Want to work together?",
    "contact.subtitle": "I'm looking for an internship starting September 2026 in Business Dev, Product or Applied AI.",
    "contact.download": "Download CV (PDF)",
    "footer.made": "Built with React, Tailwind & Framer Motion",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (newLang: Lang) => {
    localStorage.setItem("portfolio-lang", newLang);
    setLangState(newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] ?? translations.fr[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
