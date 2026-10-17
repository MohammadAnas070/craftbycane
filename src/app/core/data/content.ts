import { ArtRef } from './categories';
import { photo, cut } from './images';
import { PRODUCTS, Product } from './products';
import { CATEGORIES } from './categories';

/* ------------------------------ workshop process ------------------------------ */
export const PROCESS_SHORT = [
  { n: '01', icon: 'leaf', title: 'Select', text: 'Cane is chosen for strength, thickness and colour, then sorted by use.', art: photo('cane-stick', 3) as ArtRef, label: 'Woven cane sheets, graded and stacked' },
  { n: '02', icon: 'scissors', title: 'Shape', text: 'Strands are split, soaked and bent into frames, rims and forms.', art: photo('cane-handmade', 5) as ArtRef, label: 'Chair parts being shaped in the workshop' },
  { n: '03', icon: 'hand', title: 'Weave', text: 'Artisans weave classic patterns by hand, strand by strand.', art: photo('rope-work', 14) as ArtRef, label: 'A seat being woven by hand' },
  { n: '04', icon: 'shield', title: 'Finish', text: 'Edges are trimmed, surfaces smoothed and each piece checked before packing.', art: null as ArtRef | null, label: '' },
];

export const PROCESS_FULL = [
  { n: '01', title: 'Material selection', text: 'Cane stems are chosen by thickness, length and colour. Only straight, clean stems move on.', art: photo('cane-stick', 3) as ArtRef },
  { n: '02', title: 'Preparation and shaping', text: 'Stems are split, soaked until pliable and bent over forms to make rims, frames and curves.', art: photo('cane-handmade', 5) as ArtRef },
  { n: '03', title: 'Weaving', text: 'Artisans weave classic patterns by hand, keeping tension even across the whole panel.', art: photo('rope-work', 14) as ArtRef },
  { n: '04', title: 'Assembly', text: 'Woven panels are fitted to frames, joints are bound and the structure is tested by hand.', art: photo('cane-wicker', 22) as ArtRef },
  { n: '05', title: 'Finishing and quality checks', text: 'Edges are trimmed, surfaces sanded and sealed, then every piece is inspected before it is packed.', art: photo('cane-handmade', 15) as ArtRef },
  { n: '06', title: 'Custom manufacturing', text: 'For special sizes and shapes, we make a sample drawing, confirm it with you and then build to order.', art: photo('cane-stick', 8) as ArtRef },
];

export const WHY_US = [
  { icon: 'leaf', title: 'Natural materials', text: 'Cane, rope and seasoned wood. Finishes chosen to keep the natural character visible.' },
  { icon: 'hand', title: 'Handwoven detail', text: 'Woven strand by strand, so no two pieces are exactly alike.' },
  { icon: 'ruler', title: 'Made to fit', text: 'Custom sizes, shapes and colours for homes, cafes and hospitality spaces.' },
  { icon: 'whatsapp', title: 'Talk to the maker', text: 'Ask questions and share ideas directly through WhatsApp or the quote form.' },
];

export const QUALITY_CHECKS = [
  { icon: 'leaf', title: 'Material check', text: 'Stems graded before weaving.' },
  { icon: 'ruler', title: 'Size check', text: 'Measured against the order.' },
  { icon: 'hand', title: 'Hand check', text: 'Weave and edges felt by hand.' },
  { icon: 'shield', title: 'Final check', text: 'Finish and stability reviewed.' },
];

/* ------------------------------ testimonials (sample content) ------------------------------ */
export interface Review { quote: string; initials: string; kind: 'Chairs' | 'Lighting' | 'Swings' | 'Decor'; product: string }

export const REVIEWS: Review[] = [
  { quote: 'The armchair is lighter than I expected and sits very comfortably. The weave is neat and even.', initials: 'C', kind: 'Chairs', product: 'Chair' },
  { quote: 'The pendant gives a lovely patterned light in the evening. It arrived well packed.', initials: 'L', kind: 'Lighting', product: 'Lamp' },
  { quote: 'We ordered a custom size for our veranda and it fit perfectly. Easy to message with.', initials: 'S', kind: 'Swings', product: 'Swing' },
  { quote: 'Sturdy handles and a tidy finish. It holds our blankets well.', initials: 'B', kind: 'Decor', product: 'Basket' },
  { quote: 'Simple and good-looking. It goes with everything in our living room.', initials: 'T', kind: 'Chairs', product: 'Table' },
  { quote: 'A nice detail for the hallway. The cane frame looks handmade, in a good way.', initials: 'M', kind: 'Decor', product: 'Mirror' },
];

