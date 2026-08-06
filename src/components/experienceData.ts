import addetectiveLogo from "@/assets/addetective-logo.svg";
import betclicLogo from "@/assets/betclic-logo.png";
import cleoLogo from "@/assets/cleo-logo.png";
import roofwanderLogo from "@/assets/roofwander-logo.webp";
import adayBoatLogo from "@/assets/aday-boat-logo.jpeg";
import zeboatLogo from "@/assets/zeboat-logo.jpeg";
import bdeLogo from "@/assets/bde-esscalibur-logo.jpeg";
import mapetitecoquilleLogo from "@/assets/mapetitecoquille-logo.png";
import mapetitecoquilleCollection from "@/assets/mapetitecoquille-collection.webp";

export interface BadgeItem {
  label: string;
  link?: string;
}

export interface Experience {
  i18nKey: string;
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
  /** "upcoming" = signé mais pas commencé · "current" = en cours */
  status?: "upcoming" | "current";
}

export const experiences: Experience[] = [
  {
    i18nKey: "betclic",
    title: "Alternant — Squad Gen AI Transformation",
    company: "Betclic",
    type: "Alternance",
    dates: "Septembre 2026 →",
    location: "Bordeaux, France",
    status: "upcoming",
    description:
      "Alternance de 3e année dans la squad qui pilote l'adoption de l'IA générative dans le groupe. Ce que je vais y faire :\n→ Identifier et cadrer les cas d'usage Gen AI avec les équipes métier\n→ Automatiser des workflows et tester des agents en conditions réelles\n→ Accompagner les équipes et diffuser les bonnes pratiques\n→ Mesurer l'adoption et l'impact réel des outils déployés",
    badges: [{ label: "Gen AI" }, { label: "Adoption & change" }, { label: "Automatisation" }],
    logo: betclicLogo,
    siteUrl: "https://www.betclicgroup.com",
  },
  {
    i18nKey: "cleo",
    title: "Fondateur — Cléo",
    company: "Cléo",
    type: "Projet entrepreneurial",
    dates: "Juin 2026 — Présent",
    location: "Marseille, France",
    status: "current",
    description:
      "Livrets d'accueil numériques pour hôtes Airbnb, gîtes et conciergeries. Produit, code, infra et support en solo.\n→ 150+ livrets créés depuis le lancement, 4,4/5 sur Trustpilot\n→ Génération depuis une annonce : scraping Apify, mapping déterministe, puis LLM contraint à citer un extrait exact de la source\n→ Vérification serveur de chaque consigne générée — sans preuve dans l'annonce, l'info est jetée\n→ Assistant voyageur multilingue, partage par lien ou QR code, sans application\n→ 29 € à vie par livret, 69 € clé en main, sur-mesure pour les conciergeries",
    badges: [
      { label: "150+ livrets" },
      { label: "4,4/5 Trustpilot" },
      { label: "Produit solo" },
    ],
    logo: cleoLogo,
    siteUrl: "https://monlivretcleo.fr",
  },
  {
    i18nKey: "roofwander",
    title: "Business Developer & Partnerships",
    company: "Roofwander",
    type: "Stage",
    dates: "Mars — Août 2026",
    location: "Bruxelles, Belgique",
    description:
      "Marketplace de location de tentes de toit entre particuliers et professionnels.\n→ Prospection et closing de partenariats avec revendeurs et marques outdoor\n→ Acquisition et onboarding de propriétaires sur la plateforme\n→ Structuration des process commerciaux et du CRM\n→ Automatisations IA pour qualifier les leads et accélérer les opérations",
    badges: [{ label: "Partenariats B2B" }, { label: "Growth & SEO" }, { label: "Automatisations IA" }],
    logo: roofwanderLogo,
    siteUrl: "https://roofwander.com/fr",
  },
  {
    i18nKey: "addetective",
    title: "Fondateur — SaaS IA",
    company: "AdDetective",
    type: "Projet entrepreneurial",
    dates: "Janvier — Juin 2026",
    location: "Marseille, France",
    description:
      "SaaS d'analyse d'annonces immobilières et véhicules par IA, conçu et développé en solo.\n→ Analyse texte + photos, score de risque et marge de négociation estimée en 30s\n→ Stack : React/Vite, Supabase, Stripe, LLMs (Claude, GPT)\n→ Premier produit mené de l'idée à la mise en production",
    badges: [{ label: "Produit solo" }, { label: "SaaS IA" }, { label: "Idée → Prod" }],
    logo: addetectiveLogo,
    siteUrl: "https://addetective.fr",
  },
  {
    i18nKey: "adayboat",
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
    i18nKey: "zeboat",
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
    i18nKey: "bde",
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
    i18nKey: "coquille",
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
];
