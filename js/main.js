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
     UxV TYPING ANIMATION
     Cycles: Land → Air → Water
     Erase letter by letter backwards, then type next word forwards
     Gives a real terminal / typewriter feel — no sudden swaps
  ---------------------------------------------------------- */
  var UXV_WORDS  = ['Land', 'Air', 'Water'];
  var uxvIdx     = 0;
  var uxvEl      = document.getElementById('uxv-word');
  var uxvSubEl   = document.getElementById('uxv-expand-word');
  var uxvTyping  = false;

  var ERASE_SPEED = 80;   /* ms per character erase */
  var TYPE_SPEED  = 110;  /* ms per character type */
  var PAUSE_FULL  = 2200; /* ms to hold full word before erasing */
  var PAUSE_EMPTY = 200;  /* ms pause when empty before typing next */

  function eraseWord(word, done) {
    if (!word.length) { done(); return; }
    setTimeout(function () {
      var shorter = word.slice(0, -1);
      if (uxvEl) uxvEl.textContent = shorter;
      eraseWord(shorter, done);
    }, ERASE_SPEED);
  }

  function typeWord(word, idx, done) {
    if (idx > word.length) { done(); return; }
    setTimeout(function () {
      if (uxvEl) uxvEl.textContent = word.slice(0, idx);
      typeWord(word, idx + 1, done);
    }, TYPE_SPEED);
  }

  function runUxVCycle() {
    if (uxvTyping || !uxvEl) return;
    uxvTyping = true;

    var current = UXV_WORDS[uxvIdx];

    /* Hold the full word, then erase */
    setTimeout(function () {
      eraseWord(current, function () {
        /* Brief pause on empty cursor */
        setTimeout(function () {
          uxvIdx = (uxvIdx + 1) % UXV_WORDS.length;
          var next = UXV_WORDS[uxvIdx];

          /* Update subtitle when we start typing the new word */
          if (uxvSubEl) {
            uxvSubEl.style.transition = 'opacity .18s ease';
            uxvSubEl.style.opacity = '0';
            setTimeout(function () {
              uxvSubEl.textContent = next;
              uxvSubEl.style.opacity = '1';
            }, 180);
          }

          /* Type the new word character by character */
          typeWord(next, 1, function () {
            uxvTyping = false;
            /* Schedule next cycle */
            runUxVCycle();
          });
        }, PAUSE_EMPTY);
      });
    }, PAUSE_FULL);
  }

  /* Init display and start */
  if (uxvEl) {
    uxvEl.textContent = UXV_WORDS[0];
    if (uxvSubEl) uxvSubEl.textContent = UXV_WORDS[0];
    /* Small delay on first run so hero animations finish first */
    setTimeout(runUxVCycle, 1800);
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
