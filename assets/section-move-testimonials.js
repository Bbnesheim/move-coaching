class MoveTestimonialsScroller {
  constructor(section) {
    this.section = section;
    this.track = section.querySelector('.move-testimonials__grid');
    this.arrow = section.querySelector('.move-testimonials__arrow');

    if (!this.track || !this.arrow) return;

    this.arrow.addEventListener('click', () => this.scrollNext());
  }

  scrollNext() {
    if (!this.track) return;

    const firstItem = this.track.querySelector('.move-testimonials__item');
    const itemWidth = firstItem
      ? firstItem.getBoundingClientRect().width
      : 320;

    const gap = parseFloat(
      getComputedStyle(this.track).columnGap ||
        getComputedStyle(this.track).gap ||
        24
    );

    const delta = itemWidth + gap;

    this.track.scrollBy({ left: delta, behavior: 'smooth' });
  }
}

function initMoveTestimonials(scope = document) {
  const sections = scope.querySelectorAll('.move-testimonials--scroller');
  sections.forEach((section) => new MoveTestimonialsScroller(section));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initMoveTestimonials());
} else {
  initMoveTestimonials();
}

// Support Shopify theme editor section reloads
if (typeof document !== 'undefined') {
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.move-testimonials--scroller');
    if (section) {
      initMoveTestimonials(section.parentElement || section);
    }
  });
}
