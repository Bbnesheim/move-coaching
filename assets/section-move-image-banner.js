const clamp01 = (n) => Math.max(0, Math.min(1, n));
const lerp = (a, b, t) => a + (b - a) * t;

function getScrollProgress(section) {
  const rect = section.getBoundingClientRect();
  const viewportH = window.innerHeight || 0;

  // Progress 0 when the section top hits the bottom of the viewport,
  // and progress 1 when the section bottom hits the top of the viewport.
  const total = Math.max(1, viewportH + rect.height);
  const raw = (viewportH - rect.top) / total;
  return clamp01(raw);
}

class MoveImageBannerCover {
  constructor(section) {
    this.section = section;
    this.heading = section.querySelector('.move-image-banner__heading');

    this.sync = this.sync.bind(this);

    if (!this.heading) return;

    // Observe size changes of the section itself
    this.resizeObserver = new ResizeObserver(() => {
      this.sync();
    });
    this.resizeObserver.observe(this.section);

    // Recalc once fonts are ready (important for custom display fonts)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.sync()).catch(() => {});
    }

    this.sync();
  }

  isCoverMode() {
    return this.section.classList.contains('move-image-banner--text-layout-cover');
  }

  reset() {
    if (!this.heading) return;

    this.heading.style.fontSize = '';
  }

  sync() {
    if (!this.heading) return;

    if (!this.isCoverMode()) {
      this.reset();
      return;
    }

    const availableWidth = this.section.clientWidth;
    if (!availableWidth) return;

    // Prepare for measurement
    this.heading.style.display = 'inline-block';
    this.heading.style.whiteSpace = 'nowrap';

    // Measure at a known base size, then scale proportionally
    const baseSize = 100;
    this.heading.style.fontSize = `${baseSize}px`;

    // Force layout
    const measuredWidth = this.heading.getBoundingClientRect().width;
    if (!measuredWidth) return;

    // Scale to fill width edge-to-edge
    const targetSize = (baseSize * availableWidth) / measuredWidth;
    this.heading.style.fontSize = `${targetSize}px`;

    // Also ensure the heading fits within the banner height (for short screens)
    const availableHeight = this.section.clientHeight;
    if (availableHeight) {
      const measuredHeight = this.heading.getBoundingClientRect().height;
      if (measuredHeight) {
        // Leave a tiny breathing room to avoid sub-pixel overflow/clipping
        const safeHeight = Math.max(0, availableHeight - 2);
        const sizeByHeight = (baseSize * safeHeight) / measuredHeight;
        const finalSize = Math.min(targetSize, sizeByHeight);
        this.heading.style.fontSize = `${finalSize}px`;
      }
    }
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}

class MoveImageBannerHeadingDelayedReveal {
  constructor(section) {
    this.section = section;
    this.wrapper = section.querySelector('.move-image-banner__heading-wrapper--slide-in-left');

    if (!this.wrapper) return;

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.timerId = null;

    this.init();
  }

  init() {
    // If reduced motion, don't animate.
    if (this.isReducedMotion) {
      this.reveal(true);
      return;
    }

    // Mark as pending so CSS can hide it (and so no-JS keeps it visible).
    this.wrapper.classList.add('is-pending');

    // Reveal shortly after init so we get a transition from the initial state.
    this.timerId = window.setTimeout(() => {
      this.reveal();
    }, 50);
  }

  reveal(skipAnimation = false) {
    if (!this.wrapper) return;

    // If we are skipping animation (reduced motion), just force visible.
    if (skipAnimation) {
      this.wrapper.classList.remove('is-pending');
      this.wrapper.classList.add('is-revealed');
      this.wrapper.style.opacity = '1';
      this.wrapper.style.transform = 'none';
      this.wrapper.style.animation = 'none';
      return;
    }

    this.wrapper.classList.remove('is-pending');
    this.wrapper.classList.add('is-revealed');
  }

  destroy() {
    if (this.timerId) window.clearTimeout(this.timerId);
    this.timerId = null;
  }
}

class MoveImageBannerHeadingParallax {
  constructor(section) {
    this.section = section;
    this.heading = section.querySelector('.move-image-banner__heading');

    if (!this.heading) return;

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.ticking = false;

    // Update once on init.
    this.update();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
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
    this.onScroll();
  }

  update() {
    if (this.isReducedMotion) {
      this.section.style.setProperty('--move-image-banner-heading-scroll-y', '0px');
      return;
    }

    const progress = getScrollProgress(this.section);
    const startPx = this.readCssPx('--move-image-banner-heading-scroll-start-y', 18);
    const distancePx = this.readCssPx('--move-image-banner-heading-scroll-distance', 64);

    // Start a bit lower (positive translate), then drift upward past the start point.
    const y = lerp(startPx, startPx - distancePx, progress);
    this.section.style.setProperty('--move-image-banner-heading-scroll-y', `${y.toFixed(2)}px`);
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }
}

const moveImageBannerCoverInstances = new WeakMap();
const moveImageBannerHeadingRevealInstances = new WeakMap();
const moveImageBannerHeadingParallaxInstances = new WeakMap();

function initMoveImageBanners(scope = document) {
  const sections = scope.querySelectorAll('.move-image-banner');

  sections.forEach((section) => {
    if (!moveImageBannerCoverInstances.has(section)) {
      moveImageBannerCoverInstances.set(section, new MoveImageBannerCover(section));
    }

    if (!moveImageBannerHeadingRevealInstances.has(section)) {
      moveImageBannerHeadingRevealInstances.set(section, new MoveImageBannerHeadingDelayedReveal(section));
    }

    if (!moveImageBannerHeadingParallaxInstances.has(section)) {
      moveImageBannerHeadingParallaxInstances.set(section, new MoveImageBannerHeadingParallax(section));
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initMoveImageBanners());
} else {
  initMoveImageBanners();
}

// Support Shopify theme editor section reloads
if (typeof document !== 'undefined') {
  document.addEventListener('shopify:section:load', (event) => {
    initMoveImageBanners(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    // Best-effort cleanup
    const sectionEl = event.target.querySelector('.move-image-banner');
    if (!sectionEl) return;

    const coverInstance = moveImageBannerCoverInstances.get(sectionEl);
    if (coverInstance && coverInstance.destroy) coverInstance.destroy();
    moveImageBannerCoverInstances.delete(sectionEl);

    const revealInstance = moveImageBannerHeadingRevealInstances.get(sectionEl);
    if (revealInstance && revealInstance.destroy) revealInstance.destroy();
    moveImageBannerHeadingRevealInstances.delete(sectionEl);

    const parallaxInstance = moveImageBannerHeadingParallaxInstances.get(sectionEl);
    if (parallaxInstance && parallaxInstance.destroy) parallaxInstance.destroy();
    moveImageBannerHeadingParallaxInstances.delete(sectionEl);
  });
}

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    MoveImageBannerCover,
    MoveImageBannerHeadingDelayedReveal,
    MoveImageBannerHeadingParallax,
    initMoveImageBanners,
    getScrollProgress,
  };
}