export const HOME_TESTIMONIALS = [
  { quote: 'The swing arrived well packed and looks beautiful on the veranda. We are happy with the weave and the finish.', initials: 'AB', name: 'Customer name', meta: 'City · Product reviewed' },
  { quote: 'The finish is even and the weave is tight. It looks even better in the room than it did in the photos.', initials: 'RK', name: 'Customer name', meta: 'City · Chair' },
  { quote: 'They shared a drawing, adjusted the size and the pendants fit our stairwell exactly.', initials: 'NS', name: 'Customer name', meta: 'City · Pendant lamps' },
];

/* ------------------------------ FAQ ------------------------------ */
export interface FaqItem { q: string; a: string; policy?: boolean }
export interface FaqGroup { id: string; title: string; items: FaqItem[] }

export const FAQ_GROUPS: FaqGroup[] = [
  { id: 'customisation', title: 'Customisation', items: [
    { q: 'Can I order a custom size or finish?', a: 'Yes. Most pieces can be made in a different size, finish or colour. Share what you need through the custom order form or WhatsApp and we will confirm what is possible.' },
    { q: 'Can I change the cushion or fabric?', a: 'Yes. Seat pads and cushions can be made in a fabric and colour you choose. Send a swatch photo or describe it and we will confirm with your quotation.' },
    { q: 'How long does a custom piece take?', a: 'It depends on size, weave and quantity. We confirm the timeline with your quotation rather than promising a number up front.' },
    { q: 'Will the piece look exactly like the photo?', a: 'Pieces are woven by hand, so small differences in weave and tone are normal. That is part of the character. We will share a sample plan before building a custom piece.' },
    { q: 'Can I see a sample before I order?', a: 'For custom orders we share a sample drawing and, where useful, weave and finish samples. Ask us and we will tell you what is available.' },
  ] },
  { id: 'materials', title: 'Materials and craftsmanship', items: [
    { q: 'What materials do you use?', a: 'Natural cane, rope and seasoned wood. Finishes are chosen to keep the natural character of the material visible.' },
    { q: 'Is the weaving done by hand?', a: 'Yes. Strands are split, soaked and woven by hand, then trimmed, sanded and sealed in the workshop.' },
    { q: 'Is cane a sustainable material?', a: 'Cane is a fast-growing, renewable fibre. We can talk through sourcing with you; we only make claims we can support.' },
    { q: 'What weave patterns do you offer?', a: 'Classic patterns such as open octagon and herringbone, set in clean contemporary frames. Ask us if you have a pattern in mind.' },
  ] },
  { id: 'dimensions', title: 'Dimensions', items: [
    { q: 'Where can I find the dimensions of each piece?', a: 'Every product page lists sample dimensions. Final sizes are confirmed with your quotation.' },
    { q: 'Can you make a piece to fit a specific space?', a: 'Yes. Send your measurements or a rough sketch and we will suggest a size that works.' },
    { q: 'How do I measure for a hanging swing?', a: 'Measure the ceiling height, the clear floor space and the fixing point. We will confirm the drop and fixings with your quotation.' },
  ] },
  { id: 'bulk', title: 'Bulk orders', items: [
    { q: 'Do you take bulk or trade orders?', a: 'Yes. Cafes, hotels, resorts and boutiques can order furniture and decor in custom sizes, colours and quantities.' },
    { q: 'Can you repeat a design in batches?', a: 'Yes. We can repeat a confirmed design across a batch. Timelines are confirmed per order.' },
    { q: 'Do you supply for gifting and retail?', a: 'Yes. Tell us the quantity and the pieces you are interested in and we will respond with a quotation.' },
  ] },
  { id: 'pricing', title: 'Pricing and quotations', items: [
    { q: 'Why do some products say Request a Quote?', a: 'Pieces that depend heavily on size, finish or quantity are quoted individually, so the price you see is always honest.' },
    { q: 'What does "Starting at" mean?', a: 'It is the lowest price for the smallest standard size and finish. The final price depends on size, finish and quantity.' },
    { q: 'Are the prices on this site final?', a: 'Prices shown here are sample prices until the business confirms them. Your quotation is the exact figure.' },
    { q: 'Do I need an account to ask for a quote?', a: 'No. You can send a request through the form or message us on WhatsApp. No login and no payment details are required.' },
  ] },
  { id: 'delivery', title: 'Delivery and shipping', items: [
    { q: 'Do you deliver?', a: 'Delivery options are confirmed with your quotation based on location and the size of the piece.' },
    { q: 'How are pieces packed?', a: 'Pieces are wrapped and packed to travel safely. Packing details are shared with the quotation.' },
    { q: 'Can I collect from the workshop?', a: 'Visiting arrangements will be listed here once the workshop address and hours are confirmed.' },
  ] },
  { id: 'care', title: 'Product care', items: [
    { q: 'How do I clean cane furniture?', a: 'Dust with a soft dry cloth or brush, working along the weave. Wipe spills right away with a slightly damp cloth.' },
    { q: 'Can cane go outdoors?', a: 'Cane prefers shade. Keep it out of constant direct sun and heavy rain. A covered veranda suits it well.' },
    { q: 'What about humidity?', a: 'Cane breathes. In humid months keep it ventilated and dry, and avoid storing it in damp rooms.' },
    { q: 'Can a woven panel be repaired?', a: 'Often, yes. Send us a photo and we will tell you what can be done.' },
  ] },
  { id: 'returns', title: 'Returns and damage', items: [
    { q: 'What is your returns and damage policy?', a: 'Policy to be confirmed. The business has not yet supplied its returns, refunds and damage policy. Publish the confirmed text here and on the Returns policy page.', policy: true },
    { q: 'What should I do if a piece arrives damaged?', a: 'Policy to be confirmed. Please message us with photos and we will help, until the full policy is published.', policy: true },
  ] },
];

