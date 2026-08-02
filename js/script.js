const header = document.querySelector('.header');
const nav = document.querySelector('#nav');
const menuToggle = document.querySelector('#menu-toggle');
const openIcon = document.querySelector('.menu-toggle__icon--open');
const closeIcon = document.querySelector('.menu-toggle__icon--close');

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  openIcon.style.display = isOpen ? 'none' : 'block';
  closeIcon.style.display = isOpen ? 'block' : 'none';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (openIcon) openIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const dashboardWrap = document.querySelector('.features__visual .dashboard-wrap');
const dashboard = document.querySelector('.features__visual .dashboard');

dashboardWrap?.addEventListener('pointermove', (event) => {
  if (window.matchMedia('(hover: none)').matches) return;
  const bounds = dashboardWrap.getBoundingClientRect();
  const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
  const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
  dashboard.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

dashboardWrap?.addEventListener('pointerleave', () => {
  dashboard.style.transform = '';
});
