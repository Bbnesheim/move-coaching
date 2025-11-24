# MOVE Coaching – Products, Checkout & Subscriptions Spec

This document describes how to model MOVE Coaching products in Shopify, configure subscriptions via a compatible app, and set up checkout/payment flows (Stripe/Shopify Payments, Klarna, Vipps) in line with the PRD and PROMPT acceptance tests.

## 1. Product & Subscription Modelling

### 1.1 Core Coaching Packages

From PRD (pricing subject to final confirmation):
- **6 måneder – Halvårsboost**
- **9 måneder – Veien mot Suksess**
- **12 måneder – Full Livsstilsendring** (includes free start and extra month)

All packages are **digital-only** and include:
- Coaching & follow-up.
- Access to MOVE app.
- Check-ins, course library, and supporting content.

### 1.2 Product Strategy

Recommend **one product per package** for clarity and analytics:
- Product A: `MOVE Coaching – 6 måneder` (handle: `coaching-6-mnd`)
- Product B: `MOVE Coaching – 9 måneder` (handle: `coaching-9-mnd`)
- Product C: `MOVE Coaching – 12 måneder` (handle: `coaching-12-mnd`)

Within each product:
- Use a **primary subscription selling plan** as default.
- Optionally support a **one-time purchase** (e.g., upfront for full duration) if the business wants that option visible.

Alternative (if subscription app prefers):
- A single product `MOVE Coaching – Abonnement` with variants for 6/9/12 months.
- Selling plans mapped by variant. This is more compact but slightly less explicit in analytics and IA.

### 1.3 Digital Product Configuration

For each coaching product in Shopify Admin:
- Product type: `Service` or `Digital`.
- No physical inventory or shipping.
- Ensure **“This is a physical product”** is **unchecked**.
- Add metafields as needed (e.g., duration, programme type, key features) to drive theme display.

### 1.4 Selling Plan Concepts

For each package, define selling plans in the subscription app (names subject to app):
- Selling plan name: `MOVE Coaching 6 måneder` / `9 måneder` / `12 måneder`.
- Billing interval: monthly.
- Billing count:
  - 6 months → 6 charges.
  - 9 months → 9 charges.
  - 12 months → 12 charges (plus free start rules below).

For 12-month “Full Livsstilsendring” offer:
- Option 1: **Free first month**
  - 12-month contract, but first month is billed at 0 NOK (or included as bonus month at end).
- Option 2: **Extra month added**
  - 12 monthly payments; subscription app continues for a 13th month at no extra cost (handled manually or via app configuration).

The exact implementation depends on chosen subscription app; note this as an open assumption.

---

## 2. Subscription App & Configuration (Assumed Pattern)

Because the PRD does not specify a particular app, we assume a **Shopify-compatible subscription app** that supports:
- Fixed-term subscriptions (6/9/12 billing cycles).
- Monthly billing amount per plan.
- Prepaid vs pay-as-you-go (we use monthly pay-as-you-go).
- Customer portal for managing subscriptions.

Examples (not mandated):
- Apps similar to Loop, Seal, or Recharge that support standard Shopify subscription APIs.

### 2.1 Subscription App Setup (Conceptual)

1. Install chosen subscription app from Shopify App Store.
2. Enable the app’s **subscription widget** on product templates (usually via app block or automatic install).
3. Create 3 selling plans:
   - `MOVE Coaching 6 måneder`
   - `MOVE Coaching 9 måneder`
   - `MOVE Coaching 12 måneder`
4. For each plan, configure:
   - Billing interval: **1 month**.
   - Number of billing cycles: **6**, **9**, or **12**.
   - Price per month as per PRD (e.g., 2999/2799/2499 NOK; confirm final numbers).
   - Any free month or startup-fee logic for the 12-month plan.
5. Assign plans to relevant products (6/9/12 month products or variants).

### 2.2 Customer Portal & Subscription Access

- Enable the app’s **customer portal** so customers can:
  - View active subscriptions.
  - See next billing date and amount.
  - Update payment method (if supported by app/payment gateway).
  - Request/carry out changes (pause, cancel, upgrade/downgrade) within allowed rules.
- Ensure **Shopify customer accounts** are turned on.
- Add a **“Min side / Konto”** link in header/footer to `/account`.
- Surface subscription portal link within account or via portal link from emails (depending on app integration).

### 2.3 Operational Notes

- Any complex flows like **upgrades/downgrades** or **pausing** are subject to capabilities of chosen subscription app; document supported actions in FAQ and legal pages.
- For launch, prioritise:
  - Clear presentation of duration & price.
  - Reliable billing.
  - Simple self-service cancellation if required by local rules.

