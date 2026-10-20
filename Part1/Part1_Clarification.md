# Part 1 — Clarification (Test Documentation)

**Project:** Ozcart Demo Store — https://demo.ozcart.com/
**Date:** 19 Oct 2026

## 1. Business Questions (BA / Product Manager)

1. How is the final product price calculated when multiple paid options are selected (e.g., Size: Medium +$1.10, Gift Wrap: Yes +$2.00)? Is it a simple additive sum, or do some options apply a percentage modifier instead of a fixed amount?
2. The product shows an overall "Availability: 39" while individual option values show different stock numbers (e.g., Colour: Turquoise — 19 left, Size: Medium — 4 left). How are the overall stock count and the per-option stock counts related/synchronized?
3. One of the Size options is shown as "Small (0 left)." Is a customer allowed to select an out-of-stock option at all? If selected, what is the expected system behavior (block selection, disable "Add to Cart," show an error message)?
4. The product description states that selecting "Large" hides the "Colour" option ("paired option combination"). Please confirm this is intentional and what the expected cart/order data is for the hidden Colour.
5. The product title says "14ct Gold Earrings," while the description text refers to "14ct plated Gold." Which description is accurate, and which one should be displayed to the customer? https://demo.ozcart.com/_v5/14ct-gold-earrings
6. The specification table at the bottom of the page shows a "Bag Features" section with "Dimensions: 10mm" for an earrings product. Is this a content/data error, or expected shared template data? (look at to the image.png)
7. The special offer/discount dates shown are from 2019 to 2080. Is this real campaign data, or leftover test/demo data that should not be visible on a live-like environment? (image2.png)
8. When the currency is changed (AUD, CAD, EUR, NZD, GBP, USD), is the displayed price converted using a real-time exchange rate, or a static/manual rate? In which currency is the order actually stored and charged?
9. Is the "Price in reward points" value (shown as 45 points) usable as a payment/discount method during checkout, or is it purely informational?
10. What are the possible order statuses (e.g., Pending, Processing, Shipped, Cancelled, Refunded), and which transitions between statuses happen automatically vs. manually by an admin?
11. Is tax calculated based on the customer's shipping address/country? How is the "Excl. Tax" value related to the final displayed price?
12. Is there a minimum or maximum order quantity per product, and does quantity affect pricing tiers (bulk discounts)?
13. What payment methods are expected to be available in the live/production environment (this demo may only show test/sandbox options)?

## 2. Technical Questions

1. Is price/stock recalculation performed client-side or via a backend call? In DevTools, a backend request is sent on every option change; which endpoint is it and what does it return?
2. Is the shopping cart stored server-side (database/session) or client-side (cookies/local storage)? How long does an abandoned cart persist?
3. Does the test/demo environment (demo.ozcart.com) share the same database as production, or is it fully isolated?
4. Are test payment credentials (sandbox card numbers, test PayPal accounts) available for completing checkout without creating a real transaction/charge?
5. Which browsers and devices (desktop/mobile, Chrome/Firefox/Safari) are officially supported and should be covered by testing?
6. Will the QA team have access to backend logs, the admin panel, or the database to verify order data, stock updates, and price calculations?
7. Are there third-party integrations (payment gateway, shipping/courier API, email/SMS notifications) running in sandbox mode on this environment, or do they trigger real external calls?
8. Is there an API (REST/SOAP) available for the store that could be used for automated test data setup/teardown (creating test products, resetting stock)?

## 3. Assumptions (used when answers are not exactly known)

1. The 50% discount applies only to the base product price, not to option surcharges, unless proven otherwise during testing.
2. Stock is tracked per individual option/variation combination; an option showing "(0 left)" should not be selectable or should block "Add to Cart."
3. The "paired option combination" behavior (Large hides Colour) is intentional, since it is explicitly described in the product's own description text.
4. The cart is assumed to be stored server-side (session-based) and persists until the browser session ends or the cart is manually cleared.
5. Since direct DB/log access is not confirmed, all bug reports will rely only on UI evidence, browser console/network logs, and a clear request to the Dev team for backend/DB confirmation.
6. The demo environment is isolated from production and safe for test order creation, unless stated otherwise.

## 4. Top 5 Product Risks (based on website exploration only)

**Risk 1 — Incorrect price calculation when combining options and discounts**
The product has multiple paid options (Size, Gift Wrap) plus an active 50% discount. If the combination logic is wrong, customers could be overcharged or undercharged. This directly affects revenue and customer trust, making it the highest-priority area to test.

**Risk 2 — "Paired option combination" logic breaking cart/checkout data**
Selecting "Large" removes the "Colour" option from the page. If a previously selected Colour value is still silently added to the cart or order after it disappears from the UI, the customer could receive a product that doesn't match what they ordered. This is a non-trivial, product-specific edge case that is easy to miss during casual testing.

**Risk 3 — Out-of-stock options can still be selected and "ordered"**
The "Small (0 left)" option is visible and may be selectable. If the system allows adding an out-of-stock variation to the cart and completing checkout, this leads to overselling — a serious operational/business problem.

**Risk 4 — Selected attributes not correctly carried through cart and checkout**
If the exact product configuration (size, colour, gift wrap) selected on the product page is not accurately reflected in the cart and the final order summary, customers may receive the wrong product, leading to complaints and returns.

**Risk 5 — Currency conversion inconsistency across the purchase flow**
The store supports six currencies (AUD, CAD, EUR, NZD, GBP, USD). If the displayed price, cart total, and final checkout amount are not consistently calculated/converted in the selected currency, this could result in incorrect charges and a broken checkout experience.
