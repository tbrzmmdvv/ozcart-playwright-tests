import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { product, money } from '../data/product';

const o = product.options;

// Every Playwright test gets a fresh browser context => fresh guest session => empty cart.
// That is why the tests are independent and need no cleanup.

test.describe('14ct Gold Earrings - product selection & cart', () => {
  test('UI-01 product page shows key product information @smoke', async ({ page }) => {
    const pdp = new ProductPage(page);
    await pdp.open();

    await expect(page).toHaveTitle(product.pageTitle);
    await expect(pdp.heading).toBeVisible();
    await pdp.expectPrice(product.basePrice);
    await expect(pdp.oldPrice).toHaveText(money(product.oldPrice));
    await expect(pdp.size).toBeVisible();
    await expect(pdp.colour).toBeVisible();
    await expect(page.locator(`input[name="${o.giftWrap.name}"]`)).toHaveCount(2);
    await expect(pdp.quantity).toHaveValue('1');
    await expect(pdp.addToCart).toBeEnabled();
  });

  test('UI-02 price recalculates when size and gift wrap change; Large hides Colour @smoke', async ({ page }) => {
    const pdp = new ProductPage(page);
    await pdp.open();

    await pdp.selectSize(o.size.medium);
    await pdp.expectPrice(product.basePrice + o.size.mediumSurcharge); // 20.35

    await pdp.selectGiftWrap(true);
    await pdp.expectPrice(product.basePrice + o.size.mediumSurcharge + o.giftWrap.yesSurcharge); // 22.35

    await pdp.selectGiftWrap(false);
    await pdp.selectSize(o.size.large);
    await pdp.expectPrice(product.basePrice + o.size.largeSurcharge); // 21.45
    await expect(pdp.colour).toBeHidden(); // documented business rule: Large hides Colour
  });

  test('UI-03 add to cart without required options shows validation errors and adds nothing @smoke', async ({ page }) => {
    const pdp = new ProductPage(page);
    await pdp.open();

    const body = await pdp.submitAddToCart();

    expect(body.success).toBeUndefined();
    await expect(pdp.errors.filter({ hasText: 'Size required' })).toBeVisible();
    await expect(pdp.errors.filter({ hasText: 'Gift Wrap required' })).toBeVisible();
    await expect(pdp.successAlert).toBeHidden();

    const cart = new CartPage(page);
    await cart.open();
    await expect(cart.row(product.cartName)).toHaveCount(0);
  });

  test('UI-04 configured product is added to the cart with correct options and price @smoke', async ({ page }) => {
    const pdp = new ProductPage(page);
    await pdp.open();
    await pdp.configure({ size: o.size.medium, giftWrap: true });

    const body = await pdp.submitAddToCart();
    expect(body.success).toContain('You have added');
    await expect(pdp.successAlert).toContainText('14ct Gold Earrings');

    const cart = new CartPage(page);
    await cart.open();
    const row = cart.row(product.cartName);
    await expect(row).toContainText('Gift Wrap: Yes');
    await expect(row).toContainText('Colour: Turquoise');
    await expect(row).toContainText('Size: Medium');
    await expect(cart.quantityInput(product.cartName)).toHaveValue('1');
    await expect(row).toContainText(money(22.35)); // unit price == line total for qty 1
  });

  test('UI-05 changing quantity in the cart recalculates the line total', async ({ page }) => {
    const pdp = new ProductPage(page);
    await pdp.open();
    await pdp.configure({ size: o.size.medium, giftWrap: false });
    await pdp.submitAddToCart();

    const cart = new CartPage(page);
    await cart.open();
    await cart.setQuantity(product.cartName, 2);

    await expect(cart.quantityInput(product.cartName)).toHaveValue('2');
    await expect(cart.row(product.cartName)).toContainText(money(20.35 * 2)); // 40.70
    await expect(cart.totalRow('Total:')).toContainText(money(20.35 * 2));
  });

  // ---- Known application defects -------------------------------------------------------------
  // These assert the EXPECTED (correct) behaviour. They are marked test.fail(): the run is green while
  // the defect exists and turns RED as soon as the app is fixed -> remove the annotation then.
  // See AUTOMATION.md "Known defects" for evidence.

  test('UI-06 [KNOWN DEFECT BUG#1] quantity above stock (41 > 39) must be rejected', async ({ page }) => {
    test.fail(true, 'App accepts Qty=41 although Availability is 39 (overselling risk)');
    const pdp = new ProductPage(page);
    await pdp.open();
    await pdp.configure({ size: o.size.medium });
    await pdp.setQuantity(String(product.stock + 2));

    const body = await pdp.submitAddToCart();

    expect(body.success, 'cart add should be rejected').toBeUndefined();
    expect(body.error).toBeDefined();
  });

  test('UI-07 [KNOWN DEFECT] invalid quantity (0) must be rejected, not silently added', async ({ page }) => {
    test.fail(true, 'App returns success for Qty=0 and shows $0.00 price; server coerces it to 1');
    const pdp = new ProductPage(page);
    await pdp.open();
    await pdp.configure({ size: o.size.medium });
    await pdp.setQuantity('0');

    const body = await pdp.submitAddToCart();

    expect(body.success, 'Qty=0 should not be accepted').toBeUndefined();
  });
});
