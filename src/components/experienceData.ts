import addetectiveLogo from "@/assets/addetective-logo.svg";
import roofwanderLogo from "@/assets/roofwander-logo.webp";
import adayBoatLogo from "@/assets/aday-boat-logo.jpeg";
import zeboatLogo from "@/assets/zeboat-logo.jpeg";
import bdeLogo from "@/assets/bde-esscalibur-logo.jpeg";
import mapetitecoquilleLogo from "@/assets/mapetitecoquille-logo.png";
import mapetitecoquilleCollection from "@/assets/mapetitecoquille-collection.webp";
import ministereArmeesLogo from "@/assets/ministere-armees-logo.jpeg";

export interface BadgeItem {
  label: string;
  link?: string;
}

export interface Experience {
  title: string;
  company: string;
  type: string;
  dates: string;
  location: string;
  description: string;
  badges: BadgeItem[];
  logo?: string;
  siteUrl?: string;
  image?: string;
}

export const experiences: Experience[] = [
  {
    title: "Business Developer & Partnerships",
    company: "Roofwander",
    type: "Stage",
    dates: "Mars 2026 — Présent",
    location: "Bruxelles, Belgique",
    description:
      "Marketplace de location de tentes de toit entre particuliers et professionnels.\n→ Prospection et closing de partenariats avec revendeurs et marques outdoor\n→ Acquisition et onboarding de propriétaires sur la plateforme\n→ Structuration des process commerciaux et du CRM\n→ Automatisations IA (Claude, Cursor) pour qualifier les leads et accélérer les opérations",
    badges: [{ label: "Partenariats B2B" }, { label: "Growth & SEO" }, { label: "Automatisations IA" }],
    logo: roofwanderLogo,
    siteUrl: "https://roofwander.com/fr",
  },
  {
    title: "Fondateur — SaaS IA",
    company: "AdDetective",
    type: "Projet entrepreneurial",
    dates: "Janvier 2026 — Présent",
    location: "Marseille, France",
    description:
      "SaaS d'analyse d'annonces immobilières et véhicules par IA, conçu et développé en solo.\n→ Analyse texte + photos, score de risque, points de vigilance et marge de négociation en 30s\n→ Stack : React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ Développé intégralement avec Cursor et Claude Code, du prototype à la production",
    badges: [{ label: "Produit solo" }, { label: "SaaS IA" }, { label: "Idée → Prod" }],
    logo: addetectiveLogo,
    siteUrl: "https://addetective.fr",
  },
  {
    title: "Boat Manager",
    company: "ADAY BOAT",
    type: "Stage",
    dates: "Avril — Août 2025",
    location: "Lège-Cap-Ferret, France",
    description:
      "Gestion opérationnelle d'une base nautique en haute saison.\n→ 200+ locations gérées, flotte de 11 bateaux\n→ Parcours client complet : accueil, contrats, briefing sécurité, gestion des incidents\n→ Création des supports de marque et merchandising\n→ Lettre de recommandation du gérant",
    badges: [{ label: "11 bateaux" }, { label: "200+ locations" }, { label: "Lettre de reco", link: "/documents/lettre-recommandation.pdf" }],
    logo: adayBoatLogo,
    siteUrl: "https://www.adayboat.com",
  },
  {
    title: "Boat Manager",
    company: "ZEBOAT Marseille",
    type: "CDD",
    dates: "Juillet — Août 2024",
    location: "Marseille, France",
    description:
      "Gestion d'une flotte de ~19 bateaux sur le Vieux-Port en pleine saison.\n→ 200+ locations gérées sur 2 mois\n→ Préparation, accueil clients, briefing et gestion des retours\n→ Première expérience en gestion de flotte nautique",
    badges: [{ label: "~19 bateaux" }, { label: "200+ locations" }],
    logo: zeboatLogo,
    siteUrl: "https://www.zeboat.fr",
  },
  {
    title: "Responsable Pôle Événementiel",
    company: "BDE Esscalibur · ESSCA Bordeaux",
    type: "Associatif",
    dates: "Janvier 2025 — Janvier 2026",
    location: "Bordeaux, France",
    description:
      "→ Organisation d'événements étudiants (soirées, week-ends d'intégration, activités sportives)\n→ Coordination d'équipes et gestion de prestataires\n→ Création de concepts originaux pour animer la vie associative",
    badges: [{ label: "Événementiel" }, { label: "Gestion d'équipe" }, { label: "BDE 2025" }],
    logo: bdeLogo,
  },
  {
    title: "Co-fondateur",
    company: "MaPetiteCoquille",
    type: "Indépendant",
    dates: "Mars 2023 — Juillet 2024",
    location: "Marseille, France",
    description:
      "Marque de coques de téléphone inspirées de Marseille, co-fondée à 17 ans.\n→ Création de la marque, design produit et identité visuelle\n→ Mise en place du e-commerce et de la stratégie de communication\n→ Gestion des commandes, stocks et relation client",
    badges: [{ label: "Entrepreneuriat" }, { label: "E-commerce" }, { label: "Branding" }],
    logo: mapetitecoquilleLogo,
    image: mapetitecoquilleCollection,
  },
  {
    title: "Stagiaire découverte",
    company: "Ministère des Armées",
    type: "Stage",
    dates: "Février — Mars 2021",
    location: "Toulon, France",
    description:
      "→ Immersion en base aéronavale : services techniques, unités spécialisées\n→ Échanges avec le personnel civil et militaire sur les métiers de la Défense",
    badges: [{ label: "Défense" }, { label: "Stage découverte" }],
    logo: ministereArmeesLogo,
  },
];
