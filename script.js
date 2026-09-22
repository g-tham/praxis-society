const header = document.querySelector('#siteHeader');
const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const mobileDock = document.querySelector('.mobile-dock');

const routeMap = {
  home: 'home',
  about: 'about',
  pillars: 'pillars',
  membership: 'membership',
  traditions: 'traditions',
  governance: 'governance'
};

const setHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 35);
  if (mobileDock) mobileDock.classList.toggle('visible', window.scrollY > Math.min(520, window.innerHeight * 0.62));
};
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menu.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  mobileNav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  mobileNav.classList.remove('open');
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}));

const scrollToRoute = (route, smooth = true) => {
  const sectionId = routeMap[route];
  const section = sectionId ? document.getElementById(sectionId) : null;
  if (!section) return;

  section.scrollIntoView({
    behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto',
    block: 'start'
  });
};

document.querySelectorAll('[data-route]').forEach(link => {
  link.addEventListener('click', event => {
    const route = link.dataset.route;
    if (!routeMap[route]) return;

    event.preventDefault();
    const path = route === 'home' ? '/' : `/${route}`;

    if (window.location.pathname !== path) {
      history.pushState({ route }, '', path);
    }

    scrollToRoute(route);
  });
});

window.addEventListener('popstate', () => {
  const route = window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home';
  scrollToRoute(route, false);
});

const redirectRoute = new URLSearchParams(window.location.search).get('route');
const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, '');
const initialRoute = redirectRoute && routeMap[redirectRoute]
  ? redirectRoute
  : (routeMap[pathRoute] ? pathRoute : 'home');

if (redirectRoute && routeMap[redirectRoute]) {
  history.replaceState({ route: redirectRoute }, '', `/${redirectRoute}`);
}

if (initialRoute !== 'home') {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToRoute(initialRoute, false));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const crest = document.querySelector('.hero-crest');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight && crest) {
      crest.style.transform = `translateY(${window.scrollY * 0.035}px)`;
    }
  }, { passive: true });
}

if (mobileDock) {
  mobileDock.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileDock.classList.remove('visible');
    setTimeout(setHeader, 450);
  }));
}
