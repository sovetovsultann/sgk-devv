/* ============================================================
   Smart Group Kazakhstan — script.js
   Vanilla JS: Intersection Observer, scroll effects, tabs,
   FAQ accordion, counters, hamburger, form validation
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. INTERSECTION OBSERVER — reveal / zoom-reveal / unfold
     ---------------------------------------------------------- */
  function initRevealObserver() {
    var elements = document.querySelectorAll('.reveal, .zoom-reveal, .unfold');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     2. STAGGER ANIMATIONS — cards, advantages, timeline steps
     ---------------------------------------------------------- */
  function initStagger() {
    var groups = document.querySelectorAll('[data-stagger]');
    groups.forEach(function (group) {
      var delay = parseInt(group.getAttribute('data-stagger'), 10) || 80;
      var children = group.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.transitionDelay = (i * delay) + 'ms';
      }
    });
  }

  /* ----------------------------------------------------------
     3. NAVBAR SCROLL — scrolled class + active section
     ---------------------------------------------------------- */
  function initNavbar() {
    var nav = document.querySelector('.navbar');
    var progressBar = document.querySelector('.progress-bar');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');

    if (!nav) return;

    function onScroll() {
      // Scrolled class
      if (window.scrollY > 0) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Progress bar
      if (progressBar) {
        var progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
      }

      // Active nav link
      var scrollPos = window.scrollY + 100;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     4. SMOOTH SCROLL — anchor links
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        var menu = document.querySelector('.mobile-menu');
        var hamburger = document.querySelector('.hamburger');
        if (menu && menu.classList.contains('open')) {
          menu.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.classList.remove('no-scroll');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     5. HAMBURGER MENU
     ---------------------------------------------------------- */
  function initHamburger() {
    var hamburger = document.querySelector('.hamburger');
    var menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = menu.classList.contains('open');
      if (isOpen) {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('no-scroll');
      } else {
        menu.classList.add('open');
        hamburger.classList.add('open');
        document.body.classList.add('no-scroll');

        // Stagger menu items
        var items = menu.querySelectorAll('a');
        items.forEach(function (item, i) {
          item.style.transitionDelay = (i * 60) + 'ms';
        });
      }
    });
  }

  /* ----------------------------------------------------------
     6. FAQ ACCORDION
     ---------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });
        // Toggle clicked
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     7. TABS (ЖК levels, ТРЦ/БЦ tabs)
     ---------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
      var buttons = tabGroup.querySelectorAll('.tab-btn');
      var parentSection = tabGroup.closest('section') || tabGroup.parentElement;
      var contents = parentSection.querySelectorAll('.tab-content');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');

          buttons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');

          contents.forEach(function (c) {
            c.classList.remove('active');
            if (c.getAttribute('data-tab-content') === target) {
              c.classList.add('active');
            }
          });
        });
      });
    });
  }

  /* ----------------------------------------------------------
     8. COUNTER ANIMATION
     ---------------------------------------------------------- */
  function animateCounter(el, target, suffix, prefix) {
    prefix = prefix || '';
    suffix = suffix || '';
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-counter'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';
          animateCounter(el, target, suffix, prefix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     9. HERO PARALLAX
     ---------------------------------------------------------- */
  function initHeroParallax() {
    var heroBg = document.querySelector('.hero__bg');
    var heroContent = document.querySelector('.hero__content');
    if (!heroBg) return;

    function onScroll() {
      var scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;
      heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      if (heroContent) {
        heroContent.style.opacity = String(1 - scrollY / 600);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     10. FLOATING CTA
     ---------------------------------------------------------- */
  function initFloatingCta() {
    var cta = document.querySelector('.floating-cta');
    var hero = document.querySelector('.hero');
    if (!cta || !hero) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          cta.classList.add('visible');
        } else {
          cta.classList.remove('visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(hero);
  }

  /* ----------------------------------------------------------
     11. HOTEL LEVELS (accordion)
     ---------------------------------------------------------- */
  function initHotelLevels() {
    document.querySelectorAll('.hotel-level').forEach(function (level) {
      var header = level.querySelector('.hotel-level__header');
      if (!header) return;

      header.addEventListener('click', function () {
        var isOpen = level.classList.contains('open');
        document.querySelectorAll('.hotel-level').forEach(function (l) {
          l.classList.remove('open');
        });
        if (!isOpen) {
          level.classList.add('open');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     12. PROCESS TIMELINE — sequential reveal
     ---------------------------------------------------------- */
  function initTimelineReveal() {
    var steps = document.querySelectorAll('.timeline-item');
    if (!steps.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(steps, entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    steps.forEach(function (step) {
      step.classList.add('reveal');
      observer.observe(step);
    });
  }

  /* ----------------------------------------------------------
     13. FORM VALIDATION
     ---------------------------------------------------------- */
  function initFormValidation() {
    var form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var contact = form.querySelector('[name="contact"]');
      var valid = true;

      // Reset
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      if (!name || !name.value.trim()) {
        if (name) name.classList.add('error');
        valid = false;
      }

      if (!contact || !contact.value.trim()) {
        if (contact) contact.classList.add('error');
        valid = false;
      }

      if (valid) {
        // Show success state
        var formFields = form.querySelector('.contact-form__fields');
        var success = form.querySelector('.contact-form__success');
        if (formFields) formFields.style.display = 'none';
        if (success) success.classList.add('show');
      }
    });
  }

  /* ----------------------------------------------------------
     INIT — run everything on DOMContentLoaded
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initRevealObserver();
    initStagger();
    initNavbar();
    initSmoothScroll();
    initHamburger();
    initFaq();
    initTabs();
    initCounters();
    initHeroParallax();
    initFloatingCta();
    initHotelLevels();
    initTimelineReveal();
    initFormValidation();
  });

})();
