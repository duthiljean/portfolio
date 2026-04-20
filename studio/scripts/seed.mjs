import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const profile = {
  _id: 'profile',
  _type: 'profile',
  name: 'Jean Duthil',
  badge: {
    _type: 'localeString',
    fr: 'Recherche alternance — Septembre 2026',
    en: 'Looking for an internship — September 2026',
  },
  dateline: {
    _type: 'localeString',
    fr: 'Marseille · Bordeaux · Bruxelles · \u201926',
    en: 'Marseille · Bordeaux · Brussels · \u201926',
  },
  roles: [
    {_key: 'r1', _type: 'localeString', fr: 'Builder IA', en: 'AI Builder'},
    {_key: 'r2', _type: 'localeString', fr: 'Business Developer', en: 'Business Developer'},
    {_key: 'r3', _type: 'localeString', fr: 'Product Thinker', en: 'Product Thinker'},
  ],
  ctaPrimary: {
    label: {_type: 'localeString', fr: 'Voir mon parcours', en: 'View my background'},
    href: '#experience',
  },
  ctaSecondary: {
    label: {_type: 'localeString', fr: 'Me contacter', en: 'Contact me'},
    href: '#contact',
  },
  socials: [
    {_key: 's1', platform: 'linkedin', url: 'https://www.linkedin.com/in/jean-duthil/'},
    {_key: 's2', platform: 'github', url: 'https://github.com/jeanduthil'},
    {_key: 's3', platform: 'email', url: 'mailto:jean.duthil13@gmail.com'},
    {_key: 's4', platform: 'phone', url: 'tel:+33760049011'},
  ],
}

const about = {
  _id: 'about',
  _type: 'about',
  kicker: {_type: 'localeString', fr: 'À PROPOS', en: 'ABOUT'},
  dateline: {_type: 'localeString', fr: 'BORDEAUX — BRUXELLES — 2026', en: 'BORDEAUX — BRUSSELS — 2026'},
  headlines: [
    {_key: 'h1', _type: 'localeString', fr: 'Construire des produits.', en: 'Build products.'},
    {_key: 'h2', _type: 'localeString', fr: 'Développer des activités.', en: 'Grow businesses.'},
    {_key: 'h3', _type: 'localeString', fr: 'Avec l\u2019IA comme levier.', en: 'With AI as the lever.'},
  ],
  bio: {
    _type: 'localeText',
    fr: 'Actuellement en stage chez Roofwander à Bruxelles, j\u2019ai aussi lancé AdDetective — un SaaS d\u2019analyse d\u2019annonces propulsé par l\u2019IA. De la prospection à la mise en production.',
    en: 'Currently interning at Roofwander in Brussels, I also launched AdDetective — an AI-powered listing analysis SaaS. From prospecting to production.',
  },
  description: {
    _type: 'localeText',
    fr: 'Je conçois des produits et développe des activités en utilisant l\u2019IA comme levier — de la prospection à la mise en production. Actuellement en stage chez Roofwander, j\u2019ai aussi lancé AdDetective, un SaaS d\u2019analyse d\u2019annonces propulsé par l\u2019IA.',
    en: 'I build products and grow businesses using AI as a lever — from prospecting to production. Currently interning at Roofwander, I also launched AdDetective, an AI-powered listing analysis SaaS.',
  },
  location: {_type: 'localeString', fr: 'Bordeaux, France', en: 'Bordeaux, France'},
  phone: '07 60 04 90 11',
  rhythm: {
    _type: 'localeString',
    fr: 'Rythme : 2 sem. entreprise / 1 sem. école',
    en: 'Schedule: 2 weeks company / 1 week school',
  },
  languages: {
    _type: 'localeString',
    fr: 'Français (natif) · Anglais (B2) · Espagnol (B1)',
    en: 'French (native) · English (B2) · Spanish (B1)',
  },
  stats: [
    {
      _key: 'st1',
      value: '400+',
      label: {_type: 'localeString', fr: 'locations gérées', en: 'rentals managed'},
    },
    {
      _key: 'st2',
      value: '30',
      label: {_type: 'localeString', fr: 'bateaux gérés', en: 'boats managed'},
    },
  ],
  nowLabel: {_type: 'localeString', fr: 'EN CE MOMENT', en: 'CURRENTLY'},
  nowItems: [
    {
      _key: 'n1',
      title: 'Roofwander',
      description: {_type: 'localeString', fr: 'Business Dev · Bruxelles', en: 'Business Dev · Brussels'},
    },
    {
      _key: 'n2',
      title: 'AdDetective',
      description: {_type: 'localeString', fr: 'SaaS IA · solo', en: 'AI SaaS · solo'},
    },
  ],
}

