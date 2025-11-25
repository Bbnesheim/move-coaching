class MoveTestimonialsScroller {
  constructor(section) {
    this.section = section;
    this.track = section.querySelector('.move-testimonials__grid');
    this.nextArrow = section.querySelector('.move-testimonials__arrow--next');
    this.prevArrow = section.querySelector('.move-testimonials__arrow--prev');

    if (!this.track || !this.nextArrow) return;

    this.handleScroll = this.handleScroll.bind(this);

    this.nextArrow.addEventListener('click', () => this.scrollBy(1));
    if (this.prevArrow) {
      this.prevArrow.addEventListener('click', () => this.scrollBy(-1));
    }

    this.track.addEventListener('scroll', this.handleScroll);

    // Set initial arrow visibility based on starting scroll position
    this.handleScroll();
  }

  scrollBy(direction) {
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

    const delta = (itemWidth + gap) * direction;

    this.track.scrollBy({ left: delta, behavior: 'smooth' });
  }

  handleScroll() {
    if (!this.track) return;

    const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth - 1;
    const atStart = this.track.scrollLeft <= 0;
    const atEnd = this.track.scrollLeft >= maxScrollLeft;

    if (this.prevArrow) {
      this.prevArrow.classList.toggle('move-testimonials__arrow--hidden', atStart);
    }

    if (this.nextArrow) {
      this.nextArrow.classList.toggle('move-testimonials__arrow--hidden', atEnd);
    }
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
