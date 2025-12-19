const SELECTOR = '[data-workouts-scroll]';

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function getScrollProgress(section, { leadInPx = 0 } = {}) {
  const rect = section.getBoundingClientRect();
  const viewportH = window.innerHeight || 0;

  // With section height set to (100vh + scrollDistance), the effective scroll distance is:
  // sectionHeight - viewportH.
  const sectionHeight = rect.height;
  const scrollDistance = Math.max(1, sectionHeight - viewportH);

  // Optional lead-in (in px): allow progress to start before the sticky hits the top.
  // leadInPx = viewportH means "start when the section enters the viewport".
  const leadIn = Math.max(0, Number(leadInPx) || 0);
  const totalDistance = scrollDistance + leadIn;

  // When rect.top === leadIn => progress 0.
  // When we've moved through (leadIn + scrollDistance) => progress 1.
  const raw = (leadIn - rect.top) / totalDistance;
  return clamp01(raw);
}

class WorkoutsScroll {
  constructor(section) {
    this.section = section;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.minScale = this.readCssNumber('--workouts-scroll-min-scale', 0.35);
    this.startRadiusPx = this.readCssPx('--workouts-scroll-start-radius', 18);

    this.viewportW = window.innerWidth || 0;
    this.viewportH = window.innerHeight || 0;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.ticking = false;

    // Update once on init.
    this.update();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  readCssNumber(varName, fallback) {
    const value = getComputedStyle(this.section).getPropertyValue(varName).trim();
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  readCssPx(varName, fallbackPx) {
    const value = getComputedStyle(this.section).getPropertyValue(varName).trim();
    if (!value) return fallbackPx;
    const n = Number(String(value).replace('px', '').trim());
    return Number.isFinite(n) ? n : fallbackPx;
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    window.requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  onResize() {
    // Re-read settings on resize (theme editor tweaks, responsive adjustments)
    this.minScale = this.readCssNumber('--workouts-scroll-min-scale', this.minScale);
    this.startRadiusPx = this.readCssPx('--workouts-scroll-start-radius', this.startRadiusPx);
    this.viewportW = window.innerWidth || this.viewportW;
    this.viewportH = window.innerHeight || this.viewportH;
    this.onScroll();
  }

  update() {
    if (this.isReducedMotion) {
      this.section.style.setProperty('--workouts-scroll-progress', '1');
      this.section.style.setProperty('--workouts-scroll-frame-w', '100vw');
      this.section.style.setProperty('--workouts-scroll-frame-h', '100vh');
      this.section.style.setProperty('--workouts-scroll-radius', '0px');
      this.section.style.setProperty('--workouts-scroll-media-zoom', '1');
      this.section.style.setProperty('--workouts-scroll-top-line-1-x', '0px');
      this.section.style.setProperty('--workouts-scroll-top-line-2-x', '0px');
      this.section.style.setProperty('--workouts-scroll-bottom-line-1-x', '0px');
      this.section.style.setProperty('--workouts-scroll-bottom-line-2-x', '0px');
      return;
    }

    const vw = this.viewportW || window.innerWidth || 0;
    const vh = this.viewportH || window.innerHeight || 0;

    // Media growth should NOT start until the section is fullscreen / sticky is active.
    // (i.e. when the section top reaches the top of the viewport)
    const frameProgress = getScrollProgress(this.section);
    const frameEased = easeOutCubic(frameProgress);

    // Headline motion starts as the section scrolls INTO view.
    const headlineProgress = getScrollProgress(this.section, { leadInPx: vh });
    const headlineEased = easeOutCubic(headlineProgress);

    // Start as a centered tile, then expand to full-bleed.
    // Much smaller on start so the full headings remain readable.
    const startW = Math.max(170, Math.min(520, vw * (this.minScale * 0.6)));

    // Slightly-taller-than-wide tile (matches the reference better than 16:9).
    const startAspect = 0.85; // w/h
    const startHByRatio = startW / startAspect;
    const startH = Math.max(220, Math.min(vh * 0.62, startHByRatio));

    const frameW = lerp(startW, vw, frameEased);
    const frameH = lerp(startH, vh, frameEased);

    const radius = lerp(this.startRadiusPx, 0, frameEased);

    // Subtle zoom out as we expand.
    const zoom = lerp(1.15, 1, frameEased);

    // Headline drift: line 1 and line 2 move opposite horizontal directions.
    // Keep it within margins by clamping the max shift.
    //
    // Important: because the top headline is left-anchored and the bottom headline is right-anchored,
    // we move the *second* lines inward (towards center) so they don't drift off-screen.
    const innerShiftPx = Math.min(vw * 0.09, 140);
    const outerShiftPx = Math.min(vw * 0.03, 48);

    // Positive = right, negative = left
    const inwardRightX = lerp(0, innerShiftPx, headlineEased);
    const inwardLeftX = lerp(0, -innerShiftPx, headlineEased);
    const outwardRightX = lerp(0, outerShiftPx, headlineEased);
    const outwardLeftX = lerp(0, -outerShiftPx, headlineEased);

    this.section.style.setProperty('--workouts-scroll-progress', String(frameProgress));
    this.section.style.setProperty('--workouts-scroll-frame-w', `${frameW}px`);
    this.section.style.setProperty('--workouts-scroll-frame-h', `${frameH}px`);
    this.section.style.setProperty('--workouts-scroll-radius', `${radius}px`);
    this.section.style.setProperty('--workouts-scroll-media-zoom', String(zoom));

    // Top headline is left-anchored:
    // - line 2 moves inward (right)
    // - line 1 moves opposite (left) but with a smaller "outer" shift
    this.section.style.setProperty('--workouts-scroll-top-line-1-x', `${outwardLeftX.toFixed(2)}px`);
    this.section.style.setProperty('--workouts-scroll-top-line-2-x', `${inwardRightX.toFixed(2)}px`);

    // Bottom headline is right-anchored:
    // - line 2 moves inward (left)
    // - line 1 moves opposite (right) but with a smaller "outer" shift
    this.section.style.setProperty('--workouts-scroll-bottom-line-1-x', `${outwardRightX.toFixed(2)}px`);
    this.section.style.setProperty('--workouts-scroll-bottom-line-2-x', `${inwardLeftX.toFixed(2)}px`);
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }
}

const instances = new WeakMap();

function init(scope = document) {
  scope.querySelectorAll(SELECTOR).forEach((section) => {
    if (instances.has(section)) return;
    instances.set(section, new WorkoutsScroll(section));
  });
}

function destroy(scope) {
  scope.querySelectorAll(SELECTOR).forEach((section) => {
    const inst = instances.get(section);
    if (!inst) return;
    inst.destroy();
    instances.delete(section);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

// Shopify theme editor support
document.addEventListener('shopify:section:load', (event) => init(event.target));
document.addEventListener('shopify:section:unload', (event) => destroy(event.target));

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {};
}
