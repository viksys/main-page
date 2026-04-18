/* ============================================================
   VIKASANA SYSTEMS — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     PAGE ROUTER
  ---------------------------------------------------------- */
  var PAGES = ['home', 'domains', 'about', 'technology', 'investors', 'contact', 'terms', 'privacy'];

  function showPage(id) {
    if (!id || PAGES.indexOf(id) === -1) id = 'home';

    PAGES.forEach(function (p) {
      var el = document.getElementById('pg-' + p);
      if (el) el.classList.toggle('active', p === id);
    });

    document.querySelectorAll('.nav-links a[data-page]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-page') === id);
    });

    window.scrollTo(0, 0);
    closeMob();
    initReveal();


  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-page]');
    if (!el) return;
    e.preventDefault();
    showPage(el.getAttribute('data-page'));
  });

  /* ----------------------------------------------------------
     MOBILE NAV
  ---------------------------------------------------------- */
  var mobNav  = document.getElementById('mob-nav');
  var btnOpen = document.getElementById('nav-open');
  var btnClose= document.getElementById('nav-close');

  function closeMob() {
    if (!mobNav) return;
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'false');
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', function () {
      mobNav.classList.add('open');
      document.body.style.overflow = 'hidden';
      btnOpen.setAttribute('aria-expanded', 'true');
    });
  }
  if (btnClose) btnClose.addEventListener('click', closeMob);

  /* ----------------------------------------------------------
     UxV ANIMATION
     Targets the domains page heading: U[Land/Air/Water]V
     Cycles every 2.4s with slide-up-out / slide-down-in
  ---------------------------------------------------------- */
  /* ----------------------------------------------------------
     UxV SLOT MACHINE ANIMATION
     Words spin upward like a slot reel on a fixed interval.
     Reel contains: Land → Air → Water (loops)
     On each tick: translateY moves up by one slot height (0.9em × fontSize)
     When last word reached, instantly reset to top (no transition) then spin again
  ---------------------------------------------------------- */
  var UXV_WORDS   = ['Land', 'Air', 'Water'];
  var uxvTotal    = UXV_WORDS.length;
  var uxvCurrent  = 0;
  var uxvReel     = document.getElementById('uxv-reel');
  var uxvSubEl    = document.getElementById('uxv-expand-word');
  var uxvSlot     = uxvReel ? uxvReel.parentElement : null;

  var UXV_INTERVAL  = 2400; /* ms between each spin */
  var UXV_SPIN_DUR  = 420;  /* ms for the spin transition */

  function spinUxV() {
    if (!uxvReel) return;

    var next = (uxvCurrent + 1) % uxvTotal;

    /* Compute one-slot height in px from the actual rendered font */
    var slotH = uxvSlot ? uxvSlot.offsetHeight : 0;
    if (slotH === 0) slotH = parseInt(window.getComputedStyle(uxvReel).fontSize, 10) * 0.9;

    /* Animate the reel upward by one slot */
    uxvReel.style.transition = 'transform ' + UXV_SPIN_DUR + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
    uxvReel.style.transform  = 'translateY(-' + ((uxvCurrent + 1) * slotH) + 'px)';

    /* After spin completes, update subtitle */
    setTimeout(function () {
      if (uxvSubEl) {
        uxvSubEl.style.transition = 'opacity 0.18s ease';
        uxvSubEl.style.opacity    = '0';
        setTimeout(function () {
          if (uxvSubEl) {
            uxvSubEl.textContent     = UXV_WORDS[next];
            uxvSubEl.style.opacity   = '1';
          }
        }, 180);
      }

      uxvCurrent = next;

      /* When we've shown the last word, silently snap back to top
         so the loop is seamless */
      if (uxvCurrent === uxvTotal - 1) {
        setTimeout(function () {
          uxvReel.style.transition = 'none';
          uxvReel.style.transform  = 'translateY(0)';
          uxvCurrent = 0;
          /* Re-sync subtitle to first word */
          if (uxvSubEl) {
            uxvSubEl.style.transition = 'none';
            uxvSubEl.textContent      = UXV_WORDS[0];
          }
        }, UXV_SPIN_DUR + 80);
      }

    }, UXV_SPIN_DUR);
  }

  /* Init */
  if (uxvReel) {
    uxvReel.style.transform = 'translateY(0)';
    if (uxvSubEl) uxvSubEl.textContent = UXV_WORDS[0];
    /* First spin after hero animations settle */
    setTimeout(function () {
      setInterval(spinUxV, UXV_INTERVAL);
    }, 2000);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
  ---------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }
  initReveal();

  /* about page — no bar animation needed */

  /* ----------------------------------------------------------
     NAV SCROLL STATE
  ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (!nav) return;
    nav.style.borderBottomColor = window.scrollY > 60
      ? 'rgba(174,182,168,0.22)'
      : 'rgba(174,182,168,0.12)';
  }, { passive: true });

  /* ----------------------------------------------------------
     HERO VIDEO FALLBACK
  ---------------------------------------------------------- */
  var heroVid = document.getElementById('hero-vid');
  if (heroVid) {
    heroVid.addEventListener('error', function () {
      var wrap = document.querySelector('.hero-video-wrap');
      if (wrap) wrap.style.background = 'linear-gradient(150deg, #1a1c18 0%, #262924 50%, #3C4520 100%)';
    });
  }

  /* ----------------------------------------------------------
     CONTACT FORM
  ---------------------------------------------------------- */
  var submitBtn = document.getElementById('form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var nameEl  = document.getElementById('f-name');
      var emailEl = document.getElementById('f-email');
      if (!nameEl || !nameEl.value.trim() || !emailEl || !emailEl.value.trim()) {
        var orig = submitBtn.textContent;
        submitBtn.textContent      = 'Fill required fields';
        submitBtn.style.background = 'rgba(174,182,168,0.4)';
        setTimeout(function () {
          submitBtn.textContent      = orig;
          submitBtn.style.background = '';
        }, 2000);
        return;
      }
      submitBtn.textContent   = 'Transmitting...';
      submitBtn.style.opacity = '0.6';
      setTimeout(function () {
        submitBtn.textContent      = 'Enquiry Received';
        submitBtn.style.opacity    = '1';
        submitBtn.style.background = 'var(--olive)';
        submitBtn.style.color      = 'var(--off-white)';
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     CUSTOM CURSOR
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    var ring = document.getElementById('cur-ring');
    var dot  = document.getElementById('cur-dot');
    var ch   = document.getElementById('cur-h');
    var cv   = document.getElementById('cur-v');

    if (ring && dot) {
      var mx = -200, my = -200, rx = -200, ry = -200;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        if (ch) { ch.style.left = mx + 'px'; ch.style.top = my + 'px'; }
        if (cv) { cv.style.left = mx + 'px'; cv.style.top = my + 'px'; }
      });

      (function animRing() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
      })();

      document.querySelectorAll('a, button, .domain-card, .metric-cell, .tech-pillar, .keypoint, .cert-row, .dpc').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          ring.style.width  = '52px';
          ring.style.height = '52px';
          ring.style.borderColor = 'rgba(111,122,96,0.75)';
        });
        el.addEventListener('mouseleave', function () {
          ring.style.width  = '34px';
          ring.style.height = '34px';
          ring.style.borderColor = 'rgba(240,239,234,0.55)';
        });
      });
    }
  }

})();
