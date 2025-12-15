class MoveStepsJourney {
  constructor(section) {
    this.section = section;
    this.journey = section.querySelector('[data-move-steps]');
    this.steps = Array.from(section.querySelectorAll('[data-move-steps-step]'));
    this.nodes = Array.from(section.querySelectorAll('[data-move-steps-node]'));

    this.svg = section.querySelector('[data-move-steps-path]');
    this.basePath = section.querySelector('[data-move-steps-path-base]');
    this.progressPath = section.querySelector('[data-move-steps-path-progress]');

    this.activeIndex = 0;

    if (
      !this.journey ||
      !this.svg ||
      !this.basePath ||
      !this.progressPath ||
      this.steps.length === 0 ||
      this.nodes.length !== this.steps.length
    ) {
      return;
    }

    this.handleResize = this.handleResize.bind(this);

    this.steps.forEach((step, index) => {
      const button = step.querySelector('button');
      if (!button) return;

      button.addEventListener('click', () => {
        this.setActiveIndex(index, { scroll: false });
      });
    });

    // Prefer observing the journey container (layout changes due to responsive images)
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.rebuildPath());
      this.resizeObserver.observe(this.journey);
    }

    window.addEventListener('resize', this.handleResize, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.rebuildPath()).catch(() => {});
    }

    this.setupIntersectionObserver();

    this.rebuildPath();
    this.setActiveIndex(0, { scroll: false, silent: true });
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        // Choose the most visible step
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible.length === 0) return;

        const stepEl = visible[0].target;
        const idx = this.steps.indexOf(stepEl);
        if (idx >= 0) this.setActiveIndex(idx, { scroll: false });
      },
      {
        root: null,
        threshold: [0.25, 0.4, 0.55, 0.7],
      }
    );

    this.steps.forEach((step) => this.intersectionObserver.observe(step));
  }

  handleResize() {
    // ResizeObserver will usually catch this; this is a safety net.
    this.rebuildPath();
  }

  setActiveIndex(index, { scroll = false, silent = false } = {}) {
    if (!Number.isFinite(index)) return;

    const clamped = Math.max(0, Math.min(index, this.steps.length - 1));
    if (clamped === this.activeIndex && !silent) return;

    this.activeIndex = clamped;

    this.steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === clamped);
    });

    this.updateProgress();

    if (scroll) {
      this.steps[clamped].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  rebuildPath() {
    if (!this.journey || !this.svg || !this.basePath || !this.progressPath) return;

    const width = this.journey.clientWidth;
    const height = this.journey.offsetHeight;

    if (!width || !height) return;

    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const journeyRect = this.journey.getBoundingClientRect();
    const points = this.nodes
      .map((node) => {
        const r = node.getBoundingClientRect();
        return {
          x: r.left - journeyRect.left + r.width / 2,
          y: r.top - journeyRect.top + r.height / 2,
        };
      })
      // Ensure y is strictly increasing to avoid self-intersections
      .sort((a, b) => a.y - b.y);

    if (points.length < 2) return;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midY = (prev.y + cur.y) / 2;

      // Smooth vertical "S" curve between nodes.
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }

    this.basePath.setAttribute('d', d);
    this.progressPath.setAttribute('d', d);

    // Prepare dash drawing on the progress path
    const total = this.progressPath.getTotalLength();
    this.progressPath.style.strokeDasharray = `${total}`;

    // Ensure the base path is always solid
    this.basePath.style.strokeDasharray = 'none';
    this.basePath.style.strokeDashoffset = '0';

    // Update progress on next frame so styles apply before dash offset
    requestAnimationFrame(() => {
      this.updateProgress();
    });
  }

  updateProgress() {
    if (!this.progressPath) return;

    const total = this.progressPath.getTotalLength();
    const denom = Math.max(1, this.steps.length - 1);
    const t = this.activeIndex / denom;

    this.progressPath.style.strokeDashoffset = `${total * (1 - t)}`;
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
    window.removeEventListener('resize', this.handleResize);
  }
}

const moveStepsInstances = new WeakMap();

function initMoveSteps(scope = document) {
  const sections = scope.querySelectorAll('.move-steps');

  sections.forEach((section) => {
    if (moveStepsInstances.has(section)) return;
    moveStepsInstances.set(section, new MoveStepsJourney(section));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initMoveSteps());
} else {
  initMoveSteps();
}

// Support Shopify theme editor section reloads
if (typeof document !== 'undefined') {
  document.addEventListener('shopify:section:load', (event) => {
    initMoveSteps(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    const sectionEl = event.target.querySelector('.move-steps');
    if (!sectionEl) return;

    const instance = moveStepsInstances.get(sectionEl);
    if (instance && instance.destroy) instance.destroy();
  });
}

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { MoveStepsJourney, initMoveSteps };
}
