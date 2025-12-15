# New Shopify Project – Dawn Base Theme

## 0. Purpose

This document describes a repeatable, end‑to‑end process for starting a brand‑new Shopify project from a blank Dawn theme, setting up the repo and core docs (`RESEARCH.md`, `PRD.md`, `PROMPT.md`, etc.), and taking it to launch.

---

## 1. Prerequisites

1. **Shopify**
   - Shopify Partner account.
   - New development store created for the project (one per client/project).
2. **Local environment**
   - Git installed and configured.
   - Node.js LTS installed.
   - Shopify CLI installed and authenticated.
3. **Access**
   - Confirm owner/collaborator access to the dev store.
   - One primary “project owner” responsible for approvals.

---

## 2. Initialize the Git Repository and Core Docs

1. **Create the repo**
   1. Create a new empty Git repo for the client/project.
   2. Clone it locally.
2. **Create initial documentation skeleton**
   1. `RESEARCH.md`  
      - Capture raw notes: client goals, audience, competitors, inspiration, screenshots, links, and constraints.
   2. `PRD.md`  
      - Summarize what you learned from `RESEARCH.md` into:
        - Problem statement and goals.
        - Target users and primary journeys.
        - Functional requirements (FR‑1, FR‑2, …).
        - Non‑functional requirements (performance, SEO, accessibility, etc.).
        - Success metrics and KPIs.
   3. `PROMPT.md`  
      - System prompt for agents/AI collaborators:
        - How to behave.
        - What documents matter (`PRD.md`, brand guide, etc.).
        - Acceptance tests for each major requirement.
   4. Optional but recommended:
      - `BRAND_GUIDE.md` – colors, typography, imagery, tone of voice.
      - `AGENT_WORKFLOW.md` – who does what (design/dev/QA/content).
      - `sitemap.md` – IA and page list.
3. **Project configuration**
   1. Create `.gitignore` (Shopify artifacts, `node_modules`, build outputs).
   2. Optionally add a repo‑specific rules file (e.g. `WARP.md`) with conventions.
   3. Make an initial commit: `chore: bootstrap project docs and structure`.

---

## 3. Set Up the Dev Store and Install Dawn

1. **Create and configure the dev store**
   1. In the Shopify Partner dashboard, create a new development store for this project.
   2. Set store name and URL slug consistent with the repo name.
2. **Install Dawn**
   1. In the store’s **Theme library**, add the latest Dawn theme from the Theme Store.
   2. Duplicate Dawn:
      - Original: keep as `Dawn (vanilla backup)`.
      - Working copy: rename to `<Client> – Dawn base`.
3. **Configure basic store settings**
   1. General info: store name, default language, time zone, currency.
   2. Payment test mode: enable test mode or test payment gateways.
   3. Shipping/taxes: configure minimal setup suitable for development.

---

## 4. Connect Shopify Theme to the Repo (Dawn Base)

1. **Create local theme folder**
   - From the repo root, create a `theme/` folder (or similar) to hold the theme code.
2. **Initialize Shopify CLI in the project**
   1. Log in to Shopify from the CLI:
      ```bash
      shopify login
      ```
   2. Connect to the dev store:
      ```bash
      shopify switch --store <your-dev-store.myshopify.com>
      ```
3. **Pull the working Dawn theme into the repo**
   1. Get the theme ID for `<Client> – Dawn base` from the Shopify admin.
   2. From `theme/`, pull the theme:
      ```bash
      shopify theme pull --theme-id=<ID>
      ```
   3. Commit this as `chore: import base Dawn theme`.
4. **Establish local dev workflow**
   1. For live development:
      ```bash
      shopify theme dev
      ```
   2. For pushing changes:
      ```bash
      shopify theme push --theme-id=<ID>
      ```

---

## 5. Research and Product Definition Phase

1. **Use `RESEARCH.md` to capture:**
   - Business model and offerings.
   - Target segments and main pains/goals.
   - Competitor examples (screenshots, URLs, notes).
   - Brand references (logos, colors, fonts, copy tone).
2. **Use `PRD.md` to lock in:**
   - Exact product types (physical, digital, subscriptions).
   - Required pages and funnels (homepage → pricing → checkout, etc.).
   - Checkout/payment providers and legal requirements.
   - Performance/SEO/accessibility targets.
