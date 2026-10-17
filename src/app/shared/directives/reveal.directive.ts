import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Fades an element up (16px) when it enters the viewport.
 * `appReveal` takes an optional delay in ms; use `[appReveal]="i * 60"` to stagger cards.
 * Observers are shared to keep the cost low.
 */
let observer: IntersectionObserver | null = null;
const targets = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        targets.get(e.target)?.();
        targets.delete(e.target);
        observer?.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  return observer;
}

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  /** delay in ms (empty string = 0) */
  @Input('appReveal') delay: number | string = 0;
  @Input() revealFrom: 'up' | 'left' | 'right' | 'scale' = 'up';

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  ngOnInit(): void {
    const el = this.el;
    el.classList.add('reveal');
    if (this.revealFrom !== 'up') el.classList.add(`reveal--${this.revealFrom}`);
    const d = Number(this.delay) || 0;
    if (d) el.style.setProperty('--d', `${Math.min(d, 600)}ms`);
    const io = getObserver();
    if (!io) {
      el.classList.add('is-in');
      return;
    }
    targets.set(el, () => el.classList.add('is-in'));
    io.observe(el);
  }

  ngOnDestroy(): void {
    targets.delete(this.el);
    observer?.unobserve(this.el);
  }
}
