# MOVE Coaching – Brand Guide

## 1. Brand Essence

MOVE Coaching is a personal-brand–driven digital coaching business founded by **Aline Skancke Olsen**. The brand is warm, empathetic, and realistic, focused on long-term lifestyle change rather than quick fixes. Communication should feel like a supportive, honest conversation between Aline and the visitor.

Key principles:
- **Warm & empathetic**: Speak to the visitor’s real life, responsibilities, and emotional load.
- **Realistic, no quick fixes**: Emphasise sustainable change, routines, and long-term coaching.
- **Personal & story-led**: Aline’s journey is central; show real transformations and behind-the-scenes.
- **Focused on women in the tidsklemma**: Acknowledge time pressure, family, and work.

## 2. Colour Palette

Base palette from PRD:

- **Primary Brown** – `#5C4842`
  - Role: Core brand colour for headings, key accents, and primary CTAs on light backgrounds.
  - Usage: Primary buttons, section headings, navigation text, key icons.
- **Secondary Pink** – `#F5B5C4`
  - Role: Support/brand accent for highlights, badges, pills, subtle backgrounds.
  - Usage: Highlight boxes, secondary buttons, chips, subtle section backgrounds.
- **Background Cream** – `#F9F5F0`
  - Role: Default page background for a warm, calm feel.
  - Usage: Body background, large hero areas, neutral sections.
- **Text Dark Grey** – `#2F2E2B`
  - Role: Main body text and high-contrast UI text.
  - Usage: Paragraphs, labels, long-form content, and legal text.

Recommended semantic mapping for UI (to be reflected in `tokens.json`):

- `color.background.default` → Background Cream `#F9F5F0`
- `color.background.surface` → White or very light cream (e.g., `#FFFFFF` or `#FDF9F4`) for cards and sections
- `color.text.primary` → Text Dark Grey `#2F2E2B`
- `color.text.inverse` → Background Cream or white on dark backgrounds
- `color.text.muted` → Text Dark Grey with reduced opacity (e.g., 70%)
- `color.brand.primary` → Primary Brown `#5C4842`
- `color.brand.secondary` → Secondary Pink `#F5B5C4`
- `color.border.subtle` → Slightly darker cream or light grey derived from palette
- `color.state.success` / `color.state.warning` / `color.state.error` → To be derived from Shopify/Dawn defaults but styled to harmonise with the palette.

Guidelines:
- Maintain sufficient contrast, especially for text on cream and pink backgrounds.
- Prefer warm, low-saturation backgrounds; avoid stark white everywhere.
- Use Secondary Pink sparingly for emphasis so it retains impact.

## 3. Typography

From PRD and PROMPT (updated):
- **Headings**: Black Mango–style display serif.
- **Body**: Poppins–style geometric sans serif.

Recommended mapping for implementation:

- Heading font family (CSS):
  - `font-family: "Black Mango", serif;`
- Body font family (CSS):
  - `font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`

Typographic hierarchy (approximate sizes for web, mobile-first):

- H1 – Main page hero heading
  - Desktop: 40–56px, line-height ~1.1–1.2, weight 600–700 (serif).
  - Mobile: 32–40px.
  - Usage: Primary hero headings on Home, App, Programmes, Aline.
- H2 – Section headings
  - Desktop: 32–40px, line-height ~1.2, weight 600 (serif).
  - Mobile: 24–28px.
  - Usage: Major content sections (USPs, Pricing, Testimonials, FAQ).
- H3 – Sub-section headings / card titles
  - Desktop: 24–28px, line-height ~1.3, weight 500–600 (serif or sans depending on context).
  - Mobile: 20–22px.
  - Usage: Card titles, feature titles, FAQ categories.
- Body / paragraph
  - Desktop & mobile: 16–18px, line-height ~1.5–1.7, weight 400 (sans).
  - Usage: All standard copy blocks, FAQ answers, legal content.
- Small text / meta
  - 14px, line-height ~1.4–1.6.
  - Usage: Labels, captions, meta info under testimonials, legal footers.
- Buttons / CTAs
  - 16px uppercase or title-case sans, medium/semibold weight.

Guidelines:
- Keep headings relatively tight to support a premium editorial look.
- Use generous line-height on body to maintain readability, especially on cream backgrounds.
- Avoid using serif fonts for long paragraphs; reserve serif primarily for headings and key pull quotes.