/* ------------------------------ gallery (real photos, grouped by category folder) ------------------------------ */
export type GalleryCategory = string;
export interface GalleryItem { id: string; title: string; label: string; cat: GalleryCategory; art: ArtRef; ratio: 'tall' | 'square' | 'wide' | 'portrait'; piece: string; finish: string; space: string; product: string }

const ratioOf = (w: number, h: number): GalleryItem['ratio'] => {
  const r = w / h;
  return r > 1.25 ? 'wide' : r < 0.68 ? 'tall' : r > 0.9 && r < 1.1 ? 'square' : 'portrait';
};

export const GALLERY_CATEGORIES = CATEGORIES.map((c) => c.short);

export const GALLERY: GalleryItem[] = PRODUCTS.map((p: Product) => {
  const cat = CATEGORIES.find((c) => c.slug === p.category)!;
  const art = photo(p.category, p.photoNo);
  return {
    id: p.slug, title: p.name, label: p.name, cat: cat.short, art, ratio: ratioOf(art.w, art.h),
    piece: p.name, finish: p.finishes[0], space: cat.short, product: p.slug,
  };
});

/* ------------------------------ journal ------------------------------ */
export type JournalTopic = 'Craft story' | 'Styling' | 'Decor inspiration' | 'Care guide' | 'Behind the scenes';
export interface Section { id: string; heading: string; paragraphs: string[]; quote?: string }
export interface Article {
  slug: string; title: string; topic: JournalTopic; excerpt: string; minutes: number; date: string; author: string;
  art: ArtRef; featured?: boolean; sections: Section[];
}

const AUTHOR = 'Atelier team';

