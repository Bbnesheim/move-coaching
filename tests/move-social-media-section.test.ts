import fs from 'fs';
import path from 'path';

const sectionPath = path.resolve(__dirname, '../sections/move-social-media.liquid');
const template = fs.readFileSync(sectionPath, 'utf8');

describe('MOVE social media section', () => {
  test('only one profile card is rendered from the section blocks', () => {
    // Guard: we track whether a profile has already been rendered
    expect(template).toContain("{%- assign profile_rendered = false -%}");

    // The card markup is wrapped in a single conditional that checks
    // both the block type and the profile_rendered flag.
    const profileGuardRegex = new RegExp(
      // for block in section.blocks
      String.raw`{%-\s*for\s+block\s+in\s+section\.blocks\s*-%}[\s\S]*?` +
        // if block.type == 'profile' and profile_rendered == false
        String.raw`{%-\s*if\s+block\.type\s*==\s*'profile'\s*and\s*profile_rendered\s*==\s*false\s*-%}[\s\S]*?` +
        // profile_rendered is flipped to true to prevent further profile cards
        String.raw`{%-\s*assign\s+profile_rendered\s*=\s*true\s*-%}` +
        // endfor
        String.raw`[\s\S]*?{%-\s*endfor\s*-%}`,
      'm'
    );

    expect(profileGuardRegex.test(template)).toBe(true);

    // Ensure we only reference the profile guard condition once, so the
    // first matching profile block is the only one rendered.
    const marker = "if block.type == 'profile' and profile_rendered == false";
    expect(template.indexOf(marker)).toBeGreaterThan(-1);
    expect(template.indexOf(marker)).toBe(template.lastIndexOf(marker));
  });

  test('social media posts are rendered when the section contains post blocks', () => {
    // has_posts flag is computed by scanning blocks for type === 'post'
    expect(template).toContain("{%- assign has_posts = false -%}");
    expect(template).toMatch(/for block in section\.blocks[\s\S]*if block\.type == 'post'[\s\S]*assign has_posts = true[\s\S]*endfor/);

    // When has_posts is true, we render the posts grid container
    expect(template).toMatch(
      /{%-\s*if\s+has_posts\s*-%}[\s\S]*?<div class="move-social-media__posts-grid grid grid--3-col-desktop grid--2-col-tablet grid--1-col-tablet-down">[\s\S]*?{%-\s*endif\s*-%}/
    );

    // Inside the posts grid we loop over post blocks only
    expect(template).toMatch(
      /<div class="move-social-media__posts-grid[\s\S]*?{%-\s*for\s+block\s+in\s+section\.blocks\s*-%}[\s\S]*?{%-\s*if\s+block\.type\s*==\s*'post'\s*-%}[\s\S]*?<figure class="move-social-media__post grid__item"/m
    );
  });

  test('profile block renders avatar, label, platform, handle, description, and CTA link', () => {
    // Avatar image inside a circular media wrapper
    expect(template).toContain(
      '<div class="move-social-media__avatar media media--circle">'
    );
    expect(template).toContain(
      "{{ block.settings.avatar | image_url: width: 120 | image_tag: widths: '80, 120', class: 'move-social-media__avatar-image' }}"
    );

    // Display label
    expect(template).toContain(
      '<h3 class="h3 move-social-media__label">{{ block.settings.label }}</h3>'
    );

    // Platform (except when set to "other") and handle meta line
    expect(template).toContain(
      "<span class=\"move-social-media__platform\">{{ block.settings.platform | capitalize }}</span>"
    );
    expect(template).toContain(
      '<span class="move-social-media__handle">{{ block.settings.handle }}</span>'
    );

    // Description text
    expect(template).toContain(
      '<p class="move-social-media__description text-body">{{ block.settings.description }}</p>'
    );

    // CTA link uses the profile URL and falls back to the section default label
    expect(template).toContain(
      '<a href="{{ block.settings.url }}" class="button button--secondary">'
    );
    expect(template).toContain(
      "{{ block.settings.cta_label | default: section.settings.default_cta_label | escape }}"
    );
  });

  test('post block renders image, tag, caption, and URL link', () => {
    // Post figure wrapper with Shopify block attributes
    expect(template).toContain(
      '<figure class="move-social-media__post grid__item" {{ block.shopify_attributes }}>'
    );

    // Image uses Liquid image pipeline with correct widths and class
    expect(template).toContain('block.settings.image | image_url: width: 900');
    expect(template).toContain(
      "| image_tag: widths: '400, 600, 900', class: 'move-social-media__post-image'"
    );

    // Optional URL link wraps the media when provided
    expect(template).toContain(
      '<a href="{{ block.settings.url }}" class="move-social-media__post-link" target="_blank" rel="noreferrer noopener">'
    );

    // Caption area with tag and caption text spans
    expect(template).toContain(
      '<figcaption class="move-social-media__post-caption">'
    );
    expect(template).toContain(
      '<span class="move-social-media__post-tag caption-with-letter-spacing">{{ block.settings.tag }}</span>'
    );
    expect(template).toContain(
      '<span class="move-social-media__post-caption-text">{{ block.settings.caption }}</span>'
    );
  });
});
