import { Component, computed, signal } from '@angular/core';
import transportsData from './transports.data.json';

type Category = 'vol' | 'ferry' | 'train' | 'voiture' | 'local' | 'activites';

interface LinkItem {
  label: string;
  url: string;
}

interface TransportCard {
  chip: string;
  title: string;
  description?: string;
  category: Category;
  toReserve: boolean;
  links?: LinkItem[];
}

interface PageData {
  hero: { eyebrow: string; title: string; description: string; };
  cards: Record<string, unknown>[];
}

interface CategoryMeta {
  label: string;
  icon: string;
  badge: string;
  dot: string;
}

const STORAGE_KEY = 'hokkaido-transports-reserved';

const CATEGORY_META: Record<Category, CategoryMeta> = {
  vol:       { label: 'Vols',                    icon: '✈️', badge: 'bg-blue-50 text-blue-700',      dot: 'bg-blue-400' },
  ferry:     { label: 'Ferry',                    icon: '⛴️', badge: 'bg-sky-50 text-sky-700',       dot: 'bg-sky-400' },
  train:     { label: 'Train / JR Pass',          icon: '🚂', badge: 'bg-violet-50 text-violet-700', dot: 'bg-violet-400' },
  voiture:   { label: 'Location voiture',         icon: '🚗', badge: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-400' },
  local:     { label: 'Déplacements locaux',      icon: '🚌', badge: 'bg-zinc-50 text-zinc-600',     dot: 'bg-zinc-400' },
  activites: { label: 'Activités à réserver',     icon: '🎌', badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
};

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [],
  templateUrl: './transports.component.html',
})
export class TransportsComponent {
  private readonly rawData = transportsData as PageData;

  protected readonly reservations: TransportCard[] = (this.rawData.cards as unknown as TransportCard[]).filter(
    (c) => c.toReserve === true
  );

  protected readonly categoryMeta = CATEGORY_META;

  protected readonly categories: Category[] = [...new Set(
    this.reservations.map((c) => c.category)
  )];

  private loadState(): boolean[] {
    try {
      if (typeof localStorage === 'undefined') {
        return new Array<boolean>(this.reservations.length).fill(false);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: boolean[] = raw ? (JSON.parse(raw) as boolean[]) : [];
      return Array.from({ length: this.reservations.length }, (_, i) => arr[i] ?? false);
    } catch {
      return new Array<boolean>(this.reservations.length).fill(false);
    }
  }

  protected readonly reservedState = signal<boolean[]>(this.loadState());

  protected readonly reservedCount = computed(() =>
    this.reservedState().filter(Boolean).length
  );

  protected readonly progressPercent = computed(() =>
    this.reservations.length > 0
      ? Math.round((this.reservedCount() / this.reservations.length) * 100)
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

  protected getByCategory(category: Category): Array<{ card: TransportCard; index: number }> {
    return this.reservations
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => card.category === category);
  }
}