export const ARTICLES: Article[] = [
  {
    slug: 'how-a-swing-is-woven-from-a-single-cane', title: 'How a swing is woven from a single cane', topic: 'Craft story', featured: true, minutes: 7, date: 'Oct 2026', author: AUTHOR, art: photo('zula-furniture', 11),
    excerpt: 'A close look at the weaving, binding and finishing that turns raw cane into a hanging chair.',
    sections: [
      { id: 'frame', heading: 'It starts with the frame', paragraphs: ['A hanging chair is only as good as the frame it hangs from. We begin with seasoned wood, shaped and joined so the load spreads evenly.', 'Only when the frame is true do the weavers pick up the cane.'] },
      { id: 'weaving', heading: 'Weaving the shell', paragraphs: ['Strands are soaked until they bend without cracking, then woven around the frame, tension kept even as the shell closes.', 'Each pass is checked by hand. A slack row shows itself immediately when you run a palm across it.'] },
      { id: 'finishing', heading: 'Binding and finishing', paragraphs: ['Joints are bound, edges trimmed and the surface sanded and sealed. The last step is the hang test: the chair is loaded before it leaves the workshop.'] },
    ],
  },
  {
    slug: 'how-a-cane-chair-is-woven-step-by-step', title: 'How a cane chair is woven, step by step', topic: 'Craft story', minutes: 5, date: 'Sep 2026', author: AUTHOR, art: photo('cane-handmade', 6),
    excerpt: 'From a bundle of straight stems to a round-back armchair, in six slow stages.',
    sections: [
      { id: 'select', heading: 'Choosing the cane', paragraphs: ['Stems are graded by thickness, length and colour. Straight, clean stems are kept for the visible weave.'] },
      { id: 'weave', heading: 'Weaving the back', paragraphs: ['The open-weave back is woven on the frame, strand by strand, with even tension from rim to centre.'] },
      { id: 'finish', heading: 'Seat, finish and checks', paragraphs: ['The seat is fitted, joints checked, the frame sanded and sealed. Every chair is sat on before it is packed.'] },
    ],
  },
  {
    slug: 'five-ways-to-style-a-cane-armchair', title: 'Five ways to style a cane armchair', topic: 'Styling', minutes: 5, date: 'Sep 2026', author: AUTHOR, art: photo('cane-handmade', 15),
    excerpt: 'Small, honest ideas for placing a woven chair in a living room, a hallway or a veranda.',
    sections: [
      { id: 'light', heading: 'Give it natural light', paragraphs: ['Cane looks best in soft daylight, where the weave throws small shadows. Try a spot near a window, out of harsh direct sun.'] },
      { id: 'pair', heading: 'Pair it with a low table', paragraphs: ['A small round table beside the chair gives a place for a cup and a plant. Matching tones keep it calm.'] },
      { id: 'texture', heading: 'Layer texture, keep colour quiet', paragraphs: ['Linen, wool and wood sit well with cane. Let the chair be the warm note and keep everything else neutral.'] },
    ],
  },
  {
    slug: 'caring-for-cane-furniture-through-the-seasons', title: 'Caring for cane furniture through the seasons', topic: 'Care guide', minutes: 6, date: 'Aug 2026', author: AUTHOR, art: photo('cane-handmade', 10),
    excerpt: 'A simple routine for dusting, cleaning, humidity and storage that keeps cane looking its best for years.',
    sections: [
      { id: 'everyday', heading: 'Everyday care', paragraphs: ['Dust with a soft dry cloth or a gentle brush. Work along the weave, not across it.', 'Wipe spills immediately with a slightly damp cloth and let the piece dry in the shade.'], quote: 'Treat cane like wood that breathes: keep it dry, keep it clean and give it room.' },
      { id: 'summer', heading: 'Summer and humidity', paragraphs: ['In humid weather, make sure the piece has air around it. Avoid placing cane against damp walls, and keep it out of standing water.', 'Strong, direct afternoon sun can fade the tone over time. A shaded veranda is ideal.'] },
      { id: 'cleaning', heading: 'Cleaning spills', paragraphs: ['Blot, do not rub. If a mark remains, use a barely damp cloth with a drop of mild soap, then wipe with a clean damp cloth and dry in the shade.'] },
      { id: 'storage', heading: 'Storage', paragraphs: ['Store pieces in a dry, ventilated room. Avoid plastic covers that trap moisture; a light cotton sheet is better.'] },
    ],
  },
  {
    slug: 'a-day-at-the-workshop', title: 'A day at the workshop', topic: 'Behind the scenes', minutes: 5, date: 'Jul 2026', author: AUTHOR, art: photo('cane-wicker', 22),
    excerpt: 'Soaking, splitting, weaving and sanding: what an ordinary working day looks like.',
    sections: [
      { id: 'morning', heading: 'Morning: preparing the cane', paragraphs: ['The day starts with soaking and sorting. Cane that is ready to bend is separated from cane that needs more time.'] },
      { id: 'afternoon', heading: 'Afternoon: weaving and checks', paragraphs: ['Weavers work in the light near the open doors. Frames are checked, weaves are inspected and finished pieces are wrapped for packing.'] },
    ],
  },
  {
    slug: 'warm-lighting-with-woven-pendants', title: 'Warm lighting with woven pendants', topic: 'Decor inspiration', minutes: 5, date: 'Jul 2026', author: AUTHOR, art: photo('lamp', 10),
    excerpt: 'How a cane shade turns a plain bulb into a patterned glow, and where it works best.',
    sections: [
      { id: 'glow', heading: 'The glow through the weave', paragraphs: ['A woven shade filters light into small patterns on walls and ceilings. Warm bulbs bring out the tone of the cane.'] },
      { id: 'placement', heading: 'Where to hang them', paragraphs: ['Over a dining table, in a stairwell or in a cluster at staggered heights. Keep the drop comfortable and the bulbs warm.'] },
    ],
  },
  {
    slug: 'why-we-still-weave-by-hand', title: 'Why we still weave by hand', topic: 'Craft story', minutes: 5, date: 'Jun 2026', author: AUTHOR, art: photo('rope-work', 24),
    excerpt: 'Handwork takes time. Here is why we never rush a weave to meet a number.',
    sections: [
      { id: 'reason', heading: 'The case for slow hands', paragraphs: ['Hand weaving lets us adjust to each strand. A machine repeats a pattern; a weaver reads the material and corrects as they go.'] },
      { id: 'result', heading: 'What you notice in the finished piece', paragraphs: ['Edges feel even, tension stays consistent and the pattern holds across the whole panel. No two pieces are exactly alike.'] },
    ],
  },
];

