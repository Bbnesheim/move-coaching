# MOVE Coaching – Dawn Sections & Components Spec

This document defines reusable Shopify Dawn sections/components required for the MOVE Coaching site, including their configuration schemas and layout options.

Source-of-truth content references:
- Founder/product copy baseline: `OM_ALINE.md`
- Client-facing product info + policy baseline: `CLIENT_PRODUCT_INFO_AND_POLICIES.md`

## 1. Global Principles

- All sections must be **reusable and configurable** via the Shopify theme editor.
- Content should be **data-driven** (no hard-coded MOVE copy inside Liquid where avoidable).
- Section settings should reference design tokens from `tokens.json` via theme settings/CSS variables wherever possible.
- Copy fields should support Norwegian and be written in MOVE’s tone of voice.

Schema format below is illustrative JSON for `settings` and `blocks` arrays in Dawn section `.liquid` files.

---

## 2. Sections

### 2.1 Hero Section (`move-hero`)

**Purpose**: Primary hero for pages like Home, App, Programme detail, Aline.

**Key features**:
- Two-column layout (text + media).
- Variant support: founder/story hero, product/app hero, campaign hero.
- Primary and secondary CTAs.

**Settings (examples)**:
- `heading` (text, required)
- `subheading` (textarea, optional)
- `primary_cta_label` (text)
- `primary_cta_link` (url)
- `secondary_cta_label` (text, optional)
- `secondary_cta_link` (url, optional)
- `badge_text` (text, optional)
- `layout` (select: `text_left`, `text_right`)
- `background_variant` (select: `default`, `cream`, `brown`, `pink`)
- `image` (image_picker)
- `image_aspect_ratio` (select: `square`, `portrait`, `landscape`)

**Tokens used**:
- `color.semantic.background.*`
- `color.semantic.brand.*`
- `typography.scale.h1`, `.body`, `.button`

---

### 2.2 USP Grid (`move-usps`)

**Purpose**: Show 3–4 key benefits.

**Settings**:
- `heading` (text)
- `intro` (textarea, optional)
- `background_variant` (select: `default`, `cream`, `surface`)
- `columns_desktop` (range: 2–4)

**Blocks (type: `usp`)**:
- `icon` (image_picker or icon select)
- `title` (text)
- `text` (textarea)

---

### 2.3 App Features Grid (`move-app-features`)

**Purpose**: Highlight MOVE app capabilities.

**Settings**:
- `heading` (text)
- `intro` (textarea)
- `background_variant` (select)

**Blocks (type: `feature`)**:
- `icon` (image_picker/icon)
- `title` (text)
- `description` (textarea)

Optional: `app_screenshot` (image_picker) at section level for layout variant with screenshot + bullet list.

---

### 2.4 Testimonials Slider/Grid (`move-testimonials`)

**Purpose**: Show social proof across pages.

**Settings**:
- `heading` (text)
- `style` (select: `slider`, `grid`)
- `background_variant` (select)
- `show_navigation` (checkbox)

**Blocks (type: `testimonial`)**:
- `quote` (textarea)
- `name` (text)
- `role_or_context` (text, optional)
- `image` (image_picker, optional)
- `before_after_label` (text, optional)

---

### 2.5 Gallery Slider (`move-gallery`)

**Purpose**: Before/after gallery, lifestyle photos, app gallery.

**Settings**:
- `heading` (text, optional)
- `background_variant` (select)
- `display_captions` (checkbox)

**Blocks (type: `image`)**:
- `image` (image_picker)
- `caption` (text, optional)
- `tag` (text, optional – e.g., “Før”, “Etter”).

---

### 2.6 Pricing Table (`move-pricing-table`)

**Purpose**: Compare 6/9/12-month packages.

**Settings**:
- `heading` (text)
- `intro` (textarea)
- `highlight_plan_handle` (text or select; optional, to mark recommended plan)
- `show_monthly_price` (checkbox)
- `background_variant` (select)

**Blocks (type: `plan`)**:
- `plan_name` (text)
- `duration_label` (text, e.g., "6 måneder")
- `price_per_month` (text)
- `total_price` (text, optional)
- `badge` (text, optional – e.g., “Mest populær”)
- `description` (textarea)
- `benefits` (textarea, one per line or richtext)
- `primary_cta_label` (text)
- `primary_cta_link` (url or product link)

Note: product selection may later be tied to actual product references; for now schema uses URLs.

---

### 2.7 FAQ Accordion (`move-faq`)

**Purpose**: FAQ pages/sections.

**Settings**:
- `heading` (text)
- `intro` (textarea, optional)
- `background_variant` (select)
- `layout` (select: `single_column`, `two_column`)

**Blocks (type: `question`)**:
- `category` (text, optional)
- `question` (text)
- `answer` (richtext/textarea)

---

### 2.8 Quiz Entry / Lead Capture (`move-quiz-entry`)

