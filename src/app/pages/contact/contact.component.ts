import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { INQUIRY_TYPES } from '../../core/data/content';
import { SITE, contact, whatsappUrl } from '../../core/data/site';
import { InquiryResult, InquiryService } from '../../core/services/inquiry.service';
import { FieldErrorComponent, emailValidator, phoneValidator } from '../../shared/components/field-error.component';
import { IconComponent } from '../../shared/components/icon.component';
import { InquiryResultComponent } from '../../shared/components/inquiry-result.component';
import { PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, IconComponent, FieldErrorComponent, InquiryResultComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
  private readonly mapEl = viewChild<ElementRef<HTMLElement>>('map');
  private map: { remove(): void; invalidateSize(): void } | null = null;
  private ro: ResizeObserver | null = null;
  protected readonly loc = SITE.location;
  protected readonly directions = `https://www.google.com/maps/dir/?api=1&destination=${SITE.location.lat},${SITE.location.lng}`;
  private readonly inquiry = inject(InquiryService);
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Contact' }];
  protected readonly kinds = INQUIRY_TYPES;
  protected readonly site = SITE;
  protected readonly c = contact;
  protected readonly wa = whatsappUrl('Hello Crafted By Cane, I have a question.');

  protected readonly form = new FormGroup({
    kind: new FormControl('General question', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [phoneValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  protected readonly sending = signal(false);
  protected readonly result = signal<InquiryResult | null>(null);

  /** ?type=Bulk%20or%20trade preselects the inquiry type */
  @Input() set type(v: string | undefined) {
    if (v && this.kinds.includes(v)) this.form.controls.kind.setValue(v);
  }

  constructor() {
    afterNextRender(() => this.initMap());
    inject(Title).setTitle('Contact | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Questions, quotes or a custom idea. Message us on WhatsApp for the fastest reply, or use the form.' });
  }

  protected setKind(k: string): void { this.form.controls.kind.setValue(k); }

  protected async send(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.sending.set(true);
    const res = await this.inquiry.submit({
      kind: 'contact',
      subject: `${v.kind.toLowerCase()}`,
      fields: [{ label: 'Inquiry type', value: v.kind }, { label: 'Name', value: v.name }, { label: 'Phone', value: v.phone }, { label: 'Email', value: v.email }, { label: 'Message', value: v.message }],
    });
    this.sending.set(false);
    this.result.set(res);
  }

  protected prepared(): Extract<InquiryResult, { status: 'prepared' }> | null {
    const r = this.result();
    return r && r.status === 'prepared' ? r : null;
  }

  /** Leaflet is loaded on demand so it only costs bytes on this page. */
  private async initMap(): Promise<void> {
    const el = this.mapEl()?.nativeElement;
    if (!el) return;
    const L = await import('leaflet');
    const { lat, lng } = SITE.location;
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const pin = L.divIcon({
      className: 'cb-pin',
      html: '<span class="cb-pin__dot"></span><span class="cb-pin__pulse"></span>',
      iconSize: [34, 44],
      iconAnchor: [17, 42],
      popupAnchor: [0, -38],
    });
    L.marker([lat, lng], { icon: pin, title: SITE.name })
      .addTo(map)
      .bindPopup(`<strong>${SITE.name}</strong><br>${SITE.address}`)
      .openPopup();
    this.map = map;
    // keep Leaflet in sync with the container size (reveal animation, resize, layout shifts)
    this.ro = new ResizeObserver(() => map.invalidateSize());
    this.ro.observe(el);
    setTimeout(() => map.invalidateSize(), 700);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.map?.remove();
  }
}
