import { Component, computed, signal, inject } from '@angular/core';
import { TravelService } from '../../services/travel.service';

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

interface ReservationsData {
  hero: { eyebrow: string; title: string; description: string; };
  categories: DocCategory[];
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent {
  private readonly travelService = inject(TravelService);
  private readonly rawData = this.travelService.reservationsData() as unknown as ReservationsData;

  protected readonly categories: DocCategory[] = this.rawData.categories ?? [];

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
