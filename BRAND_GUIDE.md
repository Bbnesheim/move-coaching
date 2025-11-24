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

From PRD and PROMPT:
- **Headings**: Playfair Display / DM Serif Display–style serif.
- **Body**: Inter / Lato / Open Sans–style sans serif.

Recommended mapping for implementation:

- Heading font family (CSS):
  - `font-family: "Playfair Display", "DM Serif Display", serif;`
- Body font family (CSS):
  - `font-family: "Inter", "Lato", "Open Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`

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

## 5. Tone of Voice

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
