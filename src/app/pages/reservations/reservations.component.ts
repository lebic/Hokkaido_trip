import { Component } from '@angular/core';
import reservationsData from './reservations.data.json';
import { imageForText } from '../../utils/card-images';

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

  protected cardImageSrc(card: ReservationCard): string {
    return imageForText(`${card.title} ${card.chip}`).src;
  }

  protected cardImageAlt(card: ReservationCard): string {
    return imageForText(`${card.title} ${card.chip}`).alt;
  }
}
