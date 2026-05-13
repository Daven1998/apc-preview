/* ============================================
   ALGARVE AL COMPLIANCE — Main JS
   ============================================ */

// ----------------------------------------
// 1. Force light mode (dark mode disabled)
// ----------------------------------------
(function () {
  document.documentElement.setAttribute('data-theme', 'light');
})();

// ----------------------------------------
// 2. EU 2024/1028 Countdown to 20 May 2026
// ----------------------------------------
(function () {
  const target = new Date('2026-05-20T00:00:00+01:00').getTime();
  const daysEl = document.querySelector('[data-countdown="days"]');
  const hoursEl = document.querySelector('[data-countdown="hours"]');
  const minutesEl = document.querySelector('[data-countdown="minutes"]');
  const secondsEl = document.querySelector('[data-countdown="seconds"]');

  if (!daysEl) return;

  function tick() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
})();

// ----------------------------------------
// 3. Reveal-on-scroll
// Mark <html class="js"> first so the reveal CSS only fires when JS is on.
// ----------------------------------------
(function () {
  document.documentElement.classList.add('js');

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((i) => i.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((i) => io.observe(i));

  // Safety net: after 600ms, force any still-hidden reveals to visible.
  // Catches edge cases like fullPage screenshots, prerenderers, and very tall pages.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((i) =>
      i.classList.add('is-visible')
    );
  }, 600);
})();

// ----------------------------------------
// 3b. Counter animation — animates [data-counter] when in viewport.
//     data-counter="87" → counts 0..87. Optional data-suffix="/9" appended.
// ----------------------------------------
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animate(el) {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1100;
    const start = performance.now();
    const initial = 0;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(initial + (target - initial) * eased);
      el.textContent = value + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => io.observe(c));
})();

// ----------------------------------------
// 4. Waiting list submission to Google Sheets
// ----------------------------------------
// To wire up: replace SHEETS_ENDPOINT below with your Google Apps Script
// Web App URL. See deployment-guide.md for setup instructions.
// ----------------------------------------
(function () {
  const SHEETS_ENDPOINT = 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL';
  const form = document.querySelector('[data-waitlist-form]');
  if (!form) return;

  const success = document.querySelector('[data-waitlist-success]');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    data.append('source', window.location.pathname || 'landing');
    data.append('timestamp', new Date().toISOString());
    data.append('userAgent', navigator.userAgent);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      if (SHEETS_ENDPOINT.startsWith('https://')) {
        // Real submission to Google Apps Script.
        // Apps Script accepts simple POST requests; using no-cors keeps the
        // browser from blocking on the redirect Apps Script returns.
        await fetch(SHEETS_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body: data,
        });
      } else {
        // Demo mode — simulate a 600ms network call so the success state shows.
        await new Promise((res) => setTimeout(res, 600));
        console.info(
          '[Algarve Property Compliance] Demo capture — replace SHEETS_ENDPOINT in js/main.js to enable live submissions.',
          Object.fromEntries(data)
        );
      }

      form.style.display = 'none';
      if (success) success.classList.add('is-visible');
    } catch (err) {
      console.error(err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Try again';
      }
      alert('Sorry — something went wrong. Please try again or email dave@fdas.co.uk.');
    }
  });
})();
