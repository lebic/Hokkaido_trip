import { Component, computed, signal, inject } from '@angular/core';
import { TravelService } from '../../services/travel.service';

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

const TIPS_TITLES = ['Conseils generaux', 'General tips'];

@Component({
  selector: 'app-hebergements',
  standalone: true,
  imports: [],
  templateUrl: './hebergements.component.html',
})
export class HebergementsComponent {
  private readonly travelService = inject(TravelService);
  private readonly storageKey = computed(() => `${this.travelService.selectedId()}-hebergements-reserved`);
  private readonly rawData = computed(() => this.travelService.hebergementsData() as PageData);

  protected readonly accommodations = computed(() =>
    (this.rawData().cards as unknown as HotelCard[]).filter((c) => typeof c.location === 'string')
  );

  protected readonly conseilsSections = computed((): PageSection[] => {
    const tips = this.rawData().cards.find(
      (c) => TIPS_TITLES.includes((c as { title?: string }).title ?? '')
    ) as { sections?: PageSection[] } | undefined;
    return tips?.sections ?? [];
  });

  private loadState(): boolean[] {
    try {
      if (typeof localStorage === 'undefined') {
        return new Array<boolean>(this.accommodations().length).fill(false);
      }
      const raw = localStorage.getItem(this.storageKey());
      const arr: boolean[] = raw ? (JSON.parse(raw) as boolean[]) : [];
      return Array.from({ length: this.accommodations().length }, (_, i) => arr[i] ?? false);
    } catch {
      return new Array<boolean>(this.accommodations().length).fill(false);
    }
  }

  protected readonly reservedState = signal<boolean[]>(this.loadState());

  protected readonly reservedCount = computed(() =>
    this.reservedState().filter(Boolean).length
  );

  protected readonly progressPercent = computed(() =>
    this.accommodations().length > 0
      ? Math.round((this.reservedCount() / this.accommodations().length) * 100)
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
      localStorage.setItem(this.storageKey(), JSON.stringify(state));
    } catch { /* localStorage unavailable */ }
  }
}