## 4. Imagery & Media

Imagery themes:
- **Real people and real transformations**: Before/after stories, everyday scenarios, not stocky “fitness model” clichés.
- **Family-friendly food**: Meals that look realistic, budget-conscious, and family-oriented.
- **Lifestyle over perfection**: Photos that feel lived-in, with warmth and relatability.
- **App screenshots**: Clean, on-brand screenshots that highlight features like menu planning, workouts, and progress.

Guidelines:
- Backgrounds should lean into warm beige/cream tones; avoid cold, clinical whites or highly saturated neon colours.
- Use soft natural light where possible; avoid harsh, high-contrast studio lighting.
- When showing before/after content, be respectful and empowering—focus on energy, confidence, and everyday wins.
- Use app mockups sparingly but clearly to communicate digital product value.

Placement patterns:
- Heros often pair a strong portrait of Aline or a representative client with bold serif heading and a clear CTA.
- Use galleries/sliders for testimonials, before/after, and app feature walkthroughs.
- Avoid cluttered collages; opt for simple, focused compositions with breathing room.

## 5. Social Presence

Primary organic channels today:
- **Instagram – Aline (founder)**: `@coach.alineskk`  
  - URL: https://www.instagram.com/coach.alineskk/
  - Role: Personal story, hverdagsglimt, før/etter, reels og nær kommunikasjon med følgerne.
- **Instagram – MOVE Coaching (brand)**: to be confirmed.  
  - When available, document handle + URL here and mirror in `analytics_seo_crm.md`.

Guidelines:
- Bruk samme tone som på nettsiden: varm, ærlig, realistisk og uten quick‑fix‑lovnader.
- Del ekte hverdagsinnhold (mat, familie, trening, energi) fremfor polerte «fitness»-bilder.
- Lenker fra bio bør peke til viktigste landingssider (Home, Priser, Quiz, App) og oppdateres ved kampanjer.

## 6. Tone of Voice

Core attributes:
- **Direct and motivational**: Encourage action without being aggressive.
- **Empathetic and understanding**: Acknowledge struggles with time, energy, and emotional eating.
- **Realistic**: Make it clear that this is about long-term change, not quick fixes.
- **Personal**: Use “jeg”, “du”, “vi” in Norwegian copy and speak as Aline where appropriate.

Examples – DO:
- “Kjenner du på dårlig samvittighet hver gang du velger den enkle løsningen til middag?”
- “Jeg vet hvordan det føles å stå fast – derfor bygger vi nye vaner steg for steg.”
- “Du trenger ikke være perfekt. Du trenger bare å møte opp for deg selv litt oftere.”

Examples – DON’T:
- “Gå ned X kilo på 4 uker med denne dietten!”
- Overly clinical or corporate language.
- Shaming or guilt-based messaging.

Practical guidelines:
- Lead with the visitor’s situation and feelings, then present MOVE’s method as a supportive path.
- Use rhetorical questions to mirror what the visitor is already thinking.
- Balance warmth with clarity around commitment (6/9/12 måneder, oppfølging, struktur).

## 6. Layout & Component Patterns (for Dawn)

Key layout principles:
- **Clear hierarchy**: Each page should have a single primary CTA and a clear flow from story → proof → offer → action.
- **Chunked content**: Use sections and cards to break long content into scannable blocks.
- **Repetition with variation**: Reuse global components (USPs, testimonials, app features) across pages for consistency.

Core components / sections (to be implemented as Dawn sections):
- **Hero section**
  - Elements: H1, short supporting text, primary CTA (e.g., “Start nå”), optional secondary CTA (e.g., “Ta quizen først”), portrait or lifestyle image.
  - Variants: Founder-focused hero, app-focused hero, campaign hero.
- **USP grid**
  - Elements: 3–4 key benefits with icons/illustrations, short headings, and 1–2 lines of copy.
  - Usage: Early on Home; can be reused on Programmes and App pages.
- **App features section**
  - Elements: Feature list (menu planning, family meals, trening med video, wearables, ukentlige check-ins, kursbibliotek), icons, and app screenshots.
