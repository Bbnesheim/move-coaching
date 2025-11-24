# MOVE Coaching – Analytics, SEO & CRM/Lead Capture Spec

This document defines GA4 tracking, SEO metadata and structured data, and CRM/lead capture patterns for the MOVE Coaching Shopify site.

## 1. GA4 Analytics Model

### 1.1 Core Events

Events to track (names can follow GA4 recommended patterns):

- **Page views**
  - `page_view` (standard GA4 event).
  - Automatically handled by GA4 script/GTAG; ensure page titles and paths are meaningful.

- **Add to cart / select plan**
  - `add_to_cart` with parameters:
    - `item_id` (product handle/ID).
    - `item_name` (product name).
    - `price`.
    - `subscription_type` (e.g., `6m`, `9m`, `12m`).

- **Begin checkout**
  - `begin_checkout` when user reaches `/checkout`.

- **Purchase**
  - `purchase` with Shopify GA4 integration or GTM e-commerce events.

- **Quiz interactions**
  - `quiz_start`
    - Parameters: `quiz_id` (e.g., `move-coaching-main`), optional `entry_point` (`home`, `pricing`, etc.).
  - `quiz_step`
    - Parameters: `quiz_id`, `step_number`, `step_key`.
  - `quiz_complete`
    - Parameters: `quiz_id`, `result_type` (if applicable).

- **Key CTA clicks**
  - `select_content` or custom event `cta_click` for:
    - `cta_type` (`start_now`, `see_prices`, `take_quiz`, `see_app`, `see_story`).
    - `page` (e.g., `home`, `priser`, `programmer_detail`).

- **Lead capture**
  - `generate_lead` for:
    - Newsletter signup.
    - Quiz email submission.
  - Parameters: `source` (`newsletter_home`, `quiz`, `footer_form`).

### 1.2 Implementation Options

Two main patterns:

1. **Direct GA4 gtag in theme**
   - Add GA4 `gtag.js` snippet in theme `theme.liquid` or GA4 integration app.
   - Trigger events via inline scripts or `data-` attributes + small JS module.

2. **Google Tag Manager (preferred for flexibility)**
   - Add GTM container to theme.
   - Push events into `dataLayer` from theme sections.
   - Configure GA4 events inside GTM UI.

### 1.3 Data Layer Design (for GTM)

When user clicks CTAs or interacts with quiz:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'cta_click',
  cta_type: 'start_now',
  page: 'priser',
  plan: '12m'
});
```

For quiz events:

```js
window.dataLayer.push({
  event: 'quiz_start',
  quiz_id: 'move-coaching-main',
  entry_point: 'home_hero'
});