3. **Update `PROMPT.md`:**
   - Map each FR/NFR to an Acceptance Test.
   - Define how agents or future devs should interpret these tests.

---

## 6. IA, Sitemap, and Wireframes

1. **Create `sitemap.md`**
   1. List all pages and their hierarchy.
   2. Define global navigation and footer structure.
2. **Draft text‑based wireframes** (within `sitemap.md` or separate files)
   1. For each key page, outline sections in order:
      - Hero, USP grid, product highlights, testimonials, FAQ, etc.
   2. Mark primary and secondary CTAs for each page.
3. **Align IA with Dawn**
   1. Map each planned section to:
      - Existing Dawn sections.
      - New custom sections you will build.
   2. Note where you’ll need new templates, alternate templates, or metafield‑driven content.

---

## 7. Theme Architecture and Customization Plan

1. **Decide customization strategy**
   1. What stays “pure Dawn” (header, footer, basic product pages)?
   2. What becomes custom sections/templates (stories, pricing grid, app features, etc.)?
2. **Design tokens and brand guide**
   1. Capture the brand system in `BRAND_GUIDE.md`.
   2. Optionally create a `tokens.json` or similar mapping (colors, typography, spacing).
3. **Document technical plan**
   1. In this doc or a separate `IMPLEMENTATION_PLAN.md`, list:
      - Custom sections and their settings schema.
      - Mapping of tokens → theme settings.
      - Any app integrations (subscriptions, reviews, quiz, CRM).

---

## 8. Implement the Theme (Dawn Derivative)

1. **Set up branch structure**
   1. `main` (stable).
   2. Feature branches: `feat/<short-summary>`, `fix/<short-summary>`, etc.
2. **Implement custom sections**
   1. For each planned section:
      - Add a new file under `sections/`.
      - Define schema (blocks, settings, presets).
      - Wire in brand tokens/theme settings.
   2. Keep sections reusable across pages (no page‑hardcoded content).
3. **Adjust templates and layout**
   1. Configure each page template to use your new sections.
   2. Add additional templates if needed (e.g., alternate product template, pricing page).
4. **Configure theme settings**
   1. Colors, typography, buttons, spacing.
   2. Header/footer configuration as per IA and brand guide.

---

## 9. Products, Apps, and Configuration

1. **Create products and collections**
   1. Mirror what’s described in `PRD.md`.
   2. Use metafields for structured content that sections will consume.
2. **Apps and integrations**
   1. Subscriptions, reviews, CRM/email, quiz, etc.
   2. Document each app and its role in `PRD.md` or a separate `INTEGRATIONS.md`.
3. **Payment, shipping, and taxes**
   1. Configure providers and methods per project requirements.
   2. Confirm test/payment flows work end‑to‑end.

---

## 10. Analytics, SEO, and Legal

1. **Analytics**
   1. Implement GA4 (and/or Tag Manager) according to the measurement plan.
   2. Ensure all key events (view, add to cart, checkout start, purchase, lead/quiz completion) are tracked.
2. **SEO**
   1. Configure meta titles/descriptions for key pages.
   2. Implement structured data (JSON‑LD) for products, articles, and services where relevant.
3. **Legal**
   1. Privacy policy, terms, cookie policy (pages and footer links).
   2. Cookie banner and consent text appropriate to the region.

---

## 11. QA, Performance, and Accessibility

1. **QA checklist**
   1. Navigation and IA.
   2. Forms and CTAs.
   3. Cart and checkout flows.
   4. App integrations.
2. **Performance**
   1. Run Lighthouse on key pages (mobile first).
   2. Optimize images, critical CSS, and avoid unnecessary scripts.
3. **Accessibility**
   1. Keyboard navigation, focus states, and ARIA where needed.
   2. Color contrast and alternative text on images.

---

## 12. Launch and Post‑Launch

1. **Pre‑launch**
   1. Final content review and proofing.
   2. Domain connection and SSL.
   3. Remove any test products/orders you don’t want visible.
2. **Launch**
   1. Publish the theme.
   2. Monitor analytics and logs for issues in the first days.
3. **Post‑launch iteration**
   1. Use real data to refine copy, layout, and offers.
   2. Keep `PRD.md` and other docs up to date when changes are made.
