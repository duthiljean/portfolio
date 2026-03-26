

## Redesign premium de la section "Stack & Compétences"

### Nouvelle structure et contenu

**Titre** : "Ce que je sais faire" (plus direct, plus stratégique que "Stack & Compétences")
**Sous-titre** : "Construire, développer et optimiser des produits en utilisant l'IA comme levier."

**3 nouvelles catégories** orientées action/valeur :

1. **Construire avec l'IA** — "Outils maîtrisés au quotidien pour concevoir et expédier."
   - Claude (logo) · ChatGPT (logo) · Gemini (logo) · Cursor (logo) · Claude Code · Prompt Engineering

2. **Développer le business** — "Acquisition, croissance et partenariats opérationnels."
   - Business Dev · Growth Hacking · Partnerships B2B · CRM · SEO · Acquisition

3. **Concevoir le produit** — "Du cadrage stratégique à la mise en production."
   - Développement SaaS · Product Thinking · No-code · Data Analysis

Chaque catégorie a une **micro-description** d'une ligne sous le titre pour contextualiser.

### Design et layout

**Fichier modifie** : `src/components/Skills.tsx` (remplacement complet)

**Layout** : Passage d'une grille 3 colonnes egales a un layout vertical empile avec plus d'espace. Chaque categorie = un bloc horizontal full-width avec :
- A gauche : icone + titre de categorie + micro-description
- A droite : les pills alignees

Sur mobile : empilage vertical naturel.

**Hiérarchie visuelle renforcee** :
- Titre de section : `text-3xl md:text-5xl font-bold` avec un gradient text subtil (primary -> accent)
- Sous-titre : `text-muted-foreground text-base md:text-lg` plus genereux
- Titres de categories : `text-lg font-semibold text-foreground` (plus gros, plus lisibles)
- Micro-descriptions : `text-sm text-muted-foreground` sous chaque titre de categorie
- Plus d'espacement vertical entre les blocs (`gap-8 md:gap-10`)

**Pills redesignees** :
- Fond plus subtil : `bg-muted/50` au repos, `bg-accent/8 text-accent` au hover
- Border fine : `border border-border/40`
- Taille : `px-3.5 py-2 text-sm` (plus genereuses, plus respirantes)
- Coins : `rounded-lg` au lieu de `rounded-full` (plus moderne, style Linear/Vercel)
- Logos a `w-4.5 h-4.5` avec `rounded-md`
- Hover : leger lift (`y: -1`), ombre douce, changement de couleur de fond subtil
- Pas de glow excessif

**Cartes** : Suppression des cartes avec bordures. Les categories sont separees par de l'espace blanc et eventuellement un separateur tres fin (`border-b border-border/30`) entre chaque bloc, style Linear. Plus de shadow-sm sur les cards.

### Motion design

- **Titre** : ScrollReveal classique (fade-up 0.6s)
- **Sous-titre** : idem avec delay 0.05s
- **Blocs de categories** : stagger de 0.12s entre chaque bloc, fade-up avec blur
- **Pills** : entree en stagger spring (delay 0.04s par pill), `initial: { opacity: 0, y: 8 }`, `animate: { opacity: 1, y: 0 }`
- **Hover pills** : `whileHover: { y: -1, transition: { duration: 0.2 } }` + changement de background-color via CSS transition
- **Icones de categories** : leger scale au hover du bloc parent (1.05)

Toutes les animations sont `once: true`, subtiles, rapides.

### Indicateurs de credibilite

Ajout d'un petit tag discret "Usage quotidien" sur les 4 outils IA principaux (Claude, ChatGPT, Gemini, Cursor) — un petit dot vert + texte `text-[10px]` integre dans la pill, ou un tooltip au hover qui dit "Utilise quotidiennement".

Alternative plus elegante : un petit indicateur visuel (dot colored) a cote du nom dans la pill, sans texte, avec un tooltip Radix au hover ("Usage quotidien" / "Applique en projet").

### Implementation technique

Un seul fichier a modifier : **`src/components/Skills.tsx`**

- Donnees restructurees avec `description` par categorie
- Layout en `flex flex-col gap-10` au lieu de `grid grid-cols-3`
- Chaque categorie : `flex flex-col md:flex-row md:items-start gap-4 md:gap-8`
- Pills dans un `div flex flex-wrap gap-2.5`
- Utilisation de `motion.div` pour le stagger des pills
- Tooltip Radix optionnel pour les pills marquees "quotidien"
- Pas de nouvelles dependances