**Purpose**: Promote quiz as lead-gen and guidance tool.

**Settings**:
- `heading` (text)
- `body` (textarea)
- `primary_cta_label` (text)
- `primary_cta_link` (url or anchor id)
- `secondary_text` (textarea, optional)
- `background_variant` (select)
- `alignment` (select: `left`, `center`)

Optional: support for embedded quiz iframe/app in later phases.

---

### 2.9 Storytelling Blocks (`move-story-blocks`)

**Purpose**: Aline’s story sections (Where she started → Turning point → Today).

**Settings**:
- `heading` (text, optional)
- `layout` (select: `stacked`, `timeline`)
- `background_variant` (select)

**Blocks (type: `story`)**:
- `title` (text)
- `body` (textarea)
- `image` (image_picker, optional)
- `emphasis_quote` (text, optional)

---

### 2.10 CTA Strip (`move-cta-strip`)

**Purpose**: Full-width CTA band reused across pages.

**Settings**:
- `heading` (text)
- `body` (textarea, optional)
- `primary_cta_label` (text)
- `primary_cta_link` (url)
- `secondary_cta_label` (text, optional)
- `secondary_cta_link` (url, optional)
- `background_variant` (select)
- `align` (select: `center`, `left`)

---

### 2.11 Content Section / Rich Text (`move-content`)

**Purpose**: Generic rich-text content blocks for legal, blog intros, explanations.

**Settings**:
- `heading` (text, optional)
- `content` (richtext)
- `background_variant` (select)
- `max_width` (select: `narrow`, `default`, `wide`)

---

### 2.12 App + Coaching Flow (`move-steps`)

**Purpose**: 3-step visual flows (e.g., How app + coaching work, onboarding).

**Settings**:
- `heading` (text)
- `intro` (textarea, optional)
- `background_variant` (select)

**Blocks (type: `step`)**:
- `step_label` (text, e.g., "1")
- `title` (text)
- `description` (textarea)

---

## 3. Template-Level Composition

### 3.1 Home

Suggested section order:
1. `move-hero`
2. `move-usps`
3. `move-app-features`
4. `move-content` (founder teaser) or `move-story-blocks` (short variant)
5. `move-testimonials`
6. `move-pricing-table` (summary variant)
7. `move-quiz-entry`
8. `move-faq` (teaser subset)
9. `move-cta-strip` or email capture block

### 3.2 App Page

1. `move-hero` (app-focused)
2. `move-app-features`
3. `move-gallery` (app screenshots)
4. `move-steps` (How app + coaching work together)
5. `move-testimonials` (app-focused subset)
6. `move-cta-strip` (link to programmes/prices)

### 3.3 Priser Page

1. `move-hero` (pricing-focused)
2. `move-pricing-table`
3. `move-content` (What’s included in all packages)
4. `move-content` or `move-usps` (Which package is right for you)
5. `move-content` (payment & practical info)
6. `move-faq` (pricing-related subset)
7. `move-cta-strip`

### 3.4 Programmer Overview

1. `move-hero`
2. `move-usps` (programme benefits)
3. `move-gallery` or `move-testimonials` (transformations)
4. `move-steps` (How programme works over time)
5. `move-cta-strip` (quiz/prices)

### 3.5 Programme Detail

1. `move-hero` (programme-specific)
2. `move-content` (Who this is for)
3. `move-content` or `move-steps` (structure & timeline)
4. `move-usps` (programme-specific benefits)
5. `move-testimonials`
6. `move-pricing-table` (single-plan or small table variant)
7. `move-faq` (programme-specific)
8. `move-cta-strip`

### 3.6 FAQ Page

1. `move-hero`
2. `move-faq` (full list, categorised)
3. `move-cta-strip` (contact/support)

### 3.7 Blog Listing & Detail

**Listing**:
1. `move-hero`
2. Blog-specific list section (can use Dawn default blog section)
3. `move-cta-strip` (newsletter or programme CTA)

**Detail**:
1. Default article header + content
2. `move-cta-strip` (newsletter or programme CTA)
3. Related posts (Dawn default)

### 3.8 Aline Page

1. `move-hero` (portrait + headline)
2. `move-story-blocks` (Where she started → Turning point → Today)
3. `move-content` (Values & philosophy)
4. `move-content` (Credentials)
5. `move-testimonials` (relationship-focused)
6. `move-cta-strip`

### 3.9 Juridisk & Legal Pages

- Use `move-content` sections to structure legal text with clear headings.
- Optional `move-hero` on overview page only.

---

## 4. Implementation Notes

- Each section should declare sensible `presets` in schema for Home/Priser/App etc.
- `background_variant` should map to CSS classes that apply colours from design tokens.
- Typography should rely on global theme settings configured from `tokens.json` mapping.
- Keep logic minimal in sections; avoid coupling to specific product IDs where possible (use handles/links).