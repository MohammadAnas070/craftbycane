import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { INQUIRY_TYPES } from '../../core/data/content';
import { SITE } from '../../core/data/site';
import { FieldErrorComponent, emailValidator, phoneValidator } from '../../shared/components/field-error.component';
import { IconComponent } from '../../shared/components/icon.component';
import { PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

const WHATSAPP_NUMBER = '919925721088'; // country code 91 + 9925721088
const BACKEND_URL = 'https://designcane-backend.onrender.com'; // Node server (index.js). Change to your deployed URL in production.

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, IconComponent, FieldErrorComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
  private readonly mapEl = viewChild<ElementRef<HTMLElement>>('map');
  private map: { remove(): void; invalidateSize(): void } | null = null;
  private ro: ResizeObserver | null = null;
  private destroyed = false;

  protected readonly loc = SITE.location;
  protected readonly directions = `https://www.google.com/maps/dir/?api=1&destination=${SITE.location.lat},${SITE.location.lng}`;
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Contact' }];
  protected readonly kinds = INQUIRY_TYPES;
  protected readonly site = SITE;

  protected readonly info = {
    phoneDisplay: '+91 99257 21088',
    phoneHref: 'tel:+919925721088',
    email: 'designcane857@gmail.com',
    address: 'Design Cane Handi Craft, Opposite of Petrol Pump, Anjali, Ahmedabad, Gujarat - 380007',
    hoursMain: 'Mon–Sat, 10 AM–7 PM',
    hoursNote: 'Sunday, 10 AM–2 PM (Half Day)',
  };

  /** api.whatsapp.com/send pre-fills the text reliably on WhatsApp Web, Desktop and mobile (wa.me can drop it). */
  private readonly waBase = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
  protected readonly wa = `${this.waBase}&text=${encodeURIComponent('Hello Crafted By Cane, I have a question.')}`;

  /** Opens WhatsApp with the details currently typed into the form as the message. */
  protected openWhatsApp(): void {
    const v = this.form.getRawValue();
    const lines = ['Hello Crafted By Cane,'];
    const add = (label: string, val: string) => { const t = val.trim(); if (t) lines.push(`*${label}:* ${t}`); };
    add('Inquiry', v.kind);
    add('Name', v.name);
    add('Phone', v.phone);
    add('Email', v.email);
    add('Subject', v.subject);
    add('Message', v.message);
    if (lines.length === 2) lines.push('I have a question.'); // only the inquiry type present
    const text = lines.join('\n').slice(0, 1500);
    const url = `${this.waBase}&text=${encodeURIComponent(text)}`;

    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else window.location.href = url; // popup blocked: open in the same tab
  }

  protected readonly form = new FormGroup({
    kind: new FormControl('General question', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    phone: new FormControl('', { nonNullable: true, validators: [phoneValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(5000)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected readonly status = signal<SendStatus>('idle');
  protected readonly errorMsg = signal<string | null>(null);

  /** ?type=Bulk%20or%20trade preselects the inquiry type */
  @Input() set type(v: string | undefined) {
    if (v && this.kinds.includes(v)) this.form.controls.kind.setValue(v);
  }

  constructor() {
    afterNextRender(() => this.initMap());
    inject(Title).setTitle('Contact | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Questions, quotes or a custom idea. Send us a message or chat on WhatsApp for the fastest reply.' });
  }

  protected setKind(k: string): void { this.form.controls.kind.setValue(k); }

  /** Sends the form details to the backend, which builds and emails the message. */
  protected async send(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.status() === 'sending') return;
    if (this.form.invalid) {
      this.errorMsg.set('Please fix the highlighted fields and try again.');
      this.status.set('error');
      return;
    }

    this.status.set('sending');
    this.errorMsg.set(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; message?: string } | null;

      if (res.ok && data?.ok === true) {
        this.status.set('sent');
        return;
      }
      this.errorMsg.set(data?.message || 'Your message could not be sent. Please try again or message us on WhatsApp.');
      this.status.set('error');
    } catch {
      this.errorMsg.set('Could not reach the server. Please try again or message us on WhatsApp.');
      this.status.set('error');
    }
  }

  protected reset(): void {
    this.status.set('idle');
    this.errorMsg.set(null);
    this.form.reset({ kind: 'General question', name: '', phone: '', email: '', subject: '', message: '', consent: false });
  }

  /** Leaflet is loaded on demand so it only costs bytes on this page. */
  private async initMap(): Promise<void> {
    const el = this.mapEl()?.nativeElement;
    if (!el) return;

    // In production builds the API lives on `.default`; in dev it can be on the namespace itself.
    const mod: any = await import('leaflet');
    const L = mod.default ?? mod;
    if (this.destroyed) return;

    const { lat, lng } = SITE.location;
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // divIcon avoids Leaflet's default marker PNGs, which 404 in bundled builds
    const pin = L.divIcon({
      className: 'cb-pin',
      html: '<span class="cb-pin__dot"></span><span class="cb-pin__pulse"></span>',
      iconSize: [34, 44],
      iconAnchor: [17, 42],
      popupAnchor: [0, -38],
    });
    L.marker([lat, lng], { icon: pin, title: SITE.name })
      .addTo(map)
      .bindPopup(`<strong>${SITE.name}</strong><br>${this.info.address}`)
      .openPopup();

    this.map = map;
    this.ro = new ResizeObserver(() => map.invalidateSize());
    this.ro.observe(el);
    setTimeout(() => map.invalidateSize(), 700);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.ro?.disconnect();
    this.map?.remove();
  }
}