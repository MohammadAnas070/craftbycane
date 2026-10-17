import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { REVIEWS, Review } from '../../core/data/content';
import { InquiryResult, InquiryService } from '../../core/services/inquiry.service';
import { photo } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { FieldErrorComponent } from '../../shared/components/field-error.component';
import { IconComponent } from '../../shared/components/icon.component';
import { InquiryResultComponent } from '../../shared/components/inquiry-result.component';
import { PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, ArtComponent, IconComponent, FieldErrorComponent, InquiryResultComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  private readonly inquiry = inject(InquiryService);
  protected readonly featImg = photo('zula-furniture', 12);
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Testimonials' }];
  protected readonly kinds = ['All', 'Chairs', 'Lighting', 'Swings', 'Decor'] as const;
  protected readonly kind = signal<string>('All');
  protected readonly reviews = computed<Review[]>(() => REVIEWS.filter((r) => this.kind() === 'All' || r.kind === this.kind()));
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    product: new FormControl('', { nonNullable: true }),
    feedback: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });
  protected readonly sending = signal(false);
  protected readonly result = signal<InquiryResult | null>(null);

  constructor() {
    inject(Title).setTitle('Testimonials | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Kind words from customers. Sample layout content is labelled until genuine reviews are collected with permission.' });
  }

  protected async send(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.sending.set(true);
    this.result.set(await this.inquiry.submit({ kind: 'feedback', subject: 'I would like to share feedback', fields: [{ label: 'Name', value: v.name }, { label: 'Piece', value: v.product }, { label: 'Feedback', value: v.feedback }] }));
    this.sending.set(false);
  }

  protected prepared(): Extract<InquiryResult, { status: 'prepared' }> | null {
    const r = this.result();
    return r && r.status === 'prepared' ? r : null;
  }
}
