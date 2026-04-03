/* ================================================
   CHANCHAL DIAMONDS — The House of Diamonds
   main.js | Interactions & Animations
   ================================================ */

'use strict';

// ─── Custom Cursor ─────────────────────────────────
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const interactives = document.querySelectorAll('a, button, .gallery-item, .why-card, .cert-card, .diamond-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });
})();

// ─── Navbar Scroll ────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    // Hide nav on scroll down, show on scroll up
    if (y > 300) {
      if (y > lastY) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });
})();

// ─── Gold Particle Generator ──────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 50;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: ${Math.random() * 0.6};
    `;
    container.appendChild(p);
  }
})();

// ─── Image Trail Effect ──────────────────────────
(function initImageTrail() {
  const hero = document.getElementById('hero');
  const container = document.getElementById('image-trail');
  if (!hero || !container) return;

  const images = [
    'col-1.png',
    'col-2.png',
    'col-3.png',
    'col-4.png',
  ];

  // Preload images
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let lastTime = 0;
  let lastX = 0, lastY = 0;
  let currentIndex = 0;
  const INTERVAL = 120;
  const ROTATION_RANGE = 20;
  const MAX_ITEMS = 12;

  hero.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastTime < INTERVAL) return;

    // Only spawn if mouse has actually moved
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

    lastTime = now;
    lastX = e.clientX;
    lastY = e.clientY;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotation = (Math.random() - 0.5) * ROTATION_RANGE * 2;

    const item = document.createElement('div');
    item.className = 'trail-item';
    item.style.left = x + 'px';
    item.style.top = y + 'px';
    item.style.setProperty('--rot', rotation + 'deg');

    const img = document.createElement('img');
    img.src = images[currentIndex];
    img.alt = 'Diamond jewellery';
    img.draggable = false;
    item.appendChild(img);

    container.appendChild(item);
    currentIndex = (currentIndex + 1) % images.length;

    // Remove old items if too many
    while (container.children.length > MAX_ITEMS) {
      container.removeChild(container.firstChild);
    }

    // Remove after animation completes
    item.addEventListener('animationend', () => {
      if (item.parentNode) item.parentNode.removeChild(item);
    });
  });
})();

// ─── Scroll Reveal (Intersection Observer) ────────
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger delay based on index
        const delay = (entry.target.dataset.delay || 0) * 1;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => {
    // Auto-assign stagger delays to direct siblings ONLY
    if (!el.dataset.delay) {
      const parent = el.parentElement;
      const directSiblings = Array.from(parent.children).filter(child => 
        child.classList.contains('reveal') || 
        child.classList.contains('reveal-left') || 
        child.classList.contains('reveal-right')
      );
      const idx = directSiblings.indexOf(el);
      el.dataset.delay = idx > 0 ? idx * 80 : 0;
    }
    observer.observe(el);
  });
})();

// ─── Gold Line Reveal ─────────────────────────────
(function initDividers() {
  const lines = document.querySelectorAll('.section-divider');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'line-expand 0.8s cubic-bezier(0.4,0,0.2,1) forwards';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  lines.forEach(l => obs.observe(l));
})();

// ─── Parallax Hero ────────────────────────────────
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();

// ─── Counter Animation ────────────────────────────
(function initCounters() {
  const numbers = document.querySelectorAll('[data-count]');
  if (!numbers.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = target * eased;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  numbers.forEach(n => obs.observe(n));
})();

// ─── Flash Card Carousel & Modals ──────────────────
(function initFlashCards() {
  const wrapper = document.querySelector('.gallery-carousel-wrapper');
  const track = document.getElementById('gallery-track');
  if (!wrapper || !track) return;

  const originalCards = Array.from(track.children);
  const GAP = 20; // must match CSS gap

  // Clone all cards 3 times to create a massive buffer for ultra-wide screens
  for(let i=0; i<3; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.remove('reveal');
      clone.classList.add('active');
      track.appendChild(clone);
    });
  }

  let scrollPos = 0;
  let speed = 1.25; // pixels per frame
  let paused = false;

  // Calculate the width of ONE full set of original cards
  function getResetPoint() {
    const totalOriginalCards = originalCards.length;
    const cardWidth = track.children[0].offsetWidth;
    // Length of 1 set = (width * count) + (gap * count)
    return totalOriginalCards * (cardWidth + GAP);
  }

  function animate() {
    if (!paused) {
      scrollPos += speed;
      const resetPoint = getResetPoint();
      if (scrollPos >= resetPoint) {
        scrollPos -= resetPoint;
      }
      track.style.transform = `translateX(-${scrollPos}px)`;
    }
    requestAnimationFrame(animate);
  }

  // Pause on hover
  wrapper.addEventListener('mouseenter', () => { paused = true; });
  wrapper.addEventListener('mouseleave', () => { paused = false; });

  requestAnimationFrame(animate);

  // Collection details Modal
  const flashCards = document.querySelectorAll('.flash-card');
  const modal = document.getElementById('collection-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (!modal || !flashCards.length) return;

  function closeModal() {
    modal.classList.remove('active');
  }

  flashCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category || 'Collection';
      const desc = card.dataset.desc || 'Explore our exquisite collection of premium diamonds.';
      const img = card.querySelector('img');

      if (img) modalImg.src = img.src;
      modalImg.alt = category;
      modalTitle.textContent = category;
      modalDesc.textContent = desc;

      modal.classList.add('active');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
})();

// ─── Smooth Scroll for Nav Links ──────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ─── Hover Tilt on Cards ─────────────────────────
(function initTilt() {
  const cards = document.querySelectorAll('.diamond-card, .cert-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── Marquee Duplicate for Seamless Loop ─────────
(function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  // Clone content for seamless infinite scroll
  const clone = track.innerHTML;
  track.innerHTML += clone;
})();

// ─── Page Load Progress ───────────────────────────
(function initPageLoad() {
  document.body.classList.add('loaded');
  // Trigger hero animations immediately
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });
})();

// ─── Navbar Mobile Toggle ─────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.right = '24px';
    links.style.background = 'rgba(5,5,5,0.98)';
    links.style.padding = '20px 32px';
    links.style.gap = '20px';
    links.style.border = '1px solid rgba(201,168,76,0.2)';
  });
})();



console.log('%c💎 CHANCHAL DIAMONDS — The House of Diamonds', 'color: #C9A84C; font-family: serif; font-size: 16px; font-weight: bold;');
