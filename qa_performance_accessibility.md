# MOVE Coaching – QA, Performance, Accessibility & Launch Readiness

This document maps PRD functional requirements to tests, outlines example automated test specs for critical flows, and defines performance and accessibility checks required before launch.

## 1. Test Plan Mapped to PRD Functional Requirements

### 1.1 Navigation & IA (FR-1, FR-2)

- **FR-1 – Global navigation**
  - Manual test:
    - From Home and at least one inner page, verify that header navigation exposes links to Home, Coaches, App, Priser, Programmer, FAQ, Blogg (if enabled), Aline, Juridisk.
    - On mobile, open menu and verify same links are present.
  - Automated (E2E) idea:
    - Script visits `/`, opens nav, clicks each link, and asserts correct URL and H1.

- **FR-2 – Language & region**
  - Manual test:
    - Confirm primary navigation labels and main content are in Norwegian.
    - Check there are no stray English placeholders in key templates.

### 1.2 Coaching Packages & Pricing (FR-3, FR-4)

- **FR-3 – Price table**
  - Manual:
    - On `/priser`, ensure a table or equivalent layout shows 6/9/12 month packages with comparable info (name, price, key points).
  - Automated:
    - E2E test checks presence of 3 pricing columns and text content for durations and prices.

- **FR-4 – Package details**
  - Manual:
    - From `/priser` or `/programmer`, click each package and confirm detail section/page includes description, included features, price, duration, and mention of startup fee or bonuses.

### 1.3 Products, Cart & Checkout (FR-5, FR-6, FR-7)

- **FR-5 – Add package to cart/checkout**
  - Manual:
    - Click "Start nå" on a package and confirm the correct product/variant appears in cart or checkout with expected name and price.
  - Automated:
    - E2E: trigger CTA, inspect cart line item name and price.

- **FR-6 – Payment providers**
  - Manual (requires live/sandbox config):
    - Walk through checkout to payment step and verify availability of card (Shopify Payments), Klarna, and Vipps for a Norwegian test user.

- **FR-7 – Confirmation**
  - Manual:
    - Complete a test order (in sandbox or low-price test product) and verify order confirmation page and email are received with clear next steps for app access/coaching.

### 1.4 Subscriptions & Recurring Billing (FR-8, FR-9, FR-10)

- **FR-8 – Subscription selection**
  - Manual:
    - On package detail pages, confirm user can see/select subscription option with 6/9/12-month labels before purchase.

- **FR-9 – Subscription creation**
  - Manual (with test store):
    - Place a subscription order and verify that the subscription app creates a record with correct billing amount and schedule.

- **FR-10 – Subscription access**
  - Manual:
    - Log in as the test customer, go to `/account`, and confirm link or embedded view of active subscription with renewal date and payment method.

### 1.5 Quiz & Lead Capture (FR-11, FR-12, FR-13)

- **FR-11 – Quiz entry**
  - Manual:
    - From Home and any relevant landing sections, click quiz CTA and verify multi-step flow starts without leaving main site context.

- **FR-12 – Quiz completion**
  - Manual:
    - Complete quiz, confirm final step shows recommended programme and at least one CTA (“Gå til anbefalt program” / “Book din plass”).

- **FR-13 – Lead capture**
  - Manual:
    - Submit email and consent within quiz or lead forms; verify contact appears in CRM/email tool with correct tags and consent status.

### 1.6 App Showcase (FR-14, FR-15)

- **FR-14 – App features section**
  - Manual:
    - On `/app`, verify all key features (menu, family meals, quick recipes, budget, training, wearables, check-ins, course library) are represented with text and visuals.

- **FR-15 – App CTA**
  - Manual:
    - Confirm prominent CTA routes to appropriate programme or pricing page that includes app access.

### 1.7 Social Proof & Storytelling (FR-16, FR-17)

- **FR-16 – Testimonials**
  - Manual:
    - On Home and at least one Programmes page, confirm presence of testimonial section with real quotes and names.

- **FR-17 – Founder story**
  - Manual:
    - On `/aline`, verify 3-part story (start, turning point, today) is present and readable with supporting imagery.

### 1.8 FAQ & Objection Handling (FR-18)

- **FR-18 – FAQ accessibility**
  - Manual:
    - On `/faq`, confirm categories and questions cover payment, duration, refunds, app access, and support.
    - Check expand/collapse behavior and readability.

### 1.9 Blog (FR-19, FR-20)

- **FR-19 – Blog listing**
  - Manual:
    - On `/blogg`, ensure blog posts show title, date, excerpt, thumbnail.

- **FR-20 – Blog detail**
  - Manual:
    - Click a post, confirm full content is visible and a related content or CTA section is present.

### 1.10 Legal & GDPR (FR-21, FR-22)

- **FR-21 – Legal pages**
  - Manual:
    - From footer, click Privacy, Terms, Cookies links and confirm each loads a dedicated page with appropriate content.

