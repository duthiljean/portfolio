#!/usr/bin/env python3
"""Generate a professional 1-page ATS-friendly CV PDF for Jean Duthil."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import Paragraph, Frame, Spacer
from reportlab.lib.styles import ParagraphStyle

OUTPUT = "/Users/jean/Desktop/CV Jean Duthil/public/documents/cv-jean-duthil.pdf"

# Colors
DARK = HexColor("#1e3a5f")      # primary
ACCENT = HexColor("#3b82f6")    # accent blue
GRAY = HexColor("#64748b")      # muted
BLACK = HexColor("#1e293b")     # text
LIGHT_BG = HexColor("#f1f5f9")  # section bg
WHITE = HexColor("#ffffff")
BORDER = HexColor("#cbd5e1")

WIDTH, HEIGHT = A4  # 210 x 297 mm
MARGIN_LEFT = 18 * mm
MARGIN_RIGHT = 18 * mm
USABLE_W = WIDTH - MARGIN_LEFT - MARGIN_RIGHT


def draw_header(c, y):
    """Name, title, contact info."""
    # Name
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(DARK)
    c.drawString(MARGIN_LEFT, y, "Jean Duthil")

    # Availability badge
    badge_text = "Recherche alternance - Sept. 2026"
    c.setFont("Helvetica", 7.5)
    tw = c.stringWidth(badge_text, "Helvetica", 7.5)
    bx = WIDTH - MARGIN_RIGHT - tw - 14
    by = y - 1
    c.setFillColor(HexColor("#dcfce7"))
    c.roundRect(bx - 6, by - 3, tw + 16, 16, 8, fill=1, stroke=0)
    c.setFillColor(HexColor("#166534"))
    # Green dot
    c.setFillColor(HexColor("#22c55e"))
    c.circle(bx, by + 5, 2.5, fill=1, stroke=0)
    c.setFillColor(HexColor("#166534"))
    c.drawString(bx + 6, by + 1, badge_text)

    y -= 16
    c.setFont("Helvetica", 10.5)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN_LEFT, y, "Business Developer  |  Product Builder  |  IA Appliquee")

    y -= 14
    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY)
    contact = "Bordeaux, France (mobile : Aix, Angers, Lyon, Paris)  |  +33 7 60 04 90 11  |  jean.duthil13@gmail.com  |  linkedin.com/in/duthiljean"
    c.drawString(MARGIN_LEFT, y, contact)

    y -= 6
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(MARGIN_LEFT, y, WIDTH - MARGIN_RIGHT, y)

    return y - 10


def draw_section_title(c, y, title):
    """Section header with accent underline."""
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(DARK)
    c.drawString(MARGIN_LEFT, y, title.upper())
    tw = c.stringWidth(title.upper(), "Helvetica-Bold", 11)
    y -= 3
    c.setStrokeColor(ACCENT)
    c.setLineWidth(1.5)
    c.line(MARGIN_LEFT, y, MARGIN_LEFT + tw, y)
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.3)
    c.line(MARGIN_LEFT + tw + 2, y, WIDTH - MARGIN_RIGHT, y)
    return y - 11


def draw_experience(c, y, title, company, type_, dates, bullets):
    """Single experience entry."""
    # Title line
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT, y, title)

    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY)
    c.drawRightString(WIDTH - MARGIN_RIGHT, y, dates)

    y -= 11
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN_LEFT, y, f"{company}  -  {type_}")

    y -= 10
    c.setFont("Helvetica", 7.8)
    c.setFillColor(BLACK)
    for bullet in bullets:
        # Bullet point
        c.setFillColor(ACCENT)
        c.drawString(MARGIN_LEFT + 4, y + 1.5, "\u2022")
        c.setFillColor(BLACK)
        # Handle long lines
        max_w = USABLE_W - 12
        words = bullet.split()
        line = ""
        first = True
        for word in words:
            test = line + (" " if line else "") + word
            if c.stringWidth(test, "Helvetica", 7.8) > max_w:
                c.drawString(MARGIN_LEFT + 12, y, line)
                y -= 10
                line = word
                first = False
            else:
                line = test
        if line:
            c.drawString(MARGIN_LEFT + 12, y, line)
            y -= 10

    return y - 2


def draw_education(c, y, school, degree, dates, extra=None):
    """Education entry."""
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT, y, school)

    c.setFont("Helvetica", 8)
    c.setFillColor(GRAY)
    c.drawRightString(WIDTH - MARGIN_RIGHT, y, dates)

    y -= 11
    c.setFont("Helvetica", 8)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT, y, degree)

    if extra:
        y -= 10
        c.setFont("Helvetica-Oblique", 7.5)
        c.setFillColor(ACCENT)
        c.drawString(MARGIN_LEFT, y, extra)

    return y - 10


def draw_skills_line(c, y, category, skills):
    """Skills on one line."""
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(DARK)
    c.drawString(MARGIN_LEFT, y, category + " :")

    cat_w = c.stringWidth(category + " : ", "Helvetica-Bold", 8)
    c.setFont("Helvetica", 8)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT + cat_w, y, skills)
    return y - 13


def draw_languages(c, y):
    """Languages section inline."""
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(DARK)
    c.drawString(MARGIN_LEFT, y, "Langues :")
    cat_w = c.stringWidth("Langues : ", "Helvetica-Bold", 8)
    c.setFont("Helvetica", 8)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT + cat_w, y, "Francais (natif)  |  Anglais (B2)  |  Espagnol (B1)")
    return y - 13


def generate():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle("CV Jean Duthil")
    c.setAuthor("Jean Duthil")
    c.setSubject("CV - Business Developer, Product Builder, IA")

    y = HEIGHT - 20 * mm

    # === HEADER ===
    y = draw_header(c, y)

    # === EXPERIENCE ===
    y = draw_section_title(c, y, "Experiences professionnelles")

    y = draw_experience(c, y,
        "Business Developer & Partnerships", "Roofwander", "Stage",
        "Mars 2026 - Present",
        [
            "Prospection et closing de partenariats avec revendeurs et marques outdoor",
            "Acquisition et onboarding de proprietaires sur la marketplace de tentes de toit",
            "Structuration des process commerciaux et du CRM",
            "Automatisations IA (Claude, Cursor) pour qualifier les leads et accelerer les operations",
        ])

    y = draw_experience(c, y,
        "Fondateur - SaaS IA", "AdDetective", "Projet entrepreneurial",
        "Jan. 2026 - Present",
        [
            "Conception et developpement solo d'un SaaS d'analyse d'annonces par IA (immobilier, vehicules)",
            "Score de risque, points de vigilance et marge de negociation generes en 30 secondes",
            "Stack : React/Vite, Supabase, Stripe, LLMs (Claude, GPT) - developpe avec Cursor et Claude Code",
        ])

    y = draw_experience(c, y,
        "Boat Manager", "ADAY BOAT", "Stage",
        "Avr. - Aout 2025",
        [
            "200+ locations gerees, flotte de 11 bateaux au Cap-Ferret en haute saison",
            "Parcours client complet : accueil, contrats, briefing securite, gestion des incidents",
            "Creation des supports de marque et merchandising - Lettre de recommandation obtenue",
        ])

    y = draw_experience(c, y,
        "Boat Manager", "ZEBOAT Marseille", "CDD",
        "Juil. - Aout 2024",
        [
            "Gestion operationnelle d'une flotte de ~19 bateaux, 200+ locations sur le Vieux-Port",
            "Preparation, accueil clients, briefing et gestion des rotations en pleine saison",
        ])

    y = draw_experience(c, y,
        "Responsable Pole Evenementiel", "BDE Esscalibur - ESSCA Bordeaux", "Associatif",
        "Jan. 2025 - Jan. 2026",
        [
            "Organisation d'evenements etudiants, coordination d'equipes et gestion de prestataires",
        ])

    y = draw_experience(c, y,
        "Co-fondateur", "MaPetiteCoquille", "Independant",
        "Mars 2023 - Juil. 2024",
        [
            "Creation d'une marque e-commerce de coques de telephone inspirees de Marseille (branding, vente, logistique)",
        ])

    # === FORMATION ===
    y = draw_section_title(c, y, "Formation")

    y = draw_education(c, y,
        "ESSCA School of Management", "Bachelor Management International - International Business",
        "2023 - 2026", "VP du Bureau Des Etudiants")

    y -= 2
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(DARK)
    c.drawString(MARGIN_LEFT, y, "Certifications :")
    cat_w = c.stringWidth("Certifications : ", "Helvetica-Bold", 8)
    c.setFont("Helvetica", 8)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_LEFT + cat_w, y, "AI Training - Prompt Engineering (2024)  |  MOOC Creative Box - ESSCA (2025)")
    y -= 15

    # === COMPETENCES ===
    y = draw_section_title(c, y, "Competences")

    y = draw_skills_line(c, y, "Outils IA", "Claude, ChatGPT, Cursor, Claude Code, Prompt Engineering")
    y = draw_skills_line(c, y, "Business", "Business Dev, Growth Hacking, Partenariats B2B, CRM, SEO, Acquisition")
    y = draw_skills_line(c, y, "Produit", "Developpement SaaS, Product Thinking, No-code, Data Analysis")

    # === LANGUES ===
    y = draw_languages(c, y)

    # === INFOS ===
    y -= 2
    c.setFont("Helvetica-Oblique", 7.5)
    c.setFillColor(GRAY)
    c.drawString(MARGIN_LEFT, y, "Rythme : 2 semaines entreprise / 1 semaine ecole  |  Disponible a partir de septembre 2026")

    c.save()
    print(f"PDF genere : {OUTPUT}")


if __name__ == "__main__":
    generate()
