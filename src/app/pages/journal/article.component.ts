import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, inject, input, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ARTICLES, Article, articleBySlug } from '../../core/data/content';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { BreadcrumbComponent, CtaBandComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent, BreadcrumbComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  private readonly router = inject(Router);
  private readonly titleSvc = inject(Title);
  private readonly metaSvc = inject(Meta);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly slug = input.required<string>();
  protected readonly a = computed<Article | undefined>(() => articleBySlug(this.slug()));
  protected readonly crumbs = computed(() => [{ label: 'Home', link: '/' }, { label: 'Journal', link: '/journal' }, { label: this.a()?.topic ?? '' }]);
  protected readonly related = computed(() => ARTICLES.filter((x) => x.slug !== this.slug()).slice(0, 3));
  protected readonly active = signal('');
  protected readonly copied = signal(false);

  constructor() {
    effect(() => {
      const a = this.a();
      if (!a) { this.router.navigateByUrl('/not-found', { replaceUrl: true }); return; }
      this.titleSvc.setTitle(`${a.title} | Crafted By Cane Journal`);
      this.metaSvc.updateTag({ name: 'description', content: a.excerpt });
      this.active.set(a.sections[0].id);
    }, { allowSignalWrites: true });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const line = 160;
    let cur = '';
    this.host.querySelectorAll<HTMLElement>('[data-sec]').forEach((el) => { if (el.getBoundingClientRect().top < line + 60) cur = el.dataset['sec']!; });
    if (cur && cur !== this.active()) this.active.set(cur);
  }

  protected go(id: string): void { document.getElementById('sec-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  protected async share(): Promise<void> {
    try {
      await navigator.clipboard.writeText(location.href);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch { /* clipboard blocked */ }
  }
}
