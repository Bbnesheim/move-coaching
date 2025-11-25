import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../assets/section-move-testimonials.css');
const css = fs.readFileSync(cssPath, 'utf8');

function getRuleBlock(selector: string): string {
  const startIndex = css.indexOf(selector);
  if (startIndex === -1) {
    throw new Error(`Selector not found: ${selector}`);
  }

  const braceIndex = css.indexOf('{', startIndex);
  if (braceIndex === -1) {
    throw new Error(`No opening brace found for selector: ${selector}`);
  }

  let depth = 1;
  let i = braceIndex + 1;

  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') depth--;
    i++;
  }

  return css.slice(braceIndex + 1, i - 1);
}

describe('Move testimonials CSS', () => {
  test('testimonial section uses flexbox and stretches content', () => {
    const contentBlock = getRuleBlock('.move-testimonials__content');

    expect(contentBlock).toContain('display: flex');
    expect(contentBlock).toContain('align-items: stretch');
    expect(contentBlock).toContain('min-height: 520px');

    const sectionBlock = getRuleBlock('.move-testimonials');
    expect(sectionBlock).toContain('min-height: 520px');

    const layoutBlock = getRuleBlock('.move-testimonials__layout');
    expect(layoutBlock).toContain('min-height: 520px');
  });

  test('image stack primary and secondary wrappers have correct positioning and double state', () => {
    const primaryBlock = getRuleBlock('.move-testimonials__image-wrapper--primary');
    expect(primaryBlock).toContain('position: absolute');
    expect(primaryBlock).toContain('top: -10px');
    expect(primaryBlock).toContain('left: -6px');
    expect(primaryBlock).toContain('width: 70%');

    const secondaryBlock = getRuleBlock('.move-testimonials__image-wrapper--secondary');
    expect(secondaryBlock).toContain('position: absolute');
    expect(secondaryBlock).toContain('bottom: -10px');
    expect(secondaryBlock).toContain('right: -10px');
    expect(secondaryBlock).toContain('width: 60%');

    const doubleBlock = getRuleBlock(
      '.move-testimonials__image-stack--double .move-testimonials__image-wrapper--secondary'
    );
    expect(doubleBlock).toContain('transform: translate(8px, 8px)');
  });

  test('responsive styling for image stack applies at different screen widths', () => {
    // Base image stack size
    const baseBlock = getRuleBlock('.move-testimonials__image-stack');
    expect(baseBlock).toContain('width: 320px');
    expect(baseBlock).toContain('height: 260px');

    // Mobile overrides at max-width: 749px
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(max-width: 749px\)[\s\S]*?\.move-testimonials__image-stack\s*{[\s\S]*?width: 260px;[\s\S]*?height: 220px;/
    );
  });

  test('scroller items use intrinsic card height with separate baselines for images (top) and quotes (bottom)', () => {
    const scrollerGridBlock = getRuleBlock('.move-testimonials--scroller .move-testimonials__grid');
    expect(scrollerGridBlock).toContain('display: flex');
    expect(scrollerGridBlock).toContain('align-items: flex-start');

    const baseItemBlock = getRuleBlock('.move-testimonials--scroller .move-testimonials__item');
    expect(baseItemBlock).toContain('display: flex');
    expect(baseItemBlock).toContain('flex-direction: column');
    expect(baseItemBlock).not.toContain('height: 100%');

    const imageItemBlock = getRuleBlock('.move-testimonials--scroller .move-testimonials__item--image');
    expect(imageItemBlock).toContain('align-self: flex-start');
    expect(imageItemBlock).toContain('justify-content: flex-start');

    const quoteItemBlock = getRuleBlock('.move-testimonials--scroller .move-testimonials__item--quote');
    expect(quoteItemBlock).toContain('align-self: flex-end');
    expect(quoteItemBlock).toContain('justify-content: flex-end');
  });

  test('overall testimonial section maintains minimum height and stretching behavior', () => {
    const sectionBlock = getRuleBlock('.move-testimonials');
    expect(sectionBlock).toContain('min-height: 520px');

    const layoutBlock = getRuleBlock('.move-testimonials__layout');
    expect(layoutBlock).toContain('min-height: 520px');

    const contentBlock = getRuleBlock('.move-testimonials__content');
    expect(contentBlock).toContain('min-height: 520px');
    expect(contentBlock).toContain('align-items: stretch');
  });
});
