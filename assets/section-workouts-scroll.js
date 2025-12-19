const SELECTOR = '[data-workouts-scroll]';

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function getScrollProgress(section) {
  const rect = section.getBoundingClientRect();
  const viewportH = window.innerHeight || 0;

  // With section height set to (100vh + scrollDistance), the effective scroll distance is:
  // sectionHeight - viewportH.
  const sectionHeight = rect.height;
  const scrollDistance = Math.max(1, sectionHeight - viewportH);

  // When section top is at viewport top => progress 0.
  // When the extra scroll distance has passed => progress 1.
  const raw = (-rect.top) / scrollDistance;
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
      this.section.style.setProperty('--workouts-scroll-top-x', '0px');
      this.section.style.setProperty('--workouts-scroll-bottom-x', '0px');
      return;
    }

    const progress = getScrollProgress(this.section);
    const eased = easeOutCubic(progress);

    const vw = this.viewportW || window.innerWidth || 0;
    const vh = this.viewportH || window.innerHeight || 0;

    // Start as a centered tile, then expand to full-bleed.
    const startW = Math.max(260, Math.min(720, vw * this.minScale));

    // Slightly-taller-than-wide tile (matches the reference better than 16:9).
    const startAspect = 0.85; // w/h
    const startHByRatio = startW / startAspect;
    const startH = Math.max(320, Math.min(vh * 0.86, startHByRatio));

    const frameW = lerp(startW, vw, eased);
    const frameH = lerp(startH, vh, eased);

    const radius = lerp(this.startRadiusPx, 0, eased);

    // Subtle zoom out as we expand.
    const zoom = lerp(1.15, 1, eased);

    // Headline drift: top and bottom move in opposite horizontal directions.
    const headlineShiftPx = vw * 0.22;
    const topX = lerp(0, headlineShiftPx, eased);
    const bottomX = lerp(0, -headlineShiftPx, eased);

    this.section.style.setProperty('--workouts-scroll-progress', String(progress));
    this.section.style.setProperty('--workouts-scroll-frame-w', `${frameW}px`);
    this.section.style.setProperty('--workouts-scroll-frame-h', `${frameH}px`);
    this.section.style.setProperty('--workouts-scroll-radius', `${radius}px`);
    this.section.style.setProperty('--workouts-scroll-media-zoom', String(zoom));
    this.section.style.setProperty('--workouts-scroll-top-x', `${topX.toFixed(2)}px`);
    this.section.style.setProperty('--workouts-scroll-bottom-x', `${bottomX.toFixed(2)}px`);
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
