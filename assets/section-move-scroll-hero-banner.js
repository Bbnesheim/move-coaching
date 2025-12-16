(() => {
  const SELECTOR = '[data-move-scroll-hero-banner]';

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

  class MoveScrollHeroBanner {
    constructor(section) {
      this.section = section;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.minScale = this.readCssNumber('--move-scroll-hero-banner-min-scale', 0.35);
      this.startRadiusPx = this.readCssPx('--move-scroll-hero-banner-start-radius', 18);

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
      this.minScale = this.readCssNumber('--move-scroll-hero-banner-min-scale', this.minScale);
      this.startRadiusPx = this.readCssPx('--move-scroll-hero-banner-start-radius', this.startRadiusPx);
      this.viewportW = window.innerWidth || this.viewportW;
      this.viewportH = window.innerHeight || this.viewportH;
      this.onScroll();
    }

    update() {
      if (this.isReducedMotion) {
        this.section.style.setProperty('--move-scroll-hero-banner-progress', '1');
        this.section.style.setProperty('--move-scroll-hero-banner-frame-w', '100vw');
        this.section.style.setProperty('--move-scroll-hero-banner-frame-h', '100vh');
        this.section.style.setProperty('--move-scroll-hero-banner-radius', '0px');
        this.section.style.setProperty('--move-scroll-hero-banner-image-zoom', '1');
        this.section.style.setProperty('--move-scroll-hero-banner-content-opacity', '1');
        this.section.style.setProperty('--move-scroll-hero-banner-content-y', '0px');
        return;
      }

      const progress = getScrollProgress(this.section);
      const eased = easeOutCubic(progress);

      // Frame: start as a portrait card (show center subject), then expand to full-bleed.
      const vw = this.viewportW || window.innerWidth || 0;
      const vh = this.viewportH || window.innerHeight || 0;

      // Treat minScale as a starting width fraction of the viewport width.
      // Clamp so it remains usable across breakpoints.
      const startW = Math.max(260, Math.min(520, vw * this.minScale));

      // Portrait ratio ~ 0.62 (w/h). Clamp height so it doesn't exceed the viewport.
      const startHByRatio = startW / 0.62;
      const startH = Math.max(380, Math.min(vh * 0.86, startHByRatio));

      const frameW = lerp(startW, vw, eased);
      const frameH = lerp(startH, vh, eased);

      const radius = lerp(this.startRadiusPx, 0, eased);

      // Image: start zoomed-in so the center subject is prominent,
      // then gradually zoom out as the frame grows.
      const zoom = lerp(1.55, 1, eased);

      // UI reveal while the frame is still expanding.
      // Separate curves so heading doesn't "pop" and CTAs aren't too slow.
      // Heading should begin slightly before the CTAs.
      // Heading uses a "sunrise" mask (clipped box) so we animate with %.
      const headingStart = 0.18;
      const headingEnd = 0.54;
      const headingT = clamp01((progress - headingStart) / (headingEnd - headingStart));
      const headingEased = easeOutCubic(headingT);

      const ctaStart = 0.24;
      const ctaEnd = 0.62;
      const ctaT = clamp01((progress - ctaStart) / (ctaEnd - ctaStart));
      const ctaEased = easeOutCubic(ctaT);

      const headingTranslateY = `${lerp(140, 0, headingEased)}%`;
      const ctaTranslateY = `${lerp(140, 0, ctaEased)}%`;


      this.section.style.setProperty('--move-scroll-hero-banner-progress', String(progress));
      this.section.style.setProperty('--move-scroll-hero-banner-frame-w', `${frameW}px`);
      this.section.style.setProperty('--move-scroll-hero-banner-frame-h', `${frameH}px`);
      this.section.style.setProperty('--move-scroll-hero-banner-radius', `${radius}px`);
      this.section.style.setProperty('--move-scroll-hero-banner-image-zoom', String(zoom));
      this.section.style.setProperty('--move-scroll-hero-banner-heading-translate-y', headingTranslateY);
      this.section.style.setProperty('--move-scroll-hero-banner-cta-translate-y', ctaTranslateY);
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
      instances.set(section, new MoveScrollHeroBanner(section));
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
})();

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {};
}
