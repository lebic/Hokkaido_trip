export interface CardImage {
  src: string;
  alt: string;
}

const IMAGE_MAP: Array<{ keywords: string[]; image: CardImage }> = [
  {
    keywords: ['tokyo', 'shibuya', 'shinjuku', 'asakusa', 'ginza', 'harajuku'],
    image: { src: '/images/placeholders/city.svg', alt: 'City skyline' }
  },
  {
    keywords: ['sapporo', 'otaru', 'hakodate', 'asahikawa'],
    image: { src: '/images/placeholders/harbor.svg', alt: 'Harbor town' }
  },
  {
    keywords: ['ferry', 'sunflower', 'oarai', 'tomakomai'],
    image: { src: '/images/placeholders/ferry.svg', alt: 'Ferry at sea' }
  },
  {
    keywords: ['train', 'jr', 'shinkansen', 'rail', 'station'],
    image: { src: '/images/placeholders/train.svg', alt: 'Train ride' }
  },
  {
    keywords: ['onsen', 'sounkyo', 'ryokan'],
    image: { src: '/images/placeholders/onsen.svg', alt: 'Onsen retreat' }
  },
  {
    keywords: ['akan', 'lake', 'mashu', 'kussharo'],
    image: { src: '/images/placeholders/lake.svg', alt: 'Lake view' }
  },
  {
    keywords: ['furano', 'biei', 'farm', 'lavender'],
    image: { src: '/images/placeholders/fields.svg', alt: 'Flower fields' }
  },
  {
    keywords: ['mountain', 'ropeway', 'daisetsuzan'],
    image: { src: '/images/placeholders/mountain.svg', alt: 'Mountain view' }
  },
  {
    keywords: ['car', 'rental', 'drive'],
    image: { src: '/images/placeholders/car.svg', alt: 'Car rental' }
  },
  {
    keywords: ['flight', 'airport', 'vol', 'haneda', 'narita'],
    image: { src: '/images/placeholders/airport.svg', alt: 'Airport travel' }
  },
  {
    keywords: ['checklist', 'documents', 'reservation', 'files'],
    image: { src: '/images/placeholders/documents.svg', alt: 'Travel documents' }
  }
];

export function imageForText(text: string): CardImage {
  const normalized = text.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.image;
    }
  }
  return { src: '/images/placeholders/landscape.svg', alt: 'Travel landscape' };
}
