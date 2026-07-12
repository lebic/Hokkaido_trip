import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

/**
 * Anime l'apparition d'un élément lorsqu'il entre dans le viewport (scroll reveal).
 * Ajoute la classe `.reveal` immédiatement puis `.reveal-in` à l'intersection.
 * Respecte `prefers-reduced-motion` via les styles globaux (voir styles.scss).
 *
 * Usage : `<div [appReveal]="120">` où la valeur est un délai en ms (optionnel).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;

  /** Délai d'animation en millisecondes (effet cascade). */
  readonly appReveal = input<number>(0);

  private observer?: IntersectionObserver;

  constructor() {
    const el = this.host;
    el.classList.add('reveal');

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const delay = this.appReveal();
            if (delay > 0) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add('reveal-in');
            this.observer?.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
