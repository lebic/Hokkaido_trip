import { Component } from '@angular/core';
import reservationsData from './reservations.data.json';
import { resolveCardImage, type CardImageOverride } from '../../utils/card-images';

interface LinkItem {
  label: string;
  url: string;
}

interface ReservationSection {
  title: string;
  items: string[];
}

interface ReservationCard {
  chip: string;
  title: string;
  description?: string;
  image?: CardImageOverride;
  sections: ReservationSection[];
  links?: LinkItem[];
}

interface ReservationsData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: ReservationCard[];
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent {
  protected readonly data = reservationsData as ReservationsData;
  private readonly defaultImagePosition = 'center 65%';

  protected cardImageSrc(card: ReservationCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).src;
  }

  protected cardImageAlt(card: ReservationCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).alt;
  }

  protected cardImagePosition(card: ReservationCard): string {
    return card.image?.position ?? this.defaultImagePosition;
  }
}
