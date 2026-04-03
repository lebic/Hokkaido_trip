import { Component, computed, signal } from '@angular/core';
import hebergementsData from './hebergements.data.json';

type Priority = 1 | 2;

interface LinkItem {
  label: string;
  url: string;
}

interface PageSection {
  title: string;
  items: string[];
}

interface HotelCard {
  chip: string;
  title: string;
  location: string;
  nights: string;
  priority: Priority;
  description?: string;
  links?: LinkItem[];
  sections?: PageSection[];
}

interface PageData {
  hero: { eyebrow: string; title: string; description: string; };
  cards: Record<string, unknown>[];
}

const STORAGE_KEY = 'hokkaido-hebergements-reserved';

@Component({
  selector: 'app-hebergements',
  standalone: true,
  imports: [],
  templateUrl: './hebergements.component.html',
})
export class HebergementsComponent {
  private readonly rawData = hebergementsData as PageData;

  protected readonly accommodations: HotelCard[] = (this.rawData.cards as unknown as HotelCard[]).filter(
    (c) => typeof c.location === 'string'
  );

  protected readonly conseilsSections: PageSection[] = (() => {
    const tips = this.rawData.cards.find(
      (c) => (c as { title?: string }).title === 'Conseils generaux'
    ) as { sections?: PageSection[] } | undefined;
    return tips?.sections ?? [];
  })();

  private loadState(): boolean[] {
    try {
      if (typeof localStorage === 'undefined') {
        return new Array<boolean>(this.accommodations.length).fill(false);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: boolean[] = raw ? (JSON.parse(raw) as boolean[]) : [];
      return Array.from({ length: this.accommodations.length }, (_, i) => arr[i] ?? false);
    } catch {
      return new Array<boolean>(this.accommodations.length).fill(false);
    }
  }

  protected readonly reservedState = signal<boolean[]>(this.loadState());

  protected readonly reservedCount = computed(() =>
    this.reservedState().filter(Boolean).length
  );

  protected readonly progressPercent = computed(() =>
    this.accommodations.length > 0
      ? Math.round((this.reservedCount() / this.accommodations.length) * 100)
      : 0
  );

  protected isReserved(index: number): boolean {
    return this.reservedState()[index] ?? false;
  }

  protected toggle(index: number): void {
    const state = [...this.reservedState()];
    state[index] = !state[index];
    this.reservedState.set(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* localStorage unavailable */ }
  }
}
