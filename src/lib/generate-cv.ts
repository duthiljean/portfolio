import type { jsPDF as JsPDF } from "jspdf";

type Lang = "fr" | "en";
type RGB = [number, number, number];

/* ─────────── Design tokens (monochrome Vercel-style) ─────────── */
const C = {
  ink: [14, 14, 14] as RGB,
  body: [48, 48, 48] as RGB,
  muted: [120, 120, 120] as RGB,
  rule: [226, 226, 226] as RGB,
};

const P = { w: 210, h: 297, mx: 17, my: 17 };

/* ─────────── Content ─────────── */
type Exp = {
  title: string;
  org: string;
  kind: string;
  dates: string;
  location: string;
  bullets: string[];
};

const EXPERIENCES_FR: Exp[] = [
  {
    title: "Business Developer & Partnerships",
    org: "Roofwander",
    kind: "Stage",
    dates: "Mars 2026 — Présent",
    location: "Bruxelles, Belgique",
    bullets: [
      "Prospection et closing de partenariats B2B avec revendeurs et marques outdoor",
      "Acquisition et onboarding de propriétaires sur la plateforme (growth)",
      "Structuration des process commerciaux et mise en place du CRM",
      "Automatisations IA (Claude, VS Code) pour qualifier les leads et accélérer les ops",
    ],
  },
  {
    title: "Fondateur — SaaS IA",
    org: "AdDetective",
    kind: "Projet entrepreneurial",
    dates: "Janvier 2026 — Présent",
    location: "Marseille, France",
    bullets: [
      "SaaS d'analyse d'annonces immobilières et véhicules, conçu et développé en solo",
      "Analyse IA texte + photos, score de risque et marge de négociation en 30s",
      "Stack React/Vite, Supabase, Firecrawl, Claude — du prototype à la production",
    ],
  },
  {
    title: "Boat Manager",
    org: "ADAY BOAT",
    kind: "Stage",
    dates: "Avril — Août 2025",
    location: "Lège-Cap-Ferret, France",
    bullets: [
      "Gestion opérationnelle d'une base nautique en haute saison",
      "200+ locations gérées sur une flotte de 11 bateaux",
      "Parcours client end-to-end : accueil, contrats, briefing sécurité, incidents",
    ],
  },
  {
    title: "Boat Manager",
    org: "ZEBOAT Marseille",
    kind: "CDD",
    dates: "Juillet — Août 2024",
    location: "Marseille, France",
    bullets: [
      "Gestion d'une flotte de ~19 bateaux sur le Vieux-Port en haute saison",
      "200+ locations gérées en 2 mois · accueil, briefing, retours",
    ],
  },
  {
    title: "Responsable Pôle Événementiel",
    org: "BDE Esscalibur · ESSCA Bordeaux",
    kind: "Associatif",
    dates: "Janvier 2025 — Janvier 2026",
    location: "Bordeaux, France",
    bullets: [
      "Organisation d'événements étudiants (soirées, week-ends d'intégration)",
      "Coordination d'équipes et gestion des prestataires",
    ],
  },
  {
    title: "Co-fondateur",
    org: "MaPetiteCoquille",
    kind: "Indépendant",
    dates: "Mars 2023 — Juillet 2024",
    location: "Marseille, France",
    bullets: [
      "Marque de coques de téléphone inspirée de Marseille, co-fondée à 17 ans",
      "Création de marque, design produit, e-commerce, gestion des commandes",
    ],
  },
];

