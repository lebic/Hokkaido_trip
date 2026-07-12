import { hokkaidoData } from './hokkaido/index';
import { viennaMunichData } from './vienna-munich/index';

export type TravelTheme = Record<string, string>;

export interface TravelMeta {
  id: string;
  name: string;
  subtitle: string;
  subtitleEn: string;
  dates: string;
  duration: string;
  durationEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  imagePosition?: string;
  color: string;
  /** Variables CSS d'ambiance appliquées quand ce voyage est actif. */
  theme: TravelTheme;
}

export const TRAVELS_REGISTRY: TravelMeta[] = [
  {
    id: 'hokkaido',
    name: 'Tokyo & Hokkaido',
    subtitle: 'Japon',
    subtitleEn: 'Japan',
    dates: '24 Oct – 10 Nov 2026',
    duration: '18 jours / 17 nuits',
    durationEn: '18 days / 17 nights',
    description: 'Tokyo, ferry de nuit vers Hokkaido, Sapporo, lacs, lavandes de Furano...',
    descriptionEn: 'Tokyo, overnight ferry to Hokkaido, Sapporo, lakes, lavender fields of Furano...',
    image: '/images/header-card/japan/tokyo.avif',
    imagePosition: 'center 10%',
    color: 'from-emerald-500 to-teal-400',
    theme: {
      '--tb-canvas': '#f4ede2',
      '--tb-ink': '#241b16',
      '--tb-muted': '#6f6259',
      '--tb-accent': '#c14a2b',
      '--tb-accent-strong': '#9c3a1f',
      '--tb-accent-soft': '#f6e1d5',
      '--tb-glow-a': '226 116 74',
      '--tb-glow-b': '66 84 138',
      '--tb-hero-tint': '32 19 12',
    },
  },
  {
    id: 'vienna-munich',
    name: 'Vienna & Munich',
    subtitle: 'Autriche · Allemagne',
    subtitleEn: 'Austria · Germany',
    dates: '29 Jan – 9 Feb 2027',
    duration: '12 jours / 11 nuits',
    durationEn: '12 days / 11 nights',
    description: 'Vienne, Salzbourg, Hallstatt, Munich et Neuschwanstein : palais, concert classique et trains entre Autriche et Bavière.',
    descriptionEn: 'Vienna, Salzburg, Hallstatt, Munich and Neuschwanstein: palaces, a classical concert and trains across Austria and Bavaria.',
    image: '/images/header-card/vienna/vienna.jpg',
    imagePosition: 'center 30%',
    color: 'from-blue-500 to-indigo-400',
    theme: {
      '--tb-canvas': '#f1ede6',
      '--tb-ink': '#211d24',
      '--tb-muted': '#655e66',
      '--tb-accent': '#9a2f3e',
      '--tb-accent-strong': '#7c2333',
      '--tb-accent-soft': '#f0e4d3',
      '--tb-glow-a': '198 160 92',
      '--tb-glow-b': '96 118 158',
      '--tb-hero-tint': '20 18 28',
    },
  },
];

export const ALL_TRAVEL_DATA = {
  hokkaido: hokkaidoData,
  'vienna-munich': viennaMunichData,
};
