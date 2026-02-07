import { Component } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import activitesData from './activites.data.json';

type CardTone = 'forest' | 'clay' | 'berry';

interface PageSection {
  title: string;
  items: string[];
}

interface PageCard {
  chip: string;
  tone: CardTone;
  title: string;
  description?: string;
  sections: PageSection[];
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
  private readonly toneClasses: Record<CardTone, string> = {
    forest: 'border-emerald-200/70 bg-emerald-50/40',
    clay: 'border-amber-200/70 bg-amber-50/40',
    berry: 'border-rose-200/70 bg-rose-50/40'
  };

  protected cardClass(tone: CardTone): string {
    return [
      'grid gap-4 rounded-2xl border bg-white/80 p-5 shadow-xl shadow-zinc-900/5 backdrop-blur',
      this.toneClasses[tone]
    ].join(' ');
  }
}
