import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.goto('cart');
    await expect(this.page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  }

  /**
   * Cart line item for the given product name.
   * The page also contains a hidden mini-cart (header dropdown) with similar rows, so we scope to
   * the main cart table container `.cart-info` (only class-based handle available in this app).
   */
  row(productName: string): Locator {
    return this.page.locator('.cart-info tbody tr', { hasText: productName });
  }

  quantityInput(productName: string): Locator {
    return this.row(productName).locator('input[name^="quantity["]');
  }

  async setQuantity(productName: string, qty: number) {
    const input = this.quantityInput(productName);
    await input.fill(String(qty));
    await Promise.all([this.page.waitForLoadState('load'), input.press('Enter')]); // Enter submits the update form
  }

  /** Order totals row, e.g. 'Total:' (with colon -> distinguishes it from the mini-cart's 'Total'). */
  totalRow(label: string): Locator {
    return this.page.locator('tr').filter({ hasText: new RegExp(`^\\s*${label}`) });
  }
}