const skillsSection = {
  _id: 'skillsSection',
  _type: 'skillsSection',
  kicker: {_type: 'localeString', fr: 'COMPÉTENCES', en: 'CAPABILITIES'},
  title: {_type: 'localeString', fr: 'Ce que je sais faire.', en: 'What I can do.'},
  dateline: {_type: 'localeString', fr: '3 AXES · USAGE QUOTIDIEN', en: '3 AXES · DAILY USE'},
  subtitle: {
    _type: 'localeText',
    fr: 'Construire, développer et optimiser des produits en utilisant l\u2019IA comme levier.',
    en: 'Build, grow and optimize products using AI as a lever.',
  },
  legend: {_type: 'localeString', fr: 'Usage quotidien', en: 'Daily use'},
  categories: [
    {
      _key: 'c1',
      kicker: 'AXE 01',
      icon: 'sparkles',
      title: {_type: 'localeString', fr: 'Construire avec l\u2019IA', en: 'Build with AI'},
      description: {
        _type: 'localeString',
        fr: 'Outils maîtrisés au quotidien pour concevoir et expédier.',
        en: 'Tools mastered daily to design and ship.',
      },
      pills: [
        {_key: 'p1', name: 'Claude', tooltipType: 'daily'},
        {_key: 'p2', name: 'ChatGPT', tooltipType: 'daily'},
        {_key: 'p3', name: 'Gemini', tooltipType: 'daily'},
        {_key: 'p4', name: 'VS Code', tooltipType: 'daily'},
        {_key: 'p5', name: 'Claude Code', tooltipType: 'project'},
        {_key: 'p6', name: 'GitHub', tooltipType: 'project'},
        {_key: 'p7', name: 'Prompt Engineering', tooltipType: 'project'},
      ],
    },
    {
      _key: 'c2',
      kicker: 'AXE 02',
      icon: 'rocket',
      title: {_type: 'localeString', fr: 'Développer le business', en: 'Grow the business'},
      description: {
        _type: 'localeString',
        fr: 'Acquisition, croissance et partenariats opérationnels.',
        en: 'Acquisition, growth and operational partnerships.',
      },
      pills: [
        {_key: 'p1', name: 'Business Dev', tooltipType: 'operational'},
        {_key: 'p2', name: 'Growth Hacking', tooltipType: 'project'},
        {_key: 'p3', name: 'Partnerships B2B', tooltipType: 'operational'},
        {_key: 'p4', name: 'CRM', tooltipType: 'project'},
        {_key: 'p5', name: 'SEO', tooltipType: 'project'},
        {_key: 'p6', name: 'Acquisition', tooltipType: 'operational'},
      ],
    },
    {
      _key: 'c3',
      kicker: 'AXE 03',
      icon: 'lineChart',
      title: {_type: 'localeString', fr: 'Concevoir le produit', en: 'Design the product'},
      description: {
        _type: 'localeString',
        fr: 'Du cadrage stratégique à la mise en production.',
        en: 'From strategic framing to production deployment.',
      },
      pills: [
        {_key: 'p1', name: 'Développement SaaS', tooltipType: 'project'},
        {_key: 'p2', name: 'Product Thinking', tooltipType: 'project'},
        {_key: 'p3', name: 'No-code', tooltipType: 'project'},
        {_key: 'p4', name: 'Data Analysis', tooltipType: 'project'},
      ],
    },
  ],
  dailyStack: [
    {_key: 'd1', name: 'Claude', use: {_type: 'localeString', fr: 'Raisonnement & code', en: 'Reasoning & code'}},
    {_key: 'd2', name: 'ChatGPT', use: {_type: 'localeString', fr: 'Recherche & idées', en: 'Research & ideas'}},
    {_key: 'd3', name: 'Gemini', use: {_type: 'localeString', fr: 'Analyse & synthèse', en: 'Analysis & synthesis'}},
    {_key: 'd4', name: 'VS Code', use: {_type: 'localeString', fr: 'Éditeur de code', en: 'Code editor'}},
  ],
}

