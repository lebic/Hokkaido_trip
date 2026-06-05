import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './ui/button/button.component';
import { NavLinkComponent } from './ui/nav-link/nav-link.component';
import { TravelService } from './services/travel.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, NavLinkComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly travelService = inject(TravelService);
  protected readonly title = signal('hokkaido-trip');
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
