import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { TranslationService, LOCALES } from '../../services/translation.service';

@Component({
  selector: 'app-lang-picker',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './lang-picker.component.html',
})
export class LangPickerComponent {
  protected readonly translationService = inject(TranslationService);
  protected readonly locales = LOCALES;
}
