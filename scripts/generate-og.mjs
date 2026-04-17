// Renders the OG image (1200×630) to public/og-image.png using headless Chromium.
// Run: node scripts/generate-og.mjs

import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "og-image.png");

const html = /* html */ `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 1200px; height: 630px; background: #0a0a0a; }
      body {
        font-family: "Inter", -apple-system, system-ui, sans-serif;
        color: #fafafa;
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "cv11", "ss01", "ss03";
        position: relative;
        overflow: hidden;
      }

      /* Dot-grid — faint, masked toward center-left */
      .grid {
        position: absolute; inset: 0;
        background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
        background-size: 28px 28px;
        -webkit-mask-image: radial-gradient(ellipse 85% 70% at 35% 50%, #000 0%, #000 35%, transparent 85%);
                mask-image: radial-gradient(ellipse 85% 70% at 35% 50%, #000 0%, #000 35%, transparent 85%);
      }

      /* Ambient vignette */
      .glow {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 60% 50% at 25% 45%, rgba(255,255,255,0.045), transparent 65%);
      }

      /* Frame */
      .frame {
        position: absolute; inset: 20px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px;
      }

      /* Brand */
      .brand {
        position: absolute; top: 54px; left: 64px;
        display: flex; align-items: center; gap: 12px;
        color: rgba(255,255,255,0.72);
        font-size: 14px; font-weight: 500;
        letter-spacing: -0.01em;
      }
      .jd {
        width: 34px; height: 34px; border-radius: 9px;
        background: #fafafa; color: #0a0a0a;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700; letter-spacing: -0.02em;
      }
      .brand .sep {
        width: 1px; height: 14px; background: rgba(255,255,255,0.16);
      }

      /* Availability pill */
      .pill {
        position: absolute; top: 54px; right: 64px;
        display: inline-flex; align-items: center; gap: 8px;
        padding: 7px 14px;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        font-size: 12px; font-weight: 500;
        color: rgba(255,255,255,0.8);
        letter-spacing: 0.02em;
      }
      .dot-wrap { position: relative; width: 7px; height: 7px; }
      .dot-pulse {
        position: absolute; inset: 0; border-radius: 999px;
        background: #34d399; opacity: 0.55; transform: scale(1.6);
      }
      .dot-core {
        position: relative; width: 7px; height: 7px; border-radius: 999px;
        background: #10b981;
      }

      /* Center stack */
      .stack {
        position: absolute; left: 64px; right: 64px; top: 180px;
      }
      h1 {
        font-size: 132px; font-weight: 700;
        letter-spacing: -0.045em;
        line-height: 0.94;
        background: linear-gradient(180deg, #ffffff 0%, #bfbfbf 100%);
        -webkit-background-clip: text;
                background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .tagline {
        margin-top: 28px;
        font-size: 28px; font-weight: 500;
        letter-spacing: -0.015em;
        color: rgba(255,255,255,0.78);
        display: inline-flex; align-items: center; gap: 14px;
      }
      .tagline .bullet {
        width: 4px; height: 4px; border-radius: 999px;
        background: rgba(255,255,255,0.35);
      }
      .tagline em {
        font-style: normal; color: #fafafa; font-weight: 600;
      }

      /* Footer line */
      .foot {
        position: absolute; left: 64px; right: 64px; bottom: 54px;
        display: flex; align-items: center; justify-content: space-between;
        color: rgba(255,255,255,0.5);
        font-size: 13px; font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .foot .group { display: inline-flex; align-items: center; gap: 10px; }
      .foot .rule { width: 48px; height: 1px; background: rgba(255,255,255,0.2); }
      .arrow {
        font-size: 18px; color: rgba(255,255,255,0.7);
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="glow"></div>
    <div class="frame"></div>

    <div class="brand">
      <span class="jd">JD</span>
      <span>Jean Duthil</span>
      <span class="sep"></span>
      <span>Portfolio</span>
    </div>

    <div class="pill">
      <span class="dot-wrap">
        <span class="dot-pulse"></span>
        <span class="dot-core"></span>
      </span>
      Dispo dès sept. 2026
    </div>

    <div class="stack">
      <h1>Jean<br>Duthil</h1>
      <div class="tagline">
        <em>Builder IA</em>
        <span class="bullet"></span>
        <em>Business Developer</em>
        <span class="bullet"></span>
        <em>Product Thinker</em>
      </div>
    </div>

    <div class="foot">
      <div class="group">
        <span class="rule"></span>
        <span>Alternance · Bordeaux</span>
      </div>
      <div class="group">
        <span>jeanduthil.com</span>
        <span class="arrow">↗</span>
      </div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
});
const page = await context.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
});
const buffer = await page.screenshot({ type: "png", omitBackground: false });
writeFileSync(OUT, buffer);
await browser.close();
console.log(`✓ OG image written to ${OUT}`);
