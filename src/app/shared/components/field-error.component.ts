import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IconComponent } from './icon.component';

export const phoneValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  return /^[+()\d][\d\s().-]{6,17}$/.test(v) ? null : { phone: true };
};

export const emailValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : { email: true };
};

const DEFAULTS: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address, for example name@example.com.',
  phone: 'Enter a valid phone number.',
  min: 'Quantity must be at least 1.',
  minlength: 'Please add a little more detail.',
  consent: 'Please tick the box so we can contact you.',
  requiredTrue: 'Please tick the box so we can contact you.',
};

/** Plain-language inline error, shown once the field has been touched. */
@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (control && control.invalid && (control.touched || control.dirty)) {
      <p class="field-error" role="alert"><app-icon name="alert" [s]="15" /> {{ message() }}</p>
    }
  `,
  styles: [':host { display: block; } .field-error { animation: fade-in 0.25s var(--ease); }'],
})
export class FieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() messages: Record<string, string> = {};

  protected message(): string {
    const key = Object.keys(this.control?.errors ?? {})[0];
    return this.messages[key] ?? DEFAULTS[key] ?? 'Please check this field.';
  }
}
