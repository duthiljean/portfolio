import type { About, Education, Profile, SkillsSection } from "@/lib/sanity";

export const fallbackProfile: Profile = {
  name: "Jean Duthil",
  badge: {
    fr: "Gen AI Transformation · Betclic — septembre 2026",
    en: "Gen AI Transformation · Betclic — September 2026",
  },
  dateline: {
    fr: "Je construis des produits avec l'IA. Et je les confronte au réel.",
    en: "I build products with AI. Then I put them in front of real users.",
  },
  roles: [
    { fr: "Produit & IA appliquée", en: "Product & applied AI" },
    { fr: "Automatisation & workflows", en: "Automation & workflows" },
    { fr: "Business development", en: "Business development" },
  ],
  ctaPrimary: {
    label: { fr: "Voir Cléo", en: "See Cléo" },
    href: "#cleo",
  },
  ctaSecondary: {
    label: { fr: "Me contacter", en: "Contact me" },
    href: "#contact",
  },
  socials: [
    { _key: "linkedin", platform: "linkedin", url: "https://www.linkedin.com/in/duthiljean/" },
    { _key: "github", platform: "github", url: "https://github.com/duthiljean" },
    { _key: "email", platform: "email", url: "mailto:jean.duthil13@gmail.com" },
  ],
};

export const fallbackAbout: About = {
  kicker: { fr: "À propos", en: "About" },
  headlines: [
    { fr: "Je construis des produits avec l'IA.", en: "I build products with AI." },
    { fr: "Je les mets entre de vraies mains.", en: "I put them in real hands." },
    { fr: "Et je regarde ce qui casse.", en: "Then I watch what breaks." },
  ],
  bio: {
    fr: "Je développe Cléo, des livrets d'accueil numériques pour hôtes et conciergeries — 150+ livrets créés depuis le lancement. En septembre 2026, je rejoins la Squad Gen AI Transformation de Betclic en alternance. Avant ça : deux saisons de gestion opérationnelle, un stage business dev, et un premier SaaS mené jusqu'en production.",
    en: "I build Cléo, digital welcome books for short-term rental hosts and property managers — 150+ published since launch. In September 2026 I join Betclic's Gen AI Transformation squad as an apprentice. Before that: two seasons of field operations, a business dev internship, and a first SaaS taken to production.",
  },
  location: { fr: "Bordeaux, France", en: "Bordeaux, France" },
  rhythm: {
    fr: "2 sem. entreprise / 1 sem. école",
    en: "2 weeks company / 1 week school",
  },
  languages: {
    fr: "Français natif · Anglais B2 · Espagnol B1",
    en: "Native French · English B2 · Spanish B1",
  },
  stats: [
    {
      _key: "booklets",
      value: "150+",
      label: { fr: "livrets Cléo créés", en: "Cléo booklets created" },
      trend: { fr: "Produit", en: "Product" },
    },
    {
      _key: "trustpilot",
      value: "4,4",
      label: { fr: "sur 5 sur Trustpilot", en: "out of 5 on Trustpilot" },
      trend: { fr: "Utilisateurs", en: "Users" },
    },
  ],
  nowLabel: { fr: "En ce moment", en: "Currently" },
  nowItems: [
    {
      _key: "cleo",
      title: "Cléo",
      description: {
        fr: "Produit solo · monlivretcleo.fr",
        en: "Solo product · monlivretcleo.fr",
      },
    },
    {
      _key: "betclic",
      title: "Betclic",
      description: {
        fr: "Squad Gen AI Transformation · alternance",
        en: "Gen AI Transformation squad · apprenticeship",
      },
    },
  ],
};

