import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FAQ_GROUPS } from '../../core/data/content';
import { whatsappUrl } from '../../core/data/site';
import { IconComponent } from '../../shared/components/icon.component';
import { CtaBandComponent, PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, IconComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'FAQ' }];
  protected readonly query = signal('');
  protected readonly open = signal<ReadonlySet<string>>(new Set(['customisation-0']));
  protected readonly wa = whatsappUrl('Hello Crafted By Cane, I have a question before I order.');

  protected readonly groups = computed(() => {
    const q = this.query().trim().toLowerCase();
    return FAQ_GROUPS.map((g) => ({
      ...g,
      items: g.items.map((it, i) => ({ ...it, id: `${g.id}-${i}` })).filter((it) => !q || (it.q + ' ' + it.a).toLowerCase().includes(q)),
    })).filter((g) => g.items.length);
  });
  protected readonly total = computed(() => this.groups().reduce((n, g) => n + g.items.length, 0));
  protected readonly allCounts = FAQ_GROUPS.map((g) => ({ id: g.id, title: g.title, n: g.items.length }));

  constructor() {
    inject(Title).setTitle('FAQ | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Quick answers on customisation, materials, sizes, pricing, delivery and care for handwoven cane furniture.' });
  }

  protected toggle(id: string): void {
    this.open.update((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  protected jump(id: string): void {
    document.getElementById('faq-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
