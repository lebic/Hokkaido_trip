import { Component, computed, input } from '@angular/core';
import { cva } from 'class-variance-authority';

const chipStyles = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      tone: {
        forest: 'bg-emerald-100 text-emerald-800',
        clay: 'bg-amber-100 text-amber-800',
        berry: 'bg-rose-100 text-rose-800'
      }
    },
    defaultVariants: {
      tone: 'forest'
    }
  }
);

@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.component.html'
})
export class ChipComponent {
  tone = input<'forest' | 'clay' | 'berry'>('forest');
  className = input<string>('');

  readonly classes = computed(() => {
    const base = chipStyles({ tone: this.tone() });
    const extra = this.className().trim();
    return extra ? `${base} ${extra}` : base;
  });
}
