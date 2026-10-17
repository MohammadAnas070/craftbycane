import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { POLICIES, Policy, policyBySlug } from '../../core/data/content';
import { IconComponent } from '../../shared/components/icon.component';
import { BreadcrumbComponent } from '../../shared/components/small.components';

/** One layout for privacy, terms, shipping and returns. */
@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [RouterLink, IconComponent, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (p(); as p) {
      <section class="head">
        <div class="container head__in">
          <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: p.title }]" />
          <h1>{{ p.title }}</h1>
        </div>
      </section>
      <div class="container body">
        <aside class="toc">
          <p class="toc__t">On this page</p>
          <ol>@for (s of p.sections; track s.id) { <li><a [href]="'#' + s.id" (click)="go($event, s.id)">{{ s.heading }}</a></li> }</ol>
          <p class="toc__more">Other policies</p>
          <ul>@for (o of others(); track o.slug) { <li><a [routerLink]="['/', o.slug]">{{ o.title }}</a></li> }</ul>
        </aside>
        <article class="prose">
          <div class="alert alert--info"><app-icon name="info" [s]="20" /><div><strong>Draft</strong>Replace with text approved by the business or its legal adviser.</div></div>
          @for (s of p.sections; track s.id) {
            <section [id]="s.id"><h2>{{ s.heading }}</h2><p>{{ s.text }}</p></section>
          }
        </article>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .head { background: var(--ivory-2); padding-block: 36px 48px; }
    .head h1 { margin-top: 28px; font-size: clamp(38px, 5vw, 64px); animation: fade-up 0.7s var(--ease) both; }
    .body { display: grid; gap: 32px; padding-block: 48px clamp(64px, 8vw, 100px); }
    @media (min-width: 960px) { .body { grid-template-columns: 240px minmax(0, 700px); gap: 72px; } .toc { position: sticky; top: calc(var(--header-h) + 24px); align-self: start; } }
    .toc__t, .toc__more { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 14px; }
    .toc__more { margin-top: 32px; color: var(--ink-muted); }
    .toc li a { display: block; padding: 8px 0; font-size: 14.5px; border-bottom: 1px solid var(--line); transition: color 0.2s, padding-left 0.3s var(--ease); }
    .toc li a:hover { color: var(--terracotta); padding-left: 8px; }
    .prose { font-size: 16.5px; line-height: 1.8; }
    .alert { margin-bottom: 40px; }
    .prose section { scroll-margin-top: calc(var(--header-h) + 24px); margin-bottom: 36px; }
    .prose h2 { font-size: 32px; margin-bottom: 10px; }
  `],
})
export class PolicyComponent {
  private readonly router = inject(Router);
  private readonly titleSvc = inject(Title);
  private readonly metaSvc = inject(Meta);
  readonly slug = input<string>('');
  protected readonly p = computed<Policy | undefined>(() => policyBySlug(this.slug()));
  protected readonly others = computed(() => POLICIES.filter((x) => x.slug !== this.slug()));

  constructor() {
    effect(() => {
      const p = this.p();
      if (!p) { this.router.navigateByUrl('/not-found', { replaceUrl: true }); return; }
      this.titleSvc.setTitle(`${p.title} | Crafted By Cane`);
      this.metaSvc.updateTag({ name: 'description', content: `${p.title} for Crafted By Cane. Draft text, to be confirmed by the business.` });
    });
  }

  protected go(e: Event, id: string): void {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
