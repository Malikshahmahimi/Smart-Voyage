/* ============================================
   SMART VOYAGE — Premium Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Gold Particles Canvas ----
  initParticles();

  // ---- Navbar Scroll Effect ----
  initNavbar();

  // ---- Mobile Menu ----
  initMobileMenu();

  // ---- Scroll Reveal Animations ----
  initScrollReveal();

  // ---- Surprise Plane ----
  initFollowPlane();

  // ---- Easter Egg ----
  initEasterEgg();

  // ---- Stat Counter Animation ----
  initCounters();

  // ---- Contact Form ----
  initContactForm();

  // ---- Smooth Scroll ----
  initSmoothScroll();

  // ---- Active Nav Link Tracking ----
  initActiveNav();

  // ---- Form Dropdown ----
  initCustomSelects();

  // ---- Set Min Date for Travel Date Input ----
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});


/* ============================================
   GOLD PARTICLES ANIMATION
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.005 + 0.001;
      this.growing = Math.random() > 0.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.growing) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.6) this.growing = false;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0.05) this.reset();
      }

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      // Gold color with varying opacity
      const goldR = 201, goldG = 168, goldB = 76;
      ctx.fillStyle = `rgba(${goldR}, ${goldG}, ${goldB}, ${this.opacity})`;
      ctx.fill();

      // Glow effect
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${goldR}, ${goldG}, ${goldB}, ${this.opacity * 0.1})`;
        ctx.fill();
      }
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const lineOpacity = (1 - dist / 150) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${lineOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Pause animation when not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) animate();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas.parentElement);
}


/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('class-toggle'); // add this
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
      if (toggle) toggle.classList.add('scrolled'); // add this
    } else {
      navbar.classList.remove('scrolled');
      if (toggle) toggle.classList.remove('scrolled'); // add this
    }

    lastScroll = currentScroll;
  }, { passive: true });
}


/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  closeBtn.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}


/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}


/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!data.name || !data.phone || !data.from || !data.to || !data.date) {
      shakeButton(submitBtn);
      return;
    }

    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      const whatsappMsg = encodeURIComponent(
        `Hi Smart Voyage! 🛫\n\n` +
        `I'd like to book a flight:\n` +
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `From: ${data.from}\n` +
        `To: ${data.to}\n` +
        `Date: ${data.date}\n` +
        `Trip Type: ${data.tripType || 'One Way'}\n` +
        `Passengers: ${data.passengers || '1'}\n` +
        `Class: ${data.travelClass || 'Economy'}\n` +
        (data.notes ? `Notes: ${data.notes}\n` : '') +
        `\nPlease share the best available fare. Thank you!`
      );

      // Open WhatsApp silently in background
      window.open(`https://wa.me/917738836277?text=${whatsappMsg}`, '_blank');

      // Show success screen as normal
      form.style.display = 'none';
      formSuccess.classList.add('show');

      btnText.textContent = 'Send Enquiry';
      submitBtn.disabled = false;
    }, 1500);
  });
}

function shakeButton(btn) {
  btn.style.animation = 'shake 0.5s ease';
  setTimeout(() => {
    btn.style.animation = '';
  }, 500);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ============================================
   ACTIVE NAV LINK TRACKING
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}
/* ============================================
   CUSTOM SELECT DROPDOWNS
   ============================================ */
function initCustomSelects() {
  const selects = document.querySelectorAll('.custom-select');

  selects.forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelectorAll('.custom-select-option');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    const triggerText = trigger.querySelector('span');
    const optionsBox = select.querySelector('.custom-select-options');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('open');

      // Close all others
      document.querySelectorAll('.custom-select.open').forEach(s => {
        s.classList.remove('open');
        s.querySelector('.custom-select-options').style.bottom = '';
        s.querySelector('.custom-select-options').style.top = '';
      });

      if (!isOpen) {
        select.classList.add('open');

        // Check if dropdown overflows viewport bottom
        const triggerRect = trigger.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceNeeded = optionsBox.scrollHeight + 10;

        if (spaceBelow < spaceNeeded) {
          // Open upward
          optionsBox.style.top = 'auto';
          optionsBox.style.bottom = 'calc(100% + 6px)';
        } else {
          // Open downward (default)
          optionsBox.style.bottom = 'auto';
          optionsBox.style.top = 'calc(100% + 6px)';
        }
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        triggerText.textContent = option.textContent;
        hiddenInput.value = option.getAttribute('data-value');
        select.classList.remove('open');
      });
    });
  });

  // Close on outside click or touch
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select.open').forEach(s => {
      s.classList.remove('open');
    });
  });

  // Close on scroll (mobile UX)
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.custom-select.open').forEach(s => {
      s.classList.remove('open');
    });
  }, { passive: true });
}
/* ============================================
   EASTER EGG — Click Logo
   ============================================ */
