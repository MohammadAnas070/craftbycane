import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ARTICLES, JournalTopic } from '../../core/data/content';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { NewsletterFormComponent } from '../../shared/components/newsletter-form.component';
import { PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, ArtComponent, IconComponent, NewsletterFormComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss',
})
export class JournalComponent {
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Journal' }];
  protected readonly topics: ('All' | JournalTopic)[] = ['All', 'Craft story', 'Styling', 'Decor inspiration', 'Care guide', 'Behind the scenes'];
  protected readonly topic = signal<'All' | JournalTopic>('All');
  protected readonly query = signal('');
  protected readonly limit = signal(6);

  protected readonly featured = ARTICLES.find((a) => a.featured)!;
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return ARTICLES.filter((a) => a !== this.featured || this.topic() !== 'All' || !!q)
      .filter((a) => (this.topic() === 'All' || a.topic === this.topic()) && (!q || (a.title + ' ' + a.excerpt + ' ' + a.topic).toLowerCase().includes(q)));
  });
  protected readonly shown = computed(() => this.filtered().slice(0, this.limit()));
  protected readonly showFeatured = computed(() => this.topic() === 'All' && !this.query().trim());

  constructor() {
    inject(Title).setTitle('Journal | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Stories about craft, styling ideas, care guides and life at the workshop.' });
  }
}
