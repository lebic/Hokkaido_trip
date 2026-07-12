import { afterNextRender, Directive, ElementRef, inject, input, NgZone, OnDestroy } from '@angular/core';

/**
 * Effet "bouton magnétique" : l'élément suit légèrement la souris au survol,
 * puis revient à sa place en douceur. Désactivé au tactile et sous
 * `prefers-reduced-motion`.
 *
 * Usage : `<button appMagnetic>` ou `<button [appMagnetic]="0.4">` (force 0..1).
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly zone = inject(NgZone);

  /** Intensité de l'attraction (0 = aucune, 1 = colle au curseur). */
  readonly strength = input(0.3, {
    alias: 'appMagnetic',
    transform: (value: number | string): number => {
      if (typeof value === 'number') return value;
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0.3;
    },
  });

  private cleanup: (() => void)[] = [];

  constructor() {
    afterNextRender(() => {
      const canHover = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!canHover || reduced) return;

      const el = this.host;
      el.style.transition = 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.willChange = 'transform';

      this.zone.runOutsideAngular(() => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const s = this.strength();
          const maxX = r.width * 0.45;
          const maxY = r.height * 0.6;
          const tx = Math.max(-maxX, Math.min(maxX, dx * s));
          const ty = Math.max(-maxY, Math.min(maxY, dy * s));
          el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
        };
        const onLeave = () => {
          el.style.transform = 'translate(0, 0)';
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        this.cleanup.push(
          () => el.removeEventListener('mousemove', onMove),
          () => el.removeEventListener('mouseleave', onLeave),
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.cleanup.forEach((fn) => fn());
  }
}
