import { Component } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import activitesData from './activites.data.json';

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
  selector: 'app-activites',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.scss'
})
export class ActivitesComponent {
  protected readonly data = activitesData as PageData;
}
