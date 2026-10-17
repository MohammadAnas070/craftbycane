/** Business details. Placeholders stay visible until the business supplies real values. */
export const SITE = {
  name: 'Crafted By Cane',
  tagline: 'Handwoven cane living',
  promise: 'Crafted by Nature. Shaped by Tradition.',
  announcement: 'Free design consultation for custom furniture orders',
  phone: '',
  whatsapp: '',
  email: '',
  address: 'Anjali, opposite the petrol pump, Ahmedabad',
  location: { lat: 23.004893110409572, lng: 72.55236450417016 },
  hours: '',
  placeholders: {
    phone: '[Phone number]',
    whatsapp: '[WhatsApp number]',
    email: '[Business email]',
    address: '[Workshop address]',
    hours: '[Opening days and times]',
  },
  social: { instagram: '#', facebook: '#', youtube: '#' },
};

export const contact = {
  phone: () => SITE.phone || SITE.placeholders.phone,
  whatsapp: () => SITE.whatsapp || SITE.placeholders.whatsapp,
  email: () => SITE.email || SITE.placeholders.email,
  address: () => SITE.address || SITE.placeholders.address,
  hours: () => SITE.hours || SITE.placeholders.hours,
  telHref: () => (SITE.phone ? `tel:${SITE.phone.replace(/\s+/g, '')}` : null),
  mailHref: (subject = '', body = '') =>
    SITE.email ? `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : null,
};

/** wa.me link; without a number WhatsApp lets the visitor pick the chat. */
export function whatsappUrl(text = ''): string {
  const num = SITE.whatsapp.replace(/[^\d]/g, '');
  return `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