function initEasterEgg() {
  const logo = document.getElementById('nav-logo');
  const easter = document.getElementById('easter-egg');
  const overlay = document.getElementById('ee-overlay');
  const plane = document.getElementById('ee-plane');
  const message = document.getElementById('ee-message');
  let clickCount = 0;
  let clickTimer;
  let isActive = false;

  if (!logo) return;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isActive) {
      isActive = true;
      triggerEasterEgg();
    }
  });

  function triggerEasterEgg() {
    easter.style.display = 'block';

    // Step 1 — dim overlay smoothly
    setTimeout(() => overlay.classList.add('active'), 50);

    // Step 2 — fly plane smoothly
    setTimeout(() => {
      plane.classList.add('fly');
      spawnStars();
    }, 200);

    // Step 3 — show message after plane passes
    setTimeout(() => {
      message.classList.add('show');
    }, 1800);

    // Step 4 — dismiss on click
    overlay.addEventListener('click', dismissEasterEgg);
    message.addEventListener('click', dismissEasterEgg);
  }
  function dismissEasterEgg() {
    message.classList.remove('show');
    overlay.classList.remove('active');

    // Fly plane out
    plane.classList.remove('fly');
    plane.classList.add('fly-out');

    setTimeout(() => {
      easter.style.display = 'none';
      plane.classList.remove('fly-out');
      isActive = false;

      // Clear stars
      const trail = document.getElementById('ee-trail');
      trail.innerHTML = '';
    }, 1000);
  }

  function spawnStars() {
    const trail = document.getElementById('ee-trail');
    const goldColors = ['#c9a84c', '#e8d48b', '#fff8e1', '#f0ebe1'];

    // Spawn gold stars
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.style.cssText = `
        position: fixed;
        width: ${Math.random() * 5 + 2}px;
        height: ${Math.random() * 5 + 2}px;
        background: ${goldColors[Math.floor(Math.random() * goldColors.length)]};
        border-radius: 50%;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 60 + 10}vh;
        pointer-events: none;
        z-index: 9997;
        animation: ee-star-fall ${Math.random() * 1.5 + 0.8}s ease-out forwards;
        box-shadow: 0 0 6px rgba(201, 168, 76, 0.8);
      `;
        trail.appendChild(star);
      }, i * 80);
    }

    // Spawn clouds from plane tail
    const planeEl = document.getElementById('ee-plane');
    let cloudCount = 0;
    const cloudInterval = setInterval(() => {
      if (cloudCount > 18) {
        clearInterval(cloudInterval);
        return;
      }

      const rect = planeEl.getBoundingClientRect();
      const cloud = document.createElement('div');

      const size = Math.random() * 28 + 16;
      const offsetY = (Math.random() - 0.5) * 14;

      cloud.style.cssText = `
      position: fixed;
      left: ${rect.left + 10}px;
      top: ${rect.top + rect.height / 2 + offsetY}px;
      width: ${size}px;
      height: ${size * 0.6}px;
      background: rgba(255, 255, 255, 0.18);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9996;
      filter: blur(6px);
      animation: ee-cloud-fade ${Math.random() * 0.8 + 1.2}s ease-out forwards;
      transform: scale(0.3);
    `;
      trail.appendChild(cloud);
      cloudCount++;
    }, 140);
  }
}
/* ============================================
   FOLLOW PLANE — Tracks cursor / touch
   ============================================ */
function initFollowPlane() {
  const isMobile = () => window.innerWidth <= 768;

  // --- MOBILE: ambient drifting plane ---
  if (isMobile()) {
    const ambient = document.createElement('div');
    ambient.id = 'ambient-plane';
    ambient.innerHTML = '✈';
    document.body.appendChild(ambient);
    return;
  }

  // --- DESKTOP: cursor follow plane ---
  const plane = document.createElement('div');
  plane.id = 'follow-plane';
  plane.innerHTML = '✈';
  document.body.appendChild(plane);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let planeX = window.innerWidth / 2;
  let planeY = window.innerHeight / 2;
  let lastX = planeX;
  let lastY = planeY;
  let isVisible = false;
  let hideTimer;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    showPlane();
  });

  function showPlane() {
    clearTimeout(hideTimer);
    if (!isVisible) {
      plane.classList.add('visible');
      isVisible = true;
    }
    hideTimer = setTimeout(() => {
      plane.classList.remove('visible');
      isVisible = false;
    }, 3000);
  }

  function animate() {
    const ease = 0.07;
    planeX += (mouseX - planeX) * ease;
    planeY += (mouseY - planeY) * ease;

    const dx = planeX - lastX;
    const dy = planeY - lastY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const speed = Math.sqrt(dx * dx + dy * dy);

    if (speed > 0.3) {
      plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    plane.style.left = `${planeX}px`;
    plane.style.top = `${planeY}px`;
    lastX = planeX;
    lastY = planeY;

    requestAnimationFrame(animate);
  }

  animate();

  let trailTimer = 0;
  function spawnTrail() {
    trailTimer++;
    const speed = Math.sqrt(
      Math.pow(planeX - lastX, 2) + Math.pow(planeY - lastY, 2)
    );
    if (isVisible && speed > 1.5 && trailTimer % 3 === 0) {
      const puff = document.createElement('div');
      puff.className = 'follow-puff';
      puff.style.left = `${planeX}px`;
      puff.style.top = `${planeY}px`;
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 1000);
    }
    requestAnimationFrame(spawnTrail);
  }

  spawnTrail();
}