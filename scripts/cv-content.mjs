/**
 * Contenu du CV — source unique de vérité (FR + EN).
 * Rendu en PDF par `node scripts/build-cv.mjs` → public/documents/.
 * Aligné sur src/components/experienceData.ts, src/i18n/LanguageContext.tsx
 * et src/lib/fallback-content.ts. Mettre à jour ici ET là-bas.
 *
 * Dans les puces, `**texte**` est rendu en gras.
 */

const CONTACT = {
  name: "Jean Duthil",
  email: "jean.duthil13@gmail.com",
  phone: "+33 7 60 04 90 11",
  linkedin: "linkedin.com/in/duthiljean",
  site: "jeanduthil.com",
};

export const cv = {
  fr: {
    ...CONTACT,
    badge: "Alternance signée · Betclic · Sept. 2026",
    role: "Builder IA · Product & Business Developer",
    place: "Bordeaux, France",
    summary:
      "Je construis des produits avec l'IA et je les confronte au réel. Fondateur de **Cléo** — 150+ livrets d'accueil créés, 4,4/5 sur Trustpilot, produit mené en solo. En septembre 2026, je rejoins la squad **Gen AI Transformation de Betclic**.",
    labels: {
      experience: "Expérience",
      education: "Formation",
      skills: "Compétences",
      certifications: "Certifications",
      languages: "Langues",
      upcoming: "À venir",
      current: "En cours",
    },
    experiences: [
      {
        title: "Alternant — Squad Gen AI Transformation",
        company: "Betclic",
        type: "Alternance",
        location: "Bordeaux",
        dates: "Sept. 2026 →",
        tag: "upcoming",
        bullets: [
          "Cadrage des cas d'usage Gen AI avec les équipes métier, du besoin au périmètre testable",
          "Automatisation de workflows, agents en conditions réelles et **mesure de l'adoption**",
        ],
      },
      {
        title: "Fondateur — Cléo",
        company: "Cléo",
        type: "Projet entrepreneurial",
        location: "monlivretcleo.fr",
        dates: "Juin 2026 — Présent",
        tag: "current",
        bullets: [
          "Livrets d'accueil numériques pour hôtes Airbnb, gîtes et conciergeries — **150+ livrets créés**, **4,4/5 sur Trustpilot**, produit et support **en solo**",
          "Génération depuis une annonce : scraping Apify, mapping déterministe, puis **LLM contraint de citer un extrait exact** — chaque consigne est vérifiée côté serveur, sinon elle est jetée",
          "Assistant voyageur multilingue, partagé par lien ou QR code · 29 € à vie ou 69 € clé en main",
        ],
      },
      {
        title: "Business Developer & Partnerships",
        company: "Roofwander",
        type: "Stage",
        location: "Bruxelles, Belgique",
        dates: "Mars — Août 2026",
        bullets: [
          "Prospection et **closing de partenariats B2B** avec revendeurs et marques outdoor",
          "Acquisition et onboarding des propriétaires sur la marketplace (location de tentes de toit)",
          "Structuration des process commerciaux, CRM et **automatisations IA** pour qualifier les leads",
        ],
      },
      {
        title: "Fondateur — SaaS IA",
        company: "AdDetective",
        type: "Projet entrepreneurial",
        location: "addetective.fr",
        dates: "Janv. — Juin 2026",
        bullets: [
          "SaaS d'analyse d'annonces immobilières et véhicules — **score de risque et marge de négociation en 30 s** à partir du texte et des photos",
          "React/Vite, Supabase, Stripe, LLMs — premier produit mené seul **de l'idée à la production**",
        ],
      },
      {
        title: "Boat Manager",
        company: "ADAY BOAT",
        type: "Stage",
        location: "Lège-Cap-Ferret",
        dates: "Avril — Août 2025",
        bullets: [
          "Base nautique en haute saison : **200+ locations**, flotte de **11 bateaux**",
          "Accueil, contrats, briefing sécurité, incidents · lettre de recommandation du gérant",
        ],
      },
      {
        title: "Boat Manager",
        company: "ZEBOAT Marseille",
        type: "CDD",
        location: "Vieux-Port",
        dates: "Juil. — Août 2024",
        bullets: [
          "Flotte de ~19 bateaux sur le Vieux-Port · **200+ locations gérées en 2 mois**",
        ],
      },
      {
        title: "Responsable Pôle Événementiel — VP du BDE",
        company: "BDE Esscalibur",
        type: "Associatif",
        location: "ESSCA Bordeaux",
        dates: "Janv. 2025 — Janv. 2026",
        bullets: [
          "Soirées et week-ends d'intégration : coordination d'équipes et de prestataires",
        ],
      },
      {
        title: "Co-fondateur",
        company: "MaPetiteCoquille",
        type: "Indépendant",
        location: "Marseille",
        dates: "Mars 2023 — Juil. 2024",
        bullets: [
          "Marque marseillaise de coques de téléphone, **co-fondée à 17 ans** : branding et e-commerce",
        ],
      },
    ],
    education: {
      school: "ESSCA School of Management",
      degree: "Bachelor en Management International",
      dates: "2024 — 2027 · Bordeaux",
      notes: [
        "3e année en alternance — Betclic",
        "VP du Bureau des Étudiants",
      ],
    },
    skills: [
      {
        label: "Construire le produit",
        value: "Prototypage rapide · SaaS · Pipelines LLM vérifiables · Mise en production",
      },
      {
        label: "Automatiser & mesurer",
        value: "Workflows · Agents IA · Scraping & enrichissement · API · Mesure d'usage",
      },
      {
        label: "Développer le business",
        value: "Prospection · Partenariats B2B · Acquisition & SEO · CRM · Support client",
      },
      {
        label: "Tech",
        value: "React · Vite · TypeScript · Supabase · Stripe · Vercel · Apify",
      },
      {
        label: "Outils",
        value: "Claude Code · Codex · Cursor · ChatGPT · Gemini · VS Code",
      },
    ],
    certifications: [
      { org: "Anthropic", value: "Claude 101 · Claude Code in Action · Claude Cowork (2026)" },
      { org: "OpenAI", value: "Applied AI Foundations (2026)" },
      { org: "Lovable", value: "Vibe Coding — L4 Platinum (2026)" },
      { org: "ESSCA", value: "Climate Academy (2026) · MOOC Creative Box (2025)" },
      { org: "Compétences & Métiers", value: "Prompt Engineering (2024)" },
    ],
    languages: [
      { label: "Français", level: "Natif" },
      { label: "Anglais", level: "B2" },
      { label: "Espagnol", level: "B1" },
    ],
    footer: "Jean Duthil · CV 2026",
  },

  en: {
    ...CONTACT,
    badge: "Apprenticeship signed · Betclic · Sept. 2026",
    role: "AI Builder · Product & Business Developer",
    place: "Bordeaux, France",
    summary:
      "I build products with AI and put them in front of real users. Founder of **Cléo** — 150+ welcome books created, 4.4/5 on Trustpilot, run solo. In September 2026 I join Betclic's **Gen AI Transformation squad**.",
    labels: {
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      certifications: "Certifications",
      languages: "Languages",
      upcoming: "Upcoming",
      current: "Current",
    },
    experiences: [
      {
        title: "Apprentice — Gen AI Transformation Squad",
        company: "Betclic",
        type: "Apprenticeship",
        location: "Bordeaux",
        dates: "Sept. 2026 →",
        tag: "upcoming",
        bullets: [
          "Scoping Gen AI use cases with business teams, from need to testable scope",
          "Automating workflows, testing agents in real conditions and **measuring adoption**",
        ],
      },
      {
        title: "Founder — Cléo",
        company: "Cléo",
        type: "Entrepreneurial project",
        location: "monlivretcleo.fr",
        dates: "June 2026 — Present",
        tag: "current",
        bullets: [
          "Digital welcome books for Airbnb hosts, guesthouses and property managers — **150+ books created**, **4.4/5 on Trustpilot**, product and support run **solo**",
          "Generated from a listing: Apify scraping, deterministic mapping, then an **LLM forced to quote an exact excerpt** — every instruction is verified server-side or dropped",
          "Multilingual guest assistant, shared by link or QR code · €29 lifetime or €69 done-for-you",
        ],
      },
      {
        title: "Business Developer & Partnerships",
        company: "Roofwander",
        type: "Internship",
        location: "Brussels, Belgium",
        dates: "March — August 2026",
        bullets: [
          "Prospecting and **closing B2B partnerships** with retailers and outdoor brands",
          "Acquiring and onboarding owners onto the marketplace (rooftop-tent rentals)",
          "Structuring sales processes, CRM rollout and **AI automations** to qualify leads",
        ],
      },
      {
        title: "Founder — AI SaaS",
        company: "AdDetective",
        type: "Entrepreneurial project",
        location: "addetective.fr",
        dates: "Jan. — June 2026",
        bullets: [
          "AI listing-analysis SaaS for real estate and vehicles — **risk score and negotiation margin in 30s** from text and photos",
          "React/Vite, Supabase, Stripe, LLMs — first product taken solo **from idea to production**",
        ],
      },
      {
        title: "Boat Manager",
        company: "ADAY BOAT",
        type: "Internship",
        location: "Lège-Cap-Ferret",
        dates: "April — August 2025",
        bullets: [
          "Boat rental base through peak season: **200+ rentals**, fleet of **11 boats**",
          "Check-in, contracts, safety briefing, incidents · recommendation letter from the manager",
        ],
      },
      {
        title: "Boat Manager",
        company: "ZEBOAT Marseille",
        type: "Fixed-term",
        location: "Old Port",
        dates: "July — August 2024",
        bullets: [
          "Fleet of ~19 boats on the Old Port · **200+ rentals handled in 2 months**",
        ],
      },
      {
        title: "Head of Events — VP of the Student Union",
        company: "BDE Esscalibur",
        type: "Student association",
        location: "ESSCA Bordeaux",
        dates: "Jan. 2025 — Jan. 2026",
        bullets: [
          "Parties and orientation weekends: coordinating teams and external vendors",
        ],
      },
      {
        title: "Co-founder",
        company: "MaPetiteCoquille",
        type: "Freelance",
        location: "Marseille",
        dates: "March 2023 — July 2024",
        bullets: [
          "Phone cases inspired by Marseille, **co-founded at 17**: branding, design and e-commerce",
        ],
      },
    ],
    education: {
      school: "ESSCA School of Management",
      degree: "Bachelor in International Management",
      dates: "2024 — 2027 · Bordeaux",
      notes: [
        "Final year apprentice — Betclic",
        "VP of the Student Union",
      ],
    },
    skills: [
      {
        label: "Build the product",
        value: "Rapid prototyping · SaaS · Verifiable LLM pipelines · Shipping to production",
      },
      {
        label: "Automate & measure",
        value: "Workflows · AI agents · Scraping & enrichment · APIs · Usage measurement",
      },
      {
        label: "Grow the business",
        value: "Prospecting · B2B partnerships · Acquisition & SEO · CRM · Customer support",
      },
      {
        label: "Tech",
        value: "React · Vite · TypeScript · Supabase · Stripe · Vercel · Apify",
      },
      {
        label: "Tools",
        value: "Claude Code · Codex · Cursor · ChatGPT · Gemini · VS Code",
      },
    ],
    certifications: [
      { org: "Anthropic", value: "Claude 101 · Claude Code in Action · Claude Cowork (2026)" },
      { org: "OpenAI", value: "Applied AI Foundations (2026)" },
      { org: "Lovable", value: "Vibe Coding — L4 Platinum (2026)" },
      { org: "ESSCA", value: "Climate Academy (2026) · MOOC Creative Box (2025)" },
      { org: "Compétences & Métiers", value: "Prompt Engineering (2024)" },
    ],
    languages: [
      { label: "French", level: "Native" },
      { label: "English", level: "B2" },
      { label: "Spanish", level: "B1" },
    ],
    footer: "Jean Duthil · Resume 2026",
  },
};
