import { JSDOM } from 'jsdom';

// Require the compiled storefront script, which conditionally exports the class in Node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MoveTestimonialsScroller } = require('../assets/section-move-testimonials.js');

declare const window: Window & typeof globalThis;

function createSectionWithScroller() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  // Attach JSDOM window/document to globals if not already present
  (global as any).window = dom.window as any;
  (global as any).document = dom.window.document as any;

  const section = document.createElement('section');
  section.className = 'move-testimonials--scroller';

  const track = document.createElement('div');
  track.className = 'move-testimonials__grid';

  const nextArrow = document.createElement('button');
  nextArrow.className = 'move-testimonials__arrow move-testimonials__arrow--next';

  const prevArrow = document.createElement('button');
  prevArrow.className = 'move-testimonials__arrow move-testimonials__arrow--prev';

  section.appendChild(track);
  section.appendChild(nextArrow);
  section.appendChild(prevArrow);

  document.body.appendChild(section);

  return { section, track, nextArrow, prevArrow };
}

function mockScrollMetrics(track: HTMLElement, {
  scrollWidth,
  clientWidth,
  scrollLeft,
}: {
  scrollWidth: number;
  clientWidth: number;
  scrollLeft: number;
}) {
  Object.defineProperty(track, 'scrollWidth', {
    configurable: true,
    value: scrollWidth,
  });

  Object.defineProperty(track, 'clientWidth', {
    configurable: true,
    value: clientWidth,
  });

  Object.defineProperty(track, 'scrollLeft', {
    configurable: true,
    writable: true,
    value: scrollLeft,
  });
}

describe('MoveTestimonialsScroller behavior', () => {
  const originalGetComputedStyle = global.getComputedStyle;

  afterEach(() => {
    // Restore any global mocks between tests
    global.getComputedStyle = originalGetComputedStyle;
  });

  test('scrollBy scrolls the track forward when direction is 1', () => {
    const { section, track } = createSectionWithScroller();

    const item = document.createElement('div');
    item.className = 'move-testimonials__item';
    (item as any).getBoundingClientRect = jest.fn(() => ({ width: 100 }));
    track.appendChild(item);

    (track as any).scrollBy = jest.fn();

    global.getComputedStyle = jest.fn(() => ({ columnGap: '20', gap: '' } as any));

    const scroller = new MoveTestimonialsScroller(section);

    scroller.scrollBy(1);

    expect((track as any).scrollBy).toHaveBeenCalledWith({
      left: 120,
      behavior: 'smooth',
    });
  });

  test('scrollBy scrolls the track backward when direction is -1', () => {
    const { section, track } = createSectionWithScroller();

    const item = document.createElement('div');
    item.className = 'move-testimonials__item';
    (item as any).getBoundingClientRect = jest.fn(() => ({ width: 150 }));
    track.appendChild(item);

    (track as any).scrollBy = jest.fn();

    global.getComputedStyle = jest.fn(() => ({ columnGap: '10', gap: '' } as any));

    const scroller = new MoveTestimonialsScroller(section);

    scroller.scrollBy(-1);

    expect((track as any).scrollBy).toHaveBeenCalledWith({
      left: -(160),
      behavior: 'smooth',
    });
  });

  test('handleScroll hides the previous arrow when at the beginning', () => {
    const { section, track, prevArrow, nextArrow } = createSectionWithScroller();

    mockScrollMetrics(track, {
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 0,
    });

    const scroller = new MoveTestimonialsScroller(section);

    scroller.handleScroll();

    expect(prevArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(true);
    expect(nextArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(false);
  });

  test('handleScroll hides the next arrow when at the end', () => {
    const { section, track, prevArrow, nextArrow } = createSectionWithScroller();

    mockScrollMetrics(track, {
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 500, // >= maxScrollLeft (1000 - 500 - 1 = 499)
    });

    const scroller = new MoveTestimonialsScroller(section);

    scroller.handleScroll();

    expect(prevArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(false);
    expect(nextArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(true);
  });

  test('initializes with correct arrow visibility based on starting scroll position', () => {
    const { section, track, prevArrow, nextArrow } = createSectionWithScroller();

    mockScrollMetrics(track, {
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 0,
    });

    // Constructor calls handleScroll once to set initial state
    new MoveTestimonialsScroller(section);

    expect(prevArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(true);
    expect(nextArrow.classList.contains('move-testimonials__arrow--hidden')).toBe(false);
  });
});
