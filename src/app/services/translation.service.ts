import { Injectable, signal } from '@angular/core';

export type Locale = 'fr' | 'en';

export interface LocaleMeta {
  code: Locale;
  label: string;
  flag: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const STORAGE_KEY = 'app-locale';

function loadPersistedLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return stored && LOCALES.some((l) => l.code === stored) ? stored : 'fr';
  } catch {
    return 'fr';
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly locale = signal<Locale>(loadPersistedLocale());

  setLocale(code: Locale): void {
    this.locale.set(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch { /* ignore */ }
  }
}
