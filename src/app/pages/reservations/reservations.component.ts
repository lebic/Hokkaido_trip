import { Component, computed, signal } from '@angular/core';

interface DocCategory {
  key: string;
  icon: string;
  label: string;
  badge: string;
  docs: string[];
}

interface UploadedFile {
  name: string;
  size: number;
}

const CATEGORIES: DocCategory[] = [
  {
    key: 'vols',
    icon: '✈️',
    label: 'Vols',
    badge: 'bg-blue-50 text-blue-700',
    docs: ['Vol aller Europe → Tokyo', 'Vol retour Tokyo → Europe', 'Vol Sapporo → Tokyo (Jour 15)'],
  },
  {
    key: 'ferry',
    icon: '⛴️',
    label: 'Ferry',
    badge: 'bg-sky-50 text-sky-700',
    docs: ['Sunflower Ferry – Oarai → Tomakomai (Jour 4)'],
  },
  {
    key: 'hebergements',
    icon: '🏨',
    label: 'Hébergements',
    badge: 'bg-violet-50 text-violet-700',
    docs: [
      'Tokyo arrivée (Jours 1–3)',
      'Sapporo (Jours 5–7)',
      'Sounkyo Onsen (Jour 8)',
      'Akan-ko (Jours 9–11)',
      'Furano (Jours 12–13)',
      'Sapporo retour (Jour 14)',
      'Tokyo retour (Jours 16–18)',
    ],
  },
  {
    key: 'train',
    icon: '🚂',
    label: 'JR Pass / Train',
    badge: 'bg-amber-50 text-amber-700',
    docs: ['JR Hokkaido Rail Pass', 'Réservations sièges'],
  },
  {
    key: 'voiture',
    icon: '🚗',
    label: 'Location voiture',
    badge: 'bg-emerald-50 text-emerald-700',
    docs: ['Confirmation location voiture (Jours 8–13)'],
  },
  {
    key: 'activites',
    icon: '🎌',
    label: 'Activités',
    badge: 'bg-rose-50 text-rose-700',
    docs: ['Spectacle Aïnou – Akan-ko', 'Ropeway Daisetsuzan', 'Autres billets'],
  },
];

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent {
  protected readonly categories = CATEGORIES;

  protected readonly uploads = signal<Record<string, UploadedFile[]>>({});

  protected readonly totalCount = computed(() =>
    Object.values(this.uploads()).reduce((sum, files) => sum + files.length, 0)
  );

  protected getFiles(key: string): UploadedFile[] {
    return this.uploads()[key] ?? [];
  }

  protected addFiles(key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const newFiles: UploadedFile[] = Array.from(input.files).map((f) => ({ name: f.name, size: f.size }));
    this.uploads.update((u) => ({ ...u, [key]: [...(u[key] ?? []), ...newFiles] }));
    input.value = '';
  }

  protected removeFile(key: string, index: number): void {
    this.uploads.update((u) => {
      const updated = [...(u[key] ?? [])];
      updated.splice(index, 1);
      return { ...u, [key]: updated };
    });
  }

  protected formatSize(bytes: number): string {
    return bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} Ko`
      : `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }
}
