import type { Stage } from './trip-stages';

/**
 * Vue transverse "Préparatifs" : agrège tout ce qu'il reste à réserver / préparer,
 * à partir des données existantes (transports à réserver, hébergements, activités),
 * sans re-décrire les étapes. Chaque item pointe vers son étape quand c'est possible.
 */

export type PrepGroupKey = 'transport' | 'stay' | 'activity' | 'document';

export interface PrepLink {
  label: string;
  url: string;
}

export interface PrepItem {
  id: string;
  group: PrepGroupKey;
  title: string;
  subtitle: string | null;
  meta: string | null;
  priority: 1 | 2 | null;
  links: PrepLink[];
  stageIndex: number | null;
  /** Options candidates (ex : hôtels recommandés) — surtout pour les séjours. */
  options: string[];
  /** Détails d'une réservation confirmée (adresse, dates, conditions…). */
  reservation: string[];
  /** true si déjà réservé (statut) → coché par défaut dans les préparatifs. */
  booked: boolean;
}

export interface PrepGroup {
  key: PrepGroupKey;
  items: PrepItem[];
}

interface RawSection {
  title: string;
  items: (string | { text: string; url?: string })[];
}
interface RawTransportCard {
  chip?: string;
  title: string;
  category?: string;
  toReserve?: boolean;
  description?: string;
  links?: PrepLink[];
  sections?: RawSection[];
}
interface RawHotelCard {
  chip?: string;
  title: string;
  location?: string;
  nights?: string;
  priority?: number;
  description?: string;
  links?: PrepLink[];
  sections?: RawSection[];
}
interface RawActivity {
  chip?: string;
  title: string;
  location?: string;
  description?: string;
  links?: PrepLink[];
}

/** Cherche l'étape correspondant à un lieu/titre (best-effort, tolérant fr/en). */
function matchStage(stages: Stage[], text: string | null | undefined): number | null {
  if (!text) return null;
  const t = text.toLowerCase();
  for (const s of stages) {
    const loc = (s.location ?? '').toLowerCase();
    if (loc) {
      const head = loc.split(/[,(]/)[0].trim();
      if (head.length >= 3 && (t.includes(head) || head.includes(t))) return s.index;
    }
  }
  for (const s of stages) {
    const title = s.title.toLowerCase();
    if (title.length >= 3 && (t.includes(title) || title.includes(t))) return s.index;
  }
  return null;
}

function firstSectionItem(card: { sections?: RawSection[] }, titleIncludes: string): string | null {
  const section = card.sections?.find((s) => s.title.toLowerCase().includes(titleIncludes));
  const item = section?.items[0];
  if (!item) return null;
  return typeof item === 'string' ? item : item.text;
}

function collectSection(card: { sections?: RawSection[] }, titleIncludes: string): string[] {
  const section = card.sections?.find((s) => s.title.toLowerCase().includes(titleIncludes));
  return (section?.items ?? []).map((i) => (typeof i === 'string' ? i : i.text));
}

/** Détecte un hébergement déjà réservé via sa section Statut/Status. */
function isBookedStay(card: { sections?: RawSection[] }): boolean {
  const status = firstSectionItem(card, 'statut') ?? firstSectionItem(card, 'status');
  if (!status) return false;
  const s = status.toLowerCase();
  const reserved = s.startsWith('reserve') || s.startsWith('réserv') || s.startsWith('book');
  const toBook = s.includes('a reserver') || s.includes('à reserver') || s.includes('to book');
  return reserved && !toBook;
}

export function buildPreparatifs(opts: {
  transports: unknown;
  hebergements: unknown;
  activites: unknown;
  stages: Stage[];
}): PrepGroup[] {
  const { stages } = opts;
  const transports = (opts.transports ?? {}) as { cards?: RawTransportCard[] };
  const hebergements = (opts.hebergements ?? {}) as { cards?: RawHotelCard[] };
  const activites = (opts.activites ?? {}) as { activities?: RawActivity[] };

  // --- Transports à réserver ---
  const transport: PrepItem[] = (transports.cards ?? [])
    .filter((c) => c.toReserve === true)
    .map((c, i) => ({
      id: `t-${i}`,
      group: 'transport' as const,
      title: c.title,
      subtitle: c.description ?? null,
      meta: c.chip ?? null,
      priority: null,
      links: c.links ?? [],
      stageIndex: matchStage(stages, c.title),
      options: [],
      reservation: [],
      booked: false,
    }));

  // --- Hébergements (une carte = un séjour à réserver) ---
  const stay: PrepItem[] = (hebergements.cards ?? [])
    .filter((c) => typeof c.location === 'string')
    .map((c, i) => ({
      id: `s-${i}`,
      group: 'stay' as const,
      title: c.location ?? c.title,
      subtitle: [c.title, c.nights].filter(Boolean).join(' · ') || null,
      meta: firstSectionItem(c, 'budget'),
      priority: c.priority === 1 ? 1 : c.priority === 2 ? 2 : null,
      links: c.links ?? [],
      stageIndex: matchStage(stages, c.location),
      options: collectSection(c, 'option'),
      reservation: collectSection(c, 'reserv'),
      booked: isBookedStay(c),
    }));

  // --- Activités à réserver ---
  const activity: PrepItem[] = (activites.activities ?? []).map((a, i) => ({
    id: `a-${i}`,
    group: 'activity' as const,
    title: a.title,
    subtitle: a.location ?? null,
    meta: a.chip ?? null,
    priority: null,
    links: a.links ?? [],
    stageIndex: matchStage(stages, a.location),
    options: [],
    reservation: [],
    booked: false,
  }));

  // --- Documents (déduits des sections "Documents" existantes, dédupliqués) ---
  const seen = new Set<string>();
  const document: PrepItem[] = [];
  const docSources = [...(transports.cards ?? []), ...(hebergements.cards ?? [])];
  for (const card of docSources) {
    for (const section of card.sections ?? []) {
      if (!section.title.toLowerCase().includes('document')) continue;
      for (const raw of section.items) {
        const text = typeof raw === 'string' ? raw : raw.text;
        const key = text.toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);
        document.push({
          id: `d-${document.length}`,
          group: 'document',
          title: text,
          subtitle: null,
          meta: null,
          priority: null,
          links: [],
          stageIndex: null,
          options: [],
          reservation: [],
          booked: false,
        });
      }
    }
  }

  const groups: PrepGroup[] = [
    { key: 'transport', items: transport },
    { key: 'stay', items: stay },
    { key: 'activity', items: activity },
    { key: 'document', items: document },
  ];
  return groups.filter((g) => g.items.length > 0);
}

/** Somme les budgets (en EUR) trouvés dans les métadonnées, pour un total indicatif. */
export function sumBudget(groups: PrepGroup[]): number {
  let total = 0;
  for (const g of groups) {
    for (const item of g.items) {
      // Partie entière (chiffres + espaces), décimale optionnelle (, ou .), puis EUR/€.
      const match = item.meta?.match(/(\d[\d\s]*)(?:[.,]\d+)?\s*(?:EUR|€)/i);
      if (match) total += Number.parseInt(match[1].replace(/\s/g, ''), 10) || 0;
    }
  }
  return total;
}
