import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './ui/button/button.component';
import { NavLinkComponent } from './ui/nav-link/nav-link.component';
import { LangPickerComponent } from './ui/lang-picker/lang-picker.component';
import { TravelService } from './services/travel.service';
import { TranslationService } from './services/translation.service';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, NavLinkComponent, LangPickerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly travelService = inject(TravelService);
  protected readonly translationService = inject(TranslationService);
  // Instancié pour activer l'application du thème par destination.
  private readonly themeService = inject(ThemeService);
  protected readonly title = signal('travelbook');
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
