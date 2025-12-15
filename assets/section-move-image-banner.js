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

const moveImageBannerInstances = new WeakMap();

function initMoveImageBanners(scope = document) {
  const sections = scope.querySelectorAll('.move-image-banner');

  sections.forEach((section) => {
    if (moveImageBannerInstances.has(section)) return;
    moveImageBannerInstances.set(section, new MoveImageBannerCover(section));
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
    const instance = moveImageBannerInstances.get(sectionEl);
    if (instance && instance.destroy) instance.destroy();
  });
}

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { MoveImageBannerCover, initMoveImageBanners };
}
