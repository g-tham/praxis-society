const header = document.querySelector('#siteHeader');
const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 35);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menu.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  mobileNav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  mobileNav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}));

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
