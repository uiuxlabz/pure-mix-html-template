/* ============================================================
   PURE MIX — main.js
   Canonical IIFE, zero dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Blog category filter ---------- */
  var filterWrap = document.querySelector('.blog-filter');
  if (filterWrap) {
    var buttons = filterWrap.querySelectorAll('button');
    var cards = document.querySelectorAll('.blog-card');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var cat = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = cat === 'all' || card.getAttribute('data-cat') === cat;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Newsletter form ---------- */
  var nl = document.querySelector('[data-nl]');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = nl.querySelector('input[type="email"]');
      var msg = nl.querySelector('.nl-status');
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input || !re.test(input.value.trim())) {
        if (msg) {
          msg.textContent = 'Please enter a valid email address.';
          msg.classList.add('is-error');
        }
        return;
      }
      nl.innerHTML = '<p class="nl-done">Thanks for subscribing — the next mix lands in your inbox. ✌️</p>';
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;
      form.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.value.trim() !== '';
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        field.classList.toggle('is-invalid', !ok);
        if (!ok && !firstInvalid) firstInvalid = field;
        if (!ok) valid = false;
      });
      if (!valid) {
        if (status) {
          status.textContent = 'Please fill in the highlighted fields.';
          status.classList.add('is-error');
          status.classList.remove('is-ok');
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (status) {
        status.textContent = 'Thanks — your message is in the mix. We reply within one business day.';
        status.classList.add('is-ok');
        status.classList.remove('is-error');
      }
      form.reset();
    });
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('is-invalid');
      });
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
