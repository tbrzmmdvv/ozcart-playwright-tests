# AUTOMATION.md

## 1. Scenarios selected for automation (UI)
| ID | Scenario | Suite |
|---|---|---|
| UI-01 | Product page shows title, price, old price, options, qty, Add to Cart | Smoke |
| UI-02 | Price recalculates for Size / Gift Wrap; Large hides Colour | Smoke |
| UI-03 | Add to cart without required options -> validation errors, nothing added | Smoke |
| UI-04 | Configured product added to cart; options + price correct in cart | Smoke |
| UI-05 | Changing quantity in cart recalculates line total and order total | Regression |
| UI-06 | Qty above stock (41 > 39) must be rejected – **known defect** (`test.fail`) | Regression |
| UI-07 | Qty = 0 must be rejected – **known defect** (`test.fail`) | Regression |

Bonus API: create+get, update (changed/unchanged fields), delete+404.

## 2. Why these
They protect the money path: price calculation, required-option validation, and what the customer
configures is what lands in the cart. They are deterministic, fast, independent (fresh guest session per test,
so no cleanup and no ordering dependencies) and do not create persistent data.

## 3. Kept manual (from Part 3) and why
- TC-01 full checkout / TC-06 / TC-12 end-to-end: would create real orders on a shared demo; payment sandbox unknown.
- TC-10 currency EUR consistency: exchange rate is dynamic, needs a stable rate or backend control first.
- DB validations: no DB access; belong to API/DB-level checks in a controlled environment.
- TC-03 out-of-stock Small, TC-09 Large + stale Colour: valuable but rules are not confirmed by the business yet; kept manual until expected behaviour is defined.
- Visual/content issues (placeholder text, wrong "Bag Features" data): human review.

## 4. Additional scenarios in a real project
Guest/registered checkout to confirmation with sandbox payment; currency switching across PDP -> cart -> checkout;
out-of-stock option handling; cart persistence across sessions; coupon/reward points; tax by shipping country;
cross-browser (Firefox/WebKit) and mobile viewport runs; API-level price/stock contract tests for the cart endpoint.

## 5. Smoke vs Regression
- **Smoke** (`npm run test:smoke`, ~1 min): UI-01..UI-04.
- **Regression**: everything above + the additional scenarios in section 4.

## 6. Known defects found while automating (evidence)
| Test | Expected | Actual | Classification |
|---|---|---|---|
| UI-06 | Qty 41 rejected (Availability 39) | `checkout/cart/add` returns `success`, cart total `41 item(s)` | Application defect (= BUG#1) |
| UI-07 | Qty 0 rejected | `success`; PDP price shows `$0.00`, server silently adds quantity 1 | Application defect |

Also observed manually via the same endpoint: Qty `-1` shows a negative price (`$-20.35`) and Qty `abc` shows `$0.00`; both are
accepted and silently coerced to 1 by the server. Cause is most likely missing server-side validation of `quantity`
(the field is a free text input with only `onkeyup` recalculation).
Note also: **Gift Wrap is a required option** (error "Gift Wrap required"), not only Size.

## 7. Assumptions, limitations, risks
- Prices are AUD and GST-inclusive; reference values in `tests/data/product.ts` may change if the demo data is edited (main flakiness risk).
- Selectors: `name`/`id` attributes of OpenCart options (`option[293]`, `#input-option261`, `#input-quantity`, `#button-cart`) are the most stable
  handles available. Weak spots: `.price-new-live` (class-only, no label/role), `.text-danger` for validation messages, `.cart-info` to
  separate the main cart table from the hidden mini-cart (which duplicates rows/totals). Option IDs (`69`, `70`...) are DB ids and break if data is re-seeded.
- Price updates after an option change are asynchronous (AJAX). Handled with web-first assertions (auto-retry) and `waitForResponse` on
  `checkout/cart/add`; no fixed sleeps anywhere.
- No retries are configured on purpose, so real instability is visible rather than hidden.
- Shared third-party environment: someone else may change data; the demo may be slow.

## 8. Recommendations for the dev team (not implemented)
Add `data-testid` for price, option fields, validation messages, cart rows and totals; return structured error codes;
server-side validation of quantity (integer >= 1, <= stock); expose a test-data/reset API; keep mini-cart and cart markup distinguishable.