const EXPERIENCES_EN: Exp[] = [
  {
    title: "Business Developer & Partnerships",
    org: "Roofwander",
    kind: "Internship",
    dates: "March 2026 — Present",
    location: "Brussels, Belgium",
    bullets: [
      "Prospecting and closing B2B partnerships with retailers and outdoor brands",
      "Acquiring and onboarding owners onto the platform (growth)",
      "Structuring sales processes and CRM implementation",
      "AI automations (Claude, VS Code) to qualify leads and speed up ops",
    ],
  },
  {
    title: "Founder — AI SaaS",
    org: "AdDetective",
    kind: "Entrepreneurial project",
    dates: "January 2026 — Present",
    location: "Marseille, France",
    bullets: [
      "AI-powered listing analysis SaaS for real estate and vehicles, built solo",
      "Text + photo AI analysis, risk score and negotiation margin in 30s",
      "Stack React/Vite, Supabase, Firecrawl, Claude — from prototype to production",
    ],
  },
  {
    title: "Boat Manager",
    org: "ADAY BOAT",
    kind: "Internship",
    dates: "April — August 2025",
    location: "Lège-Cap-Ferret, France",
    bullets: [
      "Operational management of a boat rental base during peak season",
      "200+ rentals managed across a fleet of 11 boats",
      "End-to-end customer journey: reception, contracts, safety briefing, incidents",
    ],
  },
  {
    title: "Boat Manager",
    org: "ZEBOAT Marseille",
    kind: "Fixed-term",
    dates: "July — August 2024",
    location: "Marseille, France",
    bullets: [
      "Managing a fleet of ~19 boats on the Old Port during peak season",
      "200+ rentals handled over 2 months · reception, briefing, returns",
    ],
  },
  {
    title: "Head of Events",
    org: "BDE Esscalibur · ESSCA Bordeaux",
    kind: "Student association",
    dates: "January 2025 — January 2026",
    location: "Bordeaux, France",
    bullets: [
      "Organizing student events (parties, orientation weekends)",
      "Team coordination and vendor management",
    ],
  },
  {
    title: "Co-founder",
    org: "MaPetiteCoquille",
    kind: "Freelance",
    dates: "March 2023 — July 2024",
    location: "Marseille, France",
    bullets: [
      "Phone case brand inspired by Marseille, co-founded at age 17",
      "Brand creation, product design, e-commerce, order management",
    ],
  },
];

type SkillRow = { label: string; value: string };

const COPY = {
  fr: {
    role: "Builder IA · Business Developer · Product Thinker",
    profile:
      "Je conçois des produits et développe des activités en utilisant l'IA comme levier — du prospect qualifié au SaaS en production. Fondateur d'AdDetective (analyse d'annonces par IA), en stage chez Roofwander.",
    avail: "Disponible · Alternance Septembre 2026",
    sectionProfile: "Profil",
    sectionExp: "Expériences",
    sectionEdu: "Formation",
    sectionSkills: "Compétences",
    sectionTools: "Outils",
    sectionLangs: "Langues",
    sectionCerts: "Certifications",
    eduDegree: "Bachelor en Management International",
    eduSchool: "ESSCA School of Management",
    eduDates: "2024 — 2027",
    eduLocation: "Bordeaux, France",
    eduBde: "VP du Bureau Des Étudiants · 2025—2026",
    certs: [
      "Anthropic — Claude 101 · Claude Code in Action · Claude Cowork",
      "MOOC Creative Box — ESSCA (2025)",
      "AI Training — Prompt Engineering (2024)",
    ],
    skills: [
      { label: "Business", value: "Dev · Partenariats B2B · Go-to-Market · CRM · Growth" },
      { label: "Produit", value: "Product Thinking · SEO · Acquisition · Data Analysis" },
      { label: "Dev", value: "React · Vite · Supabase · Stripe · TypeScript · No-code" },
      { label: "IA", value: "Prompt engineering · Automatisations · Claude Code" },
    ] as SkillRow[],
    tools: "Claude · ChatGPT · Gemini · VS Code · Claude Code",
    langs: [
      { label: "Français", level: "Natif" },
      { label: "Anglais", level: "B2" },
      { label: "Espagnol", level: "B1" },
    ],
  },
  en: {
    role: "AI Builder · Business Developer · Product Thinker",
    profile:
      "I build products and grow businesses using AI as a lever — from qualified leads to SaaS in production. Founder of AdDetective (AI listing analysis), currently interning at Roofwander.",
    avail: "Available · Apprenticeship September 2026",
    sectionProfile: "Profile",
    sectionExp: "Experience",
    sectionEdu: "Education",
    sectionSkills: "Skills",
    sectionTools: "Tools",
    sectionLangs: "Languages",
    sectionCerts: "Certifications",
    eduDegree: "Bachelor in International Management",
    eduSchool: "ESSCA School of Management",
    eduDates: "2024 — 2027",
    eduLocation: "Bordeaux, France",
    eduBde: "VP of the Student Union · 2025—2026",
    certs: [
      "Anthropic — Claude 101 · Claude Code in Action · Claude Cowork",
      "MOOC Creative Box — ESSCA (2025)",
      "AI Training — Prompt Engineering (2024)",
    ],
    skills: [
      { label: "Business", value: "Dev · B2B Partnerships · Go-to-Market · CRM · Growth" },
      { label: "Product", value: "Product Thinking · SEO · Acquisition · Data Analysis" },
      { label: "Dev", value: "React · Vite · Supabase · Stripe · TypeScript · No-code" },
      { label: "AI", value: "Prompt engineering · Automations · Claude Code" },
    ] as SkillRow[],
    tools: "Claude · ChatGPT · Gemini · VS Code · Claude Code",
    langs: [
      { label: "French", level: "Native" },
      { label: "English", level: "B2" },
      { label: "Spanish", level: "B1" },
    ],
  },
};

