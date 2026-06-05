import { Injectable, signal, computed, inject } from '@angular/core';
import { ALL_TRAVEL_DATA, TRAVELS_REGISTRY } from '../data/all-travels';
import { TranslationService } from './translation.service';

export type TravelId = keyof typeof ALL_TRAVEL_DATA;

const STORAGE_KEY = 'selected-travel-id';

function loadPersistedId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? TRAVELS_REGISTRY[0].id;
  } catch {
    return TRAVELS_REGISTRY[0].id;
  }
}

@Injectable({ providedIn: 'root' })
export class TravelService {
  private readonly translationService = inject(TranslationService);

  readonly selectedId = signal<string>(loadPersistedId());

  readonly currentTravel = computed(() =>
    TRAVELS_REGISTRY.find((t) => t.id === this.selectedId()) ?? TRAVELS_REGISTRY[0]
  );

  private readonly localeData = computed(() =>
    ALL_TRAVEL_DATA[this.selectedId() as TravelId][this.translationService.locale()]
  );

  readonly itineraireData = computed(() => this.localeData().itineraire);
  readonly hebergementsData = computed(() => this.localeData().hebergements);
  readonly transportsData = computed(() => this.localeData().transports);
  readonly activitesData = computed(() => this.localeData().activites);
  readonly reservationsData = computed(() => this.localeData().reservations);

  select(id: string): void {
    this.selectedId.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch { /* ignore */ }
  }
}
