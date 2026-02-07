import { Component, computed, input } from '@angular/core';
import { cva } from 'class-variance-authority';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30',
  {
    variants: {
      variant: {
        ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-900/10',
        solid: 'bg-zinc-900 text-white hover:bg-zinc-800',
        outline: 'border-zinc-900/20 bg-[#fefaf5] text-zinc-900 hover:bg-zinc-900/5'
      },
      size: {
        sm: 'px-3 py-2 text-xs uppercase tracking-[0.12em]',
        md: 'px-4 py-2 text-sm'
      }
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm'
    }
  }
);

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  variant = input<'ghost' | 'solid' | 'outline'>('ghost');
  size = input<'sm' | 'md'>('sm');
  type = input<'button' | 'submit' | 'reset'>('button');
  className = input<string>('');
  ariaLabel = input<string | null>(null);
  ariaExpanded = input<boolean | null>(null);
  ariaControls = input<string | null>(null);

  readonly classes = computed(() => {
    const base = buttonStyles({ variant: this.variant(), size: this.size() });
    const extra = this.className().trim();
    return extra ? `${base} ${extra}` : base;
  });
}
