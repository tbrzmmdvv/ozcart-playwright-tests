import { expect, type Locator, type Page } from '@playwright/test';
import { product, money } from '../tests/data/product';

const o = product.options;

/**
 * Selector notes (third-party app, no data-testid):
 *  - select/radio/qty fields: stable `name`/`id` attributes -> used.
 *  - price: class `.price-new-live` is the only handle for the live price (no role/label available).
 *  - validation errors: Bootstrap `.text-danger` blocks next to the field.
 */
export class ProductPage {
  readonly heading: Locator;
  readonly livePrice: Locator;
  readonly oldPrice: Locator;
  readonly size: Locator;
  readonly colour: Locator;
  readonly quantity: Locator;
  readonly addToCart: Locator;
  readonly errors: Locator;
  readonly successAlert: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.livePrice = page.locator('.price-new-live');
    this.oldPrice = page.locator('.price-old-live');
    this.size = page.locator(o.size.id);
    this.colour = page.locator(o.colour.id);
    this.quantity = page.locator('#input-quantity');
    this.addToCart = page.locator('#button-cart');
    this.errors = page.locator('.text-danger');
    this.successAlert = page.locator('.alert-success');
  }

  async open() {
    await this.page.goto(product.path);
    await expect(this.addToCart).toBeVisible();
  }

  async selectSize(value: string) {
    await this.size.selectOption(value);
  }
  async selectColour(value = o.colour.turquoise) {
    await this.colour.selectOption(value);
  }
  async selectGiftWrap(yes: boolean) {
    await this.page.locator(`input[name="${o.giftWrap.name}"][value="${yes ? o.giftWrap.yes : o.giftWrap.no}"]`).check();
  }
  async setQuantity(qty: string) {
    await this.quantity.fill(qty);
  }

  /** Select a fully valid configuration (Turquoise / Medium / no gift wrap by default). */
  async configure({ size = o.size.medium, giftWrap = false }: { size?: string; giftWrap?: boolean } = {}) {
    await this.selectSize(size);
    if (size !== o.size.large) await this.selectColour(); // Large hides Colour by design
    await this.selectGiftWrap(giftWrap);
  }

  /** Click Add to Cart and wait for the AJAX response instead of sleeping. */
  async submitAddToCart() {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('checkout/cart/add') && r.request().method() === 'POST'),
      this.addToCart.click(),
    ]);
    return response.json() as Promise<{ success?: string; error?: Record<string, unknown>; total?: string }>;
  }

  async expectPrice(amount: number) {
    // livePrice is updated asynchronously after an option change -> web-first assertion auto-retries
    await expect(this.livePrice).toHaveText(money(amount));
  }
}
