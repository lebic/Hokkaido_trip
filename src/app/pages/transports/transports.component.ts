import { Component } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import transportsData from './transports.data.json';

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
  selector: 'app-transports',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './transports.component.html',
  styleUrl: './transports.component.scss'
})
export class TransportsComponent {
  protected readonly data = transportsData as PageData;
}
