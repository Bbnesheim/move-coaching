# Existing Shopify Theme Takeover – Unlaunched Store

## 0. Purpose

This document describes a structured process for taking over an existing but unlaunched Shopify store that already uses a default theme (often Dawn or another free theme), and bringing it under a clean repo and documentation workflow.

---

## 1. Access, Safety, and Backups

1. **Access**
   1. Get collaborator access with theme and app permissions.
   2. Ensure you have access to the store owner or decision‑maker for approvals.
2. **Freeze the current state**
   1. Ask the client to pause any theme editing in the Admin while you take over.
3. **Backup themes**
   1. From the Theme library:
      - Duplicate the current “main working” theme → rename to `<Client> – Backup (do not edit)`.
   2. Download a copy of each important theme as a `.zip` and store it safely (outside Git or in a `backups/` folder ignored by `.gitignore`).
4. **Backup data**
   1. Export products, customers, and orders (if any) to CSV as a safety net.
   2. Document any critical apps and their current configuration.

---

## 2. Initialize the Repo Around the Existing Theme

1. **Create a new repo**
   1. Name it clearly for the client/project.
   2. Initialize Git and push to your hosting provider.
2. **Set up structure**
   1. Create a `theme/` folder for the pulled theme.
   2. Add `.gitignore` (ignore `node_modules`, build artifacts, large exports, raw `.zip` backups).
3. **Connect Shopify CLI and pull the active theme**
   1. Log in:
      ```bash
      shopify login
      shopify switch --store <client-store.myshopify.com>
      ```
   2. From `theme/`, pull the theme you are taking over (usually the one closest to launch):
      ```bash
      shopify theme pull --theme-id=<ID>
      ```
   3. Commit as `chore: import existing client theme baseline`.
4. **Create core documentation skeleton**
   1. `RESEARCH.md` – start with:
      - What’s already implemented?
      - Notes from client about current issues/frustrations.
      - Screenshots of current pages and flows.
   2. `PRD.md` – capture the target:
      - What the client wants this store to do after the takeover.
      - What is in scope vs out of scope.
   3. `PROMPT.md` – define acceptance tests and working conventions.
   4. Optional: `BRAND_GUIDE.md`, `AGENT_WORKFLOW.md`, `sitemap.md` based on what you discover.

---

## 3. Discovery and Audit of the Existing Store

1. **Theme audit**
   1. Identify the base theme (Dawn or another).
   2. List:
      - Custom sections (`sections/` files that are not part of the vanilla theme).
      - Custom snippets and templates.
      - Any inline script tags or third‑party script includes.
   3. Note bad smells:
      - Hard‑coded copy where it should be dynamic.
      - Heavily duplicated code or layout logic.
2. **Content and IA audit**
   1. List all visible pages, templates, and navigation items.
   2. Document the actual IA in `sitemap.md` and compare with what the client says they want.
3. **Apps and integrations audit**
   1. List all installed apps, what they do, and which theme files they’ve touched.
   2. Note any that can or should be removed or replaced.
4. **Performance and accessibility snapshot**
   1. Run Lighthouse on the current theme (staging).
   2. Note major warnings (blocking scripts, layout shifts, missing alt text, etc.).

---

## 4. Clarify Goals and Scope with the Client

1. **Present findings**
   1. Summarize the current state:
      - What works.
      - What’s broken.
      - What’s confusing or inconsistent.
   2. Use screenshots and short notes.
2. **Define target state in `PRD.md`**
   1. Confirm:
      - Which user journeys matter most.
      - Required redesign vs light touch.
      - Any changes in product strategy, pricing, or markets.
3. **Decide: keep theme vs re‑base on Dawn**
   1. If the existing theme is messy or inflexible, propose migrating to a clean Dawn base.
   2. If the existing theme is OK, plan an incremental refactor instead of a full rebuild.

---

## 5. Normalize the Project Structure

1. **Align documentation**
   1. Ensure `RESEARCH.md`, `PRD.md`, `PROMPT.md`, and (if you use them) `BRAND_GUIDE.md`, `AGENT_WORKFLOW.md`, and `sitemap.md` are present and up‑to‑date.
2. **Create an implementation plan** (optional `IMPLEMENTATION_PLAN.md`)
   1. List phases:
      - Cleanup and bugfixes.
      - IA and navigation adjustments.
      - Section and template refactors.
      - App integrations (add/remove/migrate).
      - Analytics/SEO work.
      - QA and launch.
   2. For each phase, define:
      - Goals.
      - Concrete tasks.
      - Acceptance tests.

---

## 6. Implement Changes Safely

1. **Use a dedicated theme for development**
   1. Duplicate the client’s current working theme → name it `<Client> – Dev`.
   2. Only connect CLI to this dev theme while implementing changes.
2. **Branching workflow**
   1. Create feature branches for changes (`feat/`, `fix/`, etc.).
   2. Keep commits scoped and documented.
3. **Priority order for changes**
   1. Stability and bugs first:
      - Fix obvious issues that break flows (navigation, checkout blockers).
   2. IA and navigation:
      - Adjust menus, footer, and page structure to match `sitemap.md`.
   3. Theme refactors:
      - Extract repeated layout into reusable sections/snippets.
      - Remove unused sections and templates.
   4. Branding:
      - Align colors, typography, and content with `BRAND_GUIDE.md`.
   5. Apps and integrations:
      - Integrate or replace apps.
      - Remove unused apps and their scripts.
4. **Sync changes back to the dev theme**
   1. Run:
      ```bash
      shopify theme push --theme-id=<dev-theme-id>
      ```
   2. Verify changes in the browser each step of the way.

---

## 7. Analytics, SEO, and Legal for Takeover Projects

1. **Clean up tracking**
   1. Identify any old GA/Pixel/Tag Manager setups.
   2. Remove duplicates and keep one coherent analytics configuration.
2. **Implement a fresh measurement plan**
   1. Align GA4 events with new flows from `PRD.md`.
   2. Validate events in real time in GA4.
3. **Fix SEO basics**
   1. Page titles, meta descriptions, H1 usage.
   2. Canonical tags and structured data if relevant.
4. **Verify legal compliance**
   1. Ensure legal pages exist and are linked.
   2. Confirm cookie banner and consent text.

---

## 8. QA, UAT, and Launch

1. **Internal QA**
   1. Run through defined user journeys and acceptance tests.
   2. Check on multiple devices and browsers where relevant.
2. **Client UAT**
   1. Create a UAT checklist from `PRD.md`.
   2. Share a preview link of the dev theme with the client.
   3. Collect feedback and triage into must‑fix vs post‑launch.
3. **Launch**
   1. Once approved, publish the dev theme as the live theme.
   2. Confirm domain, redirects, and analytics are working.
4. **Post‑launch cleanup**
   1. Remove obsolete themes and apps (after a safe period).
   2. Archive this takeover guide and implementation plan as part of project docs for future maintainers.
