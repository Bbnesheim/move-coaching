import fs from 'fs';
import path from 'path';

const sectionPath = path.resolve(__dirname, '../sections/move-pricing-table.liquid');
const template = fs.readFileSync(sectionPath, 'utf8');

describe('MOVE pricing table section (Liquid)', () => {
  test("first pricing card receives the 'move-pricing-table__card--primary' class", () => {
    // Ensure the Liquid logic assigns the primary class when forloop.index == 1
    expect(template).toMatch(
      /if forloop\.index == 1[\s\S]*?assign card_position_class = ' move-pricing-table__card--primary'/
    );

    // The computed class is injected into the article element
    expect(template).toContain(
      'class="move-pricing-table__card{{ card_position_class }}{% if highlight %} move-pricing-table__card--highlight{% endif %}"'
    );
  });

  test("second pricing card receives the 'move-pricing-table__card--secondary' class", () => {
    // Ensure the Liquid logic assigns the secondary class when forloop.index == 2
    expect(template).toMatch(
      /elsif forloop\.index == 2[\s\S]*?assign card_position_class = ' move-pricing-table__card--secondary'/
    );
  });
});
