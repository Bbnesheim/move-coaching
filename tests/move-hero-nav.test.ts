import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

declare const window: Window & typeof globalThis;

type HeroNavDom = {
  dom: JSDOM;
  section: HTMLElement;
  nav: HTMLElement;
  toggle: HTMLButtonElement;
  overlay: HTMLElement;
};

const sectionPath = path.resolve(__dirname, '../sections/move-hero-with-nav.liquid');
const template = fs.readFileSync(sectionPath, 'utf8');

const jsBlockMatch = template.match(/\{% javascript %}([\s\S]*?)\{% endjavascript %}/);

if (!jsBlockMatch) {
  throw new Error('Could not find `{% javascript %}` block in move-hero-with-nav.liquid');
}

const scriptContent = jsBlockMatch[1];

function createDomWithHeroNav(): HeroNavDom {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');

  (global as any).window = dom.window as any;
  (global as any).document = dom.window.document as any;
  (global as any).HTMLElement = dom.window.HTMLElement as any;
  (global as any).KeyboardEvent = dom.window.KeyboardEvent as any;
  (global as any).MouseEvent = dom.window.MouseEvent as any;

  (window as any).matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  // Evaluate the JavaScript from the Liquid section so initMoveHeroNav and
  // its event wiring run against this JSDOM environment.
  // eslint-disable-next-line no-eval
  eval(scriptContent);

  const section = document.createElement('section');
  const nav = document.createElement('div');
  nav.className = 'move-hero__nav';
  nav.setAttribute('data-move-hero-nav', '');

  const toggle = document.createElement('button');
  toggle.className = 'move-hero__menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Åpne meny');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'MoveHeroNavOverlay-test');

  const overlay = document.createElement('div');
  overlay.className = 'move-hero__nav-overlay';
  overlay.id = 'MoveHeroNavOverlay-test';
  overlay.setAttribute('aria-hidden', 'true');

  const innerNav = document.createElement('nav');
  innerNav.className = 'move-hero__nav-menu move-hero__nav-menu--overlay';
  overlay.appendChild(innerNav);

  nav.appendChild(toggle);
  nav.appendChild(overlay);
  section.appendChild(nav);
  document.body.appendChild(section);

  // initMoveHeroNav is defined in the evaluated scriptContent.
  // We call it with the section so all listeners are wired using the
  // same logic as in production.
  (global as any).initMoveHeroNav(section);

  return { dom, section, nav, toggle, overlay };
}

describe('MOVE hero mobile navigation behavior', () => {
  test('opens mobile navigation when the hamburger icon is clicked', () => {
    const { dom, nav, toggle, overlay } = createDomWithHeroNav();

    expect(nav.classList.contains('move-hero__nav--open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Åpne meny');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(dom.window.document.documentElement.classList.contains('move-hero-nav-open')).toBe(false);

    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Lukk meny');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(dom.window.document.documentElement.classList.contains('move-hero-nav-open')).toBe(true);
  });

  test('closes mobile navigation when the toggle is clicked again', () => {
    const { dom, nav, toggle, overlay } = createDomWithHeroNav();

    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);

    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(nav.classList.contains('move-hero__nav--open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Åpne meny');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(dom.window.document.documentElement.classList.contains('move-hero-nav-open')).toBe(false);
  });

  test('closes mobile navigation when the overlay background is clicked', () => {
    const { dom, nav, toggle, overlay } = createDomWithHeroNav();

    // Open first via tog
    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);

    overlay.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(nav.classList.contains('move-hero__nav--open')).toBe(false);
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(dom.window.document.documentElement.classList.contains('move-hero-nav-open')).toBe(false);
  });

  test('closes mobile navigation when the Escape key is pressed', () => {
    const { dom, nav, toggle, overlay } = createDomWithHeroNav();

    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);

    const escEvent = new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    dom.window.document.dispatchEvent(escEvent);

    expect(nav.classList.contains('move-hero__nav--open')).toBe(false);
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(dom.window.document.documentElement.classList.contains('move-hero-nav-open')).toBe(false);
  });

  test('sets correct ARIA attributes for accessibility', () => {
    const { dom, nav, toggle, overlay } = createDomWithHeroNav();

    // Initial ARIA state
    expect(toggle.getAttribute('aria-controls')).toBe(overlay.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Åpne meny');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');

    // After opening
    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Lukk meny');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
  });

  test('prevents body scroll when open and re-enables it when closed', () => {
    const { dom, nav, toggle } = createDomWithHeroNav();

    const htmlEl = dom.window.document.documentElement;
    expect(htmlEl.classList.contains('move-hero-nav-open')).toBe(false);

    // Open
    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(nav.classList.contains('move-hero__nav--open')).toBe(true);
    expect(htmlEl.classList.contains('move-hero-nav-open')).toBe(true);

    // Close
    toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(nav.classList.contains('move-hero__nav--open')).toBe(false);
    expect(htmlEl.classList.contains('move-hero-nav-open')).toBe(false);
  });
});
