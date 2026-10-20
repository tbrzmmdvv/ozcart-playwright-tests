BUG#1
**Title:** [14ct Gold Earrings] System allows ordering quantity (41) that exceeds displayed stock availability (39)

**Environment:**
- URL: https://demo.ozcart.com/_v5/14ct-gold-earrings
- Browser: Chrome (latest)
- Environment: Demo(demo.ozcart.com)
- Date found: 19 Oct 2026
- User state: Guest

**Preconditions:**
- Product page shows "Availability: 39"
- Cart is empty

**Steps to Reproduce:**
1. Go to https://demo.ozcart.com/_v5/14ct-gold-earrings
2. Select valid required options (Colour: Turquoise, Size: Medium, Gift Wrap: No)
3. Set Qty = **41** (greater than the displayed "Availability: 39")
4. Click "Add to Cart"
5. Observe system response

**Actual Result:**
The system accepts Qty=41 and adds the item to the cart without any stock validation error.

**Expected Result:**
The system should block the action and display a clear error message ("Only 39 units available") when the requested quantity exceeds available stock. The item should not be addable to the cart, or at minimum checkout should be blocked until quantity is corrected.

**Severity:** High (direct overselling risk — financial/operational impact)
**Priority:** Highest
**Additional information:**
1. Screenshots: product page with "Availability: 39" (image.png); cart with Qty=41 (image2.png)
2. Network (DevTools/HAR): POST https://demo.ozcart.com/_v5/index.php?route=checkout/cart/add
   Payload: product_id=158, quantity=41, option[261]=69 (Medium), option[262]=71 (Colour), option[293]=104 (Gift Wrap: No)
   Response 200: {"success":"Success: You have added ... to your shopping cart","total":"41 item(s) - $834.35"}
3. Browser console log: no errors; HAR file attached; session cookie (OCSESSID) and timestamp of the request
4. Requested from Dev team: oc_product.quantity for product_id=158; oc_cart row for this session_id
   (quantity=41); application/server log for the cart/add request at the timestamp; the code that validates
   quantity against stock in checkout/cart/add
---

BUG#2

**Title:** [14ct Gold Earrings] Overall "Availability" count (39) does not match the sum of individual variation stock levels (Size: Medium=4, Large=7, Small=0)

**Environment:**
- URL: https://demo.ozcart.com/_v5/14ct-gold-earrings
- Browser: Chrome (latest)
- Environment: Demo

**Preconditions:**
- Product page is loaded, "Available options" section visible

**Steps to Reproduce:**
1. Go to https://demo.ozcart.com/_v5/14ct-gold-earrings
2. Note the top-level stock indicator: **"Availability: 39"**
3. Open the "Size" dropdown and note stock per option: Small (0 left), Medium (4 left), Large (7 left)
4. Sum the per-option stock: 0 + 4 + 7 = 11
5. Compare 11 with the displayed overall Availability of 39

**Actual Result:**
The overall "Availability" field shows 39 units, while the sum of all Size variation stocks is only 11. The two numbers are inconsistent and it's unclear which one represents the true, trustworthy stock level.

**Expected Result:**
The overall availability figure should be clearly defined and consistent with the sum/logic of the variation-level stock (either Availability reflects total stock across all variations, or it reflects base product stock independent of variationsbut this relationship must be documented and mathematically consistent).Note: stock may be tracked per option independently; business confirmation required.

**Severity:** Low (data integrity issue, confuses customers and risks incorrect stock decisions)
**Priority:** Low
**Additional information to attach / request from Dev team:**
1. Screenshot of "Availability: 39" and the expanded Size dropdown side by side (image4.png)

---

BUG#3

**Title:** [14ct Gold Earrings] Placeholder text "This text can be edited" is displayed on the live product page

**Environment:**
- URL: https://demo.ozcart.com/_v5/14ct-gold-earrings
- Browser: Chrome (latest)
- Environment: Demo

**Preconditions:**
- None — visible on normal page load

**Steps to Reproduce:**
1. Go to https://demo.ozcart.com/_v5/14ct-gold-earrings
2. Scroll to the product description / special offer text area
3. Read the text under the discount/special offer section

**Actual Result:**
The text reads: *"Special sale for a long time! This text can be edited."*
this is clearly unfinished CMS placeholder/editor copy, not real customer-facing marketing content.

**Expected Result:**
All customer-facing text should be final, reviewed content. Placeholder/editor instructions must never be visible on a live or production-like page.

**Severity:** Low (cosmetic/content issue, no functional impact, but damages brand credibility)
**Priority:** Low

**Additional information to attach / request from Dev team:**
1. Screenshot of the exact text location on the page (image5.png)
---


BUG#4
Title: [14ct Gold Earrings] Invalid quantity (0, -1, "abc") is accepted; price shows $0.00 / negative, server silently adds qty 1

Environment: same as above (Chrome latest, Demo, Guest)
Preconditions: Cart is empty; valid options selected (Colour: Turquoise, Size: Medium, Gift Wrap: No)

Steps to Reproduce:
1. Open https://demo.ozcart.com/_v5/14ct-gold-earrings and select valid options
2. Enter Qty = 0 (then repeat with -1 and with abc)
3. Observe the displayed price
4. Click "Add to Cart" and open the cart

Actual Result:
- Displayed price: Qty 0 -> $0.00; Qty -1 -> $-20.35; Qty abc -> $0.00
- POST checkout/cart/add returns "success" for all three values
- The cart total increases by one unit ($20.35) each time, so the server silently converts the value to 1

Expected Result:
Invalid quantity (not an integer >= 1) is rejected with a validation message; the price is never shown as
zero or negative; nothing is added to the cart.

Severity: Medium   Priority: Medium
Additional information: screenshots of prices; HAR/response JSON of cart/add; request from Dev: oc_cart.quantity
values for this session and the quantity validation code.


**"Improvement/Suggestion"** 

**Title:** [14ct Gold Earrings] Product image does not update when a different Colour option is selected

**Type:** Improvement / UX Enhancement (not a functional defect)

**Environment:**
- URL: https://demo.ozcart.com/_v5/14ct-gold-earrings
- Browser: Chrome (latest)

**Preconditions:**
- Product has multiple Colour options available (currently only "Turquoise" is listed, but assuming more colours may be added)

**Steps to Reproduce:**
1. Go to https://demo.ozcart.com/_v5/14ct-gold-earrings
2. Select a Colour option from the dropdown (e.g., Turquoise)
3. Observe the main product image

**Actual Result:**
The product image remains the same regardless of which Colour option is selected — the customer cannot visually preview the selected colour variation.

**Expected Result (suggested):**
When a Colour option is selected, the main product image should update to show the corresponding colour variation, improving purchase confidence and reducing returns due to colour mismatch.

**Severity:** N/A (enhancement, not a defect)
**Priority:** Low–Medium (nice-to-have, improves conversion/UX)
