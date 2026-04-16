/* ============================================================
   VIKASANA SYSTEMS — main.js
   ============================================================ */
(function () {
  'use strict';

  var PAGES = ['home', 'domains', 'about', 'technology', 'team', 'investors', 'contact'];

  /* ----------------------------------------------------------
     PAGE ROUTER
  ---------------------------------------------------------- */
  function showPage(id) {
    PAGES.forEach(function (p) {
      var el = document.getElementById('pg-' + p);
      if (el) el.classList.toggle('active', p === id);
    });
    /* Active nav link highlight */
    document.querySelectorAll('.nav-link[data-page], .nav-brand[data-page]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-page') === id);
    });
    /* Scroll to top */
    window.scrollTo(0, 0);
    /* Page-specific init */
    if (id === 'about') initAboutBar();
    /* Close mobile nav */
    closeMob();
  }

  /* Delegate all [data-page] clicks to router */
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
  var btnClose = document.getElementById('nav-close');

  function openMob() {
    if (!mobNav) return;
    mobNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'true');
  }
  function closeMob() {
    if (!mobNav) return;
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'false');
  }
  if (btnOpen)  btnOpen.addEventListener('click', openMob);
  if (btnClose) btnClose.addEventListener('click', closeMob);

  /* ----------------------------------------------------------
     SCROLL REVEAL
  ---------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }
  initReveal();

  /* ----------------------------------------------------------
     INDIGENY BAR (About page)
  ---------------------------------------------------------- */
  var barDone = false;
  function initAboutBar() {
    if (barDone) return;
    var fill = document.getElementById('ind-fill');
    var pct  = document.getElementById('ind-pct');
    if (!fill) return;
    setTimeout(function () {
      fill.classList.add('go');
      var n = 0;
      var ticker = setInterval(function () {
        n = Math.min(n + 2, 78);
        if (pct) pct.textContent = n + '%';
        if (n >= 78) { clearInterval(ticker); barDone = true; }
      }, 25);
    }, 300);
  }

  /* ----------------------------------------------------------
     NAV SCROLL STATE
  ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (!nav) return;
    nav.style.borderBottomColor = window.scrollY > 60
      ? 'rgba(38,41,36,.2)'
      : 'rgba(38,41,36,.1)';
  }, { passive: true });

  /* ----------------------------------------------------------
     PARALLAX — hero video + hero title on home page
  ---------------------------------------------------------- */
  var heroVid   = document.querySelector('.hero-bg video');
  var heroFallback = document.querySelector('.hero-fallback');
  var heroTitle = document.querySelector('.hero-title');

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    /* Slow-pan the video */
    if (heroVid)      heroVid.style.transform      = 'translateY(' + (y * 0.18) + 'px)';
    if (heroFallback) heroFallback.style.transform  = 'translateY(' + (y * 0.18) + 'px)';
    /* Title lifts & fades */
    if (heroTitle) {
      heroTitle.style.transform = 'translateY(' + (y * 0.06) + 'px)';
      heroTitle.style.opacity   = String(Math.max(0, 1 - y / 480));
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     HERO VIDEO FALLBACK
  ---------------------------------------------------------- */
  var vid = document.getElementById('hero-vid');
  if (vid) {
    vid.addEventListener('error', function () {
      vid.style.display = 'none';
    });
    /* If video loads, hide the fallback img */
    vid.addEventListener('canplay', function () {
      var fb = document.querySelector('.hero-fallback');
      if (fb) fb.style.opacity = '0';
    });
  }

  /* ----------------------------------------------------------
     CUSTOM CURSOR — fine pointer only
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    var ring = document.getElementById('c-ring');
    var dot  = document.getElementById('c-dot');
    var ch   = document.getElementById('c-h');
    var cv   = document.getElementById('c-v');

    if (ring && dot) {
      var mx = -200, my = -200;
      var rx = -200, ry = -200;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        if (ch) { ch.style.left = mx + 'px'; ch.style.top = my + 'px'; }
        if (cv) { cv.style.left = mx + 'px'; cv.style.top = my + 'px'; }
      });

      (function animRing() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
      })();

      document.querySelectorAll('a, button, .dc, .prod-card, .team-card, .why-item, .metric-cell, .kp, .cert-row').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          ring.style.width        = '48px';
          ring.style.height       = '48px';
          ring.style.borderColor  = 'rgba(60,69,32,.65)';
          ring.style.borderRadius = '0';
        });
        el.addEventListener('mouseleave', function () {
          ring.style.width        = '30px';
          ring.style.height       = '30px';
          ring.style.borderColor  = 'rgba(60,69,32,.5)';
          ring.style.borderRadius = '50%';
        });
      });
    }
  }

  /* ----------------------------------------------------------
     CONTACT FORM SUBMIT
  ---------------------------------------------------------- */
  var submitBtn = document.getElementById('form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name  = document.getElementById('cf-name');
      var email = document.getElementById('cf-email');
      if (!name  || !name.value.trim() ||
          !email || !email.value.trim()) {
        var orig = submitBtn.textContent;
        submitBtn.textContent    = 'Fill required fields';
        submitBtn.style.background = 'rgba(38,41,36,.3)';
        setTimeout(function () {
          submitBtn.textContent    = orig;
          submitBtn.style.background = '';
        }, 2200);
        return;
      }
      submitBtn.textContent   = 'Transmitting...';
      submitBtn.style.opacity = '.55';
      setTimeout(function () {
        submitBtn.textContent      = 'Enquiry Received';
        submitBtn.style.opacity    = '1';
        submitBtn.style.background = '#4a7a3a';
        submitBtn.style.color      = '#F0EFEA';
      }, 1300);
    });
  }


  /* ----------------------------------------------------------
     NOTIFY / REGISTER INTEREST button → contact page
  ---------------------------------------------------------- */
  document.querySelectorAll('[id="notify-btn"], .btn-notify').forEach(function (btn) {
    btn.addEventListener('click', function () { showPage('contact'); });
  });

  /* ----------------------------------------------------------
     ACTIVE NAV TRACKING on scroll (home page only)
  ---------------------------------------------------------- */
  /* (not applicable for multi-page — handled by showPage) */

})();
