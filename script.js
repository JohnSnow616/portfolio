/* ═══════════════════════════════════════════════════════
   SAMAR ELAHI — PORTFOLIO  |  script.js
   Pinterest-core · Soft Girl Tech · Dreamy Editorial
════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initHamburger();
  initReveal();
  initSkillBars();
  initContactForm();
  initParallax();
  initActiveNav();
  initMoodBar();
});

/* ═══════════════════════
   THEME TOGGLE
══════════════════════ */
function initTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');

  // Load saved preference or default to light
  const saved = localStorage.getItem('samar-theme') || 'light';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('samar-theme', next);

    // Brief scale animation on toggle
    btn.style.transform = 'scale(0.85) rotate(25deg)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  });
}

/* ═══════════════════════
   NAVBAR SCROLL BEHAVIOR
══════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Scrolled state for shadow
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > 200) {
      if (scrollY > lastScrollY) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
  };

  // Throttle scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // Smooth transition for hide/show
  navbar.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, background 0.4s ease, border-color 0.4s ease';
}

/* ═══════════════════════
   HAMBURGER MENU
══════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ═══════════════════════
   ACTIVE NAV LINK
══════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════
   SCROLL REVEAL ANIMATION
══════════════════════ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0');

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════
   SKILL BARS ANIMATION
══════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        const delay = parseInt(bar.closest('.skill-card')?.getAttribute('data-delay') || '0');

        setTimeout(() => {
          bar.style.width = width + '%';
        }, delay + 300);

        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ═══════════════════════
   MOOD BAR ANIMATION
══════════════════════ */
function initMoodBar() {
  const moodFill = document.querySelector('.mood-bar-fill');
  const pillFill = document.querySelector('.pill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (moodFill) moodFill.classList.add('animated');
        if (pillFill) pillFill.classList.add('animated');
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const moodCard = document.querySelector('.mood-main');
  if (moodCard) observer.observe(moodCard);
}

/* ═══════════════════════
   CONTACT FORM
══════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Simple validation with soft shake
    if (!name || !email || !message) {
      const emptyFields = form.querySelectorAll('input, textarea');
      emptyFields.forEach(field => {
        if (!field.value.trim()) {
          shakeElement(field);
          field.style.borderColor = 'rgba(232,100,100,0.5)';
          setTimeout(() => { field.style.borderColor = ''; }, 2000);
        }
      });
      return;
    }

    if (!isValidEmail(email)) {
      const emailField = form.querySelector('#email');
      shakeElement(emailField);
      emailField.style.borderColor = 'rgba(232,100,100,0.5)';
      setTimeout(() => { emailField.style.borderColor = ''; }, 2000);
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('.form-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending</span><span class="btn-arrow">✦</span>';

    setTimeout(() => {
      form.classList.add('hidden');
      success.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.innerHTML = originalText;
    }, 1400);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeElement(el) {
  el.style.transition = 'transform 0.1s ease';
  const steps = [6, -6, 5, -5, 3, -3, 0];
  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(interval);
      el.style.transform = '';
      return;
    }
    el.style.transform = `translateX(${steps[i]}px)`;
    i++;
  }, 60);
}

/* ═══════════════════════
   SUBTLE PARALLAX
══════════════════════ */
function initParallax() {
  const blobs = document.querySelectorAll('.blob-1, .blob-2, .blob-3, .blob-4');
  const floatCards = document.querySelectorAll('.float-card');
  const decoStars = document.querySelectorAll('.deco-star');
  const hero = document.querySelector('.hero');

  if (!hero) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Only apply within hero bounds
        const heroHeight = hero.offsetHeight;
        if (scrollY > heroHeight) { ticking = false; return; }

        const factor = scrollY / heroHeight;

        blobs.forEach((blob, i) => {
          const speed = 0.3 + i * 0.1;
          const yOffset = scrollY * speed * 0.6;
          blob.style.transform = `translate(0, ${yOffset}px)`;
        });

        floatCards.forEach((card, i) => {
          const speed = 0.15 + i * 0.05;
          card.style.transform = `translateY(${scrollY * speed * -0.5}px)`;
        });

        decoStars.forEach((star, i) => {
          const speed = 0.08 + i * 0.04;
          star.style.transform = `translateY(${scrollY * speed * -0.6}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════
   FLOATING CARDS MOUSE EFFECT (Hero)
══════════════════════ */
(function initMouseEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Only on desktop
  if (window.matchMedia('(hover: none)').matches) return;

  const moodboard = document.querySelector('.hero-moodboard');
  const heroContent = document.querySelector('.hero-content');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;

    if (moodboard) {
      moodboard.style.transform = `perspective(1000px) rotateY(${dx * -3}deg) rotateX(${dy * 2}deg)`;
    }

    if (heroContent) {
      heroContent.style.transform = `perspective(1000px) translateX(${dx * 6}px) translateY(${dy * 4}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (moodboard) moodboard.style.transform = '';
    if (heroContent) heroContent.style.transform = '';
  });
})();

/* ═══════════════════════
   SKILL CARD TILT EFFECT
══════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.skill-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top - cy) / cy;

      card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${dy * -4}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════
   SMOOTH SCROLL (fallback for older browsers)
══════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════
   STAGGER REVEAL FOR GRIDS
══════════════════════ */
(function initGridStagger() {
  const grids = [
    document.querySelector('.skills-grid'),
    document.querySelector('.projects-grid'),
  ];

  grids.forEach(grid => {
    if (!grid) return;
    const children = grid.querySelectorAll('.reveal');

    children.forEach((child, i) => {
      if (!child.hasAttribute('data-delay')) {
        child.setAttribute('data-delay', i * 100);
      }
    });
  });
})();

/* ═══════════════════════
   FOOTER ENTER ANIMATION
══════════════════════ */
(function initFooterAnim() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
          });
        });
        observer.unobserve(footer);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(footer);
})();

