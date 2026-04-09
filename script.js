// ===== THEME (run immediately to avoid flash) =====
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  // ===== CURSOR =====
  const cursor = document.querySelector('.cursor-follower');
  let cX = 0, cY = 0, fX = 0, fY = 0;
  document.addEventListener('mousemove', e => { cX = e.clientX; cY = e.clientY; });
  (function animC() {
    fX += (cX - fX) * 0.12;
    fY += (cY - fY) * 0.12;
    if (cursor) { cursor.style.left = fX + 'px'; cursor.style.top = fY + 'px'; }
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('a,button,.skill-card,.exp-card,.hero-tag,.about-chip').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
  });

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme');
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ===== ACTIVE NAV LINKS =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  function updateActive() {
    const sp = window.scrollY + 200;
    sections.forEach(s => {
      if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + s.id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });

  // ===== HAMBURGER =====
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }));
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== SCROLL REVEAL =====
  const revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const d = parseInt(en.target.dataset.delay || 0);
        setTimeout(() => en.target.classList.add('revealed'), d);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revEls.forEach(el => revObs.observe(el));

  // ===== SKILL BARS =====
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const bar = en.target.querySelector('.skill-bar');
        if (bar) setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, 300);
        skillObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

  // ===== 3D TILT =====
  function addTilt(el, intensity = 8) {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const ry = ((x - cx) / cx) * intensity;
      const rx = ((cy - y) / cy) * intensity;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }
  document.querySelectorAll('.skill-card').forEach(c => addTilt(c, 7));
  document.querySelectorAll('.exp-card').forEach(c => addTilt(c, 6));
  const af = document.querySelector('.about-frame');

  // ===== COUNTER ANIMATION =====
  function animCounter(el, target, dur = 1400) {
    const start = performance.now();
    function upd(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + '+';
      if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
  }
  document.querySelectorAll('.stat-num').forEach(s => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          animCounter(s, parseInt(s.dataset.count || s.textContent));
          obs.unobserve(s);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(s);
  });

  // ===== MAGNETIC BUTTONS =====
  document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.13}px, ${y * 0.13}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ===== TYPED EFFECT =====
  const typed = document.querySelector('.hero-typed');
  if (typed) {
    const roles = ['Full-Stack Developer', 'Web Designer', 'Frontend Developer', 'Backend Developer', 'Mobile App Builder', 'UI-Focused Developer'];
    let ri = 0, ci = 0, del = false, ts = 80;
    function type() {
      const cur = roles[ri];
      if (del) { typed.textContent = cur.substring(0, --ci); ts = 38; }
      else { typed.textContent = cur.substring(0, ++ci); ts = 80; }
      if (!del && ci === cur.length) { ts = 2000; del = true; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; ts = 400; }
      setTimeout(type, ts);
    }
    setTimeout(type, 800);
  }

  // ===== SCROLL PARALLAX =====
  const heroSection = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.blob').forEach((b, i) => {
      b.style.transform = `translateY(${sy * (i + 1) * 0.025}px)`;
    });
    if (heroText && heroSection) {
      const hb = heroSection.getBoundingClientRect();
      if (hb.bottom > 0) heroText.style.transform = `translateY(${sy * 0.12}px)`;
    }
  }, { passive: true });

  // ===== MOUSE PARALLAX FOR HERO VISUAL =====
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && heroSection) {
    document.addEventListener('mousemove', e => {
      const hb = heroSection.getBoundingClientRect();
      if (hb.top > window.innerHeight || hb.bottom < 0) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      heroVisual.querySelectorAll('.float-card').forEach((c, i) => {
        const d = (i + 1) * 0.5;
        c.style.transform = `translateX(${mx * 12 * d}px) translateY(${my * 8 * d}px) rotate(${c.style.getPropertyValue('--rot') || '-5deg'})`;
      });
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.querySelectorAll('.float-card').forEach(c => { c.style.transform = ''; });
    });
  }

  // ===== CONTACT FORM WITH EMAILJS =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Prepare template parameters
    const templateParams = {
      from_name: document.getElementById('name').value,
      from_email: document.getElementById('email').value,
      subject: document.getElementById('subject').value || 'No subject',
      message: document.getElementById('message').value
    };

    // Send email via EmailJS
    emailjs.send('service_aha7l8n', 'template_gezwhrn', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        
        // Show success message
        const fields = contactForm.querySelector('.form-fields');
        const success = contactForm.querySelector('.form-success');
        
        if (fields) fields.style.display = 'none';
        if (success) success.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Reset button after showing success
        setTimeout(() => {
          if (fields) fields.style.display = 'block';
          if (success) success.classList.remove('show');
          btn.textContent = originalText;
          btn.disabled = false;
        }, 5000);
        
      }, function(error) {
        console.error('FAILED...', error);
        
        // Show error alert
        alert('❌ Failed to send message. Please email me directly at: sabrinaswift45@gmail.com');
        
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });
}

  // ===== IDENTITY CARD HOVER TILT =====
  const idCard = document.querySelector('.identity-card');

});
