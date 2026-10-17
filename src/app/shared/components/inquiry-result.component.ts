import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { IconComponent } from './icon.component';

/**
 * "Prepared" state: nothing has been sent because no backend is connected, so the
 * visitor sends the message through WhatsApp or email, or copies the details.
 */
@Component({
  selector: 'app-inquiry-result',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="res" role="status">
      <div class="res__head">
        <span class="res__ico"><app-icon name="info" [s]="22" /></span>
        <div>
          <h3>{{ heading() }}</h3>
          <p>Nothing has been sent yet. Send it by WhatsApp or email, or copy the details below.</p>
        </div>
      </div>
      <pre class="res__text" tabindex="0" aria-label="Message details">{{ text() }}</pre>
      <div class="res__btns">
        <a class="btn btn--wa" [href]="whatsapp()" target="_blank" rel="noopener"><app-icon name="whatsapp" [s]="17" /> WhatsApp</a>
        @if (mailto()) { <a class="btn btn--outline" [href]="mailto()!"><app-icon name="mail" [s]="16" /> Email</a> }
        <button type="button" class="btn btn--outline" (click)="copy()"><app-icon [name]="copied() ? 'check' : 'copy'" [s]="16" /> {{ copied() ? 'Copied' : 'Copy details' }}</button>
        <button type="button" class="res__edit" (click)="edit.emit()">Edit my details</button>
      </div>
    </div>
  `,
  styles: [`
    .res { padding: clamp(22px, 3vw, 32px); background: #fbf3e4; border: 1px solid var(--cane); border-radius: var(--radius); animation: fade-up 0.5s var(--ease) both; }
    .res__head { display: flex; gap: 16px; align-items: flex-start; }
    .res__ico { color: var(--cane-dark); margin-top: 4px; }
    h3 { font-size: 30px; }
    .res__head p { margin-top: 8px; font-size: 14.5px; color: var(--charcoal); max-width: 52ch; }
    .res__text { margin: 22px 0; padding: 18px 20px; max-height: 260px; overflow: auto; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); white-space: pre-wrap; font: inherit; font-size: 14px; line-height: 1.65; }
    .res__btns { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    .res__edit { margin-left: 6px; font-size: 13px; color: var(--terracotta); text-decoration: underline; text-underline-offset: 3px; }
  `],
})
export class InquiryResultComponent {
  readonly text = input.required<string>();
  readonly whatsapp = input.required<string>();
  readonly mailto = input<string | null>(null);
  readonly heading = input('Your request is ready to send');
  readonly edit = output<void>();
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      /* clipboard blocked: the text is still selectable above */
    }
  }
}
