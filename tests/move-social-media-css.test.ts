import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../assets/section-move-social-media.css');
const css = fs.readFileSync(cssPath, 'utf8');

describe('Move social media CSS layout', () => {
  test('desktop layout uses grid areas with Instagram on top and TikTok/Facebook below', () => {
    // Desktop breakpoint defines a 2x2 grid with named areas
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(min-width: 900px\)[\s\S]*?\.move-social-media__cards\s*{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[\s\S]*?grid-template-rows: repeat\(2, minmax\(0, 1fr\)\);[\s\S]*?grid-template-areas:\s*"instagram instagram"\s*"tiktok facebook";[\s\S]*?}/
    );

    // Individual cards are mapped to the named grid areas
    expect(css).toMatch(
      /\.move-social-media__card--instagram\s*{[\s\S]*?grid-area: instagram;[\s\S]*?}/
    );
    expect(css).toMatch(
      /\.move-social-media__card--tiktok\s*{[\s\S]*?grid-area: tiktok;[\s\S]*?}/
    );
    expect(css).toMatch(
      /\.move-social-media__card--facebook\s*{[\s\S]*?grid-area: facebook;[\s\S]*?}/
    );
  });

  test('mobile layout stacks cards in a single column and resets explicit grid areas', () => {
    // Mobile breakpoint stacks the cards in one column with auto rows
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(max-width: 899px\)[\s\S]*?\.move-social-media__cards\s*{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);[\s\S]*?grid-template-rows: auto;[\s\S]*?}/
    );

    // All three cards share a selector block that resets grid-area to auto
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(max-width: 899px\)[\s\S]*?\.move-social-media__card--instagram,[\s\S]*?\.move-social-media__card--tiktok,[\s\S]*?\.move-social-media__card--facebook[\s\S]*?{[\s\S]*?grid-area: auto;[\s\S]*?}/
    );
  });
});
