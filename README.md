# Ozcart Demo Store – Playwright automation

UI tests for https://demo.ozcart.com/_v5/14ct-gold-earrings plus 3 bonus API tests for the Swagger Petstore.
Test selection and reasoning: see [AUTOMATION.md](./AUTOMATION.md).

## Stack
- Playwright Test (TypeScript)
- Node.js **18+** (developed on Node 22)

## Install
```bash
npm install
npx playwright install chromium
```

## Run
| Goal | Command |
|---|---|
| Everything (headless) | `npm test` |
| UI tests only | `npm run test:ui` |
| API tests only | `npm run test:api` |
| Smoke suite only | `npm run test:smoke` |
| Headed (see the browser) | `npm run test:headed` |
| Debug (Playwright Inspector) | `npm run test:debug` |
| Open HTML report | `npm run report` |

## Configuration (optional env vars)
| Variable | Default |
|---|---|
| `BASE_URL` | `https://demo.ozcart.com/_v5/` (keep trailing slash) |
| `API_URL`  | `https://petstore.swagger.io/v2/` |

Reference data (prices, option IDs) lives in `tests/data/product.ts` – the only file to change if the demo data changes.

## Project structure
```
pages/            ProductPage, CartPage (small page objects)
tests/data/       product reference data
tests/ui/         UI specs
tests/api/        API bonus specs
playwright.config.ts
```

## Reading the results
Tests UI-06 and UI-07 are **known application defects** and are annotated with `test.fail()`.
In the report they appear as "expected failure" (✘ in the list reporter, but counted as passed).
If the application gets fixed, they will turn red -> remove the annotation.

## Known limitations
- Third-party shared demo: data (prices, stock, options) can be changed by the owner at any time.
- No `data-testid` in the app; selectors use `name`/`id` attributes, roles and visible text (details in AUTOMATION.md).
- Checkout is intentionally **not** automated, to avoid creating persistent orders on a shared demo.
- Public Petstore is shared and can be slow/flaky; each API test creates its own pet with a unique ID.
