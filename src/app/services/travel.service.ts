import { Injectable, signal, computed } from '@angular/core';
import { ALL_TRAVEL_DATA, TRAVELS_REGISTRY } from '../data/all-travels';

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
  readonly selectedId = signal<string>(loadPersistedId());

  readonly currentTravel = computed(() =>
    TRAVELS_REGISTRY.find((t) => t.id === this.selectedId()) ?? TRAVELS_REGISTRY[0]
  );

  readonly itineraireData = computed(() => ALL_TRAVEL_DATA[this.selectedId() as TravelId].itineraire);
  readonly hebergementsData = computed(() => ALL_TRAVEL_DATA[this.selectedId() as TravelId].hebergements);
  readonly transportsData = computed(() => ALL_TRAVEL_DATA[this.selectedId() as TravelId].transports);
  readonly activitesData = computed(() => ALL_TRAVEL_DATA[this.selectedId() as TravelId].activites);
  readonly reservationsData = computed(() => ALL_TRAVEL_DATA[this.selectedId() as TravelId].reservations);

  select(id: string): void {
    this.selectedId.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch { /* ignore */ }
  }
}
