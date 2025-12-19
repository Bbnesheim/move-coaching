const clamp01 = (n) => Math.max(0, Math.min(1, n));

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

function parseSectionJson(section) {
  const el = section.querySelector('[data-workouts-scroll-data]');
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    return null;
  }
}

function getDurationVh(section, data) {
  const fromData = data && Number(data.durationVh);
  const fromAttr = Number(section.getAttribute('data-duration-vh'));
  const fallback = 300;
  if (Number.isFinite(fromAttr) && fromAttr > 0) return fromAttr;
  if (Number.isFinite(fromData) && fromData > 0) return fromData;
  return fallback;
}

class WorkoutsScrollInstance {
  constructor(section) {
    this.section = section;
    this.scene = section.querySelector('[data-workouts-scroll-scene]');
    this.pin = section.querySelector('[data-workouts-scroll-pin]');

    this.data = parseSectionJson(section);
    this.items = (this.data && Array.isArray(this.data.items) ? this.data.items : []).slice(0, 3);

    this.durationVh = getDurationVh(section, this.data);

    this.headingEl = section.querySelector('[data-workouts-scroll-heading]');
    this.mediaEl = section.querySelector('[data-workouts-scroll-media]');
    this.cardEl = section.querySelector('[data-workouts-scroll-card]');
    this.cardTitleEl = section.querySelector('[data-workouts-scroll-card-title]');
    this.cardBodyEl = section.querySelector('[data-workouts-scroll-card-body]');
    this.labelEls = Array.from(section.querySelectorAll('[data-workouts-scroll-label]'));
    this.bgVideoEl = section.querySelector('[data-workouts-scroll-bg-video]');

    this.activeIndex = 0;
    this.isReducedMotion = prefersReducedMotion();

    this.scrollTrigger = null;
    this.enterTrigger = null;

    this.rafId = null;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);

    this.transitionToken = 0;
    this.headingRevealed = false;

    if (!this.scene || !this.pin || this.items.length === 0) return;

    this.section.style.setProperty('--workouts-scroll-duration-vh', String(this.durationVh));

    this.labelEls.forEach((el) => {
      el.addEventListener('click', this.onLabelClick);
    });

    // Ensure initial render is correct even if Liquid rendered placeholders.
    this.setStep(0, { immediate: true });

    // Try to play the background video (best-effort).
    if (this.bgVideoEl && this.bgVideoEl.play) {
      this.bgVideoEl.play().catch(() => {});
    }

    if (this.isReducedMotion) {
      this.revealHeading();
      return;
    }

