# Part 3: Test Case Design

**Product page:** https://demo.ozcart.com/_v5/14ct-gold-earrings

**Reference data:** Base price $19.25 (50% off from $38.50). Excl. Tax $17.50. Availability: 39. Colour: Turquoise. Size: Small (0 left), Medium +$1.10 (4 left), Large +$2.20 (7 left). Gift Wrap: Yes +$2.00, No +$0.00.

---

## TC-01 | [Positive] Add item with valid options and place order
**Priority:** High

**Preconditions:**
- User is on the product page.
- Cart is empty.
- User is a guest.

**Steps:**
1. Select Colour = Turquoise, Size = Medium, Gift Wrap = No, Qty = 1.
2. Click "Add to Cart".
3. Open the cart and verify the item details.
4. Proceed to checkout as a guest.
5. Submit the order.

**Expected Result:**
- The price is $20.35 ($19.25 + $1.10).
- The cart shows the correct options.
- An order confirmation with an Order ID is displayed.

**DB Validation (if access is available):**
- `orders`: a new row exists, with status = Pending and total = 20.35.
- `order_product` / `order_option`: Size = Medium, Colour = Turquoise, quantity = 1.

---

## TC-02 | [Negative] Add to cart without required Size
**Priority:** High

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Leave Size as "--- Please Select ---".
2. Select Colour = Turquoise.
3. Click "Add to Cart".

**Expected Result:**
- A validation error (for example, "Size required") is shown.
- The item is not added to the cart.

**DB Validation:** Not applicable.

---

## TC-03 | [Negative] Add out-of-stock Size (Small, 0 left)
**Priority:** High

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select Size = Small (0 left) and Colour = Turquoise.
2. Click "Add to Cart".

**Expected Result:**
- The action is blocked with an "Out of stock" message.
- The item is not added to the cart.

**DB Validation (if access is available):**
- `product_option_value`: the quantity for the Small option is 0.
- `order_product`: no row is created for this attempt.

---

## TC-04 | [Boundary] Quantity = 0
**Priority:** Medium

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select Colour = Turquoise and Size = Medium.
2. Set Qty = 0.
3. Click "Add to Cart".

**Expected Result:**
- Qty = 0 is rejected with a message (for example, "Quantity must be at least 1").
- The item is not added to the cart.

**DB Validation:** Not applicable.

---

## TC-05 | [Negative/Boundary] Quantity = -1
**Priority:** Medium

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select valid options.
2. Set Qty = -1.
3. Click "Add to Cart".

**Expected Result:**
- The negative quantity is rejected with a validation error.
- The item is not added to the cart.

**DB Validation:** Not applicable.

---

## TC-06 | [Boundary] Quantity = 39 (equal to availability)
**Priority:** Medium

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select valid options.
2. Set Qty = 39.
3. Click "Add to Cart".
4. Complete checkout.

**Expected Result:**
- Qty = 39 is accepted and added to the cart.
- The order is placed successfully.

**DB Validation (if access is available):**
- Product stock field: value before and after the order.
- `order_product`: quantity = 39.

---

## TC-07 | [Negative/Edge] Quantity = 41 (above availability, linked to Bug #1)
**Priority:** High

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select valid options.
2. Set Qty = 41.
3. Click "Add to Cart".
4. Proceed to checkout.

**Expected Result:**
- The system rejects Qty = 41 with a message such as "Only 39 units available".
- The item does not reach checkout.

**DB Validation (if access is available):**
- Product stock field = 39 at the time of the test.
- `order_product`: no row exists with quantity greater than 39.

---

## TC-08 | [Positive variant] Gift Wrap = Yes surcharge
**Priority:** Medium

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select Colour = Turquoise, Size = Medium, Gift Wrap = Yes, Qty = 1.
2. Observe the updated price.
3. Click "Add to Cart".

**Expected Result:**
- The price is $22.35 ($19.25 + $1.10 + $2.00).
- The cart shows "Gift Wrap: Yes".

**DB Validation (if access is available):**
- `order_option`: the Gift Wrap value and its surcharge are stored correctly.
- The surcharge is included in the order total.

---

## TC-09 | [Negative/Edge] Size = Large hides Colour, check cart integrity (linked to Risk #2)
**Priority:** High

**Preconditions:**
- User is on the product page.
- Colour = Turquoise is selected first.

**Steps:**
1. Select Colour = Turquoise.
2. Change Size to Large (the Colour option disappears).
3. Click "Add to Cart".
4. Check the cart item details.

**Expected Result:**
- No stale or mismatched Colour value remains attached to the cart item.
- The behavior follows a defined business rule.

**DB Validation (if access is available):**
- `order_option`: no leftover Colour row exists for this line item.

---

## TC-10 | [Positive variant] Currency EUR consistency
**Priority:** Medium

**Preconditions:**
- User is on the product page.
- Default currency is AUD.

**Steps:**
1. Change the currency to EUR.
2. Note the converted price.
3. Add the item to the cart.
4. Proceed to checkout and compare the totals.

**Expected Result:**
- The price, cart total, and checkout total are all shown in EUR with the same conversion.

**DB Validation (if access is available):**
- `orders`: currency_code = EUR, and currency_value matches the rate used.

---

## TC-11 | [Negative/Edge] Non-numeric quantity ("abc")
**Priority:** Low

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select valid options.
2. Enter "abc" in the Qty field.
3. Click "Add to Cart".

**Expected Result:**
- The field rejects non-numeric input, or a validation error is shown.
- The item is not added to the cart.

**DB Validation:** Not applicable.

---

## TC-12 | [Negative] Discount applied only to base price, not surcharges
**Priority:** High

**Preconditions:**
- User is on the product page.
- Cart is empty.

**Steps:**
1. Select Colour = Turquoise, Size = Large (+$2.20), Gift Wrap = Yes (+$2.00), Qty = 1.
2. Verify the displayed price.
3. Add the item to the cart.
4. Complete checkout.

**Expected Result:**
- The total is $23.45 ($19.25 + $2.20 + $2.00) in the cart, at checkout, and on the order confirmation.

**DB Validation (if access is available):**
- `order_total` / `order_product`: the base price, discount, and surcharges add up to the stored total.