---

## 3. Checkout & Payment Providers

### 3.1 Shopify Payments / Stripe

In Shopify Admin:
1. Go to **Settings → Payments**.
2. Activate **Shopify Payments** (Stripe-backed) for Norway.
3. Configure accepted cards and currencies.
4. Ensure that subscription app is compatible with Shopify Payments (required for subscriptions).

### 3.2 Klarna

1. Either enable **Klarna** via Shopify Payments (if supported in region) or install the official Klarna app/alternative gateway.
2. Configure merchant account details, allowed payment types, and country/region settings.
3. Verify Klarna is available in checkout when appropriate basket criteria are met.

### 3.3 Vipps

1. Install a **Vipps for Shopify** app that integrates with Shopify Payments or as a separate gateway.
2. Connect to Vipps merchant account.
3. Confirm Vipps appears as a checkout option for Norwegian customers.

### 3.4 General Checkout Configuration

- Use **Shopify standard checkout** with MOVE branding (logo, colors, typography consistent with brand guide).
- Ensure checkout language is set to **Norwegian** or localised via theme language.
- Configure order confirmation emails and **subscription confirmation emails** via Shopify + subscription app.

---

## 4. End-to-End Flows (FR & Acceptance Test 6 Alignment)

### 4.1 Flow: Select Programme → Checkout → Confirmation

1. **Browse Programmes/Prices**
   - User visits `Priser` or `Programmer` pages.
   - Pricing table (`move-pricing-table`) or programme cards show 6/9/12 month options with clear prices and CTAs.

2. **Select Package**
   - User clicks "Start nå" on chosen package.
   - Theme either:
     - Adds the relevant product (with subscription selling plan pre-selected) to cart and navigates to `/cart`, or
     - Uses direct-to-checkout pattern, passing cart line with subscription.

3. **Checkout**
   - User is taken through Shopify checkout steps:
     - Contact information.
     - Address (minimum required for billing; shipping may be skipped/hidden for digital products).
     - Payment method selection (card/Klarna/Vipps as configured).

4. **Payment**
   - User selects preferred provider:
     - Card (Shopify Payments / Stripe).
     - Klarna (pay later/slice options, where applicable).
     - Vipps (mobile payment for Norwegian customers).

5. **Order & Subscription Creation**
   - On successful payment:
     - Shopify creates an **order** for the digital product.
     - Subscription app creates a **subscription record** for chosen selling plan with correct billing amount and schedule.

6. **Confirmation**
   - User sees Shopify **order confirmation page** with summary.
   - User receives:
     - Order confirmation email.
     - Subscription/app onboarding email(s) with instructions for accessing MOVE app and coaching.

This flow satisfies:
- FR-5 (Add package to cart/checkout), FR-6 (Payment providers), FR-7 (Confirmation).
- Acceptance Test 6 (select programme → checkout → pay → confirmation, with providers configured).

### 4.2 Flow: Subscription Access & Management

1. **Account Access**
   - Customer returns to site and clicks "Min konto"/"Min side".
   - Logs in to Shopify customer account (`/account`).

2. **View Subscription**
   - From account, customer sees:
     - Orders.
     - Link to **subscription portal** (via subscription app integration).

3. **Manage Subscription**
   - In portal, customer can:
     - View active coaching subscription(s).
     - Check billing dates and amounts.
     - Update payment method (if supported).
     - Cancel/pause/change plan (subject to app and business rules).

This aligns with:
- FR-10 (Subscription access) and the requirement that an active subscriber can see their subscriptions and billing.

### 4.3 Edge Cases & Error Handling (Conceptual)

- If payment fails:
  - Checkout shows error; no subscription record should be created.
  - Customer can retry payment or choose another provider.
- If subscription creation fails after order:
  - Subscription app should flag the error.
  - Manual follow-up process should be defined (support workflow), documented in internal ops—not in theme.

---

## 5. Open Assumptions & Decisions to Confirm

- **Subscription app choice**: exact app will determine some details of selling plans and portal UI, but the model above assumes any app compliant with Shopify’s Subscription APIs.
- **Exact price points** and **discount structures** (e.g., oppstartsgebyr vs free month) to be confirmed and configured directly in app + Shopify.
- **Self-service cancellation and upgrade/downgrade rules** to be aligned with legal and business policy and then reflected in FAQ and legal pages.

Once these decisions are made, this spec can be updated with app-specific screenshots and step-by-step admin instructions.