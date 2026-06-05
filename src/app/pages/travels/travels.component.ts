import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TravelService } from '../../services/travel.service';
import { TRAVELS_REGISTRY, type TravelMeta } from '../../data/all-travels';

@Component({
  selector: 'app-travels',
  standalone: true,
  imports: [],
  templateUrl: './travels.component.html',
})
export class TravelsComponent {
  private readonly router = inject(Router);
  protected readonly travelService = inject(TravelService);
  protected readonly travels: TravelMeta[] = TRAVELS_REGISTRY;

  protected selectTravel(id: string): void {
    this.travelService.select(id);
    void this.router.navigate(['/itineraire']);
  }
}
