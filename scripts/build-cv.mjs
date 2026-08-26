// Rend le CV (FR + EN) en PDF A4 d'une page via Chromium headless.
// Contenu : scripts/cv-content.mjs — Sortie : public/documents/cv-jean-duthil{,-en}.pdf
// Run: node scripts/build-cv.mjs

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cv } from "./cv-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const photoSourceUri = `data:image/jpeg;base64,${readFileSync(
  path.join(root, "src/assets/jean poto.jpg"),
).toString("base64")}`;

/** Redimensionne la photo dans le navigateur pour garder un PDF léger. */
const resizePhoto = (page, src, width = 420) =>
  page.evaluate(
    ({ src, width }) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = Math.round((img.height / img.width) * width);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        };
        img.onerror = () => reject(new Error("photo illisible"));
        img.src = src;
      }),
    { src, width },
  );

const OUT = {
  fr: path.join(root, "public/documents/cv-jean-duthil.pdf"),
  en: path.join(root, "public/documents/cv-jean-duthil-en.pdf"),
};

const PAGE_H_PX = 1122.5; // 297 mm @ 96 dpi

/* ─────────── helpers ─────────── */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** `**gras**` → <strong> (après échappement) */
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const entry = (exp, labels) => `
  <article class="entry">
    <div class="entry-head">
      <h3>${esc(exp.title)}${
        exp.tag ? `<span class="tag ${exp.tag}">${esc(labels[exp.tag])}</span>` : ""
      }</h3>
      <span class="dates">${esc(exp.dates)}</span>
    </div>
    <p class="meta"><strong>${esc(exp.company)}</strong> · ${esc(exp.type)} · ${esc(exp.location)}</p>
    <ul class="bullets">${exp.bullets
      .map((b) => `<li><span class="dash">—</span><span>${rich(b)}</span></li>`)
      .join("")}</ul>
  </article>`;

const html = (lang, photoDataUri) => {
  const c = cv[lang];
  const l = c.labels;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0a0a0a;
    --body: #262626;
    --muted: #767676;
    --rule: #e4e4e4;
    /* Facteur d'ajustement typographique — piloté par le script pour tenir sur 1 page */
    --k: 1;
  }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    width: 210mm; min-height: 297mm;
    padding: 12mm 13mm 8mm;
    display: flex; flex-direction: column;
    background: #fff; color: var(--body);
    font-family: "Inter", -apple-system, "Helvetica Neue", Arial, sans-serif;
    font-size: calc(8.7pt * var(--k));
    line-height: 1.42;
    -webkit-font-smoothing: antialiased;
  }
  strong { color: var(--ink); font-weight: 600; }

  /* ── en-tête ── */
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10mm; }
  h1 {
    font-size: calc(30pt * var(--k)); font-weight: 700;
    letter-spacing: -0.035em; color: var(--ink); line-height: 1;
  }
  .head-meta { display: flex; flex-direction: column; gap: calc(2.4mm * var(--k)); margin-top: calc(3.2mm * var(--k)); }
  .badge {
    align-self: flex-start;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(6.5pt * var(--k)); font-weight: 400;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: #fff; background: var(--ink);
    padding: calc(1.4mm * var(--k)) calc(2.3mm * var(--k)); border-radius: 1mm;
  }
  .role { font-size: calc(10.4pt * var(--k)); color: var(--ink); font-weight: 600; letter-spacing: -0.01em; }
  .role .sep { color: var(--rule); }
  .role .place { color: var(--muted); font-weight: 400; font-size: calc(8.6pt * var(--k)); }
  .photo {
    width: calc(24mm * var(--k)); height: calc(30mm * var(--k));
    object-fit: cover; object-position: center 18%;
    border-radius: 1.5mm; flex-shrink: 0; filter: grayscale(0.12);
  }

  /* ── contact ── */
  .contact {
    display: flex; justify-content: space-between; gap: 4mm;
    margin-top: calc(5mm * var(--k)); padding: calc(2mm * var(--k)) 0;
    border-top: 0.4pt solid var(--rule); border-bottom: 0.4pt solid var(--rule);
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(7.3pt * var(--k)); color: var(--body); letter-spacing: -0.01em;
  }

  /* ── accroche ── */
  .summary {
    margin-top: calc(4.4mm * var(--k));
    font-size: calc(9.5pt * var(--k)); line-height: 1.5;
    color: var(--ink); letter-spacing: -0.005em;
  }
  .summary strong { font-weight: 600; }

  /* ── colonnes ── */
  .cols { display: flex; gap: 7mm; margin-top: calc(5.4mm * var(--k)); align-items: flex-start; }
  .main { flex: 1 1 auto; min-width: 0; }
  .side { flex: 0 0 47mm; }

  .section-title {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(6.8pt * var(--k)); font-weight: 400;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted);
    padding-bottom: calc(1.3mm * var(--k)); margin-bottom: calc(2.8mm * var(--k));
    border-bottom: 0.5pt solid var(--rule);
  }
  .side .section-title { margin-top: calc(5mm * var(--k)); }
  .side .section-title:first-child { margin-top: 0; }

  /* ── expériences ── */
  .entry { margin-bottom: calc(3.3mm * var(--k)); break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .entry-head { display: flex; align-items: baseline; justify-content: space-between; gap: 4mm; }
  .entry h3 {
    font-size: calc(9.9pt * var(--k)); font-weight: 600; color: var(--ink);
    letter-spacing: -0.015em; display: flex; align-items: center; gap: 2.6mm;
  }
  .tag {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(5.8pt * var(--k)); font-weight: 400;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.5mm 1.3mm; border-radius: 0.8mm;
    border: 0.5pt solid var(--rule); color: var(--muted);
  }
  .tag.current { border-color: var(--ink); color: var(--ink); }
  .dates {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(7.1pt * var(--k)); color: var(--muted);
    white-space: nowrap; flex-shrink: 0;
  }
  .meta { font-size: calc(8.2pt * var(--k)); color: var(--muted); margin-top: 0.5mm; }
  .meta strong { color: var(--ink); font-weight: 600; }
  .bullets {
    list-style: none; margin-top: calc(1.3mm * var(--k));
    display: flex; flex-direction: column; gap: calc(0.8mm * var(--k));
  }
  .bullets li { display: flex; gap: 1.7mm; }
  .dash { color: #b5b5b5; flex-shrink: 0; }

  /* ── colonne droite ── */
  .edu-school { font-size: calc(9pt * var(--k)); font-weight: 600; color: var(--ink); }
  .edu-degree { font-size: calc(8.2pt * var(--k)); margin-top: 0.5mm; }
  .edu-dates {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(7pt * var(--k)); color: var(--muted); margin-top: calc(1mm * var(--k));
  }
  .edu-note { font-size: calc(8pt * var(--k)); color: var(--ink); margin-top: calc(1.3mm * var(--k)); }
  .edu-note::before { content: "— "; color: #b5b5b5; }

  .skill { margin-bottom: calc(2.6mm * var(--k)); }
  .skill:last-child { margin-bottom: 0; }
  .skill-label {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(6.4pt * var(--k)); font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink); margin-bottom: 0.7mm;
  }
  .skill-value { font-size: calc(8pt * var(--k)); line-height: 1.4; }

  .cert { font-size: calc(8pt * var(--k)); margin-bottom: calc(1.5mm * var(--k)); line-height: 1.38; }
  .cert:last-child { margin-bottom: 0; }

  .langs { font-size: calc(8pt * var(--k)); line-height: 1.4; color: var(--muted); }

  /* ── pied de page ── */
  .foot {
    display: flex; justify-content: space-between;
    margin-top: auto; padding-top: calc(2.2mm * var(--k));
    border-top: 0.4pt solid var(--rule);
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: calc(6.5pt * var(--k)); letter-spacing: 0.08em;
    text-transform: uppercase; color: #9a9a9a;
  }
</style>
</head>
<body>
  <header class="head">
    <div>
      <h1>${esc(c.name)}</h1>
      <div class="head-meta">
        <span class="badge">${esc(c.badge)}</span>
        <span class="role">${esc(c.role)}<span class="sep"> · </span><span class="place">${esc(c.place)}</span></span>
      </div>
    </div>
    <img class="photo" src="${photoDataUri}" alt="" />
  </header>

  <div class="contact">
    <span>${esc(c.email)}</span>
    <span>${esc(c.phone)}</span>
    <span>${esc(c.linkedin)}</span>
    <span>${esc(c.site)}</span>
  </div>

  <p class="summary">${rich(c.summary)}</p>

  <div class="cols">
    <div class="main">
      <h2 class="section-title">${esc(l.experience)}</h2>
      ${c.experiences.map((e) => entry(e, l)).join("")}
    </div>

    <aside class="side">
      <h2 class="section-title">${esc(l.education)}</h2>
      <p class="edu-school">${esc(c.education.school)}</p>
      <p class="edu-degree">${esc(c.education.degree)}</p>
      <p class="edu-dates">${esc(c.education.dates)}</p>
      ${c.education.notes.map((n) => `<p class="edu-note">${esc(n)}</p>`).join("")}

      <h2 class="section-title">${esc(l.skills)}</h2>
      ${c.skills
        .map(
          (s) => `<div class="skill">
            <p class="skill-label">${esc(s.label)}</p>
            <p class="skill-value">${esc(s.value)}</p>
          </div>`,
        )
        .join("")}

      <h2 class="section-title">${esc(l.certifications)}</h2>
      ${c.certifications
        .map((x) => `<p class="cert"><strong>${esc(x.org)}</strong> · ${esc(x.value)}</p>`)
        .join("")}

      <h2 class="section-title">${esc(l.languages)}</h2>
      <p class="langs">${c.languages
        .map((x) => `<strong>${esc(x.label)}</strong> ${esc(x.level)}`)
        .join(" · ")}</p>
    </aside>
  </div>

  <div class="foot">
    <span>${esc(c.footer)}</span>
    <span>${esc(c.linkedin)}</span>
  </div>
</body>
</html>`;
};