- **Testimonials & transformations**
  - Elements: Quotes, names (first name + initial), optional photos, before/after stories.
  - Layout: Slider or multi-column grid.
- **Pricing table**
  - Elements: Columns for 6/9/12-month packages with price per month, total duration, highlights, and primary CTAs.
  - Visuals: Emphasise recommended plan (e.g., 9 eller 12 måneder) with subtle highlight.
- **FAQ accordion**
  - Elements: Questions and answers covering logistics, betaling, bindingstid, app-tilgang, support.
- **Quiz entry / lead capture section**
  - Elements: Headline, short explanation, CTA button (“Ta quizen”), optional short list of what they get by taking the quiz.
- **Storytelling sections for Aline**
  - Elements: Timeline or stacked sections (Hvor hun startet → Vendepunktet → I dag) with copy and photos.

Spacing & rhythm:
- Use generous vertical spacing between sections to maintain calm, breathable layouts.
- Inside cards and sections, maintain consistent padding based on the spacing scale in `tokens.json` (e.g., small: 12–16px, medium: 24px, large: 32–40px).

## 7. Accessibility & Inclusivity

- Ensure sufficient colour contrast between text and backgrounds; adjust shades if needed to meet WCAG 2.1 AA for key text.
- Use meaningful heading hierarchy (H1–H3) in templates; avoid skipping levels purely for visual reasons.
- Provide descriptive alt text for imagery, especially for before/after and app screenshots where content matters.
- Ensure buttons and links have clear, action-oriented labels (avoid “Les mer” alone where possible; prefer “Les mer om programmet”).
- Avoid copy that reinforces shame or unrealistic body standards; focus on energy, health, confidence, and daily life.

## 8. Implementation Notes for Dawn

- Connect `tokens.json` to Dawn settings and section styles where practical (e.g., use brand colours for `--color-accent`, typography tokens for heading/body styles).
- Prefer Dawn’s native section patterns for layout (grid, split, collage) and adapt with brand styles instead of building entirely custom layouts.
- Keep custom CSS scoped and minimal; rely on tokens and theme settings rather than hard-coded values spread across templates.
- When adding new sections, ensure they are configurable via the Shopify theme editor (content, layout, and background variants) instead of being single-use.

## 9. Layout, UX & Content Guidelines (inspired by best-in-class coaching sites)

This section captures learnings from auditing best-in-class online coaching brands and translates them into concrete guidelines for MOVE Coaching. Use this as inspiration for structure, messaging, and UX – always implemented with MOVE’s own brand essence, colour palette, typography, and CSS rulings.

### 9.1 Overall positioning & narrative

- Lead with a clear, outcome-oriented promise in the hero, focused on sustainable weight loss and long-term lifestyle change, tidsklemma, and a Norwegian audience.
- Pair the hero headline with a short, supportive subheading that frames the offer as guidance and support, not a quick fix.
- Ensure the founder story (Aline) is prominent and story-led, mirroring how a founder’s personal journey and transformation can be made central across pages.
- Use a consistent narrative spine: visitor’s struggle → founder’s similar past struggle → method that works → invitation to join.

### 9.2 Social proof & community

- Use persistent, high-level social proof near the top of key pages, with a concise summary metric (e.g., total members helped, routines established, meals planned, years of coaching) rather than only kilos lost.
- Create a dedicated community / testimonials page that aggregates longer-form social proof: quotes, mini-stories, and before/after narratives.
- On the home page, feature a shorter testimonial carousel or grid section directly under the hero, reusing the same quotes for consistency.
- For each testimonial, include:
  - Name (first name + initial) and optionally age/role (e.g., “smallbarnsmor, 36”).
  - 1–3 sentence quote focused on sustainable change, routines, or energy – avoid purely weight-number bragging.
- Encourage community language that emphasises support, belonging, and that change happens together, adapted to Norwegian and MOVE’s tone of voice.

### 9.3 Program structure & feature communication

- Use a “How it works / What we’re offering” section on the home page that clearly lists the main pillars of the coaching programme, similar to clear breakdowns used on other successful coaching sites (meal plans, workouts, tracking, check-ins, habits, community).
- For MOVE, reflect our actual pillars, e.g.:
  - Planlagt, familievennlig mat og menyer.
  - Trening og aktivitet tilpasset tidsklemma.
  - Ukentlige check-ins og støtte.
  - Vaner, søvn og stressmestring.
  - App-funksjoner (tracking, kurs, påminnelser, etc.).
