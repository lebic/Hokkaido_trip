import { Component } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import itineraireData from './itineraire.data.json';

type CardTone = 'forest' | 'clay' | 'berry';

interface PageCard {
  chip: string;
  tone: CardTone;
  title: string;
  description: string;
  bullets: string[];
}

interface PageData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: PageCard[];
}

@Component({
  selector: 'app-itineraire',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './itineraire.component.html',
  styleUrl: './itineraire.component.scss'
})
export class ItineraireComponent {
  protected readonly data = itineraireData as PageData;
}
