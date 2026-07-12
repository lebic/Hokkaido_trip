import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { PreparatifsService } from '../../core/preparatifs.service';
import { RevealDirective } from '../../ui/reveal/reveal.directive';
import type { PrepGroup, PrepGroupKey, PrepItem } from '../../core/preparatifs';

const GROUP_ICON: Record<PrepGroupKey, string> = {
  transport: '🚆',
  stay: '🏨',
  activity: '🎌',
  document: '📄',
};

@Component({
  selector: 'app-preparatifs',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './preparatifs.component.html',
})
export class PreparatifsComponent {
  private readonly router = inject(Router);
  protected readonly translationService = inject(TranslationService);
  protected readonly prep = inject(PreparatifsService);

  // Délégations directes au service partagé (mêmes signaux).
  protected readonly groups = this.prep.groups;
  protected readonly totalCount = this.prep.totalCount;
  protected readonly doneCount = this.prep.doneCount;
  protected readonly budgetTotal = this.prep.budgetTotal;
  protected readonly progressPercent = this.prep.progressPercent;

  protected groupIcon(key: PrepGroupKey): string {
    return GROUP_ICON[key];
  }

  protected groupLabel(key: PrepGroupKey): string {
    return this.translationService.t().preparatifs.groups[key];
  }

  protected groupDone(group: PrepGroup): number {
    return group.items.filter((i) => this.prep.isChecked(i.id)).length;
  }

  protected isChecked(id: string): boolean {
    return this.prep.isChecked(id);
  }

  protected toggle(id: string): void {
    this.prep.toggle(id);
  }

  protected goToStage(item: PrepItem): void {
    if (item.stageIndex !== null) {
      void this.router.navigate(['/stage', item.stageIndex]);
    }
  }

  protected revealDelay(index: number): number {
    return Math.min(index, 5) * 50;
  }
}