const education = {
  _id: 'education',
  _type: 'education',
  title: {_type: 'localeString', fr: 'Formation', en: 'Education'},
  dateline: {_type: 'localeString', fr: '1 DIPLÔME · 3 CERTIFICATIONS', en: '1 DEGREE · 3 CERTIFICATIONS'},
  degree: {
    kicker: {_type: 'localeString', fr: 'BACHELOR · INTERNATIONAL BUSINESS', en: 'BACHELOR · INTERNATIONAL BUSINESS'},
    schoolName: 'ESSCA School of Management',
    name: {
      _type: 'localeString',
      fr: 'Bachelor en Management International — International Business',
      en: 'Bachelor in International Management — International Business',
    },
    datesLabel: '2023 — 2026',
    durationLabel: {_type: 'localeString', fr: 'Bachelor · 3 ans', en: 'Bachelor · 3 years'},
    location: 'Bordeaux, FR',
    bdeLabel: {_type: 'localeString', fr: 'VP du Bureau Des Étudiants', en: 'VP of the Student Union'},
    startDate: '2023-09-01',
    endDate: '2026-06-30',
  },
  certsLabel: {_type: 'localeString', fr: 'Certifications', en: 'Certifications'},
  certifications: [
    {
      _key: 'cert1',
      kind: 'anthropic',
      name: 'Anthropic',
      org: {_type: 'localeString', fr: '3 certifications · 2025', en: '3 certifications · 2025'},
      verified: true,
      subCerts: [
        {_key: 'sc1', title: 'Claude 101', url: 'https://verify.skilljar.com/c/3r3qkq4786i3'},
        {_key: 'sc2', title: 'Claude Code in Action', url: 'https://verify.skilljar.com/c/fgsjkvmybimm'},
        {_key: 'sc3', title: 'Introduction to Claude Cowork', url: 'https://verify.skilljar.com/c/5dmj2uzcgpku'},
      ],
      order: 1,
    },
    {
      _key: 'cert2',
      kind: 'mooc',
      name: 'MOOC Creative Box',
      org: {_type: 'localeString', fr: 'ESSCA · 2025', en: 'ESSCA · 2025'},
      verified: true,
      order: 2,
    },
    {
      _key: 'cert3',
      kind: 'simple',
      name: 'AI Training — Prompt Engineering',
      org: {_type: 'localeString', fr: 'Compétences et Métiers · 2024', en: 'Compétences et Métiers · 2024'},
      verified: false,
      order: 3,
    },
  ],
}

const addetectiveProject = {
  _id: 'project-addetective',
  _type: 'project',
  name: 'AdDetective',
  tagline: {
    _type: 'localeString',
    fr: 'SaaS IA d\u2019analyse d\u2019annonces immobilières et véhicules',
    en: 'AI SaaS for real estate & vehicle listing analysis',
  },
  description: {
    _type: 'localeText',
    fr: 'Analyse texte + photos, score de risque, points de vigilance et marge de négociation en 30s. Développé intégralement avec Cursor et Claude Code, du prototype à la production.',
    en: 'Text + photo analysis, risk score, red flags and negotiation margin in 30s. Fully built with Cursor and Claude Code, from prototype to production.',
  },
  url: 'https://addetective.app',
  tags: ['SaaS', 'IA', 'Solo'],
  stack: ['React', 'Vite', 'Supabase', 'Stripe', 'Claude', 'GPT'],
  order: 1,
}

const docs = [profile, about, skillsSection, education, addetectiveProject]

async function run() {
  const tx = client.transaction()
  for (const doc of docs) {
    tx.createOrReplace(doc)
  }
  const res = await tx.commit()
  console.log(`✔ Seeded ${docs.length} documents`)
  for (const r of res.results) {
    console.log(`  - ${r.id} (${r.operation})`)
  }
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
