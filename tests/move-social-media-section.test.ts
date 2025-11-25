import fs from 'fs';
import path from 'path';

const sectionPath = path.resolve(__dirname, '../sections/move-social-media.liquid');
const template = fs.readFileSync(sectionPath, 'utf8');

describe('MOVE social media section', () => {
  test('renders the main image in the left column when provided', () => {
    // Column wrapper and conditional guard
    expect(template).toContain(
      '<div class="move-social-media__column move-social-media__column--left">'
    );
    expect(template).toContain(
      "{%- if section.settings.main_image != blank -%}"
    );

    // Image wrapper and Liquid image pipeline
    expect(template).toContain(
      '<div class="move-social-media__image media">'
    );
    expect(template).toContain(
      "{{ section.settings.main_image | image_url: width: 1600 | image_tag: widths: '800, 1200, 1600', sizes: '(min-width: 990px) 40vw, 100vw', class: 'move-social-media__image-img' }}"
    );
  });

  test('renders three distinct social media cards for Instagram, TikTok, and Facebook', () => {
    // Three card articles with specific BEM modifiers
    expect(template).toContain(
      '<article class="move-social-media__card move-social-media__card--instagram">'
    );
    expect(template).toContain(
      '<article class="move-social-media__card move-social-media__card--tiktok">'
    );
    expect(template).toContain(
      '<article class="move-social-media__card move-social-media__card--facebook">'
    );

    // Accessibility: visually hidden labels for each network
    expect(template).toContain('<span class="visually-hidden">Instagram</span>');
    expect(template).toContain('<span class="visually-hidden">TikTok</span>');
    expect(template).toContain('<span class="visually-hidden">Facebook</span>');
  });

  test('each social media card displays label, handle, description, and CTA link from section settings', () => {
    // Instagram label, handle, description, CTA
    expect(template).toContain(
      '<h3 class="h3 move-social-media__card-title">'
    );
    expect(template).toContain('{{ section.settings.instagram_label }}');
    expect(template).toContain(
      '<p class="move-social-media__card-handle text-body">'
    );
    expect(template).toContain('{{ section.settings.instagram_handle }}');
    expect(template).toContain(
      '<p class="move-social-media__card-description text-body">'
    );
    expect(template).toContain('{{ section.settings.instagram_description }}');
    expect(template).toContain(
      'href="{{ section.settings.instagram_url }}"'
    );
    expect(template).toContain(
      "{{ section.settings.instagram_cta_label | default: section.settings.default_cta_label | escape }}"
    );

    // TikTok label, handle, description, CTA
    expect(template).toContain('{{ section.settings.tiktok_label }}');
    expect(template).toContain('{{ section.settings.tiktok_handle }}');
    expect(template).toContain('{{ section.settings.tiktok_description }}');
    expect(template).toContain('href="{{ section.settings.tiktok_url }}"');
    expect(template).toContain(
      "{{ section.settings.tiktok_cta_label | default: section.settings.default_cta_label | escape }}"
    );

    // Facebook label, handle, description, CTA
    expect(template).toContain('{{ section.settings.facebook_label }}');
    expect(template).toContain('{{ section.settings.facebook_handle }}');
    expect(template).toContain('{{ section.settings.facebook_description }}');
    expect(template).toContain('href="{{ section.settings.facebook_url }}"');
    expect(template).toContain(
      "{{ section.settings.facebook_cta_label | default: section.settings.default_cta_label | escape }}"
    );
  });

  test('CTA links on social media cards use target="_blank" and rel="noreferrer noopener"', () => {
    // Instagram CTA attributes
    expect(template).toMatch(
      /href="{{ section\.settings\.instagram_url }}"[\s\S]*?target="_blank"[\s\S]*?rel="noreferrer noopener"/
    );

    // TikTok CTA attributes
    expect(template).toMatch(
      /href="{{ section\.settings\.tiktok_url }}"[\s\S]*?target="_blank"[\s\S]*?rel="noreferrer noopener"/
    );

    // Facebook CTA attributes
    expect(template).toMatch(
      /href="{{ section\.settings\.facebook_url }}"[\s\S]*?target="_blank"[\s\S]*?rel="noreferrer noopener"/
    );
  });
});
