import { Component } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import hebergementsData from './hebergements.data.json';

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
  selector: 'app-hebergements',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './hebergements.component.html',
  styleUrl: './hebergements.component.scss'
})
export class HebergementsComponent {
  protected readonly data = hebergementsData as PageData;
}
