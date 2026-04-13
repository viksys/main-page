/* ============================================================
   VIKASANA SYSTEMS — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CUSTOM CURSOR (desktop / fine pointer only)
  ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const ring = document.getElementById('cur-ring');
    const dot  = document.getElementById('cur-dot');
    const ch   = document.getElementById('cur-h');
    const cv   = document.getElementById('cur-v');

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      ch.style.left  = mx + 'px';
      ch.style.top   = my + 'px';
      cv.style.left  = mx + 'px';
      cv.style.top   = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    var hoverEls = document.querySelectorAll(
      'a, button, .domain-card, .metric-cell, .tech-pillar, .keypoint, .cert-row'
    );
    hoverEls.forEach(function (el) {
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

  /* ----------------------------------------------------------
     MOBILE NAV
  ---------------------------------------------------------- */
  var mobNav   = document.getElementById('mob-nav');
  var btnOpen  = document.getElementById('nav-open');
  var btnClose = document.getElementById('nav-close');

  if (btnOpen) {
    btnOpen.addEventListener('click', function () {
      mobNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMob() {
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnClose) btnClose.addEventListener('click', closeMob);

  var mobLinks = mobNav ? mobNav.querySelectorAll('a') : [];
  mobLinks.forEach(function (a) { a.addEventListener('click', closeMob); });

  /* ----------------------------------------------------------
     SCROLL REVEAL
  ---------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  var revObs  = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  reveals.forEach(function (el) { revObs.observe(el); });

  /* ----------------------------------------------------------
     INDIGENY PROGRESS BAR
  ---------------------------------------------------------- */
  var fillEl  = document.getElementById('indigeny-fill');
  var pctEl   = document.getElementById('indigeny-pct');
  var TARGET  = 78;

  if (fillEl) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          fillEl.classList.add('go');
          var pct = 0;
          var ticker = setInterval(function () {
            pct = Math.min(pct + 2, TARGET);
            if (pctEl) pctEl.textContent = pct + '%';
            if (pct >= TARGET) clearInterval(ticker);
          }, 26);
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    barObs.observe(fillEl);
  }

  /* ----------------------------------------------------------
     NAV SCROLL STATE
  ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.style.borderBottomColor = 'rgba(174,182,168,0.22)';
    } else {
      nav.style.borderBottomColor = 'rgba(174,182,168,0.12)';
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     CONTACT FORM SUBMIT
  ---------------------------------------------------------- */
  var submitBtn = document.getElementById('form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var nameEl  = document.getElementById('f-name');
      var emailEl = document.getElementById('f-email');
      if (!nameEl.value.trim() || !emailEl.value.trim()) {
        submitBtn.textContent = 'Fill required fields';
        submitBtn.style.background = 'rgba(174,182,168,0.4)';
        setTimeout(function () {
          submitBtn.textContent = 'Transmit Enquiry';
          submitBtn.style.background = '';
        }, 2000);
        return;
      }
      submitBtn.textContent = 'Transmitting...';
      submitBtn.style.opacity = '0.6';
      setTimeout(function () {
        submitBtn.textContent = 'Enquiry Received';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'var(--olive)';
        submitBtn.style.color = 'var(--off-white)';
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     NOTIFY BUTTON (products coming soon)
  ---------------------------------------------------------- */
  var notifyBtn = document.getElementById('notify-btn');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', function () {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     HERO VIDEO FALLBACK
  ---------------------------------------------------------- */
  var heroVid = document.getElementById('hero-vid');
  if (heroVid) {
    heroVid.addEventListener('error', function () {
      var wrap = document.querySelector('.hero-video-wrap');
      if (wrap) {
        wrap.style.background =
          'linear-gradient(150deg, #1a1c18 0%, #262924 50%, #3C4520 100%)';
      }
    });
  }

})();