- **FR-22 – Consent handling**
  - Manual:
    - Verify cookie banner appears on first visit, allows user to accept/reject non-essential cookies, and preferences persist.

### 1.11 Analytics & Reporting (FR-23, FR-24)

- **FR-23 – GA4 integration**
  - Manual/technical:
    - Inspect GA4 debug view (or Tag Assistant) to confirm events `page_view`, `add_to_cart`, `begin_checkout`, `purchase`, `quiz_start`, `quiz_complete` fire with correct parameters.

- **FR-24 – Reporting readiness**
  - Manual/ops:
    - Confirm GA4 receives data for key events, and CRM can export leads for reporting.

---

## 2. Example Automated Test Specs (E2E-Oriented)

These are framework-agnostic outlines; can be implemented in Cypress, Playwright, etc.

### 2.1 Navigation to Key Pages

Test: `navigation_can_reach_all_main_pages`
- Visit `/`.
- For each main nav link (Home, Coaches, App, Priser, Programmer, FAQ, Blogg, Aline, Juridisk):
  - Click link.
  - Assert URL matches expected path.
  - Assert page contains expected H1.

### 2.2 Pricing Table Visibility

Test: `pricing_page_displays_three_packages`
- Visit `/priser`.
- Assert presence of 3 pricing cards/columns.
- For each card:
  - Assert duration text contains `6`, `9`, or `12` months.
  - Assert a price value is visible.
  - Assert there is a CTA button (e.g., contains "Start").

### 2.3 Quiz Flow Start & Completion

Test: `quiz_flow_runs_to_completion`
- Visit `/`.
- Click quiz CTA in hero or quiz section.
- Step through N quiz steps, providing valid answers.
- On final step, assert page shows a result heading and at least one CTA to a programme or prices.
- Optionally assert dataLayer/GA4 events for `quiz_start` and `quiz_complete` are triggered.

### 2.4 Initiate Checkout With Package

Test: `start_checkout_with_12_month_package`
- Visit `/priser`.
- Click "Start nå" on 12-month package.
- Assert cart contains correct product name and price.
- Proceed to checkout, assert URL includes `/checkouts/`.

### 2.5 Confirmation State (Smoke Test)

Test: `checkout_reaches_confirmation_in_test_mode`
- In a test/staging environment with test payment method enabled:
  - Add a low-priced test product or use a dummy payment method.
  - Complete checkout.
  - Assert redirect to `/orders/` or order status page containing "Takk" / order confirmation message.

---

## 3. Performance Checklist

Target KPIs (from PRD):
- Lighthouse Performance score ≥ 85 (mobile) on main templates.
- Largest Contentful Paint (LCP) ≤ 2.5s on 4G mobile.
- Cumulative Layout Shift (CLS) ≤ 0.1.

### 3.1 Pages to Test

- Home
- Priser
- Programmer overview
- Aline
- App

### 3.2 Checks

- Run Lighthouse (Chrome DevTools or CI) on mobile emulation for each page.
- Optimise where needed:
  - Ensure hero and large images are compressed, responsive, and lazy-loaded below the fold.
  - Minimise blocking JS and CSS; rely on Dawn’s built-in optimisations.
  - Avoid heavy third-party scripts; load analytics and widgets efficiently.

---

## 4. Accessibility Checklist

Align with WCAG 2.1 AA where reasonable.

### 4.1 Global

- All pages:
  - Valid heading hierarchy (one H1 per page, logical H2/H3 structure).
  - Sufficient colour contrast for text/background according to WCAG.
  - Visible focus styles for all interactive elements.

### 4.2 Keyboard Navigation

- User can:
  - Tab through header nav links, buttons, forms in a logical order.
  - Open/close mobile menu with keyboard.
  - Use Enter/Space to activate buttons and links.

### 4.3 Forms & Quiz

- Every input has an associated label.
- Error messages are announced clearly and associated with fields.
- Quiz steps are navigable with keyboard; focus moves logically between steps.

### 4.4 Media & Images

- Meaningful images (e.g., before/after, app screenshots) have descriptive `alt` text.
- Decorative images use empty `alt` or CSS background images.

### 4.5 Components

- Accordions (FAQ):
  - Use appropriate ARIA attributes (`aria-expanded`, `aria-controls`).
  - Header elements are focusable and triggered by Enter/Space.
- Sliders (testimonials, gallery):
  - Include next/prev controls that are keyboard operable and labelled.

---

## 5. Launch Readiness Steps

Before public launch:
- All functional tests for FR-1–FR-24 pass in staging.
- Key automated tests for navigation, pricing, quiz, and checkout pass in CI.
- Performance KPIs met or close with documented trade-offs.
- Accessibility checks completed on main pages; critical issues fixed.
- GA4 events verified in debug view for main flows.
- Legal pages and consent banner confirmed by client.

This plan satisfies Acceptance Test 8 at a specification level and can be implemented with the chosen test framework and tooling.