    if (this.hasGsap()) {
      this.initGsap();
    } else {
      this.initFallback();
    }
  }

  hasGsap() {
    return typeof window !== 'undefined' && window.gsap && window.ScrollTrigger;
  }

  revealHeading() {
    if (this.headingRevealed) return;
    this.headingRevealed = true;
    this.section.classList.add('is-heading-visible');
  }

  initGsap() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      // If registration fails for any reason, fallback.
      this.initFallback();
      return;
    }

    this.enterTrigger = ScrollTrigger.create({
      trigger: this.scene,
      start: 'top 80%',
      onEnter: () => this.revealHeading(),
      onEnterBack: () => this.revealHeading(),
    });

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.scene,
      start: 'top top',
      end: () => `+=${Math.round((window.innerHeight || 0) * (this.durationVh / 100))}`,
      pin: this.pin,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        this.onProgress(self.progress);
      },
    });
  }

  initFallback() {
    // Use sticky pinning and manual progress mapping.
    this.section.classList.add('is-fallback');
    this.pin.classList.add('is-sticky');

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.onScroll();
  }

  onResize() {
    this.onScroll();

    // If GSAP is used, force a refresh on resize.
    if (this.hasGsap() && window.ScrollTrigger && window.ScrollTrigger.refresh) {
      window.ScrollTrigger.refresh();
    }
  }

  onScroll() {
    if (this.rafId) return;
    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null;
      this.updateProgressFromScroll();
    });
  }

  updateProgressFromScroll() {
    const rect = this.scene.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;

    // When rect.top === 0 => progress 0
    // When rect.top === -(sceneHeight - viewportH) => progress 1
    const sceneHeight = this.scene.offsetHeight || 1;
    const scrollable = Math.max(1, sceneHeight - viewportH);
    const progress = clamp01(-rect.top / scrollable);

    if (rect.top <= viewportH * 0.2 && rect.bottom >= viewportH * 0.8) {
      this.revealHeading();
    }

    this.onProgress(progress);
  }

  onProgress(progress) {
    const steps = this.items.length;
    if (steps <= 1) return;

    // Map 0..1 progress to 0..steps-1 with thresholds around 0, 0.33, 0.66
    const nextIndex = Math.min(steps - 1, Math.floor(progress * steps));
    this.setStep(nextIndex);
  }

  onLabelClick(event) {
    const btn = event.currentTarget;
    const idx = Number(btn.getAttribute('data-index'));
    if (!Number.isFinite(idx)) return;

    // In reduced motion mode, labels are the primary way to switch content.
    // In scroll mode, this can still be useful but will be overridden by scroll.
    this.setStep(idx, { fromUser: true });
  }

  setActiveLabel(index) {
    this.labelEls.forEach((el, i) => {
      const isActive = i === index;
      el.classList.toggle('is-active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
      el.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  buildMediaNode(item) {
    const type = item && item.media && item.media.type;

    if (type === 'video' && item.media && item.media.src) {
      const v = document.createElement('video');
      v.className = 'workouts-scroll__athlete-video';
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.autoplay = true;
      v.preload = 'metadata';
      if (item.media.poster) v.poster = item.media.poster;

      const source = document.createElement('source');
      source.src = item.media.src;
      source.type = 'video/mp4';
      v.appendChild(source);

      // Best-effort play (may be blocked on some devices).
      v.play().catch(() => {});

      return v;
    }

    // Default to image.
    const img = document.createElement('img');
    img.className = 'workouts-scroll__athlete-image';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = (item && item.media && item.media.alt) || '';
    img.src = (item && item.media && item.media.src) || '';
    return img;
  }

  applyStep(index) {
    const item = this.items[index];
    if (!item) return;

    this.setActiveLabel(index);

    if (this.cardTitleEl) this.cardTitleEl.textContent = item.cardTitle || '';
    if (this.cardBodyEl) this.cardBodyEl.innerHTML = item.cardBody || '';

    if (this.mediaEl) {
      this.mediaEl.innerHTML = '';
      this.mediaEl.appendChild(this.buildMediaNode(item));
    }
  }

  animateSwap(nextIndex) {
    const prevToken = ++this.transitionToken;
    const card = this.cardEl;
    const media = this.mediaEl;

    const apply = () => {
      // If another transition started while we were animating, bail.
      if (prevToken !== this.transitionToken) return;
      this.applyStep(nextIndex);
    };

    if (!card || !media) {
      apply();
      return;
    }

    // Prefer GSAP for smoother motion if available (even if ScrollTrigger isn't).
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      gsap.killTweensOf([card, media]);

      const tl = gsap.timeline({
        defaults: { duration: 0.22, ease: 'power2.out' },
      });

      tl.to([card, media], { autoAlpha: 0, y: 16, stagger: 0.03 });
      tl.add(() => {
        apply();
        gsap.set([card, media], { y: -16 });
      });
      tl.to([card, media], { autoAlpha: 1, y: 0, stagger: 0.03 });
      return;
    }

    // Fallback animations via WAAPI.
    const outOpts = { duration: 220, easing: 'ease-out', fill: 'forwards' };
    const inOpts = { duration: 220, easing: 'ease-out', fill: 'forwards' };

    const outCard = card.animate(
      [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(16px)' },
      ],
      outOpts
    );
    const outMedia = media.animate(
      [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(16px)' },
      ],
      outOpts
    );

    Promise.allSettled([outCard.finished, outMedia.finished]).then(() => {
      apply();

      if (prevToken !== this.transitionToken) return;

      card.animate(
        [
          { opacity: 0, transform: 'translateY(-16px)' },
          { opacity: 1, transform: 'translateY(0px)' },
        ],
        inOpts
      );
      media.animate(
        [
          { opacity: 0, transform: 'translateY(-16px)' },
          { opacity: 1, transform: 'translateY(0px)' },
        ],
        inOpts
      );
    });
  }

  setStep(nextIndex, { immediate = false } = {}) {
    if (!Number.isFinite(nextIndex)) return;
    const clamped = Math.max(0, Math.min(this.items.length - 1, nextIndex));
    if (clamped === this.activeIndex && !immediate) return;

    this.activeIndex = clamped;

    if (immediate || this.isReducedMotion) {
      this.applyStep(clamped);
      this.revealHeading();
      return;
    }

    this.animateSwap(clamped);
  }

  destroy() {
    this.labelEls.forEach((el) => {
      el.removeEventListener('click', this.onLabelClick);
    });

    this.section.classList.remove('is-fallback');
    this.pin.classList.remove('is-sticky');

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);

    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    this.rafId = null;

    if (this.scrollTrigger && this.scrollTrigger.kill) {
      this.scrollTrigger.kill();
    }
    this.scrollTrigger = null;

    if (this.enterTrigger && this.enterTrigger.kill) {
      this.enterTrigger.kill();
    }
    this.enterTrigger = null;

    // Also kill any triggers associated with this pin in case the theme re-inits.
    if (this.hasGsap() && window.ScrollTrigger && window.ScrollTrigger.getAll) {
      window.ScrollTrigger.getAll().forEach((t) => {
        const triggerEl = t && t.vars && t.vars.trigger;
        const pinEl = t && t.vars && t.vars.pin;
        if (triggerEl === this.scene || pinEl === this.pin) t.kill();
      });
    }
  }
}

const workoutsScrollInstances = new WeakMap();

function initWorkoutsScroll(scope = document) {
  const sections = scope.querySelectorAll('[data-workouts-scroll]');

  sections.forEach((section) => {
    if (workoutsScrollInstances.has(section)) return;
    workoutsScrollInstances.set(section, new WorkoutsScrollInstance(section));
  });
}

function destroyWorkoutsScroll(sectionRoot) {
  const section = sectionRoot && sectionRoot.matches && sectionRoot.matches('[data-workouts-scroll]')
    ? sectionRoot
    : sectionRoot.querySelector && sectionRoot.querySelector('[data-workouts-scroll]');

  if (!section) return;

  const instance = workoutsScrollInstances.get(section);
  if (instance && instance.destroy) instance.destroy();
  workoutsScrollInstances.delete(section);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initWorkoutsScroll());
} else {
  initWorkoutsScroll();
}

// Support Shopify theme editor section reloads
if (typeof document !== 'undefined') {
  document.addEventListener('shopify:section:load', (event) => {
    initWorkoutsScroll(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    destroyWorkoutsScroll(event.target);
  });
}

// Export for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    WorkoutsScrollInstance,
    initWorkoutsScroll,
  };
}
