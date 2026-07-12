import { effect, inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TravelService } from '../services/travel.service';

/**
 * Applique l'ambiance (variables CSS) du voyage sélectionné sur :root.
 * Le changement de voyage fait glisser toute la palette du site (canvas,
 * halos atmosphériques, accents) vers celle de la destination.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly travel = inject(TravelService);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const theme = this.travel.currentTravel().theme;
      const root = this.doc.documentElement;
      for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
      }
    });
  }
}
