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

/**
 * Seules les chaînes réellement consommées via `t()` vivent ici.
 * Le contenu des sections Hero / About / Skills / Education est bilingue
 * dans `src/lib/fallback-content.ts` — ne pas le dupliquer ici.
 */
const translations: Record<Lang, Record<string, string>> = {
  fr: {
    // Navbar
    "nav.about": "À propos",
    "nav.cleo": "Cléo",
    "nav.experience": "Expériences",
    "nav.education": "Formation",
    "nav.skills": "Compétences",
    "nav.contact": "Contact",

    // Experience — chrome
    "exp.title": "Expériences",
    "exp.current": "En cours",
    "exp.upcoming": "À venir",

    // Experience — entries
    "exp.betclic.title": "Alternant — Squad Gen AI Transformation",
    "exp.betclic.type": "Alternance",
    "exp.betclic.dates": "Septembre 2026 →",
    "exp.betclic.location": "Bordeaux, France",
    "exp.betclic.description":
      "Alternance de 3e année dans la squad qui pilote l'adoption de l'IA générative dans le groupe. Ce que je vais y faire :\n→ Identifier et cadrer les cas d'usage Gen AI avec les équipes métier\n→ Automatiser des workflows et tester des agents en conditions réelles\n→ Accompagner les équipes et diffuser les bonnes pratiques\n→ Mesurer l'adoption et l'impact réel des outils déployés",
    "exp.betclic.badge1": "Gen AI",
    "exp.betclic.badge2": "Adoption & change",
    "exp.betclic.badge3": "Automatisation",

    "exp.cleo.title": "Fondateur — Cléo",
    "exp.cleo.type": "Projet entrepreneurial",
    "exp.cleo.dates": "Juin 2026 — Présent",
    "exp.cleo.location": "Marseille, France",
    "exp.cleo.description":
      "Livrets d'accueil numériques pour hôtes Airbnb, gîtes et conciergeries. Produit, code, infra et support en solo.\n→ 150+ livrets créés depuis le lancement, 4,4/5 sur Trustpilot\n→ Génération depuis une annonce : scraping Apify, mapping déterministe, puis LLM contraint à citer un extrait exact de la source\n→ Vérification serveur de chaque consigne générée — sans preuve dans l'annonce, l'info est jetée\n→ Assistant voyageur multilingue, partage par lien ou QR code, sans application\n→ 29 € à vie par livret, 69 € clé en main, sur-mesure pour les conciergeries",
    "exp.cleo.badge1": "150+ livrets",
    "exp.cleo.badge2": "4,4/5 Trustpilot",
    "exp.cleo.badge3": "Produit solo",

    "exp.roofwander.title": "Business Developer & Partnerships",
    "exp.roofwander.type": "Stage",
    "exp.roofwander.dates": "Mars — Août 2026",
    "exp.roofwander.location": "Bruxelles, Belgique",
    "exp.roofwander.description":
      "Marketplace de location de tentes de toit entre particuliers et professionnels.\n→ Prospection et closing de partenariats avec revendeurs et marques outdoor\n→ Acquisition et onboarding de propriétaires sur la plateforme\n→ Structuration des process commerciaux et du CRM\n→ Automatisations IA pour qualifier les leads et accélérer les opérations",
    "exp.roofwander.badge1": "Partenariats B2B",
    "exp.roofwander.badge2": "Growth & SEO",
    "exp.roofwander.badge3": "Automatisations IA",

    "exp.addetective.title": "Fondateur — SaaS IA",
    "exp.addetective.type": "Projet entrepreneurial",
    "exp.addetective.dates": "Janvier — Juin 2026",
    "exp.addetective.location": "Marseille, France",
    "exp.addetective.description":
      "SaaS d'analyse d'annonces immobilières et véhicules par IA, conçu et développé en solo.\n→ Analyse texte + photos, score de risque et marge de négociation estimée en 30s\n→ Stack : React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ Premier produit mené de l'idée à la mise en production",
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

    // Contact
    "contact.toast.emailCopied": "Email copié",
    "contact.toast.emailCopiedDesc": "Collé dans le presse-papiers.",
    "contact.toast.copyFailed": "Copie impossible",
    "contact.toast.cvDownloaded": "CV téléchargé",
    "contact.toast.cvDownloadedDesc": "Vérifie ton dossier Téléchargements.",
    "contact.toast.downloadFailed": "Échec du téléchargement",
    "contact.toast.tryAgainDesc": "Réessaie dans un instant.",
    "contact.aria.copyEmail": "Copier l'email",
    "contact.aria.downloadCv": "Télécharger le CV en PDF",
    "contact.cv.generating": "Génération…",
    "contact.cv.download": "Télécharger le CV",
    "contact.cv.pick": "Choisir la langue",
    "contact.cv.fr": "Version française",
    "contact.cv.en": "English version",

    "footer.made": "Construit avec l'IA",
  },
  en: {
    // Navbar
    "nav.about": "About",
    "nav.cleo": "Cléo",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.skills": "Skills",
    "nav.contact": "Contact",

    // Experience — chrome
    "exp.title": "Experience",
    "exp.current": "Current",
    "exp.upcoming": "Upcoming",

    // Experience — entries
    "exp.betclic.title": "Apprentice — Gen AI Transformation Squad",
    "exp.betclic.type": "Apprenticeship",
    "exp.betclic.dates": "September 2026 →",
    "exp.betclic.location": "Bordeaux, France",
    "exp.betclic.description":
      "Final-year apprenticeship in the squad driving generative AI adoption across the group. What I'll be doing there:\n→ Identifying and scoping Gen AI use cases with business teams\n→ Automating workflows and testing agents in real conditions\n→ Supporting teams and spreading good practices\n→ Measuring adoption and the real impact of what ships",
    "exp.betclic.badge1": "Gen AI",
    "exp.betclic.badge2": "Adoption & change",
    "exp.betclic.badge3": "Automation",

    "exp.cleo.title": "Founder — Cléo",
    "exp.cleo.type": "Entrepreneurial project",
    "exp.cleo.dates": "June 2026 — Present",
    "exp.cleo.location": "Marseille, France",
    "exp.cleo.description":
      "Digital welcome books for Airbnb hosts, guesthouses and property managers. Product, code, infra and support, solo.\n→ 150+ booklets created since launch, 4.4/5 on Trustpilot\n→ Generated from a listing: Apify scraping, deterministic mapping, then an LLM forced to quote an exact excerpt from the source\n→ Server-side verification of every generated instruction — no proof in the listing, no output\n→ Multilingual guest assistant, shared by link or QR code, no app required\n→ €29 lifetime per booklet, €69 done-for-you, custom pricing for property managers",
    "exp.cleo.badge1": "150+ booklets",
    "exp.cleo.badge2": "4.4/5 Trustpilot",
    "exp.cleo.badge3": "Solo product",

    "exp.roofwander.title": "Business Developer & Partnerships",
    "exp.roofwander.type": "Internship",
    "exp.roofwander.dates": "March — August 2026",
    "exp.roofwander.location": "Brussels, Belgium",
    "exp.roofwander.description":
      "Rooftop tent rental marketplace for individuals and professionals.\n→ Prospecting and closing partnerships with retailers and outdoor brands\n→ Acquiring and onboarding owners onto the platform\n→ Structuring sales processes and CRM\n→ AI automations to qualify leads and speed up operations",
    "exp.roofwander.badge1": "B2B Partnerships",
    "exp.roofwander.badge2": "Growth & SEO",
    "exp.roofwander.badge3": "AI Automations",

    "exp.addetective.title": "Founder — AI SaaS",
    "exp.addetective.type": "Entrepreneurial project",
    "exp.addetective.dates": "January — June 2026",
    "exp.addetective.location": "Marseille, France",
    "exp.addetective.description":
      "AI-powered listing analysis SaaS for real estate and vehicles, designed and built solo.\n→ Text + photo analysis, risk score and estimated negotiation margin in 30s\n→ Stack: React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ First product taken from idea all the way to production",
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

    // Contact
    "contact.toast.emailCopied": "Email copied",
    "contact.toast.emailCopiedDesc": "Pasted to clipboard.",
    "contact.toast.copyFailed": "Copy failed",
    "contact.toast.cvDownloaded": "Resume downloaded",
    "contact.toast.cvDownloadedDesc": "Check your Downloads folder.",
    "contact.toast.downloadFailed": "Download failed",
    "contact.toast.tryAgainDesc": "Try again in a moment.",
    "contact.aria.copyEmail": "Copy email address",
    "contact.aria.downloadCv": "Download resume as PDF",
    "contact.cv.generating": "Generating…",
    "contact.cv.download": "Download resume",
    "contact.cv.pick": "Choose language",
    "contact.cv.fr": "French version",
    "contact.cv.en": "English version",

    "footer.made": "Built with AI",
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
