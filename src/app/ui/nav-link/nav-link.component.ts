import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cva } from 'class-variance-authority';

const navLinkStyles = cva(
  'rounded-full border border-transparent px-3 py-2 text-sm font-semibold transition hover:border-zinc-900/20 hover:bg-zinc-900/5',
  {
    variants: {
      tone: {
        light: 'text-zinc-900',
        dark: 'text-white hover:border-white/40 hover:bg-white/10'
      }
    },
    defaultVariants: {
      tone: 'light'
    }
  }
);

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-link.component.html'
})
export class NavLinkComponent {
  to = input.required<string>();
  exact = input<boolean>(true);
  tone = input<'light' | 'dark'>('light');
  className = input<string>('');

  protected readonly activeClasses = 'bg-zinc-900/10 border-zinc-900/40';

  readonly classes = computed(() => {
    const base = navLinkStyles({ tone: this.tone() });
    const extra = this.className().trim();
    return extra ? `${base} ${extra}` : base;
  });
}
