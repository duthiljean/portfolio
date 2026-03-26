import { chromium } from "@playwright/test";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const photoB64 = readFileSync(join(__dirname, "../public/jean-duthil-photo.jpg")).toString("base64");
const photoSrc = `data:image/jpeg;base64,${photoB64}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    font-family: 'Inter', system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  /* Background gradient */
  .bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, hsl(210 100% 97%), #fff, hsl(217 91% 60% / 0.06), hsl(210 100% 97%));
  }

  /* Blobs */
  .blob1 {
    position: absolute;
    top: -80px; left: -120px;
    width: 420px; height: 420px;
    background: hsl(217 91% 60% / 0.10);
    border-radius: 50%;
    filter: blur(60px);
  }
  .blob2 {
    position: absolute;
    bottom: -80px; right: -120px;
    width: 480px; height: 480px;
    background: hsl(211 53% 24% / 0.06);
    border-radius: 50%;
    filter: blur(70px);
  }

  .content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 80px;
    padding: 0 90px;
    width: 100%;
  }

  /* Photo */
  .photo-wrapper {
    position: relative;
    flex-shrink: 0;
  }
  .photo-glow {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: hsl(217 91% 60% / 0.25);
    filter: blur(20px);
  }
  .photo-ring {
    position: relative;
    padding: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(217 91% 60% / 0.8), hsl(211 53% 24% / 0.7), hsl(213 94% 68% / 0.9));
  }
  .photo-border {
    padding: 3px;
    border-radius: 50%;
    background: #fff;
  }
  .photo-ring img {
    width: 148px;
    height: 148px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top;
    display: block;
  }

  /* Text */
  .text { flex: 1; }

  .name {
    font-size: 64px;
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1.0;
    background: linear-gradient(135deg, hsl(211 53% 24%), hsl(217 91% 60%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 14px;
  }

  .roles {
    display: flex;
    gap: 10px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }
  .role {
    font-size: 17px;
    font-weight: 600;
    color: hsl(215 16% 47%);
  }
  .role-sep {
    font-size: 17px;
    color: hsl(217 91% 60% / 0.5);
    font-weight: 400;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: hsl(120 60% 95%);
    border: 1.5px solid hsl(142 60% 80%);
    border-radius: 100px;
    padding: 8px 18px;
    font-size: 15px;
    font-weight: 600;
    color: hsl(142 60% 28%);
    margin-bottom: 22px;
  }
  .badge-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: hsl(142 60% 42%);
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: hsl(215 16% 55%);
  }
  .meta-sep { color: hsl(214 32% 85%); }
  .meta-url {
    font-weight: 600;
    color: hsl(217 91% 60%);
  }
</style>
</head>
<body>
  <div class="bg"></div>
  <div class="blob1"></div>
  <div class="blob2"></div>

  <div class="content">
    <div class="photo-wrapper">
      <div class="photo-glow"></div>
      <div class="photo-ring">
        <div class="photo-border">
          <img src="${photoSrc}" alt="Jean Duthil" />
        </div>
      </div>
    </div>

    <div class="text">
      <div class="name">Jean Duthil</div>

      <div class="roles">
        <span class="role">Builder IA</span>
        <span class="role-sep">·</span>
        <span class="role">Business Developer</span>
        <span class="role-sep">·</span>
        <span class="role">Product Thinker</span>
      </div>

      <div class="badge">
        <div class="badge-dot"></div>
        Recherche alternance — Septembre 2026
      </div>

      <div class="meta">
        <span>Bordeaux, France</span>
        <span class="meta-sep">·</span>
        <span class="meta-url">portfolio-bay-eta-88.vercel.app</span>
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({
  path: join(__dirname, "../public/og-image.png"),
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log("✓ og-image.png générée (1200×630)");
