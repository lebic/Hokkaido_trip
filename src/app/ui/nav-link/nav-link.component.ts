import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cva } from 'class-variance-authority';

const navLinkStyles = cva(
  'block rounded-full border border-transparent px-3 py-2 text-sm font-medium transition hover:bg-black/[0.04] md:inline-block',
  {
    variants: {
      tone: {
        light: 'text-[color:var(--tb-muted)] hover:text-[color:var(--tb-ink)]',
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

  protected readonly activeClasses =
    'tb-accent-soft !font-semibold border-transparent';

  readonly classes = computed(() => {
    const base = navLinkStyles({ tone: this.tone() });
    const extra = this.className().trim();
    return extra ? `${base} ${extra}` : base;
  });
}