export const fallbackSkills: SkillsSection = {
  kicker: { fr: "Compétences", en: "Capabilities" },
  title: { fr: "De l'idée aux premiers utilisateurs.", en: "From idea to first users." },
  subtitle: {
    fr: "Trois choses que je fais bien : construire un produit avec des agents de code, supprimer le travail répétitif, et aller chercher les utilisateurs.",
    en: "Three things I do well: build products with coding agents, remove repetitive work, and go get the users.",
  },
  legend: { fr: "Usage quotidien", en: "Daily use" },
  categories: [
    {
      _key: "build",
      kicker: "AXE 01",
      icon: "sparkles",
      title: { fr: "Construire le produit", en: "Build the product" },
      description: {
        fr: "Du problème métier au produit en prod, piloté avec des agents de code plutôt qu'écrit ligne par ligne.",
        en: "From business problem to production, driven with coding agents rather than typed line by line.",
      },
      pills: [
        { _key: "proto", name: "Prototypage rapide", tooltipType: "daily" },
        { _key: "saas", name: "Développement SaaS", tooltipType: "project" },
        { _key: "archi", name: "Architectures IA fiables", tooltipType: "project" },
        { _key: "grounding", name: "Pipelines LLM vérifiables", tooltipType: "project" },
        { _key: "ux", name: "UX & design produit", tooltipType: "project" },
        { _key: "ship", name: "Mise en production", tooltipType: "project" },
      ],
    },
    {
      _key: "automate",
      kicker: "AXE 02",
      icon: "lineChart",
      title: { fr: "Automatiser & mesurer", en: "Automate & measure" },
      description: {
        fr: "Workflows, agents et intégrations pour supprimer le travail répétitif — puis vérifier que ça sert vraiment.",
        en: "Workflows, agents and integrations that remove repetitive work — then checking it actually helps.",
      },
      pills: [
        { _key: "workflows", name: "Automatisation de workflows", tooltipType: "daily" },
        { _key: "agents", name: "Agents IA", tooltipType: "project" },
        { _key: "scraping", name: "Scraping & enrichissement", tooltipType: "project" },
        { _key: "api", name: "Intégrations API", tooltipType: "project" },
        { _key: "roi", name: "Mesure d'usage & ROI", tooltipType: "operational" },
      ],
    },
    {
      _key: "grow",
      kicker: "AXE 03",
      icon: "rocket",
      title: { fr: "Développer le business", en: "Grow the business" },
      description: {
        fr: "Prospection, partenariats et acquisition — testés sur le terrain, pas en théorie.",
        en: "Prospecting, partnerships and acquisition — tested in the field, not in theory.",
      },
      pills: [
        { _key: "bd", name: "Business Dev", tooltipType: "operational" },
        { _key: "partnerships", name: "Partenariats B2B", tooltipType: "operational" },
        { _key: "acquisition", name: "Acquisition & growth", tooltipType: "operational" },
        { _key: "crm", name: "CRM & process commerciaux", tooltipType: "operational" },
        { _key: "seo", name: "SEO", tooltipType: "project" },
        { _key: "support", name: "Support & relation client", tooltipType: "daily" },
      ],
    },
  ],
  dailyStack: [
    { _key: "claude", name: "Claude", use: { fr: "Raisonnement & code", en: "Reasoning & code" } },
    { _key: "codex", name: "Codex", use: { fr: "Agent de code", en: "Coding agent" } },
    { _key: "cursor", name: "Cursor", use: { fr: "Édition assistée", en: "Assisted editing" } },
    { _key: "chatgpt", name: "ChatGPT", use: { fr: "Recherche & idées", en: "Research & ideas" } },
    { _key: "gemini", name: "Gemini", use: { fr: "Analyse & synthèse", en: "Analysis & synthesis" } },
    { _key: "vscode", name: "VS Code", use: { fr: "Éditeur de code", en: "Code editor" } },
  ],
};

export const fallbackEducation: Education = {
  title: { fr: "Formation", en: "Education" },
  dateline: { fr: "1 diplôme · 8 certifications", en: "1 degree · 8 certifications" },
  degree: {
    kicker: { fr: "Bachelor · International Business", en: "Bachelor · International Business" },
    schoolName: "ESSCA School of Management",
    name: {
      fr: "Bachelor en Management International — International Business",
      en: "Bachelor in International Management — International Business",
    },
    datesLabel: "2024 — 2027",
    durationLabel: { fr: "Bachelor · 3 ans", en: "Bachelor · 3 years" },
    location: "Bordeaux, FR",
    bdeLabel: { fr: "VP du Bureau Des Étudiants", en: "VP of the Student Union" },
    apprenticeshipLabel: {
      fr: "3e année en alternance — Betclic",
      en: "Final year as an apprentice — Betclic",
    },
    startDate: "2024-09-01",
    endDate: "2027-06-30",
  },
  certsLabel: { fr: "Certifications", en: "Certifications" },
  certifications: [
    {
      _key: "anthropic",
      kind: "anthropic",
      name: "Anthropic",
      org: { fr: "3 certifications · mars 2026", en: "3 certifications · March 2026" },
      verified: true,
      subCerts: [
        { _key: "claude-101", title: "Claude 101", url: "https://verify.skilljar.com/c/3r3qkq4786i3" },
        { _key: "claude-code", title: "Claude Code in Action", url: "https://verify.skilljar.com/c/fgsjkvmybimm" },
        { _key: "cowork", title: "Introduction to Claude Cowork", url: "https://verify.skilljar.com/c/5dmj2uzcgpku" },
      ],
      order: 1,
    },
    {
      _key: "openai",
      kind: "openai",
      name: "Applied AI Foundations",
      org: { fr: "OpenAI · juin 2026", en: "OpenAI · June 2026" },
      verified: true,
      url: "https://academy.openai.com/home/certificate/jy83fiqeru",
      order: 2,
    },
    {
      _key: "lovable-vibe",
      kind: "lovable",
      name: "Vibe Coding — L4 Platinum",
      org: { fr: "Lovable · mai 2026", en: "Lovable · May 2026" },
      verified: true,
      url: "https://www.linkedin.com/in/duthiljean/details/certifications/",
      order: 3,
    },
    {
      _key: "climate",
      kind: "essca",
      name: "ESSCA Climate Academy",
      org: { fr: "ESSCA · juillet 2026", en: "ESSCA · July 2026" },
      verified: true,
      order: 4,
    },
    {
      _key: "mooc",
      kind: "mooc",
      name: "MOOC Creative Box",
      org: { fr: "ESSCA · février 2025", en: "ESSCA · February 2025" },
      verified: true,
      order: 5,
    },
    {
      _key: "ai-training",
      kind: "simple",
      name: "AI Training — Prompt Engineering",
      org: { fr: "Compétences et Métiers · 2024", en: "Compétences et Métiers · 2024" },
      verified: false,
      order: 6,
    },
  ],
};
