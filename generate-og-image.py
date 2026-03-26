#!/usr/bin/env python3
"""Generate Open Graph image (1200x630) for WhatsApp/social media preview."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUTPUT = "/Users/jean/Desktop/CV Jean Duthil/public/og-image.png"
PHOTO = "/Users/jean/Desktop/CV Jean Duthil/public/jean-duthil-photo.jpg"

W, H = 1200, 630

# Colors
BG_TOP = (240, 245, 250)      # light blue-gray
BG_BOTTOM = (248, 250, 252)   # almost white
PRIMARY = (30, 58, 95)         # dark navy
ACCENT = (59, 130, 246)        # blue
GREEN_BG = (220, 252, 231)
GREEN_TEXT = (22, 101, 52)
GREEN_DOT = (34, 197, 94)
MUTED = (100, 116, 139)
WHITE = (255, 255, 255)

def create_gradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h))
    for y in range(h):
        r = int(top[0] + (bottom[0] - top[0]) * y / h)
        g = int(top[1] + (bottom[1] - top[1]) * y / h)
        b = int(top[2] + (bottom[2] - top[2]) * y / h)
        for x in range(w):
            img.putpixel((x, y), (r, g, b))
    return img

def make_circle_mask(size):
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    return mask

def generate():
    # Background gradient
    img = create_gradient(W, H, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(img)

    # Decorative circles (subtle)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.ellipse((-100, -100, 300, 300), fill=(59, 130, 246, 8))
    odraw.ellipse((900, 400, 1400, 900), fill=(30, 58, 95, 6))
    img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (*BG_TOP, 255)), overlay).convert("RGB"))

    draw = ImageDraw.Draw(img)

    # Photo (circular, centered)
    photo_size = 140
    try:
        photo = Image.open(PHOTO).convert("RGB")
        # Crop to square from top
        w, h = photo.size
        sq = min(w, h)
        left = (w - sq) // 2
        photo = photo.crop((left, 0, left + sq, sq))
        photo = photo.resize((photo_size, photo_size), Image.LANCZOS)

        mask = make_circle_mask(photo_size)

        # White ring behind photo
        ring_size = photo_size + 8
        ring_mask = make_circle_mask(ring_size)
        ring_img = Image.new("RGB", (ring_size, ring_size), WHITE)
        px = (W - ring_size) // 2
        py = 80
        img.paste(ring_img, (px, py), ring_mask)

        # Photo
        px_photo = (W - photo_size) // 2
        py_photo = py + 4
        img.paste(photo, (px_photo, py_photo), mask)
    except Exception:
        py_photo = 80

    # Try system fonts
    def get_font(size, bold=False):
        paths = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SFPro.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        ]
        for p in paths:
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size, index=1 if bold and p.endswith(".ttc") else 0)
                except Exception:
                    try:
                        return ImageFont.truetype(p, size)
                    except Exception:
                        continue
        return ImageFont.load_default()

    font_name = get_font(52, bold=True)
    font_role = get_font(22)
    font_badge = get_font(16)
    font_sub = get_font(14)

    # Name
    name = "Jean Duthil"
    name_y = py_photo + photo_size + 30
    bbox = draw.textbbox((0, 0), name, font=font_name)
    name_w = bbox[2] - bbox[0]
    draw.text(((W - name_w) // 2, name_y), name, fill=PRIMARY, font=font_name)

    # Role
    role = "Business Developer  |  Product Builder  |  IA"
    role_y = name_y + 65
    bbox = draw.textbbox((0, 0), role, font=font_role)
    role_w = bbox[2] - bbox[0]
    draw.text(((W - role_w) // 2, role_y), role, fill=ACCENT, font=font_role)

    # Badge "Recherche alternance"
    badge_text = "Recherche alternance - Septembre 2026"
    badge_y = role_y + 50
    bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    badge_tw = bbox[2] - bbox[0]
    badge_th = bbox[3] - bbox[1]
    badge_pad_x = 24
    badge_pad_y = 10
    badge_w = badge_tw + badge_pad_x * 2
    badge_h = badge_th + badge_pad_y * 2
    badge_x = (W - badge_w) // 2

    # Rounded rect for badge
    draw.rounded_rectangle(
        (badge_x, badge_y, badge_x + badge_w, badge_y + badge_h),
        radius=badge_h // 2,
        fill=GREEN_BG,
        outline=(187, 247, 208),
        width=1,
    )

    # Green dot
    dot_r = 5
    dot_x = badge_x + badge_pad_x
    dot_y = badge_y + badge_h // 2
    draw.ellipse((dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r), fill=GREEN_DOT)

    # Badge text
    draw.text((dot_x + dot_r + 8, badge_y + badge_pad_y), badge_text, fill=GREEN_TEXT, font=font_badge)

    # Subtitle
    sub = "CV Interactif  -  jean.duthil13@gmail.com"
    sub_y = badge_y + badge_h + 30
    bbox = draw.textbbox((0, 0), sub, font=font_sub)
    sub_w = bbox[2] - bbox[0]
    draw.text(((W - sub_w) // 2, sub_y), sub, fill=MUTED, font=font_sub)

    img.save(OUTPUT, "PNG", optimize=True)
    print(f"OG image generated: {OUTPUT}")

if __name__ == "__main__":
    generate()
