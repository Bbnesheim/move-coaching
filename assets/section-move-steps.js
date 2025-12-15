class MoveStepsJourney {
  constructor(section) {
    this.section = section;
    this.journey = section.querySelector('[data-move-steps]');
    this.steps = Array.from(section.querySelectorAll('[data-move-steps-step]'));
    this.nodes = Array.from(section.querySelectorAll('[data-move-steps-node]'));
    this.mediaInners = Array.from(section.querySelectorAll('.move-steps__media-inner'));

    this.svg = section.querySelector('[data-move-steps-path]');

    this.activeIndex = 0;
    this.nodePoints = [];
    this.mediaPoints = [];
    this.segmentAnchors = [];
    this.segments = [];

    if (!this.journey || !this.svg || this.steps.length === 0 || this.nodes.length !== this.steps.length) {
      return;
    }

    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.steps.forEach((step, index) => {
      const button = step.querySelector('button');
      if (!button) return;

      button.addEventListener('click', () => {
        // Scroll to the step so the line "fills" through natural scroll.
        this.setActiveIndex(index, { scroll: true });
      });
    });

    // Prefer observing the journey container (layout changes due to responsive images)
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.rebuildPath());
      this.resizeObserver.observe(this.journey);
    }

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.rebuildPath()).catch(() => {});
    }

    // Rebuild once images have loaded (prevents initial wrong path when lazy images resize)
    this.section
      .querySelectorAll('.move-steps__image')
      .forEach((img) => img.addEventListener('load', () => this.rebuildPath(), { once: true }));

    this.rebuildPath();
    this.setActiveIndex(0, { scroll: false, silent: true });
    this.updateFromScroll();
  }

  handleResize() {
    this.rebuildPath();
  }

  handleScroll() {
    if (this.rafPending) return;
    this.rafPending = true;

    requestAnimationFrame(() => {
      this.rafPending = false;
      this.updateFromScroll();
    });
  }

  setActiveIndex(index, { scroll = false, silent = false } = {}) {
    if (!Number.isFinite(index)) return;

    const clamped = Math.max(0, Math.min(index, this.steps.length - 1));
    if (clamped === this.activeIndex && !silent) return;

    this.activeIndex = clamped;

    this.steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === clamped);
    });

    if (scroll) {
      this.steps[clamped].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  rebuildPath() {
    if (!this.journey || !this.svg) return;

    const width = this.journey.clientWidth;
    const height = this.journey.offsetHeight;

    if (!width || !height) return;

    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Clear and rebuild all segment paths.
    this.svg.innerHTML = '';
    this.segments = [];

    const journeyRect = this.journey.getBoundingClientRect();

    // Compute anchor points in journey coordinates.
    this.nodePoints = this.nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return {
        x: r.left - journeyRect.left + r.width / 2,
        y: r.top - journeyRect.top + r.height / 2,
      };
    });

    this.mediaPoints = this.mediaInners.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - journeyRect.left + r.width / 2,
        y: r.top - journeyRect.top + r.height / 2,
      };
    });

    // Desired mapping:
    // - Segment 0: point 1 (node[0]) -> image 2 (media[1])
    // - Segment 1: point 2 (node[1]) -> image 3 (media[2])
    this.segmentAnchors = [];

    if (this.nodePoints[0] && this.mediaPoints[1]) {
      this.segmentAnchors.push({ start: this.nodePoints[0], end: this.mediaPoints[1] });
    }

    if (this.nodePoints[1] && this.mediaPoints[2]) {
      this.segmentAnchors.push({ start: this.nodePoints[1], end: this.mediaPoints[2] });
    }

    // Fallback if we don't have all media points (e.g. missing images)
    if (this.segmentAnchors.length === 0 && this.nodePoints.length >= 2) {
      for (let i = 0; i < this.nodePoints.length - 1; i++) {
        this.segmentAnchors.push({ start: this.nodePoints[i], end: this.nodePoints[i + 1] });
      }
    }

    if (this.segmentAnchors.length === 0) return;

    const segmentCount = this.segmentAnchors.length;
    const amplitude = Math.min(width * 0.28, 420);

    for (let i = 0; i < segmentCount; i++) {
      const prev = this.segmentAnchors[i].start;
      const cur = this.segmentAnchors[i].end;
      const dy = cur.y - prev.y;

      // Big flowing curve: bend outward between each pair.
      const direction = i % 2 === 0 ? 1 : -1;
      const bendX = (prev.x + cur.x) / 2 + direction * amplitude;
      const y1 = prev.y + dy * 0.35;
      const y2 = prev.y + dy * 0.65;

      const d = `M ${prev.x} ${prev.y} C ${bendX} ${y1}, ${bendX} ${y2}, ${cur.x} ${cur.y}`;

      const base = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      base.setAttribute('d', d);
      base.setAttribute(
        'class',
        `move-steps__path-line move-steps__path-line--base move-steps__path-line--segment-${i}`
      );

      const progress = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      progress.setAttribute('d', d);
      progress.setAttribute(
        'class',
        `move-steps__path-line move-steps__path-line--progress move-steps__path-line--segment-${i}`
      );
      progress.style.opacity = '0';

      this.svg.appendChild(base);
      this.svg.appendChild(progress);

      this.segments.push({ base, progress, start: prev, end: cur });
    }

    this.updateFromScroll();
  }

  updateFromScroll() {
    if (!this.journey || this.segments.length === 0) return;

    const rect = this.journey.getBoundingClientRect();

    // Fade each segment from transparent -> solid as the viewport center passes through it.
    const viewportCenterY = window.innerHeight / 2;

    this.segments.forEach(({ progress: segProgress, start, end }) => {
      const startY = rect.top + start.y;
      const endY = rect.top + end.y;
      const denom = Math.max(1, endY - startY);

      let t = (viewportCenterY - startY) / denom;
      t = Math.max(0, Math.min(1, t));

      segProgress.style.opacity = `${t}`;
    });

    // Keep active highlighting roughly in sync with overall scroll progress.
    const firstStart = this.segments[0].start;
    const lastEnd = this.segments[this.segments.length - 1].end;
    const firstY = rect.top + firstStart.y;
    const lastY = rect.top + lastEnd.y;
    const denom = Math.max(1, lastY - firstY);

    let overall = (viewportCenterY - firstY) / denom;
    overall = Math.max(0, Math.min(1, overall));

    const active = Math.max(0, Math.min(this.steps.length - 1, Math.round(overall * (this.steps.length - 1))));
    this.setActiveIndex(active, { scroll: false, silent: true });
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
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
