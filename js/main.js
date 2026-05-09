document.addEventListener('DOMContentLoaded', () => {
  // ---------- Gallery filter ----------
  const tiles = [...document.querySelectorAll('#gallery .tile')];
  const filterBtns = [...document.querySelectorAll('#filters .filter-btn')];
  const counter = document.getElementById('count');

  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    let visible = 0;
    tiles.forEach(t => {
      const match = f === 'all' || t.dataset.cat === f;
      t.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    counter.textContent = String(visible).padStart(2, '0') + ' / ' + String(tiles.length).padStart(2, '0');
  }));

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Contact form — Web3Forms ----------
  const form = document.getElementById('form');
  const successBox = document.getElementById('success');
  const errorBox = document.getElementById('error');
  const submitBtn = form.querySelector('.submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    successBox.classList.remove('is-visible');
    errorBox.classList.remove('is-visible');

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Wysyłanie… <span class="arr">⟳</span>';

    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        successBox.classList.add('is-visible');
        form.reset();
        setTimeout(() => successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      } else {
        errorBox.classList.add('is-visible');
      }
    } catch {
      errorBox.classList.add('is-visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // ---------- Smooth scroll for in-page links ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 60,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // ---------- Nav background on scroll ----------
  const nav = document.querySelector('.nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 100) {
          nav.style.background = 'rgba(11,11,12,.92)';
          nav.style.borderBottomColor = 'rgba(255,255,255,.08)';
        } else {
          nav.style.background = '';
          nav.style.borderBottomColor = '';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
});
