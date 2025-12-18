# MOVE Coaching – Dawn Tokens & Theme Settings Mapping

This document describes how to map `tokens.json` design tokens into Shopify Dawn theme settings and CSS variables, for use across custom sections.

## 1. Colors

From `tokens.json`:
- `color.palette.brownPrimary` → brand primary
- `color.palette.pinkSecondary` → brand secondary
- `color.palette.creamBackground` → default background
- `color.palette.textDarkGrey` → primary text

### 1.1 Theme Settings

In `config/settings_schema.json`, define colour settings such as:
- `settings.color_brand_primary` → default `#5C4842`
- `settings.color_brand_secondary` → default `#F5B5C4`
- `settings.color_background_default` → default `#F9F5F0`
- `settings.color_text_primary` → default `#2F2E2B`
- `settings.color_background_surface` → default `#FFFFFF`

### 1.2 CSS Variables

In theme CSS (e.g., `assets/base.css`), expose settings as variables:

```css path=null start=null
:root {
  --color-brand-primary: {{ settings.color_brand_primary }};
  --color-brand-secondary: {{ settings.color_brand_secondary }};
  --color-background-default: {{ settings.color_background_default }};
  --color-background-surface: {{ settings.color_background_surface }};
  --color-text-primary: {{ settings.color_text_primary }};
}
```

Map semantic colours to classes (e.g., `.bg-cream`, `.bg-brown`, `.text-primary`).

## 2. Typography

From `tokens.json`:
- `typography.fontFamily.heading`
- `typography.fontFamily.body`
- `typography.scale.*`

### 2.1 Theme Settings

Expose font selections in `settings_schema.json`:
- `settings.font_heading_family` (text) → default to `"Black Mango", serif`
- `settings.font_body_family` (text) → default to `"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Optionally bind to Shopify font pickers if available; otherwise, treat as custom code + loaded web fonts.

### 2.2 CSS Variables

```css path=null start=null
:root {
  --font-heading: {{ settings.font_heading_family }};
  --font-body: {{ settings.font_body_family }};

  --font-size-h1: 3rem;
  --line-height-h1: 1.15;
  --font-weight-h1: 700;

  --font-size-h2: 2.25rem;
  --line-height-h2: 1.2;
  --font-weight-h2: 600;

  --font-size-body: 1rem;
  --line-height-body: 1.6;
}
```

These values are derived from `typography.scale` and can be refined as needed.

Apply to headings and body via utility classes or base element styles.

## 3. Spacing

From `tokens.json`:
- Base: 4px
- Scale: `xs`–`3xl`

Implement as CSS variables:

```css path=null start=null
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 40px;
  --space-3xl: 48px;
}
```

Use for padding/margins in custom sections to maintain consistent rhythm.

## 4. Radius & Shadows

From `tokens.json`:
- Radius: `none`, `sm`, `md`, `lg`, `pill`
- Shadows: `subtle`, `medium`, `strong`

Define variables:

```css path=null start=null
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;

  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-strong: 0 12px 32px rgba(0, 0, 0, 0.12);
}
```

Use radius tokens for cards, buttons, and images; use subtle/medium shadows sparingly for elevation.

## 5. Section Background Variants

Each section’s `background_variant` setting (`default`, `cream`, `brown`, `pink`, etc.) should map to utility classes in CSS, e.g.:

```css path=null start=null
.bg-default {
  background-color: var(--color-background-default);
}

.bg-cream {
  background-color: var(--color-background-default);
}

.bg-surface {
  background-color: var(--color-background-surface);
}

.bg-brown {
  background-color: var(--color-brand-primary);
  color: var(--color-background-surface);
}

.bg-pink {
  background-color: var(--color-brand-secondary);
}
```

Sections like `move-hero` and `move-cta-strip` apply these classes based on the setting.

## 6. Integration into Sections

- In each custom section, reference CSS variables via classes rather than hard-coded values.
- Prefer MOVE brand variables from `assets/base.css` (mirrors `tokens.json`) instead of hard-coding MOVE palette hex values in section CSS.
- If a hard-coded MOVE palette hex is required for a specific reason, do it only when explicitly requested and document the rationale in the PR/commit.
- Keep schema options (e.g., layout, alignment) high-level; styling differences are handled via CSS classes.
- This keeps MOVE branding centralised in theme settings and easy to adjust without editing Liquid in multiple places.
