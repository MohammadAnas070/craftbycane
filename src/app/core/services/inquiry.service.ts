import { Injectable } from '@angular/core';
import { SITE, contact, whatsappUrl } from '../data/site';

export interface InquiryPayload {
  kind: 'custom-order' | 'contact' | 'product' | 'wishlist' | 'newsletter' | 'feedback';
  subject: string;
  fields: { label: string; value: string }[];
}

export type InquiryResult =
  | { status: 'prepared'; text: string; whatsapp: string; mailto: string | null }
  | { status: 'sent' }
  | { status: 'error' };

/**
 * submitInquiry() adapter. No backend is connected, so it honestly returns "prepared":
 * the visitor sends the message by WhatsApp or email, or copies the details.
 * Swap the body of submit() for an HTTP call later and return { status: 'sent' }.
 */
@Injectable({ providedIn: 'root' })
export class InquiryService {
  async submit(payload: InquiryPayload): Promise<InquiryResult> {
    const text = this.toText(payload);
    await new Promise((r) => setTimeout(r, 450));
    return {
      status: 'prepared',
      text,
      whatsapp: whatsappUrl(text),
      mailto: contact.mailHref(`${SITE.name}: ${payload.subject}`, text),
    };
  }

  toText(payload: InquiryPayload): string {
    const lines = payload.fields.filter((f) => f.value.trim()).map((f) => `${f.label}: ${f.value.trim()}`);
    return [`Hello ${SITE.name}, ${payload.subject}.`, '', ...lines].join('\n');
  }
}
