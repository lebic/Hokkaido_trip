import type { RouteWaypoint, TransportMode } from '../ui/route-map/route-map.component';
import type { CardImageOverride } from '../utils/card-images';

/**
 * Modèle "centré étape" (stage-first) de Travelbook.
 *
 * Source unique de vérité : les cartes de l'itinéraire (`itineraire.data.json`) sont déjà
 * structurées par étape. On les projette ici en un modèle `Stage` unifié que consomment
 * la timeline (journey) et le hub d'étape (stage). Aucune donnée n'est dupliquée : les
 * regroupements séjour / trajet / programme sont dérivés des sections existantes.
 */

export type CardTone = 'forest' | 'clay' | 'berry';
export type SectionKind = 'hebergement' | 'transport' | 'programme';

export interface StageItem {
  text: string;
  url?: string;
}

export interface StageSection {
  title: string;
  items: (string | StageItem)[];
}

/** Forme brute d'une carte d'itinéraire (fr ou en). */
export interface RawStageCard {
  chip: string;
  tone: CardTone;
  title: string;
  location?: string;
  description?: string;
  image?: CardImageOverride;
  sections: StageSection[];
  routeWaypoints?: RouteWaypoint[];
  transportMode?: TransportMode;
}

export interface RawTripData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    duration?: string;
    date?: string;
  };
  cards: RawStageCard[];
}

/** Étape normalisée, prête à afficher. */
export interface Stage {
  index: number;
  chip: string;
  tone: CardTone;
  title: string;
  location: string | null;
  description: string | null;
  image?: CardImageOverride;
  transportMode: TransportMode | null;
  routeWaypoints: RouteWaypoint[];
  accommodation: string | null;
  transportSections: StageSection[];
  programmeSections: StageSection[];
  /** Nombre total d'éléments de programme (pour un aperçu rapide). */
  activityCount: number;
  /** true si l'étape a un trajet cartographiable (>= 2 points). */
  hasRoute: boolean;
}

interface TransportMeta {
  /** Emoji d'aperçu. */
  icon: string;
  /** Clé de libellé i18n (voir ui-translations transportModes). */
  key: TransportMode;
}

const TRANSPORT_META: Record<TransportMode, TransportMeta> = {
  driving: { icon: '🚗', key: 'driving' },
  ferry: { icon: '⛴️', key: 'ferry' },
  flight: { icon: '✈️', key: 'flight' },
  train: { icon: '🚆', key: 'train' },
};

export function transportMeta(mode: TransportMode | null | undefined): TransportMeta | null {
  return mode ? TRANSPORT_META[mode] : null;
}

/** Classe une section (bilingue fr/en) en séjour / trajet / programme. */
export function sectionKind(title: string): SectionKind {
  const t = title.toLowerCase();
  if (t.includes('heberg') || t.includes('héberg') || t.includes('accommod')) {
    return 'hebergement';
  }
  if (
    t.includes('transport') ||
    t.includes('en route') ||
    t.includes('arret') ||
    t.includes('arrêt') ||
    t.includes('stop') ||
    t.includes('horaire') ||
    t.includes('transfer') ||
    t.includes('arriv')
  ) {
    return 'transport';
  }
  return 'programme';
}

function itemText(item: string | StageItem): string {
  return typeof item === 'string' ? item : item.text;
}

function toStage(card: RawStageCard, index: number): Stage {
  const hebergementSection = card.sections.find((s) => sectionKind(s.title) === 'hebergement');
  const accommodationItem = hebergementSection?.items[0];
  const accommodation = accommodationItem ? itemText(accommodationItem) : null;

  const transportSections = card.sections.filter((s) => sectionKind(s.title) === 'transport');
  const programmeSections = card.sections.filter((s) => sectionKind(s.title) === 'programme');
  const activityCount = programmeSections.reduce((sum, s) => sum + s.items.length, 0);
  const routeWaypoints = card.routeWaypoints ?? [];

  return {
    index,
    chip: card.chip,
    tone: card.tone,
    title: card.title,
    location: card.location ?? null,
    description: card.description ?? null,
    image: card.image,
    transportMode: card.transportMode ?? null,
    routeWaypoints,
    accommodation,
    transportSections,
    programmeSections,
    activityCount,
    hasRoute: routeWaypoints.length >= 2,
  };
}

/** Projette la donnée brute d'itinéraire en liste d'étapes normalisées. */
export function buildStages(data: RawTripData): Stage[] {
  return data.cards.map((card, i) => toStage(card, i));
}
