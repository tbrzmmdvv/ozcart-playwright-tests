// Reference data observed on https://demo.ozcart.com/_v5/14ct-gold-earrings (19 Oct 2026).
// Prices are AUD, displayed GST-inclusive. If the demo data changes, update ONLY this file.
export const product = {
  path: '14ct-gold-earrings',
  pageTitle: '14ct Gold Earrings',
  cartName: '14ct Gold Earrings',
  basePrice: 19.25,
  oldPrice: 38.5,
  stock: 39,
  // OpenCart option IDs (the only stable identifiers the app exposes)
  options: {
    giftWrap: { name: 'option[293]', yes: '105', no: '104', yesSurcharge: 2.0 },
    colour: { id: '#input-option262', turquoise: '71' },
    size: { id: '#input-option261', small: '68', medium: '69', large: '70', mediumSurcharge: 1.1, largeSurcharge: 2.2 },
  },
} as const;

export const money = (n: number) => `$${n.toFixed(2)}`;
