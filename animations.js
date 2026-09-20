(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  body.classList.add('motion-v6');

  // Split the hero title so its two lines can enter independently.
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle && !heroTitle.querySelector('.hero-title-line')) {
    const compactText = heroTitle.textContent.replace(/\s+/g, ' ').trim();
    if (compactText === 'Principles in Action.') {
      heroTitle.innerHTML =
        '<span class="hero-title-line hero-title-primary">Principles</span>' +
        '<span class="hero-title-line hero-title-accent"><em>in Action.</em></span>';
    }
  }

  // Add a one-time ceremonial light sweep over the crest.
  const crestStage = document.querySelector('.crest-stage');
  if (crestStage && !crestStage.querySelector('.crest-sheen')) {
    const sheen = document.createElement('span');
    sheen.className = 'crest-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    crestStage.appendChild(sheen);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => body.classList.add('motion-ready'));
  });

  if (reduceMotion) {
    document.querySelectorAll('.section-label').forEach(el => el.classList.add('line-drawn'));
    const closingRule = document.querySelector('.closing-rule');
    if (closingRule) closingRule.classList.add('line-drawn');
    return;
  }

  // Draw gold accent lines as sections enter.
  const lineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('line-drawn');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.45, rootMargin: '0px 0px -8%' });

  document.querySelectorAll('.section-label, .closing-rule').forEach(el => lineObserver.observe(el));

  // Institutional and document cards get a touch-friendly reveal on mobile.
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.classList.contains('tradition-card')) {
        entry.target.classList.toggle('card-in-view', entry.isIntersecting);
      } else if (entry.target.classList.contains('document-card')) {
        entry.target.classList.toggle('doc-in-view', entry.isIntersecting);
      }
    });
  }, { threshold: 0.55, rootMargin: '-8% 0px -14%' });

  document.querySelectorAll('.tradition-card, .document-card').forEach(el => cardObserver.observe(el));

  // On mobile, subtly emphasize whichever pillar is centered in the swipe row.
  const pillarList = document.querySelector('.pillar-list');
  if (pillarList) {
    const pillarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('active-card', entry.isIntersecting && entry.intersectionRatio >= 0.62);
      });
    }, { root: pillarList, threshold: [0.4, 0.62, 0.82] });

    pillarList.querySelectorAll('.pillar').forEach(el => pillarObserver.observe(el));
  }

  // Membership path: timed sequence on wider screens, scroll-progressive on mobile.
  const journey = document.querySelector('.journey');
  const steps = journey ? [...journey.querySelectorAll('.step')] : [];

  if (journey && steps.length) {
    const playDesktopJourney = () => {
      if (window.innerWidth <= 720) return;
      journey.classList.add('journey-play');
      steps.forEach((step, index) => {
        window.setTimeout(() => step.classList.add('journey-active'), 220 + index * 185);
      });
    };

    const journeyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        playDesktopJourney();
        if (window.innerWidth > 720) observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    journeyObserver.observe(journey);
  }

  const updateMobileJourney = () => {
    if (!journey || window.innerWidth > 720) return;

    const rect = journey.getBoundingClientRect();
    const viewportMarker = window.innerHeight * 0.68;
    const start = window.innerHeight * 0.78;
    const total = Math.max(rect.height, 1);
    const raw = (start - rect.top) / total;
    const progress = Math.max(0, Math.min(1, raw));

    journey.style.setProperty('--journey-progress', progress.toFixed(3));
    journey.classList.add('journey-play');

    steps.forEach(step => {
      const stepRect = step.getBoundingClientRect();
      step.classList.toggle('journey-active', stepRect.top <= viewportMarker);
    });
  };

  // Closing sequence marker.
  const closing = document.querySelector('.closing');
  if (closing) {
    const closingObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        closing.classList.add('closing-in-view');
        observer.unobserve(closing);
      });
    }, { threshold: 0.28 });
    closingObserver.observe(closing);
  }

  // Subtle scroll parallax. Kept deliberately restrained on mobile.
  const heroWord = document.querySelector('.hero-word');
  const serviceNumber = document.querySelector('.service-number');
  const closingWord = document.querySelector('.closing-word');

  let ticking = false;
  const updateScrollMotion = () => {
    ticking = false;
    const y = window.scrollY;
    const mobileFactor = window.innerWidth <= 720 ? 0.45 : 1;

    if (heroWord && y < window.innerHeight * 1.35) {
      heroWord.style.setProperty('--parallax-y', `${(y * 0.055 * mobileFactor).toFixed(1)}px`);
    }

    if (serviceNumber) {
      const r = serviceNumber.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const offset = (window.innerHeight * 0.5 - r.top) * 0.045 * mobileFactor;
        serviceNumber.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
      }
    }

    if (closingWord) {
      const r = closingWord.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const offset = (window.innerHeight * 0.5 - r.top) * -0.035 * mobileFactor;
        closingWord.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
      }
    }

    updateMobileJourney();
  };

  const requestScrollMotion = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollMotion);
  };

  window.addEventListener('scroll', requestScrollMotion, { passive: true });
  window.addEventListener('resize', requestScrollMotion, { passive: true });
  updateScrollMotion();
})();
