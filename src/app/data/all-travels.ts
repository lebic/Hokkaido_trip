import { hokkaidoData } from './hokkaido/index';
import { viennaMunichData } from './vienna-munich/index';

export interface TravelMeta {
  id: string;
  name: string;
  subtitle: string;
  dates: string;
  duration: string;
  description: string;
  image: string;
  color: string;
}

export const TRAVELS_REGISTRY: TravelMeta[] = [
  {
    id: 'hokkaido',
    name: 'Tokyo & Hokkaido',
    subtitle: 'Japon',
    dates: '24 Oct – 7 Nov 2026',
    duration: '14 jours / 13 nuits',
    description: 'Tokyo, ferry de nuit vers Hokkaido, Sapporo, lacs, lavandes de Furano...',
    image: '/images/header-card/tokyo.avif',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'vienna-munich',
    name: 'Vienne & Munich',
    subtitle: 'Autriche · Allemagne',
    dates: '29 Jan – 8 Fev 2027',
    duration: '11 jours / 10 nuits',
    description: 'Palais imperiaux, musees, bieres et Railjet entre deux capitales d\'hiver.',
    image: '/images/placeholders/city.svg',
    color: 'from-blue-500 to-indigo-400',
  },
];

export const ALL_TRAVEL_DATA = {
  hokkaido: hokkaidoData,
  'vienna-munich': viennaMunichData,
};