/* ─────────── rendu ─────────── */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
await page.emulateMedia({ media: "print" });

await page.setContent("<!doctype html><meta charset=utf-8>");
const photoDataUri = await resizePhoto(page, photoSourceUri);

for (const lang of ["fr", "en"]) {
  await page.setContent(html(lang, photoDataUri), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Le corps fait exactement une page : on réduit la typo par paliers
  // tant que le contenu déborde de son conteneur.
  let k = 1;
  for (; k >= 0.88; k -= 0.01) {
    const fits = await page.evaluate(
      ({ kk, pageH }) => {
        document.documentElement.style.setProperty("--k", String(kk));
        return document.body.getBoundingClientRect().height <= pageH + 0.5;
      },
      { kk: Number(k.toFixed(2)), pageH: PAGE_H_PX },
    );
    if (fits) break;
  }
  const overflow = await page.evaluate(
    (h) => document.body.getBoundingClientRect().height > h + 1,
    PAGE_H_PX,
  );
  if (overflow) throw new Error(`${lang}: le contenu déborde encore d'une page (k=${k.toFixed(2)})`);
  if (k < 1) console.log(`  ${lang}: typo ajustée à ${(k * 100).toFixed(0)} % pour tenir sur 1 page`);

  await page.pdf({
    path: OUT[lang],
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`✓ ${path.relative(root, OUT[lang])}`);
}

await browser.close();
