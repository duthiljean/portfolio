import type { About, Education, Profile, SkillsSection } from "@/lib/sanity";

export const fallbackProfile: Profile = {
  name: "Jean Duthil",
  badge: {
    fr: "Recherche alternance — Septembre 2026",
    en: "Looking for an internship — September 2026",
  },
  dateline: {
    fr: "Business Dev, Product & IA appliquée",
    en: "Business Dev, Product & Applied AI",
  },
  roles: [
    { fr: "Builder IA", en: "AI Builder" },
    { fr: "Business Developer", en: "Business Developer" },
    { fr: "Product Thinker", en: "Product Thinker" },
  ],
  ctaPrimary: {
    label: { fr: "Voir mon parcours", en: "View my background" },
    href: "#experience",
  },
  ctaSecondary: {
    label: { fr: "Me contacter", en: "Contact me" },
    href: "#contact",
  },
  socials: [
    { _key: "linkedin", platform: "linkedin", url: "https://www.linkedin.com/in/jean-duthil/" },
    { _key: "github", platform: "github", url: "https://github.com/jeanduthil" },
    { _key: "email", platform: "email", url: "mailto:jean.duthil13@gmail.com" },
  ],
};

export const fallbackAbout: About = {
  kicker: { fr: "À propos", en: "About" },
  headlines: [
    { fr: "Construire des produits.", en: "Build products." },
    { fr: "Développer des activités.", en: "Grow businesses." },
    { fr: "Avec l'IA comme levier.", en: "With AI as the lever." },
  ],
  bio: {
    fr: "Actuellement en stage chez Roofwander à Bruxelles, j'ai aussi lancé AdDetective, un SaaS d'analyse d'annonces propulsé par l'IA. De la prospection à la mise en production.",
    en: "Currently interning at Roofwander in Brussels, I also launched AdDetective, an AI-powered listing analysis SaaS. From prospecting to production.",
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
      _key: "rentals",
      value: "400+",
      label: { fr: "locations gérées", en: "rentals managed" },
      trend: { fr: "Terrain", en: "Field work" },
    },
    {
      _key: "boats",
      value: "30",
      label: { fr: "bateaux gérés", en: "boats managed" },
      trend: { fr: "Ops", en: "Ops" },
    },
  ],
  nowLabel: { fr: "En ce moment", en: "Currently" },
  nowItems: [
    {
      _key: "roofwander",
      title: "Roofwander",
      description: { fr: "Business Dev · Bruxelles", en: "Business Dev · Brussels" },
    },
    {
      _key: "addetective",
      title: "AdDetective",
      description: { fr: "SaaS IA · produit solo", en: "AI SaaS · solo product" },
    },
  ],
};

export const fallbackSkills: SkillsSection = {
  kicker: { fr: "Compétences", en: "Capabilities" },
  title: { fr: "Une stack orientée exécution.", en: "A stack built for execution." },
  subtitle: {
    fr: "Construire, développer et optimiser des produits en utilisant l'IA comme accélérateur concret.",
    en: "Build, grow and optimize products using AI as a practical accelerator.",
  },
  legend: { fr: "Usage quotidien", en: "Daily use" },
  categories: [
    {
      _key: "ai",
      kicker: "AXE 01",
      icon: "sparkles",
      title: { fr: "Construire avec l'IA", en: "Build with AI" },
      description: {
        fr: "Outils utilisés pour prototyper, automatiser et livrer vite.",
        en: "Tools used to prototype, automate and ship fast.",
      },
      pills: [
        { _key: "claude", name: "Claude", tooltipType: "daily" },
        { _key: "chatgpt", name: "ChatGPT", tooltipType: "daily" },
        { _key: "gemini", name: "Gemini", tooltipType: "daily" },
        { _key: "vscode", name: "VS Code", tooltipType: "daily" },
        { _key: "github", name: "GitHub", tooltipType: "project" },
        { _key: "prompt", name: "Prompt Engineering", tooltipType: "project" },
      ],
    },
    {
      _key: "growth",
      kicker: "AXE 02",
      icon: "rocket",
      title: { fr: "Développer le business", en: "Grow the business" },
      description: {
        fr: "Acquisition, partenariats, CRM et opérations terrain.",
        en: "Acquisition, partnerships, CRM and field operations.",
      },
      pills: [
        { _key: "bd", name: "Business Dev", tooltipType: "operational" },
        { _key: "growth", name: "Growth Hacking", tooltipType: "project" },
        { _key: "partnerships", name: "Partnerships B2B", tooltipType: "operational" },
        { _key: "crm", name: "CRM", tooltipType: "project" },
        { _key: "seo", name: "SEO", tooltipType: "project" },
      ],
    },
    {
      _key: "product",
      kicker: "AXE 03",
      icon: "lineChart",
      title: { fr: "Concevoir le produit", en: "Design the product" },
      description: {
        fr: "Cadrage, priorisation, UX et passage du prototype à la prod.",
        en: "Scoping, prioritization, UX and moving from prototype to production.",
      },
      pills: [
        { _key: "saas", name: "Développement SaaS", tooltipType: "project" },
        { _key: "product", name: "Product Thinking", tooltipType: "project" },
        { _key: "nocode", name: "No-code", tooltipType: "project" },
        { _key: "data", name: "Data Analysis", tooltipType: "project" },
      ],
    },
  ],
  dailyStack: [
    { _key: "claude", name: "Claude", use: { fr: "Raisonnement & code", en: "Reasoning & code" } },
    { _key: "chatgpt", name: "ChatGPT", use: { fr: "Recherche & idées", en: "Research & ideas" } },
    { _key: "gemini", name: "Gemini", use: { fr: "Analyse & synthèse", en: "Analysis & synthesis" } },
    { _key: "vscode", name: "VS Code", use: { fr: "Éditeur de code", en: "Code editor" } },
  ],
};

export const fallbackEducation: Education = {
  title: { fr: "Formation", en: "Education" },
  dateline: { fr: "1 diplôme · 3 certifications", en: "1 degree · 3 certifications" },
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
    startDate: "2024-09-01",
    endDate: "2027-06-30",
  },
  certsLabel: { fr: "Certifications", en: "Certifications" },
  certifications: [
    {
      _key: "anthropic",
      kind: "anthropic",
      name: "Anthropic",
      org: { fr: "3 certifications · 2025", en: "3 certifications · 2025" },
      verified: true,
      subCerts: [
        { _key: "claude-101", title: "Claude 101", url: "https://verify.skilljar.com/c/3r3qkq4786i3" },
        { _key: "claude-code", title: "Claude Code in Action", url: "https://verify.skilljar.com/c/fgsjkvmybimm" },
        { _key: "cowork", title: "Introduction to Claude Cowork", url: "https://verify.skilljar.com/c/5dmj2uzcgpku" },
      ],
      order: 1,
    },
    {
      _key: "mooc",
      kind: "mooc",
      name: "MOOC Creative Box",
      org: { fr: "ESSCA · 2025", en: "ESSCA · 2025" },
      verified: true,
      order: 2,
    },
    {
      _key: "ai-training",
      kind: "simple",
      name: "AI Training — Prompt Engineering",
      org: { fr: "Compétences et Métiers · 2024", en: "Compétences et Métiers · 2024" },
      verified: false,
      order: 3,
    },
  ],
};
