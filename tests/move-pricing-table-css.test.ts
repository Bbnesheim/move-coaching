import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../assets/section-move-pricing-table.css');
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

describe('MOVE pricing table CSS', () => {
  test('pricing cards display as a horizontal carousel on mobile screens', () => {
    // Mobile breakpoint turns the grid into a horizontal, snapping carousel
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(max-width: 749px\)[\s\S]*?\.move-pricing-table__grid\s*{[\s\S]*?display:\s*flex;[\s\S]*?overflow-x:\s*auto;[\s\S]*?scroll-snap-type:\s*x mandatory;[\s\S]*?scroll-padding:\s*0 1\.5rem;[\s\S]*?}/
    );

    // Individual cards behave like horizontally scrollable slides
    expect(css).toMatch(
      /@media\s+screen\s+and\s+\(max-width: 749px\)[\s\S]*?\.move-pricing-table__card\s*{[\s\S]*?flex:\s*0 0 86%;[\s\S]*?max-width:\s*86%;[\s\S]*?scroll-snap-align:\s*center;[\s\S]*?}/
    );
  });

  test('primary pricing card displays with a double outline (inner pink, outer brown)', () => {
    const primaryBlock = getRuleBlock('.move-pricing-table__card--primary');
    expect(primaryBlock).toContain('border: 6px solid var(--move-color-pink-secondary)');
    expect(primaryBlock).toContain('border-radius: calc(var(--radius-md, 8px) - 2px)');

    const primaryBeforeBlock = getRuleBlock('.move-pricing-table__card--primary::before');
    expect(primaryBeforeBlock).toContain('position: absolute');
    expect(primaryBeforeBlock).toContain('inset: -6px');
    expect(primaryBeforeBlock).toContain('border-radius: var(--radius-md, 8px)');
    expect(primaryBeforeBlock).toContain('border: 6px solid var(--move-color-brown-primary)');
  });

  test('highlighted pricing card changes its elevation via transform without altering its border or box-shadow declarations', () => {
    const baseBlock = getRuleBlock('.move-pricing-table__card');
    // Base card defines the shared box-shadow
    expect(baseBlock).toContain('box-shadow: 0 14px 40px rgba(0, 0, 0, 0.06)');

    const hoverBlock = getRuleBlock('.move-pricing-table__card:hover');
    // Hover state tweaks transform and box-shadow
    expect(hoverBlock).toContain('transform: translateY(-2px)');
    expect(hoverBlock).toContain('box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12)');

    const highlightBlock = getRuleBlock('.move-pricing-table__card--highlight');
    // Highlight state adjusts transform only and does not redefine borders or box-shadow
    expect(highlightBlock).toContain('transform: translateY(-4px)');
    expect(highlightBlock).not.toMatch(/border\s*:/);
    expect(highlightBlock).not.toMatch(/box-shadow\s*:/);

    const highlightHoverBlock = getRuleBlock('.move-pricing-table__card--highlight:hover');
    // Hovering a highlighted card further adjusts transform, still without touching borders or box-shadow
    expect(highlightHoverBlock).toContain('transform: translateY(-6px)');
    expect(highlightHoverBlock).not.toMatch(/border\s*:/);
    expect(highlightHoverBlock).not.toMatch(/box-shadow\s*:/);
  });
});
