import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';
import { TranslationService } from '../../services/translation.service';
import { RouteMapComponent } from '../../ui/route-map/route-map.component';
import { MagneticDirective } from '../../ui/magnetic/magnetic.directive';
import { resolveCardImage } from '../../utils/card-images';
import { transportMeta, type CardTone, type Stage, type StageItem } from '../../core/trip-stages';
import type { TransportMode } from '../../ui/route-map/route-map.component';
import { PreparatifsService } from '../../core/preparatifs.service';
import type { PrepItem } from '../../core/preparatifs';

const TONE_ACCENT: Record<CardTone, string> = {
  forest: 'text-emerald-600',
  clay: 'text-amber-600',
  berry: 'text-rose-600',
};

@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [RouteMapComponent, MagneticDirective],
  templateUrl: './stage.component.html',
})
export class StageComponent {
  private readonly router = inject(Router);
  protected readonly travelService = inject(TravelService);
  protected readonly translationService = inject(TranslationService);
  protected readonly prep = inject(PreparatifsService);

  /** Index de l'étape, lié au paramètre de route `:index`. */
  readonly index = input<string>('0');

  private readonly idx = computed(() => {
    const n = Number.parseInt(this.index(), 10);
    return Number.isFinite(n) ? n : 0;
  });

  protected readonly stages = computed(() => this.travelService.stages());
  protected readonly stage = computed(() => this.travelService.stageAt(this.idx()));

  /** Ce qu'il reste à réserver pour cette étape (synchronisé avec Préparatifs). */
  protected readonly bookings = computed<PrepItem[]>(() => this.prep.itemsForStage(this.idx()));
  /** Infos décisionnelles du séjour de cette étape (budget, options, priorité). */
  protected readonly stayInfo = computed<PrepItem | null>(
    () => this.bookings().find((b) => b.group === 'stay') ?? null,
  );

  protected goToPreparatifs(): void {
    void this.router.navigate(['/preparatifs']);
  }

  protected readonly prev = computed<Stage | null>(() => {
    const i = this.idx();
    return i > 0 ? this.travelService.stageAt(i - 1) : null;
  });

  protected readonly next = computed<Stage | null>(() => {
    const i = this.idx();
    return i < this.stages().length - 1 ? this.travelService.stageAt(i + 1) : null;
  });

  protected goToJourney(): void {
    void this.router.navigate(['/itineraire']);
  }

  protected goToStage(index: number): void {
    void this.router.navigate(['/stage', index]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected accent(stage: Stage): string {
    return TONE_ACCENT[stage.tone];
  }

  protected transportLabel(mode: TransportMode | null): string {
    const meta = transportMeta(mode);
    return meta ? this.translationService.t().transportModes[meta.key] : '';
  }

  protected transportIcon(mode: TransportMode | null): string | null {
    return transportMeta(mode)?.icon ?? null;
  }

  protected imageSrc(stage: Stage): string {
    return resolveCardImage(`${stage.title} ${stage.chip}`, stage.image).src;
  }

  protected imageAlt(stage: Stage): string {
    return resolveCardImage(`${stage.title} ${stage.chip}`, stage.image).alt;
  }

  protected imagePosition(stage: Stage): string {
    return stage.image?.position ?? 'center 55%';
  }

  protected itemText(item: string | StageItem): string {
    return typeof item === 'string' ? item : item.text;
  }

  protected itemUrl(item: string | StageItem): string | null {
    return typeof item === 'string' ? null : (item.url ?? null);
  }
}
