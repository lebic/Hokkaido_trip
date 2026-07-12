import { Injectable, signal, computed, inject } from '@angular/core';
import { ALL_TRAVEL_DATA, TRAVELS_REGISTRY } from '../data/all-travels';
import { TranslationService } from './translation.service';
import { buildStages, type RawTripData } from '../core/trip-stages';

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

  readonly localizedTravels = computed(() => {
    const locale = this.translationService.locale();
    return TRAVELS_REGISTRY.map((t) => ({
      ...t,
      subtitle: locale === 'en' ? t.subtitleEn : t.subtitle,
      duration: locale === 'en' ? t.durationEn : t.duration,
      description: locale === 'en' ? t.descriptionEn : t.description,
    }));
  });

  readonly currentTravelLocalized = computed(() => {
    const locale = this.translationService.locale();
    const travel = this.currentTravel();
    return {
      ...travel,
      subtitle: locale === 'en' ? travel.subtitleEn : travel.subtitle,
      duration: locale === 'en' ? travel.durationEn : travel.duration,
      description: locale === 'en' ? travel.descriptionEn : travel.description,
    };
  });

  private readonly localeData = computed(() =>
    ALL_TRAVEL_DATA[this.selectedId() as TravelId][this.translationService.locale()]
  );

  readonly itineraireData = computed(() => this.localeData().itineraire);
  readonly hebergementsData = computed(() => this.localeData().hebergements);
  readonly transportsData = computed(() => this.localeData().transports);
  readonly activitesData = computed(() => this.localeData().activites);

  /** Vue "centrée étape" dérivée de l'itinéraire (source unique de vérité). */
  readonly stages = computed(() => buildStages(this.itineraireData() as unknown as RawTripData));

  /** Métadonnées d'en-tête du voyage (titre, dates, budget estimé). */
  readonly tripHero = computed(() => (this.itineraireData() as unknown as RawTripData).hero);

  stageAt(index: number) {
    const list = this.stages();
    return index >= 0 && index < list.length ? list[index] : null;
  }

  select(id: string): void {
    this.selectedId.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch { /* ignore */ }
  }
}
