// Shared behaviour for case-study pages: scroll reveal, count-up stats, gallery lightbox.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

if (!reduce) {
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / 1200), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => statIO.observe(el));
}

// Lightbox for any link marked data-zoom
const box = document.createElement('div');
box.className = 'lightbox';
box.innerHTML = '<img alt="" />';
document.body.appendChild(box);
const boxImg = box.querySelector('img');
document.querySelectorAll('a[data-zoom]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    boxImg.src = a.href;
    boxImg.alt = a.querySelector('img')?.alt || '';
    box.classList.add('open');
  });
});
box.addEventListener('click', () => box.classList.remove('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.remove('open'); });
