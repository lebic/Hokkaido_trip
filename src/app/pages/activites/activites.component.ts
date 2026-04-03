import { Component, computed, signal } from '@angular/core';
import activitesData from './activites.data.json';

interface LinkItem {
  label: string;
  url: string;
}

interface ActivityCard {
  chip: string;
  title: string;
  location: string;
  description?: string;
  links?: LinkItem[];
}

interface PageData {
  hero: { eyebrow: string; title: string; description: string; };
  activities: ActivityCard[];
}

const STORAGE_KEY = 'hokkaido-activites-reserved';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [],
  templateUrl: './activites.component.html',
})
export class ActivitesComponent {
  private readonly rawData = activitesData as unknown as PageData;

  protected readonly activities: ActivityCard[] = this.rawData.activities;

  private loadState(): boolean[] {
    try {
      if (typeof localStorage === 'undefined') {
        return new Array<boolean>(this.activities.length).fill(false);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: boolean[] = raw ? (JSON.parse(raw) as boolean[]) : [];
      return Array.from({ length: this.activities.length }, (_, i) => arr[i] ?? false);
    } catch {
      return new Array<boolean>(this.activities.length).fill(false);
    }
  }

  protected readonly reservedState = signal<boolean[]>(this.loadState());

  protected readonly reservedCount = computed(() =>
    this.reservedState().filter(Boolean).length
  );

  protected readonly progressPercent = computed(() =>
    this.activities.length > 0
      ? Math.round((this.reservedCount() / this.activities.length) * 100)
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
