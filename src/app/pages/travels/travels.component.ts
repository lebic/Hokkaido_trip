import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';
import { TranslationService } from '../../services/translation.service';
import { RevealDirective } from '../../ui/reveal/reveal.directive';
import { MagneticDirective } from '../../ui/magnetic/magnetic.directive';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [RevealDirective, MagneticDirective],
  templateUrl: './travels.component.html',
})
export class TravelsComponent {
  private readonly router = inject(Router);
  protected readonly travelService = inject(TravelService);
  protected readonly translationService = inject(TranslationService);
  protected readonly travels = computed(() => this.travelService.localizedTravels());

  protected selectTravel(id: string): void {
    this.travelService.select(id);
    void this.router.navigate(['/itineraire']);
  }
}