/* ─────────── Latin-1 sanitization ─────────── */
const clean = (s: string) =>
  s
    .replace(/→/g, "-")
    .replace(/—/g, "—")
    .replace(/–/g, "–")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");

/* ─────────── Export ─────────── */
export async function generateCV(lang: Lang): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const c = COPY[lang];
  const exps = lang === "fr" ? EXPERIENCES_FR : EXPERIENCES_EN;
  const contentW = P.w - 2 * P.mx;
  const rightX = P.w - P.mx;

  /* ─── helpers ─── */
  const setTC = (rgb: RGB) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setDC = (rgb: RGB) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  const setFC = (rgb: RGB) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);

  const sectionHeading = (y: number, label: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setTC(C.muted);
    doc.setCharSpace(0.35);
    const text = clean(label.toUpperCase());
    doc.text(text, P.mx, y);
    doc.setCharSpace(0);

    const labelW = doc.getTextWidth(text);
    setDC(C.rule);
    doc.setLineWidth(0.25);
    doc.line(P.mx + labelW + 3, y - 1.2, rightX, y - 1.2);
    return y + 6;
  };

  /* ─── HEADER ─── */
  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  setTC(C.ink);
  doc.text("Jean Duthil", P.mx, P.my + 7);

  // Role
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setTC(C.body);
  doc.text(clean(c.role), P.mx, P.my + 13);

  // Availability (small square bullet + text)
  setFC(C.ink);
  doc.rect(P.mx, P.my + 17.2, 1.6, 1.6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setTC(C.ink);
  doc.text(clean(c.avail), P.mx + 3.2, P.my + 18.4);

  // Contact stack (right)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTC(C.body);
  const contacts = [
    "jean.duthil13@gmail.com",
    "+33 7 60 04 90 11",
    "linkedin.com/in/duthiljean",
    "Bordeaux, France",
  ];
  let cy = P.my + 7;
  for (const line of contacts) {
    doc.text(line, rightX, cy, { align: "right" });
    cy += 4.2;
  }

  // Header hairline
  setDC(C.rule);
  doc.setLineWidth(0.3);
  doc.line(P.mx, P.my + 25, rightX, P.my + 25);

  /* ─── PROFIL ─── */
  let y = P.my + 33;
  y = sectionHeading(y, c.sectionProfile);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.8);
  setTC(C.body);
  const profileLines = doc.splitTextToSize(clean(c.profile), contentW);
  doc.text(profileLines, P.mx, y);
  y += profileLines.length * 4.4 + 4;

  /* ─── EXPÉRIENCES ─── */
  y = sectionHeading(y, c.sectionExp);

  for (const exp of exps) {
    if (y > 272) {
      doc.addPage();
      y = P.my;
    }

    // Title (bold ink)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.3);
    setTC(C.ink);
    doc.text(clean(exp.title), P.mx, y);

    // Dates (muted, right)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTC(C.muted);
    doc.text(clean(exp.dates), rightX, y, { align: "right" });

    y += 4.2;

    // Org · kind · location
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTC(C.body);
    const meta = `${exp.org}  ·  ${exp.kind}  ·  ${exp.location}`;
    doc.text(clean(meta), P.mx, y);
    y += 4.6;

    // Bullets
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.3);
    for (const bullet of exp.bullets) {
      const lines = doc.splitTextToSize(clean(bullet), contentW - 4.5);
      // Dot bullet
      setFC(C.ink);
      doc.circle(P.mx + 0.8, y - 1.2, 0.5, "F");
      setTC(C.body);
      doc.text(lines, P.mx + 3.8, y);
      y += lines.length * 4.1;
    }
    y += 4.5;
  }

  /* ─── FOOTER GRID (Formation | Compétences | Outils & Langues) ─── */
  if (y > 232) {
    doc.addPage();
    y = P.my;
  }

  // 3-column grid inside content width
  const gap = 6;
  const colW = (contentW - 2 * gap) / 3;
  const col1X = P.mx;
  const col2X = P.mx + colW + gap;
  const col3X = P.mx + 2 * (colW + gap);

  // Section heading row (spans all 3)
  y = sectionHeading(y, `${c.sectionEdu}  ·  ${c.sectionSkills}  ·  ${c.sectionTools} & ${c.sectionLangs}`);

  const blockTop = y;

  /* ── Col 1: Formation + Certifications ── */
  let y1 = blockTop;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  setTC(C.ink);
  doc.text(clean(c.eduSchool), col1X, y1);
  y1 += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTC(C.body);
  const degreeLines = doc.splitTextToSize(clean(c.eduDegree), colW);
  doc.text(degreeLines, col1X, y1);
  y1 += degreeLines.length * 4;
  setTC(C.muted);
  doc.setFontSize(8.5);
  doc.text(`${clean(c.eduDates)}  ·  ${clean(c.eduLocation)}`, col1X, y1);
  y1 += 4;
  setTC(C.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(clean(c.eduBde), col1X, y1);
  y1 += 6;

  // Certifications sub-heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTC(C.muted);
  doc.setCharSpace(0.3);
  doc.text(clean(c.sectionCerts.toUpperCase()), col1X, y1);
  doc.setCharSpace(0);
  y1 += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  for (const cert of c.certs) {
    const lines = doc.splitTextToSize(clean(cert), colW - 3.5);
    setFC(C.ink);
    doc.circle(col1X + 0.8, y1 - 1.1, 0.45, "F");
    setTC(C.body);
    doc.text(lines, col1X + 3, y1);
    y1 += lines.length * 3.9 + 0.4;
  }

  /* ── Col 2: Compétences (labeled rows) ── */
  let y2 = blockTop;
  for (const skill of c.skills) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setTC(C.ink);
    doc.text(clean(skill.label.toUpperCase()), col2X, y2);
    y2 += 3.6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    setTC(C.body);
    const lines = doc.splitTextToSize(clean(skill.value), colW);
    doc.text(lines, col2X, y2);
    y2 += lines.length * 3.9 + 3;
  }

  /* ── Col 3: Outils + Langues ── */
  let y3 = blockTop;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setTC(C.ink);
  doc.text(clean(c.sectionTools.toUpperCase()), col3X, y3);
  y3 += 3.6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  setTC(C.body);
  const toolsLines = doc.splitTextToSize(clean(c.tools), colW);
  doc.text(toolsLines, col3X, y3);
  y3 += toolsLines.length * 3.9 + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setTC(C.ink);
  doc.text(clean(c.sectionLangs.toUpperCase()), col3X, y3);
  y3 += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  for (const l of c.langs) {
    setTC(C.ink);
    doc.setFont("helvetica", "bold");
    doc.text(clean(l.label), col3X, y3);
    const labelW = doc.getTextWidth(clean(l.label));
    doc.setFont("helvetica", "normal");
    setTC(C.muted);
    doc.text(`  ·  ${clean(l.level)}`, col3X + labelW, y3);
    y3 += 4;
  }

  /* ─── FOOTER (page numbers, hairline) ─── */
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    setDC(C.rule);
    doc.setLineWidth(0.2);
    doc.line(P.mx, P.h - 11, rightX, P.h - 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTC(C.muted);
    doc.text("Jean Duthil  ·  jeanduthil.com", P.mx, P.h - 7);
    if (pages > 1) {
      doc.text(`${i} / ${pages}`, rightX, P.h - 7, { align: "right" });
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  doc.save(`cv-jean-duthil-${lang}-${today}.pdf`);
}

export type { Lang };
export type JsPDFInstance = JsPDF;
