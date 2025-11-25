class MoveTestimonialsScroller {
  constructor(section) {
    this.section = section;
    this.rows = Array.from(
      section.querySelectorAll('.move-testimonials__row--testimonials')
    );

    if (!this.rows.length) return;

    this.rows.forEach((row) => this.randomizeItems(row));
  }

  randomizeItems(track) {
    const items = Array.from(track.children);
    if (items.length <= 1) return;

    const shuffled = items
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);

    shuffled.forEach((item) => this.track.appendChild(item));
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
