import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { readJson, writeJson } from '../../core/services/storage';
import { IconComponent } from './icon.component';

const KEY = 'cane-atelier:newsletter';

/** Email capture. With no backend, the address is kept on this device and the message says so. */
@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state() === 'done') {
      <div class="alert alert--ok" role="status">
        <app-icon name="check-circle" [s]="20" />
        <div><strong>Thank you</strong>Your email is saved on this device. We will send stories once the workshop turns on its mailing list.</div>
      </div>
    } @else {
      <form class="nl" [class.nl--footer]="variant === 'footer'" (ngSubmit)="submit()" novalidate>
        <label class="sr-only" [attr.for]="id">Your email address</label>
        <input [id]="id" class="nl__input" type="email" [formControl]="email" placeholder="Your email address" autocomplete="email"
          [attr.aria-invalid]="invalid()" [attr.aria-describedby]="id + '-err'" />
        <button type="submit" class="nl__btn" [attr.aria-label]="variant === 'footer' ? 'Subscribe' : null">
          @if (variant === 'footer') { <app-icon name="arrow-right" [s]="18" /> } @else { Subscribe }
        </button>
      </form>
      <p class="nl__note" [id]="id + '-err'" [class.is-err]="invalid()" role="status">
        @if (invalid()) { Please enter a valid email address, for example name&#64;example.com. }
        @else if (variant === 'band') { No spam. Unsubscribe any time. Shows a clear success or error message after submit. }
      </p>
    }
  `,
  styles: [`
    :host { display: block; }
    .nl { display: flex; }
    .nl__input { flex: 1; min-width: 0; min-height: 52px; padding: 0 20px; background: rgba(255, 255, 255, 0.1); color: var(--ivory); border: 1px solid rgba(248, 245, 239, 0.25); border-right: 0; border-radius: 2px 0 0 2px; font: inherit; font-size: 15px; transition: background-color 0.2s, border-color 0.2s; }
    .nl__input::placeholder { color: rgba(248, 245, 239, 0.6); }
    .nl__input:focus { outline: none; background: rgba(255, 255, 255, 0.16); border-color: var(--cane); }
    .nl__btn { min-width: 52px; padding: 0 28px; background: var(--terracotta); color: var(--ivory); border-radius: 0 2px 2px 0; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; display: grid; place-items: center; transition: background-color 0.2s; }
    .nl__btn:hover { background: var(--terracotta-dark); }
    .nl--footer .nl__input { min-height: 46px; background: transparent; padding: 0 14px; font-size: 14px; }
    .nl--footer .nl__btn { padding: 0 16px; }
    .nl__note { margin-top: 12px; font-size: 12.5px; color: rgba(248, 245, 239, 0.7); }
    .nl__note.is-err { color: #ffb9a5; }
    .alert { background: rgba(255, 255, 255, 0.08); border-color: rgba(248, 245, 239, 0.3); color: var(--ivory); font-size: 14px; }
    .alert strong { color: var(--ivory); }
  `],
})
export class NewsletterFormComponent {
  @Input() variant: 'band' | 'footer' = 'band';
  private static n = 0;
  protected readonly id = `nl-${NewsletterFormComponent.n++}`;
  protected readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  protected readonly state = signal<'idle' | 'done'>('idle');
  protected readonly invalid = signal(false);

  protected submit(): void {
    if (this.email.invalid) {
      this.invalid.set(true);
      return;
    }
    this.invalid.set(false);
    const list = readJson<string[]>(KEY, []);
    writeJson(KEY, [...new Set([...list, this.email.value.trim().toLowerCase()])]);
    this.state.set('done');
  }
}
