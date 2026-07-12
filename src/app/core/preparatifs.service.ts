import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TravelService } from '../services/travel.service';
import { buildPreparatifs, sumBudget, type PrepGroup, type PrepItem } from './preparatifs';

/**
 * État partagé des "préparatifs" : la même liste dérivée et le même état
 * "réservé" (une clé localStorage par voyage) sont consommés par la vue
 * transverse `/preparatifs` ET par le hub d'étape (chaque étape affiche ce
 * qu'il reste à y réserver, synchronisé).
 */
@Injectable({ providedIn: 'root' })
export class PreparatifsService {
  private readonly travel = inject(TravelService);

  readonly groups = computed<PrepGroup[]>(() =>
    buildPreparatifs({
      transports: this.travel.transportsData(),
      hebergements: this.travel.hebergementsData(),
      activites: this.travel.activitesData(),
      stages: this.travel.stages(),
    }),
  );

  readonly allItems = computed<PrepItem[]>(() => this.groups().flatMap((g) => g.items));
  readonly totalCount = computed(() => this.allItems().length);
  readonly budgetTotal = computed(() => sumBudget(this.groups()));

  private readonly storageKey = computed(() => `${this.travel.selectedId()}-preparatifs`);
  readonly checked = signal<Record<string, boolean>>(this.load());

  constructor() {
    // Recharge l'état "réservé" quand on change de voyage.
    effect(() => {
      this.storageKey();
      this.checked.set(this.load());
    });
  }

  private load(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(this.storageKey());
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  }

  /** Items réservés par défaut (statut confirmé) → cochés tant que non modifiés à la main. */
  private readonly bookedDefaults = computed<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const item of this.allItems()) {
      if (item.booked) map[item.id] = true;
    }
    return map;
  });

  readonly doneCount = computed(() =>
    this.allItems().filter((i) => this.isChecked(i.id)).length,
  );

  readonly progressPercent = computed(() =>
    this.totalCount() > 0 ? Math.round((this.doneCount() / this.totalCount()) * 100) : 0,
  );

  isChecked(id: string): boolean {
    // L'état manuel (localStorage) prime ; sinon on retombe sur le statut "réservé".
    return this.checked()[id] ?? this.bookedDefaults()[id] ?? false;
  }

  toggle(id: string): void {
    const next = { ...this.checked(), [id]: !this.isChecked(id) };
    this.checked.set(next);
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(next));
    } catch {
      /* localStorage indisponible */
    }
  }

  /** Items à réserver rattachés à une étape donnée. */
  itemsForStage(index: number): PrepItem[] {
    return this.allItems().filter((i) => i.stageIndex === index);
  }
}