window.dataLayer.push({
  event: 'quiz_complete',
  quiz_id: 'move-coaching-main',
  result_type: 'full_lifestyle_change'
});
```

### 1.4 Mapping to PRD Requirements

- `page_view` – covers general traffic and page performance metrics.
- `add_to_cart`, `begin_checkout`, `purchase` – map to core conversion funnel (FR-23/24).
- `quiz_start`, `quiz_complete` – support quiz KPIs (start/completion rates, engagement).
- `generate_lead` – supports email/lead capture KPIs.

---

## 2. SEO Metadata

### 2.1 General Guidelines

- Use Norwegian headings and copy.
- Include brand name **MOVE Coaching** where appropriate.
- Keep titles ~50–60 characters, descriptions ~130–160 characters.
- Align with tone of voice: motivational, empathetic, realistic.

### 2.2 Example Meta Titles & Descriptions

**Home**
- Title: `MOVE Coaching – Langsiktig livsstilsendring med støtte` 
- Description: `Langsiktig livsstilsendring uten quick fixes. MOVE Coaching og Aline Skancke Olsen hjelper deg med mat, trening og rutiner som faktisk passer hverdagen din.`

**Priser**
- Title: `Priser på coaching – 6, 9 og 12 måneder | MOVE Coaching`
- Description: `Velg coachingprogram som passer din hverdag: 6, 9 eller 12 måneder med personlig oppfølging, MOVE-appen og familievennlig mat. Se priser og hva som er inkludert.`

**Programmer (oversikt)**
- Title: `Coachingprogrammer for varig endring | MOVE Coaching`
- Description: `Utforsk coachingprogrammene til MOVE Coaching – struktur, støtte og app-tilgang for deg som vil ha varig livsstilsendring.`

**Programmer – 12 mnd detail (example)**
- Title: `12 måneder – Full livsstilsendring | MOVE Coaching`
- Description: `For deg som vil bygge varige vaner med tett oppfølging. 12 måneder med coaching, MOVE-appen, familievennlige oppskrifter og trening tilpasset hverdagen.`

**App**
- Title: `MOVE-appen – Mat, trening og rutiner på ett sted`
- Description: `Planlegg menyen, finn raske familievennlige oppskrifter, følg treningsøkter med video og hold oversikt i MOVE-appen – verktøyet som følger deg i hverdagen.`

**FAQ**
- Title: `Ofte stilte spørsmål om coaching og app | MOVE Coaching`
- Description: `Svar på vanlige spørsmål om coaching, betaling, bindingstid, MOVE-appen og personvern. Finn ut om MOVE Coaching passer for deg.`

**Aline**
- Title: `Aline Skancke Olsen – Historien bak MOVE Coaching`
- Description: `Les historien om Aline, fra egen kamp med mat og kropp til grunnlegger av MOVE Coaching. Ekte erfaring, ekte endring, uten quick fixes.`

**Blogg (listing)**
- Title: `Blogg – Tips og inspirasjon til hverdagen | MOVE Coaching`
- Description: `Artikler om mat, trening, motivasjon og livsstil for deg som vil ha mer energi og trygghet i hverdagen.`

---

## 3. Structured Data (JSON-LD)

### 3.1 Services / Programmes

Add JSON-LD to programme detail pages using `Service` type:

```json path=null start=null
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "12 måneder – Full livsstilsendring",
  "provider": {
    "@type": "Person",
    "name": "Aline Skancke Olsen"
  },
  "brand": {
    "@type": "Brand",
    "name": "MOVE Coaching"
  },
  "areaServed": "NO",
  "description": "12-måneders digitalt coachingprogram med MOVE-appen, familievennlig mat og tilpasset trening.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "NOK",
    "price": "2499",
    "availability": "https://schema.org/InStock"
  }
}
```

Dynamic values (name, description, price) should be populated from Shopify product data.

### 3.2 Blog Posts

Add JSON-LD for blog article pages:

```json path=null start=null
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Eksempel på blogginnlegg",
  "author": {
    "@type": "Person",
    "name": "Aline Skancke Olsen"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MOVE Coaching"
  },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-01",
  "image": [
    "https://example.com/path/to/featured-image.jpg"
  ]
}
```

Values should be generated from blog post fields (title, author, dates, featured image).

---

## 4. CRM & Lead Capture

### 4.1 Channels

- **Newsletter signup**
  - Placement: Home (optional), footer, Blogg pages.
- **Quiz email capture**
  - At the end of quiz flow, before showing recommended programme.
- **Contact/Support**
  - Via FAQ/contact CTA.

### 4.2 CRM Integration Pattern

Assume an email/CRM platform (e.g., Klaviyo/Mailchimp). Generic approach:

- **Newsletter forms**:
  - Submit email + optional name and goals.
  - Tag: `newsletter`.
- **Quiz leads**:
  - Submit email + key quiz attributes (e.g., main goal, time constraints, obstacles).
  - Tag: `quiz-lead` and specific attributes as custom fields.
- **Flows**:
  - Welcome series for newsletter signups.
  - Follow-up sequence for quiz leads (summary of result + CTA to recommended programme).

### 4.3 GDPR & Consent Language (Conceptual)

- Newsletter form example (Norwegian):
  - Checkbox label: `Ja, jeg vil motta e-poster fra MOVE Coaching med tips, inspirasjon og relevante tilbud.`
  - Link to personvern: `Les personvernserklæringen` (link to `/juridisk/personvern`).

- Quiz form example:
  - Short text: `Ved å legge inn e-posten din samtykker du til å motta resultatet av quizen og oppfølging fra MOVE Coaching. Du kan når som helst melde deg av.`
  - Same link to privacy policy.

Ensure forms are **double opt-in** if CRM/platform or local regulations require it.

### 4.4 Implementation Notes

- For newsletter and quiz forms, either:
  - Use CRM embed forms styled to match site, or
  - Use Shopify forms that trigger API calls/webhooks to CRM.
- Ensure that each lead capture point includes:
  - Clear **purpose** of emails.
  - **Opt-out** information (e.g., “Du kan når som helst melde deg av”).

---

## 5. Alignment with Acceptance Test 7

- GA4: Event model includes page views, add-to-cart, checkout start, purchase, and quiz start/completion.
- SEO: Example titles and descriptions provided for key pages.
- Structured Data: JSON-LD examples for services/programmes and blog posts.

These artefacts satisfy the requirements defined for analytics and SEO in `PROMPT.md` at a specification level; theme implementation will follow this mapping.