export const articleBySlug = (slug: string | null | undefined) => ARTICLES.find((a) => a.slug === slug);

/* ------------------------------ policy pages ------------------------------ */
export interface Policy { slug: string; title: string; sections: { id: string; heading: string; text: string }[] }

export const POLICIES: Policy[] = [
  { slug: 'privacy-policy', title: 'Privacy policy', sections: [
    { id: 'collect', heading: 'Information we collect', text: 'Explain what is collected through the contact, custom-order and newsletter forms, such as name, phone, email and message, and why.' },
    { id: 'use', heading: 'How we use it', text: 'Describe how inquiries are answered, how long they are kept and who can see them.' },
    { id: 'cookies', heading: 'Cookies', text: 'List any cookies or similar storage the site uses. This site stores your wishlist on your own device.' },
    { id: 'choices', heading: 'Your choices', text: 'Explain how someone can ask to see, correct or delete the information they have sent.' },
    { id: 'contact', heading: 'Contact', text: 'Add the business contact for privacy questions once it is supplied.' },
  ] },
  { slug: 'terms', title: 'Terms', sections: [
    { id: 'use', heading: 'Using this site', text: 'Add the terms under which visitors may use the site and its content.' },
    { id: 'quotes', heading: 'Quotations and orders', text: 'Explain that prices shown are indicative and a quotation confirms the final price, timeline and terms.' },
    { id: 'content', heading: 'Content and images', text: 'State how product photography and text may be used.' },
    { id: 'liability', heading: 'Liability', text: 'Add liability wording approved by the business or its legal adviser.' },
  ] },
  { slug: 'shipping-policy', title: 'Shipping and delivery', sections: [
    { id: 'areas', heading: 'Where we deliver', text: 'List delivery areas once confirmed by the business.' },
    { id: 'timelines', heading: 'Timelines', text: 'Production and delivery times are shared with each quotation. Add general guidance once supplied.' },
    { id: 'packing', heading: 'Packing', text: 'Describe how pieces are wrapped and packed for travel.' },
    { id: 'charges', heading: 'Charges', text: 'Explain how delivery charges are calculated and quoted.' },
  ] },
  { slug: 'returns-policy', title: 'Returns and refunds', sections: [
    { id: 'custom', heading: 'Made-to-order pieces', text: 'Explain how returns work for custom and made-to-order items once the business confirms its policy.' },
    { id: 'damage', heading: 'Damage in transit', text: 'Describe how to report damage and what the business will do.' },
    { id: 'refunds', heading: 'Refunds', text: 'Explain when and how refunds are issued.' },
    { id: 'contact', heading: 'Contact', text: 'Add the business contact for returns once it is supplied.' },
  ] },
];

export const policyBySlug = (slug: string | null | undefined) => POLICIES.find((p) => p.slug === slug);

/* ------------------------------ misc ------------------------------ */
export const SEARCH_SUGGESTIONS = ['Armchair', 'Pendant lamp', 'Swing', 'Basket'];

export const PRODUCT_TYPE_OPTIONS = ['Chair or armchair', 'Table', 'Swing or jhula', 'Lamp or pendant', 'Storage or basket', 'Screen or divider', 'Mirror or wall decor', 'Something else'];
export const BUDGET_OPTIONS = ['Under ₹ 5,000', '₹ 5,000 – ₹ 15,000', '₹ 15,000 – ₹ 40,000', '₹ 40,000 and above', 'Not sure yet'];
export const INQUIRY_TYPES = ['General question', 'Product inquiry', 'Custom order', 'Bulk or trade', 'Feedback'];
export const FINISH_SWATCHES = [
  { name: 'Natural', color: '#d4b48a' },
  { name: 'Honey', color: '#c3924f' },
  { name: 'Walnut', color: '#8b6537' },
  { name: 'Dark', color: '#4a3725' },
  { name: 'Bleached', color: '#efe6d6' },
];
