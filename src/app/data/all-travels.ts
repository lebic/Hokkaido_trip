import { hokkaidoData } from './hokkaido/index';
import { viennaMunichData } from './vienna-munich/index';

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
}

export const TRAVELS_REGISTRY: TravelMeta[] = [
  {
    id: 'hokkaido',
    name: 'Tokyo & Hokkaido',
    subtitle: 'Japon',
    subtitleEn: 'Japan',
    dates: '24 Oct – 7 Nov 2026',
    duration: '14 jours / 13 nuits',
    durationEn: '14 days / 13 nights',
    description: 'Tokyo, ferry de nuit vers Hokkaido, Sapporo, lacs, lavandes de Furano...',
    descriptionEn: 'Tokyo, overnight ferry to Hokkaido, Sapporo, lakes, lavender fields of Furano...',
    image: '/images/header-card/japan/tokyo.avif',
    imagePosition: 'center 10%',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'vienna-munich',
    name: 'Vienna & Munich',
    subtitle: 'Autriche · Allemagne',
    subtitleEn: 'Austria · Germany',
    dates: '29 Jan – 8 Feb 2027',
    duration: '11 jours / 10 nuits',
    durationEn: '11 days / 10 nights',
    description: 'Palais impériaux, musées, bières et Railjet entre deux capitales d\'hiver.',
    descriptionEn: 'Imperial palaces, museums, beer halls and Railjet between two winter capitals.',
    image: '/images/header-card/vienna/vienna.jpg',
    imagePosition: 'center 30%',
    color: 'from-blue-500 to-indigo-400',
  },
];

export const ALL_TRAVEL_DATA = {
  hokkaido: hokkaidoData,
  'vienna-munich': viennaMunichData,
};
