import fs from 'fs';
import path from 'path';

const sectionPath = path.resolve(__dirname, '../sections/move-usps.liquid');
const template = fs.readFileSync(sectionPath, 'utf8');

describe('Move USPs section', () => {
  test("first USP item receives the 'move-usps__item--white' class", () => {
    const colorIndexLine = "assign color_index = forloop.index0 | modulo: 3";
    const defaultWhiteLine = "assign color_class = 'move-usps__item--white'";
    const ifPinkLine = 'if color_index == 1';
    const elsifBrownLine = 'elsif color_index == 2';

    const colorIndexPos = template.indexOf(colorIndexLine);
    const defaultWhitePos = template.indexOf(defaultWhiteLine);
    const ifPinkPos = template.indexOf(ifPinkLine);
    const elsifBrownPos = template.indexOf(elsifBrownLine);

    expect(colorIndexPos).toBeGreaterThan(-1);
    expect(defaultWhitePos).toBeGreaterThan(-1);
    expect(ifPinkPos).toBeGreaterThan(-1);
    expect(elsifBrownPos).toBeGreaterThan(-1);

    // Default white assignment happens before any conditional overrides,
    // so color_index 0 (the first item) keeps the white class.
    expect(defaultWhitePos).toBeLessThan(ifPinkPos);
    expect(defaultWhitePos).toBeLessThan(elsifBrownPos);
  });

  test("second USP item receives the 'move-usps__item--pink' class", () => {
    expect(template).toMatch(
      /if color_index == 1\s*assign color_class = 'move-usps__item--pink'/
    );
  });

  test("third USP item receives the 'move-usps__item--brown' class", () => {
    expect(template).toMatch(
      /elsif color_index == 2\s*assign color_class = 'move-usps__item--brown'/
    );
  });

  test("fourth USP item cycles back to 'move-usps__item--white'", () => {
    // We use modulo 3 on forloop.index0, so indices 0, 3, 6, ... all map to the
    // default white class.
    expect(template).toContain('assign color_index = forloop.index0 | modulo: 3');
    expect(template).toContain("assign color_class = 'move-usps__item--white'");
    expect(template).not.toContain('color_index == 3');
  });

  test('side_image is rendered with image_url, image_tag, widths, and sizes when present', () => {
    // Guard on the conditional wrapper
    expect(template).toContain("{%- if section.settings.side_image != blank -%}");

    // Ensure the Liquid image pipeline uses image_url and image_tag with the expected args
    expect(template).toContain('section.settings.side_image');
    expect(template).toContain('| image_url: width: 1600');
    expect(template).toMatch(/\| image_tag:\s*\n\s*widths: '800, 1200, 1600'/);
    expect(template).toContain("sizes: '50vw'");
  });
});
