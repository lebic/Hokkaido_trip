import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';
import { TranslationService } from '../../services/translation.service';
import { RevealDirective } from '../../ui/reveal/reveal.directive';
import { resolveCardImage } from '../../utils/card-images';
import { transportMeta, type CardTone, type Stage } from '../../core/trip-stages';
import type { TransportMode } from '../../ui/route-map/route-map.component';

interface ToneStyle {
  node: string;
  ring: string;
  chip: string;
}

const TONE_STYLES: Record<CardTone, ToneStyle> = {
  forest: { node: 'bg-emerald-500', ring: 'ring-emerald-200', chip: 'bg-emerald-100 text-emerald-800' },
  clay: { node: 'bg-amber-500', ring: 'ring-amber-200', chip: 'bg-amber-100 text-amber-800' },
  berry: { node: 'bg-rose-500', ring: 'ring-rose-200', chip: 'bg-rose-100 text-rose-800' },
};

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './journey.component.html',
})
export class JourneyComponent {
  private readonly router = inject(Router);
  protected readonly travelService = inject(TravelService);
  protected readonly translationService = inject(TranslationService);

  protected readonly stages = computed(() => this.travelService.stages());
  protected readonly hero = computed(() => this.travelService.tripHero());
  protected readonly travel = computed(() => this.travelService.currentTravelLocalized());

  protected openStage(index: number): void {
    void this.router.navigate(['/stage', index]);
  }

  protected backToTrips(): void {
    void this.router.navigate(['/voyages']);
  }

  protected tone(stage: Stage): ToneStyle {
    return TONE_STYLES[stage.tone];
  }

  protected transportIcon(mode: TransportMode | null): string | null {
    return transportMeta(mode)?.icon ?? null;
  }

  protected transportLabel(mode: TransportMode | null): string {
    const meta = transportMeta(mode);
    return meta ? this.translationService.t().transportModes[meta.key] : '';
  }

  protected imageSrc(stage: Stage): string {
    return resolveCardImage(`${stage.title} ${stage.chip}`, stage.image).src;
  }

  protected imageAlt(stage: Stage): string {
    return resolveCardImage(`${stage.title} ${stage.chip}`, stage.image).alt;
  }

  protected imagePosition(stage: Stage): string {
    return stage.image?.position ?? 'center 60%';
  }

  /** Délai en cascade pour l'apparition au scroll (plafonné). */
  protected revealDelay(index: number): number {
    return Math.min(index, 4) * 60;
  }
}
