import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { BUDGET_OPTIONS, FINISH_SWATCHES, PRODUCT_TYPE_OPTIONS } from '../../core/data/content';
import { whatsappUrl } from '../../core/data/site';
import { InquiryResult, InquiryService } from '../../core/services/inquiry.service';
import { cut, photo } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { FieldErrorComponent, emailValidator, phoneValidator } from '../../shared/components/field-error.component';
import { IconComponent } from '../../shared/components/icon.component';
import { InquiryResultComponent } from '../../shared/components/inquiry-result.component';
import { PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface Upload { id: number; name: string; url: string; size: number }
const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-custom-orders',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, ArtComponent, IconComponent, FieldErrorComponent, InquiryResultComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-orders.component.html',
  styleUrl: './custom-orders.component.scss',
})
export class CustomOrdersComponent implements OnDestroy {
  private readonly inquiry = inject(InquiryService);
  protected readonly duoA = cut('zula-furniture', 12);
  protected readonly duoB = cut('cane-handmade', 8, 'peach');
  protected readonly sideImg = photo('cane-handmade', 16);
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Custom orders' }];
  protected readonly types = PRODUCT_TYPE_OPTIONS;
  protected readonly budgets = BUDGET_OPTIONS;
  protected readonly swatches = FINISH_SWATCHES;
  protected readonly wa = whatsappUrl('Hello Crafted By Cane, I would like to talk about a custom piece.');

  protected readonly steps = [
    { n: '01', title: 'Share your idea', text: 'Tell us what you would like made, with sizes if you have them.' },
    { n: '02', title: 'Get a quotation', text: 'We confirm what is possible and share a price and timeline.' },
    { n: '03', title: 'Approve the plan', text: 'Review the sample drawing, finish and quantity.' },
    { n: '04', title: 'We build it', text: 'Your piece is woven, finished and checked by hand.' },
  ];
  protected readonly tips = ['Add a photo or sketch of your idea', 'Give the room size or a rough sketch', 'Tell us how you will use the piece', 'Mention your deadline, if any'];

  protected readonly form = new FormGroup({
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    quantity: new FormControl<number | null>(1, { validators: [Validators.required, Validators.min(1)] }),
    width: new FormControl('', { nonNullable: true }),
    depth: new FormControl('', { nonNullable: true }),
    height: new FormControl('', { nonNullable: true }),
    finish: new FormControl('Natural', { nonNullable: true }),
    budget: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [phoneValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
    message: new FormControl('', { nonNullable: true }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected readonly uploads = signal<Upload[]>([]);
  protected readonly uploadError = signal('');
  protected readonly dragging = signal(false);
  protected readonly sending = signal(false);
  protected readonly result = signal<InquiryResult | null>(null);
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('file');
  private nextId = 1;

  constructor() {
    inject(Title).setTitle('Custom orders | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Share your idea, size and finish. We will confirm what is possible and send a quotation for custom cane furniture and decor.' });
  }

  ngOnDestroy(): void { this.uploads().forEach((u) => URL.revokeObjectURL(u.url)); }

  protected pickFinish(name: string): void { this.form.controls.finish.setValue(name); }

  /* ---- uploads ---- */
  protected onFiles(files: FileList | File[] | null): void {
    if (!files) return;
    this.uploadError.set('');
    const next = [...this.uploads()];
    for (const f of Array.from(files)) {
      if (!/^image\/(jpeg|png)$/.test(f.type)) { this.uploadError.set('Only JPG or PNG images can be added.'); continue; }
      if (f.size > MAX_BYTES) { this.uploadError.set(`${f.name} is larger than 5 MB.`); continue; }
      if (next.length >= MAX_FILES) { this.uploadError.set('You can add up to 5 images.'); break; }
      next.push({ id: this.nextId++, name: f.name, url: URL.createObjectURL(f), size: f.size });
    }
    this.uploads.set(next);
    const el = this.fileInput()?.nativeElement;
    if (el) el.value = '';
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    this.onFiles(e.dataTransfer?.files ?? null);
  }

  protected remove(u: Upload): void {
    URL.revokeObjectURL(u.url);
    this.uploads.update((l) => l.filter((x) => x.id !== u.id));
    this.uploadError.set('');
  }

  /* ---- submit ---- */
  protected async send(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      document.querySelector<HTMLElement>('.ng-invalid.ng-touched:not(form)')?.focus();
      return;
    }
    const v = this.form.getRawValue();
    const dims = [v.width && `W ${v.width}`, v.depth && `D ${v.depth}`, v.height && `H ${v.height}`].filter(Boolean).join(' x ');
    this.sending.set(true);
    const res = await this.inquiry.submit({
      kind: 'custom-order',
      subject: 'I would like a custom order',
      fields: [
        { label: 'Product type', value: v.type },
        { label: 'Quantity', value: String(v.quantity ?? '') },
        { label: 'Dimensions (cm)', value: dims },
        { label: 'Preferred finish', value: v.finish },
        { label: 'Budget range', value: v.budget },
        { label: 'Reference images', value: this.uploads().length ? `${this.uploads().length} image(s) attached by me separately: ${this.uploads().map((u) => u.name).join(', ')}` : '' },
        { label: 'Name', value: v.name }, { label: 'Phone', value: v.phone }, { label: 'Email', value: v.email },
        { label: 'Message', value: v.message },
      ],
    });
    this.sending.set(false);
    this.result.set(res);
    setTimeout(() => document.getElementById('co-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  }

  protected prepared(): Extract<InquiryResult, { status: 'prepared' }> | null {
    const r = this.result();
    return r && r.status === 'prepared' ? r : null;
  }

  protected kb(n: number): string { return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
}