- Present features as benefits-first: a short heading (benefit) + 1–2 lines of explanatory copy, aligned with our “no quick fixes” and realistic framing.
- Use a simple icon + text layout or Dawn’s feature grid for this section; keep copy scannable.

### 9.4 Recipes, food, and “no restriction” framing

- Emphasise “delicious recipes you’ll love” and “no restrictions” in a way that reflects MOVE’s focus on balance, everyday Norwegian food, and realistic portions.
- On relevant pages (Home, App, or Program), include a small grid of 4–8 example meals or recipes with:
  - Descriptive, appetising names.
  - Simple meta info (e.g., kcal or key attributes like “familievennlig”, “15 min”, “billig”).
- Use this section to visually break up the page and show that the method is enjoyable and sustainable, not a rigid diet.
- Avoid glorifying ultra-low calorie counts; focus on satiety, family-friendliness, and flexibility.

### 9.5 Founder & team presentation

- Mirror the strength of well-structured About + Team pages by dedicating sections to Aline’s story and any supporting coaches/experts.
- For Aline:
  - Use a section structure similar to strong “I tried everything”-style stories: past struggle → turning point → process → current mission.
  - Include at least one strong pull-quote that encapsulates her philosophy (e.g., “I never focused on setting a weight loss goal, I just wanted to be healthy and feel good in my body.”).
- For team/coaches (if applicable):
  - Provide short bios with qualifications, location, and a 2–4 sentence personal story tying their expertise to MOVE’s mission.
  - Use consistent patterns for headings (Coach name) and subheadings (credentials) as seen on strong coaching team pages.
  - Include accessible, descriptive alt text for headshots (e.g., “Headshot of [name], MOVE coach”).

### 9.6 CTAs, flows, and forms

- Ensure every primary page has one clear, repeated CTA pattern, with short, motivational labels (e.g., “Start din dag én”, “Book en uforpliktende prat”, “Start quizen”).
- For MOVE, define 1–2 core CTA labels and reuse them consistently across sections and pages.
- Place a strong CTA near:
  - The hero (above the fold).
  - After key social proof sections (testimonials, results, community).
  - Near the bottom of each page, paired with a simple motivational line.
- Keep forms lean and high-intent:
  - Only ask for the minimum fields needed (e.g., navn, e‑post, evt. telefon) unless it’s a more specialised flow like applying for a coaching role.
  - Use clear field labels and helper text; avoid jargon.

### 9.7 Page structure & section ordering

- The MOVE home page should roughly follow this flow (inspired by best-in-class coaching sites but adapted to our content):
  1) Hero: core promise + key CTA.
  2) Social proof snapshot (metrics + 2–3 short testimonials).
  3) “How it works” / programme pillars.
  4) Recipes/food or “Everyday life” section visualising lifestyle.
  5) Founder story (Aline) + pull-quote.
  6) Optional: Team/coaches preview with link to full team page.
  7) Strong CTA section (“Start din dag én”) with short motivational copy.
  8) Newsletter or low-friction lead capture.
- Community/testimonials page should:
  - Start with a short intro heading (e.g., “Dette sier kvinnene i MOVE Coaching”) and 2–3 sentences of framing.
  - Present testimonials in a structured layout (cards or quotes) with clear attribution.
  - End with a CTA back into the main conversion flow (e.g., quiz, prices, or application).

### 9.8 Accessibility & UX lessons from the audit

- Avoid duplicating navigation lists and content purely for layout purposes; ensure screen readers don’t encounter the same menu or testimonial looped multiple times, as can happen on some sites.
- Keep long testimonial and story copy broken into paragraphs or shorter highlights so they’re easier to scan on mobile.
- Maintain our existing accessibility guidelines (Section 7) and extend them to:
  - Provide descriptive alt text for all key imagery (founder, team, transformations, recipes).
  - Ensure CTAs and forms are fully keyboard navigable and labelled.

These guidelines should be used as a reference when designing or updating sections and templates in the MOVE theme, borrowing strong patterns from modern coaching and fitness brands while staying true to MOVE’s own brand values, CSS rulings, and colour system.
