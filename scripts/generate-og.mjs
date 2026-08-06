// Renders the OG image (1200×630) to public/og-image.png using headless Chromium.
// Run: node scripts/generate-og.mjs

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const avatarPath = path.join(root, "src/assets/avatar ia.png");
const outputPath = path.join(root, "public/og-image.png");
const avatarDataUri = `data:image/png;base64,${readFileSync(avatarPath).toString("base64")}`;

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    background: #0a0a0a;
    color: #fafafa;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    -webkit-mask-image: radial-gradient(ellipse at top right, #000 30%, transparent 80%);
            mask-image: radial-gradient(ellipse at top right, #000 30%, transparent 80%);
  }
  .glow {
    position: absolute;
    top: -200px; right: -200px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .frame {
    position: relative;
    width: 1136px; height: 566px;
    margin: 32px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .brand {
    display: flex; align-items: center; gap: 14px;
    font-size: 14px; letter-spacing: -0.01em;
  }
  .brand-tag {
    background: #fafafa;
    color: #0a0a0a;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 13px;
    letter-spacing: -0.01em;
  }
  .brand-name { color: rgba(255,255,255,0.9); font-weight: 500; }
  .brand-divider { color: rgba(255,255,255,0.25); }
  .brand-section { color: rgba(255,255,255,0.55); }
  .status {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px;
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.28);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    color: #4ade80;
    letter-spacing: -0.005em;
  }
  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
  }
  .middle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    margin-top: -8px;
  }
  .name-block { flex: 1; min-width: 0; }
  .name {
    font-size: 128px;
    font-weight: 800;
    letter-spacing: -0.055em;
    line-height: 0.95;
    background: linear-gradient(180deg, #ffffff 0%, #c9c9c9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .roles {
    margin-top: 24px;
    font-size: 22px;
    font-weight: 500;
    color: rgba(255,255,255,0.92);
    letter-spacing: -0.015em;
  }
  .role-sep { color: rgba(255,255,255,0.3); margin: 0 10px; }
  .avatar-wrap {
    position: relative;
    width: 220px; height: 220px;
    flex-shrink: 0;
  }
  .avatar {
    position: relative;
    width: 220px; height: 220px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15);
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .proof {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .proof-line {
    width: 24px; height: 1px;
    background: rgba(255,255,255,0.3);
  }
  .proof-dot { color: rgba(255,255,255,0.3); }
  .url {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
  }
  .arrow { color: rgba(255,255,255,0.5); display: inline-block; }
</style>
</head>
<body>
  <div class="dots"></div>
  <div class="glow"></div>
  <div class="frame">
    <div class="top">
      <div class="brand">
        <span class="brand-tag">JD</span>
        <span class="brand-name">Jean Duthil</span>
        <span class="brand-divider">·</span>
        <span class="brand-section">Portfolio</span>
      </div>
      <div class="status">
        <span class="status-dot"></span>
        Gen AI @ Betclic · Sept. 2026
      </div>
    </div>

    <div class="middle">
      <div class="name-block">
        <div class="name">Jean<br/>Duthil</div>
        <div class="roles">
          Produit<span class="role-sep">·</span>IA appliquée<span class="role-sep">·</span>Business
        </div>
      </div>
      <div class="avatar-wrap">
        <div class="avatar"><img src="${avatarDataUri}" alt=""/></div>
      </div>
    </div>

    <div class="bottom">
      <div class="proof">
        <span class="proof-line"></span>
        CLÉO
        <span class="proof-dot">·</span>
        BETCLIC
        <span class="proof-dot">·</span>
        ESSCA BORDEAUX
      </div>
      <div class="url">
        @DUTHILJEAN <span class="arrow">↗</span>
      </div>
    </div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000); // give fonts time to render
  await page.screenshot({ path: outputPath, type: "png", omitBackground: false });
  await browser.close();
  console.log("✓ OG image generated:", outputPath);
})();