/* ═══════════════════════
   DECORATIVE STAR PULSE ON HOVER
══════════════════════ */
(function initDecoHover() {
  const stars = document.querySelectorAll('.deco-star, .footer-deco, .avatar-sparkle');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      star.style.transform = 'scale(1.8) rotate(30deg)';
      star.style.opacity = '1';
      star.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
    });
    star.addEventListener('mouseleave', () => {
      star.style.transform = '';
      star.style.opacity = '';
    });
  });
})();

/* ═══════════════════════
   SECTION BG GRADIENT SHIFT ON SCROLL
══════════════════════ */
(function initGradientShift() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const maxScroll = hero.offsetHeight;
        const progress = Math.min(scrolled / maxScroll, 1);

        // Subtle hue shift on blobs
        const blobs = hero.querySelectorAll('.blob');
        blobs.forEach((blob, i) => {
          const shift = progress * 15 * (i % 2 === 0 ? 1 : -1);
          blob.style.filter = `blur(80px) hue-rotate(${shift}deg)`;
        });

        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════
   TYPING EFFECT — HERO TITLE
══════════════════════ */
(function initTypingEffect() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  const text = 'Aspiring Frontend Web Developer';
  titleEl.textContent = '';
  titleEl.style.borderRight = '2px solid var(--accent)';
  titleEl.style.animation = 'none';

  let i = 0;
  const speed = 55;

  function type() {
    if (i < text.length) {
      titleEl.textContent += text[i];
      i++;
      setTimeout(type, speed);
    } else {
      // Blink cursor then remove
      setTimeout(() => {
        titleEl.style.transition = 'border-color 0.4s ease';
        titleEl.style.borderRight = '2px solid transparent';
      }, 1200);
    }
  }

  // Start after a short delay for elegance
  setTimeout(type, 600);
})();

/* ═══════════════════════
   MOOD CARD INTERACTIVE HOVER
══════════════════════ */
(function initMoodCardHover() {
  if (window.matchMedia('(hover: none)').matches) return;

  const moodMain = document.querySelector('.mood-main');
  if (!moodMain) return;

  moodMain.addEventListener('mousemove', (e) => {
    const rect = moodMain.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;

    moodMain.style.transition = 'transform 0.1s ease';
    moodMain.style.transform = `translate(-50%, -50%) perspective(600px) rotateY(${dx * 6}deg) rotateX(${dy * -6}deg) translateY(-10px)`;
  });

  moodMain.addEventListener('mouseleave', () => {
    moodMain.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    moodMain.style.transform = 'translate(-50%, -50%) translateY(0)';

    // Re-engage float animation
    setTimeout(() => {
      moodMain.style.transform = '';
    }, 600);
  });
})();

/* ═══════════════════════
   PROJECT CARD SHIMMER
══════════════════════ */
(function initProjectShimmer() {
  if (window.matchMedia('(hover: none)').matches) return;

  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(
        105deg,
        transparent 30%,
        rgba(255,255,255,0.08) 50%,
        transparent 70%
      );
      background-size: 200% 100%;
      background-position: 200% 0;
      border-radius: inherit;
      pointer-events: none;
      transition: background-position 0.6s ease;
      z-index: 5;
    `;
    card.style.position = 'relative';
    card.appendChild(shimmer);

    card.addEventListener('mouseenter', () => {
      shimmer.style.backgroundPosition = '-100% 0';
    });
    card.addEventListener('mouseleave', () => {
      shimmer.style.backgroundPosition = '200% 0';
    });
  });
})();

/* ═══════════════════════
   BACK TO TOP ON LOGO CLICK
══════════════════════ */
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════
   RESIZE HANDLER
══════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Re-check parallax bounds
    const hero = document.querySelector('.hero');
    if (hero) {
      const moodboard = document.querySelector('.hero-moodboard');
      const heroContent = document.querySelector('.hero-content');
      if (moodboard) moodboard.style.transform = '';
      if (heroContent) heroContent.style.transform = '';
    }
  }, 200);
});
