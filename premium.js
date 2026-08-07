document.addEventListener('DOMContentLoaded', () => {
  // ===== AIRPORTS / DESTINATIONS DATABASE =====
  // Uses comprehensive AIRPORTS_DB from airports.js (200+ commercial airports)
  const DESTINATIONS = (typeof AIRPORTS_DB !== 'undefined') ? AIRPORTS_DB : [
    { name: 'Mumbai', code: 'BOM', flag: '🇮🇳', country: 'India', keywords: ['bombay', 'mumbai'] },
    { name: 'Delhi', code: 'DEL', flag: '🇮🇳', country: 'India', keywords: ['delhi', 'new delhi'] },
    { name: 'Dubai', code: 'DXB', flag: '🇦🇪', country: 'UAE', keywords: ['dubai', 'uae'] },
    { name: 'London', code: 'LHR', flag: '🇬🇧', country: 'UK', keywords: ['london', 'heathrow'] },
    { name: 'Singapore', code: 'SIN', flag: '🇸🇬', country: 'Singapore', keywords: ['singapore'] },
    { name: 'New York', code: 'JFK', flag: '🇺🇸', country: 'USA', keywords: ['new york', 'jfk'] },
  ];
  const MOOD_MAP = {
    'peaceful': ['Maldives', 'Bali', 'Zurich', 'Colombo', 'Phuket'],
    'relaxing': ['Maldives', 'Bali', 'Phuket', 'Santorini', 'Colombo'],
    'adventure': ['New York', 'Tokyo', 'Sydney', 'Istanbul', 'Bangkok'],
    'romantic': ['Paris', 'Santorini', 'Maldives', 'Bali', 'Rome'],
    'luxury': ['Dubai', 'Maldives', 'Singapore', 'London', 'Paris'],
    'beach': ['Maldives', 'Bali', 'Phuket', 'Santorini', 'Sydney'],
    'culture': ['Rome', 'Tokyo', 'Istanbul', 'London', 'Paris'],
    'nature': ['Zurich', 'Bali', 'Colombo', 'Santorini', 'Phuket'],
    'honeymoon': ['Maldives', 'Bali', 'Santorini', 'Paris', 'Phuket'],
    'shopping': ['Dubai', 'Singapore', 'Hong Kong', 'London', 'Bangkok'],
    'historic': ['Rome', 'Istanbul', 'London', 'Paris', 'Delhi'],
    'spiritual': ['Bali', 'Delhi', 'Istanbul', 'Colombo', 'Bangkok'],
    'nightlife': ['Dubai', 'Bangkok', 'New York', 'London', 'Los Angeles'],
    'scenic': ['Zurich', 'Santorini', 'Bali', 'Colombo', 'Sydney'],
    'family': ['Singapore', 'Dubai', 'London', 'Sydney', 'Bangkok'],
    'mountains': ['Zurich', 'Colombo', 'Bali'],
    'island': ['Maldives', 'Bali', 'Phuket', 'Santorini'],
  };

  function searchDestinations(query) {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return { results: [], type: 'empty' };
    // Check if gibberish: no vowels or too many consecutive consonants
    if (/^[^aeiou\s]{4,}$/i.test(q) || /[^a-zA-Z\s.,'-]/.test(q) && q.length > 3) {
      return { results: [], type: 'invalid' };
    }
    // Check mood keywords first
    for (const [mood, cities] of Object.entries(MOOD_MAP)) {
      if (q.includes(mood)) {
        const res = cities.map(c => DESTINATIONS.find(d => d.name === c)).filter(Boolean);
        return { results: res, type: 'mood', mood };
      }
    }
    // Direct match
    const direct = DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.keywords.some(k => k.includes(q))
    );
    if (direct.length > 0) return { results: direct.slice(0, 10), type: 'match' };
    // Nothing found - check if it's a real word but not a destination
    if (/^[a-zA-Z\s]{2,}$/.test(q)) {
      return { results: [], type: 'no_dest' };
    }
    return { results: [], type: 'invalid' };
  }

  function renderDropdown(ddEl, results) {
    ddEl.innerHTML = '';
    if (results.type === 'invalid') {
      ddEl.innerHTML = '<div class="sv-dd-err">⚠ Please enter a valid city, airport, or travel preference</div>';
      ddEl.classList.add('open');
      return;
    }
    if (results.type === 'no_dest') {
      ddEl.innerHTML = '<div class="sv-dd-err">No destinations found. Try "peaceful", "beach", or a city name</div>';
      ddEl.classList.add('open');
      return;
    }
    if (results.results.length === 0) { ddEl.classList.remove('open'); return; }
    if (results.type === 'mood') {
      ddEl.innerHTML += `<div class="sv-dd-suggest">✨ Suggested for "${results.mood}" travel</div>`;
    }
    results.results.forEach(d => {
      const item = document.createElement('div');
      item.className = 'sv-dd-item';
      item.innerHTML = `<span class="dd-flag">${d.flag}</span><span>${d.name}, ${d.country}</span><span class="dd-code">${d.code}</span>`;
      item.addEventListener('click', () => {
        const parentGroup = ddEl.closest('.p-form-group');
        const inp = parentGroup ? parentGroup.querySelector('input') : ddEl.previousElementSibling;
        if (inp) inp.value = `${d.name} (${d.code})`;
        ddEl.classList.remove('open');
      });
      ddEl.appendChild(item);
    });
    ddEl.classList.add('open');
  }

  // Bind smart search to From & To
  ['pf-from', 'pf-to', 'pmb-from', 'pmb-to'].forEach(id => {
    const inp = document.getElementById(id);
    const ddId = id === 'pf-from' ? 'dd-from'
      : id === 'pf-to' ? 'dd-to'
        : id === 'pmb-from' ? 'pmb-dd-from'
          : 'pmb-dd-to';
    const dd = document.getElementById(ddId);
    if (!inp || !dd) return;

    let debounce;
    inp.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderDropdown(dd, searchDestinations(inp.value)), 200);
    });
    inp.addEventListener('focus', () => {
      if (inp.value.length >= 2) renderDropdown(dd, searchDestinations(inp.value));
    });
    document.addEventListener('click', e => {
      if (!inp.contains(e.target) && !dd.contains(e.target)) dd.classList.remove('open');
    });

    // Make dropdown items fill the correct input on click
    dd.addEventListener('click', e => {
      const item = e.target.closest('.sv-dd-item');
      if (!item) return;
      const city = item.querySelector('span:nth-child(2)')?.textContent || '';
      const code = item.querySelector('.dd-code')?.textContent || '';
      inp.value = `${city.split(',')[0].trim()} (${code})`;
      dd.classList.remove('open');
    });
  });


  // ===== FLATPICKR CUSTOM CALENDAR =====
  if (typeof flatpickr !== 'undefined') {
    const fpConfig = {
      dateFormat: 'd M Y',
      minDate: 'today',
      disableMobile: true,   // keeps custom UI on mobile too
      animate: true,
    };

    // Desktop
    flatpickr('#pf-depart', {
      ...fpConfig,
      onChange: (s, d) => {
        const retPicker = document.querySelector('#pf-return')?._flatpickr;
        if (retPicker) retPicker.set('minDate', d);
      }
    });
    flatpickr('#pf-return', fpConfig);

    // Mobile
    flatpickr('#pmb-depart', {
      ...fpConfig,
      onChange: (s, d) => {
        const retPicker = document.querySelector('#pmb-return')?._flatpickr;
        if (retPicker) retPicker.set('minDate', d);
      }
    });
    flatpickr('#pmb-return', fpConfig);
  }

  // ===== GLASS TOGGLE LIQUID TRANSITION =====
  const toggleBtns = document.querySelectorAll('.glass-toggle-btn');
  const slider = document.querySelector('.glass-toggle-slider');
  const overlay = document.getElementById('page-transition');
  toggleBtns.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('active')) { e.preventDefault(); return; }
      e.preventDefault();
      // Move slider
      if (slider) slider.style.transform = idx === 1 ? 'translateX(100%)' : 'translateX(0)';
      // Liquid glass transition
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = btn.href; }, 500);
      } else {
        window.location.href = btn.href;
      }
    });
  });

  // ===== CHAT BUBBLE → WHATSAPP =====
  const chatBubble = document.getElementById('chat-bubble');
  if (chatBubble) {
    chatBubble.addEventListener('click', () => {
      window.open('https://wa.me/917738836277?text=Hi%20Smart%20Voyage%2C%20I%20have%20a%20question%20about%20business%20class%20flights.', '_blank');
    });
  }

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('p-hamburger');
  const mobileNav = document.getElementById('p-mobile-nav');
  const mobileClose = document.getElementById('p-mobile-close');
  hamburger?.addEventListener('click', () => mobileNav?.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));
  document.querySelectorAll('.p-mob-link').forEach(link => {
    link.addEventListener('click', () => mobileNav?.classList.remove('open'));
  });

  // ===== ENHANCED SCROLL REVEAL =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.p-reveal').forEach(el => observer.observe(el));

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.p-faq-item').forEach(item => {
    item.querySelector('.p-faq-q')?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.p-faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ===== FORM TABS =====
  document.querySelectorAll('.p-form-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.p-form-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ===== SWAP CITIES =====
  const swapBtn = document.getElementById('swap-cities');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const fromEl = document.getElementById('pf-from');
      const toEl = document.getElementById('pf-to');
      if (fromEl && toEl) {
        const tmp = fromEl.value;
        fromEl.value = toEl.value;
        toEl.value = tmp;
      }
    });
  }

  // ===== SEARCH FLIGHT → WHATSAPP =====
  const mobileSearchBtn = document.getElementById('pmb-search-btn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const from = document.getElementById('pmb-from')?.value || '';
      const to = document.getElementById('pmb-to')?.value || '';
      const dep = document.getElementById('pmb-depart')?.value || '';
      const ret = document.getElementById('pmb-return')?.value || '';
      const classTravel = document.getElementById('pmb-class')?.value || 'Business';
      const travelers = document.getElementById('pmb-travelers-count')?.value || '1';
      const tripType = document.getElementById('pmb-trip-type')?.value || 'Round-Trip';

      if (!from || !to) {
        alert('Please select both From and To destinations.');
        return;
      }

      const msg = `Hi Smart Voyage, I'd like to book a flight:\n✈ ${from} → ${to}\n📅 ${dep || 'Flexible'} – ${ret || 'Flexible'}\n🎫 ${tripType} | ${classTravel} | ${travelers} Traveler(s)\nPlease share the best deals.`;
      window.open(`https://wa.me/917738836277?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
  // ===== CONTACT FORM → WHATSAPP =====
  const contactForm = document.getElementById('premium-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = contactForm.querySelector('input[type="text"]')?.value || '';
      const msg = `Hi Smart Voyage, I'm ${name}. I'd like to book a premium flight.`;
      window.open(`https://wa.me/917738836277?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ===== PREMIUM PLANE FOLLOW ANIMATION =====
  const plane = document.getElementById('premium-plane');
  if (plane) {
    let px = -60, py = -60, tx = 0, ty = 0, angle = 45;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function animPlane() {
      px += (tx - px - 30) * 0.03;
      py += (ty - py - 30) * 0.03;
      const dx = tx - px - 30, dy = ty - py - 30;
      angle += (Math.atan2(dy, dx) * 180 / Math.PI - 90 - angle) * 0.05;
      plane.style.left = px + 'px';
      plane.style.top = py + 'px';
      plane.style.transform = `rotate(${angle}deg)`;
      requestAnimationFrame(animPlane);
    }
    animPlane();
    // Hide on mobile
    if (window.innerWidth < 768) plane.style.display = 'none';
  }

  // ===== BUTTON MICRO-INTERACTIONS =====
  document.querySelectorAll('.btn-copper, .btn-outline-w, .p-deal-btn, .p-offer-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'all 0.2s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  // ===== LOAD ADMIN DATA (if available) =====
  try {
    const stored = localStorage.getItem('sv_data');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.premium) {
        // Update hero
        const h1 = document.querySelector('.p-hero h1');
        if (h1 && data.premium.hero?.headline) {
          const parts = data.premium.hero.headline.split('\n');
          h1.innerHTML = parts[0] + (parts[1] ? `<span class="highlight">${parts[1]}</span>` : '');
        }
        // Update destinations
        if (data.premium.destinations) {
          const cards = document.querySelectorAll('.p-deal-card');
          data.premium.destinations.forEach((dest, i) => {
            if (cards[i]) {
              const cityEl = cards[i].querySelector('.p-deal-city');
              const priceEl = cards[i].querySelector('.p-deal-price');
              if (cityEl && dest.name) cityEl.textContent = dest.name;
              if (priceEl && dest.from) priceEl.textContent = dest.from;
            }
          });
        }
        // Update benefits
        if (data.premium.benefits) {
          const benefitCards = document.querySelectorAll('.p-benefit-card');
          data.premium.benefits.forEach((b, i) => {
            if (benefitCards[i]) {
              const title = benefitCards[i].querySelector('h3');
              const desc = benefitCards[i].querySelector('p');
              if (title && b.title) title.textContent = b.title;
              if (desc && b.description) desc.textContent = b.description;
            }
          });
        }
      }
    }
  } catch (e) { /* silently fail */ }

  // Destination Tabs
  document.querySelectorAll('.p-dest-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.p-dest-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.p-dest-region').forEach(r => r.classList.add('hidden'));
      this.classList.add('active');
      const region = this.dataset.region;
      const target = document.querySelector(`.p-dest-region[data-region="${region}"]`);
      if (target) target.classList.remove('hidden');
    });
  });
  // ===== REVIEW CAROUSEL =====
  // ===== REVIEW CAROUSEL =====
  (function () {
    const reviews = [
      { date: "Yesterday", title: "Luxury sedan was a great touch", text: "The complimentary sedan pickup to the airport was the cherry on top. Already booked my second trip through Smart Voyage — won't go anywhere else..." },
      { date: "Yesterday", title: "Best business class deal ever", text: "We saved over 30% on Emirates business class for our entire corporate team. The concierge handled every detail perfectly. Highly recommended..." },
      { date: "Yesterday", title: "Responsive and professional", text: "Got back to me within minutes on WhatsApp. Booked Singapore Airlines business class at a price I've never seen publicly listed. Outstanding service..." },
      { date: "2 days ago", title: "Clear communication", text: "Clear communication. Followed through on initial promises to the letter. I got a great deal on a flight that hasn't been matched anywhere else online..." },
      { date: "2 days ago", title: "Glenn Brown was amazing", text: "Glenn Brown was amazing. Helped get my parents to their meeting in Berlin. Wouldn't have been able to get them there without Smart Voyage..." },
      { date: "3 days ago", title: "I had a great experience with Smart Voyage", text: "I had a great experience with Smart Voyage while going through the process of finding a decent flight at an okay price. They delivered beyond expectations..." },
      { date: "3 days ago", title: "First class upgrade surprise", text: "Booked business class and received a complimentary upgrade to first class. The Smart Voyage team went above and beyond for my anniversary trip..." },
      { date: "4 days ago", title: "Corporate travel sorted perfectly", text: "Our company uses Smart Voyage for all executive travel. Consistent savings of 20–35% across all bookings. The relationship manager is fantastic..." },
      { date: "4 days ago", title: "Mumbai to London seamless", text: "Booked a Mumbai to London business class ticket at nearly 40% off the airline listed price. Everything from booking to boarding was perfect..." },
      { date: "5 days ago", title: "Lufthansa deal was unreal", text: "Got Lufthansa business class to Frankfurt at a price that seemed too good to be true. It was real. Arrived refreshed and ready for my conference..." },
      { date: "5 days ago", title: "24/7 support actually works", text: "Called at 11pm for an urgent rebooking. Agent sorted everything in under 20 minutes. This is what true premium service looks like..." },
      { date: "6 days ago", title: "Repeat customer for a reason", text: "This is my fifth booking with Smart Voyage. Every time the pricing is sharp, the service is warm, and the sedan is always on time..." },
      { date: "1 week ago", title: "Qatar Airways deal perfection", text: "Flew Qatar Airways business class to Doha for a price I'd normally pay for economy. The Qsuite experience was phenomenal. Thank you Smart Voyage..." },
      { date: "1 week ago", title: "Singapore Airlines Suites experience", text: "Booked Singapore Airlines Suites class. The Smart Voyage team negotiated something truly special. One of the best travel experiences of my life..." },
      { date: "1 week ago", title: "Highly professional team", text: "From the first WhatsApp message to boarding, everything was handled with precision. Knowledgeable, fast, and genuinely cares about clients..." },
      { date: "1 week ago", title: "Stress-free luxury booking", text: "Never knew booking business class could be this easy. Smart Voyage handles everything — flights, lounge access info, and arrival transfer details..." },
      { date: "2 weeks ago", title: "Emirates deal was outstanding", text: "Flew Emirates business class to Dubai at 35% below retail. The onboard bar and flat bed were incredible. Smart Voyage made it happen within hours..." },
      { date: "2 weeks ago", title: "Would recommend to everyone", text: "Recommended Smart Voyage to my entire network. Three colleagues have since booked through them. All had the exact same great experience..." }
    ];

    const grid = document.getElementById('rev-grid');
    const btnNext = document.getElementById('rev-next');
    const btnPrev = document.getElementById('rev-prev');
    if (!grid) return;

    const PER_PAGE = 3;
    let page = 0;
    const totalPages = Math.ceil(reviews.length / PER_PAGE);
    const mq480 = window.matchMedia('(max-width: 768px)');

    function makeCard(r) {
      return `
      <div class="p-rev-card">
        <div class="p-rev-date">${r.date}</div>
        <div class="p-rev-stars">
          <span class="p-rev-star">★</span>
          <span class="p-rev-star">★</span>
          <span class="p-rev-star">★</span>
          <span class="p-rev-star">★</span>
          <span class="p-rev-star">★</span>
        </div>
        <div class="p-rev-title">${r.title}</div>
        <p class="p-rev-text">${r.text}</p>
      </div>`;
    }

    function renderDesktop(p) {
      const slice = reviews.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE);
      grid.classList.remove('reviews-marquee');
      grid.style.animation = '';
      grid.style.transform = '';
      grid.innerHTML = slice.map(makeCard).join('');
      grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      grid.style.opacity = '1';
    }

    function renderMobile() {
      grid.classList.add('reviews-marquee');
      // Duplicate reviews for seamless infinite scroll loop
      const allCards = reviews.map(makeCard).join('');
      grid.innerHTML = allCards + allCards;
    }

    function render() {
      if (mq480.matches) {
        renderMobile();
      } else {
        renderDesktop(page);
      }
    }

    render();

    btnNext?.addEventListener('click', () => {
      if (mq480.matches) return;
      page = (page + 1) % totalPages;
      renderDesktop(page);
    });

    btnPrev?.addEventListener('click', () => {
      if (mq480.matches) return;
      page = (page - 1 + totalPages) % totalPages;
      renderDesktop(page);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 120);
    });

    // ── DESKTOP SLIDE ANIMATION (runs after reviews are rendered) ──
    let slidePage = 0;
    let animating = false;

    function showPage(newPage, direction) {
      if (animating || mq480.matches) return;
      animating = true;

      const currentCards = [...grid.querySelectorAll('.p-rev-card')];

      currentCards.forEach(c => c.classList.add('rev-fade-out'));

      const t1 = setTimeout(() => {
        slidePage = newPage;
        renderDesktop(slidePage);

        const nextCards = [...grid.querySelectorAll('.p-rev-card')];
        nextCards.forEach(c => c.classList.add('rev-fade-in'));

        const t2 = setTimeout(() => {
          nextCards.forEach(c => {
            c.classList.remove('rev-fade-in');
          });
          animating = false;
        }, 650);

      }, 260);
    }
    // Override the plain prev/next listeners with animated ones
    btnNext?.addEventListener('click', () => {
      if (mq480.matches) return;
      animating = false;
      showPage((slidePage + 1) % totalPages, 'next');
    });

    btnPrev?.addEventListener('click', () => {
      if (mq480.matches) return;
      animating = false;
      showPage((slidePage - 1 + totalPages) % totalPages, 'prev');
    });

  })();

  // ===== MOBILE BOOKING SECTION INITIALIZATION =====
  // Trip Type Select
  const mbTripSelect = document.getElementById('pmb-trip-select');
  if (mbTripSelect) {
    const trigger = mbTripSelect.querySelector('.pf-select-trigger');
    const options = mbTripSelect.querySelectorAll('.pf-select-option');
    const label = document.getElementById('pmb-trip-label');
    const hidden = document.getElementById('pmb-trip-type');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      mbTripSelect.classList.toggle('open');
      document.getElementById('pmb-class-select')?.classList.remove('open');
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        label.textContent = opt.dataset.value;
        hidden.value = opt.dataset.value;
        mbTripSelect.classList.remove('open');
      });
    });

    document.addEventListener('click', () => mbTripSelect.classList.remove('open'));
  }

  // Passenger + Class Modal for Mobile
  (function initMbPaxModal() {
    const trigger = document.getElementById('pmb-class-select');
    const modal = document.getElementById('pmb-pax-modal');
    const backdrop = document.getElementById('pmb-pax-backdrop');
    const closeBtn = document.getElementById('pmb-pax-close');
    const applyBtn = document.getElementById('pmb-pax-apply');
    const errorEl = document.getElementById('pmb-pax-error');
    if (!trigger || !modal) return;

    const counts = { adults: 1, children: 0, infants: 0 };
    const limits = { adults: { min: 1, max: 9 }, children: { min: 0, max: 8 }, infants: { min: 0, max: 1 } };
    let selectedClass = 'Business';

    function updateLabel() {
      const total = counts.adults + counts.children + counts.infants;
      const label = document.getElementById('pmb-class-label');
      if (label) label.textContent = `${selectedClass} · ${total} Traveler${total > 1 ? 's' : ''}`;
      document.getElementById('pmb-class').value = selectedClass;
      document.getElementById('pmb-travelers-count').value = total;
    }

    function renderCounts() {
      ['adults', 'children', 'infants'].forEach(type => {
        const numEl = document.getElementById(`pmb-count-${type}`);
        if (numEl) numEl.textContent = counts[type];
        modal.querySelectorAll(`.pax-btn[data-type="${type}"]`).forEach(btn => {
          if (btn.dataset.dir === '-') btn.disabled = counts[type] <= limits[type].min;
          if (btn.dataset.dir === '+') btn.disabled = counts[type] >= limits[type].max;
        });
      });
    }

    trigger.querySelector('.pf-select-trigger').addEventListener('click', () => {
      backdrop.classList.add('open');
      modal.classList.add('open');
      errorEl.textContent = '';
    });

    backdrop.addEventListener('click', () => { backdrop.classList.remove('open'); modal.classList.remove('open'); });
    closeBtn.addEventListener('click', () => { backdrop.classList.remove('open'); modal.classList.remove('open'); });

    modal.querySelectorAll('.pax-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const dir = btn.dataset.dir;
        errorEl.textContent = '';
        if (dir === '+') {
          if (counts[type] >= limits[type].max) { errorEl.textContent = `Maximum reached`; return; }
          if (counts.adults + counts.children + counts.infants >= 9) { errorEl.textContent = 'Maximum 9 passengers total'; return; }
          counts[type]++;
        } else {
          if (counts[type] <= limits[type].min) return;
          counts[type]--;
        }
        renderCounts();
      });
    });

    modal.querySelectorAll('.pax-class-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('.pax-class-option').forEach(o => {
          o.classList.remove('active');
          const chk = o.querySelector('.pax-check');
          if (chk) chk.remove();
        });
        opt.classList.add('active');
        selectedClass = opt.dataset.class;
        if (!opt.querySelector('.pax-check')) {
          const chk = document.createElement('span');
          chk.className = 'pax-check';
          chk.textContent = '✓';
          opt.appendChild(chk);
        }
      });
    });

    applyBtn.addEventListener('click', () => { updateLabel(); backdrop.classList.remove('open'); modal.classList.remove('open'); });
    renderCounts();
    updateLabel();
  })();
  // ===== FOLLOW PLANE — Business Class Gold =====
  (function initPremiumPlane() {
    const isMobile = () => window.innerWidth <= 768;

    // ── MOBILE: ambient drifting gold plane ──
    if (isMobile()) {
      const ambient = document.createElement('div');
      ambient.id = 'premium-ambient-plane';
      ambient.innerHTML = '✈';
      ambient.style.cssText = `
      display: block;
      position: fixed;
      pointer-events: none;
      z-index: 9500;
      font-size: 2.2rem;
      left: -80px;
      top: 70%;
      background: linear-gradient(135deg, #ffe8a3 0%, #c4956a 50%, #a57a52 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 14px rgba(196, 149, 106, 1));
      animation: premiumAmbientDrift 20s linear 3s infinite;
    `;
      document.body.appendChild(ambient);

      const style = document.createElement('style');
      style.textContent = `
      @keyframes premiumAmbientDrift {
        0%   { left: -80px;  top: 70%; opacity: 0.5;    transform: rotate(-8deg)  scale(1);    }
        8%   {               top: 70%; opacity: 0.5;                                             }
        35%  { left: 35vw;   top: 52%; opacity: 0.5; transform: rotate(-11deg) scale(1.1);  }
        65%  { left: 68vw;   top: 35%; opacity: 0.5;  transform: rotate(-8deg)  scale(1.05); }
        88%  {               top: 20%; opacity: 0.5;                                          }
        95%  { left: 108vw;  top: 20%; opacity: 0.5;    transform: rotate(-5deg)  scale(0.9);  }
        100% { left: 115vw;  top: 18%; opacity: 0.5;    transform: rotate(-4deg)  scale(0.9);  }
      }
    `;
      document.head.appendChild(style);
      return;
    }

    // ── DESKTOP: cursor follow gold plane ──
    const plane = document.createElement('div');
    plane.id = 'premium-follow-plane';
    plane.innerHTML = '✈';
    plane.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9000;
    font-size: 1.9rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 0;
    transition: opacity 0.4s ease;
    background: linear-gradient(135deg, #ffe8a3 0%, #c4956a 50%, #a57a52 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px rgba(196, 149, 106, 0.95))
            drop-shadow(0 0 22px rgba(196, 149, 106, 0.5));
    will-change: left, top, transform;
  `;
    document.body.appendChild(plane);

    // Gold sparkle star styles only
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
    .premium-gold-sparkle {
      position: fixed;
      pointer-events: none;
      z-index: 8998;
      background: linear-gradient(135deg, #ffe8a3, #c4956a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 5px rgba(196, 149, 106, 1));
      animation: premiumSparkle 0.9s ease-out forwards;
      transform: translate(-50%, -50%);
    }

    .premium-gold-sparkle.size-sm { font-size: 0.5rem; }
    .premium-gold-sparkle.size-md { font-size: 0.75rem; }
    .premium-gold-sparkle.size-lg { font-size: 1rem; }

    @keyframes premiumSparkle {
      0%   { opacity: 1;   transform: translate(-50%, -50%) scale(1.2) rotate(0deg);   }
      40%  { opacity: 0.8; transform: translate(-50%, -50%) scale(1.6) rotate(120deg); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(0)   rotate(260deg); }
    }
  `;
    document.head.appendChild(sparkleStyle);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let planeX = window.innerWidth / 2;
    let planeY = window.innerHeight / 2;
    let lastX = planeX;
    let lastY = planeY;
    let isVisible = false;
    let hideTimer;
    let trailFrame = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      clearTimeout(hideTimer);
      if (!isVisible) {
        plane.style.opacity = '1';
        isVisible = true;
      }
      hideTimer = setTimeout(() => {
        plane.style.opacity = '0';
        isVisible = false;
      }, 3000);
    });

    const stars = ['✦', '✧', '★', '✵', '✴'];

    function spawnSparkle(x, y, size) {
      const sparkle = document.createElement('div');
      sparkle.className = `premium-gold-sparkle size-${size}`;
      sparkle.innerHTML = stars[Math.floor(Math.random() * stars.length)];
      const offsetX = (Math.random() - 0.5) * 22;
      const offsetY = (Math.random() - 0.5) * 22;
      sparkle.style.left = `${x + offsetX}px`;
      sparkle.style.top = `${y + offsetY}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 900);
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

      trailFrame++;

      // Small stars — subtle
      if (isVisible && speed > 2.5 && trailFrame % 5 === 0) {
        spawnSparkle(planeX, planeY, 'sm');
      }

      // Medium stars — fast movement only
      if (isVisible && speed > 5 && trailFrame % 12 === 0) {
        spawnSparkle(planeX, planeY, 'md');
      }

      lastX = planeX;
      lastY = planeY;
      requestAnimationFrame(animate);
    }

    animate();
  })();
  // ===== EASTER EGG — Business Class =====
  (function initPremiumEasterEgg() {
    const logo = document.querySelector('.p-topbar-logo');
    if (!logo) return;

    let isActive = false;

    // Inject HTML
    const eggHTML = `
    <div id="prem-ee-overlay" style="
      position:fixed;inset:0;z-index:9998;pointer-events:none;
      background:rgba(0,0,0,0);
      backdrop-filter:blur(0px);
      transition:all 0.6s cubic-bezier(0.4,0,0.2,1);
    "></div>

    <div id="prem-ee-plane" style="
      position:fixed;font-size:2.5rem;z-index:9999;
      top:60%;left:-150px;pointer-events:none;display:none;
      background:linear-gradient(135deg,#ffe8a3 0%,#c4956a 50%,#a57a52 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;
      filter:drop-shadow(0 0 15px rgba(196,149,106,0.9)) drop-shadow(0 0 30px rgba(196,149,106,0.5));
      will-change:transform,left,top;
    ">✈</div>

    <div id="prem-ee-trail" style="
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:9997;
    "></div>

    <div id="prem-ee-message" style="
      position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%) scale(0.5);
      z-index:9999;text-align:center;
      opacity:0;pointer-events:none;
      transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <div id="prem-ee-icon" style="
        font-size:3.5rem;margin-bottom:1rem;
        display:inline-block;
        animation:premEggGlobe 6s linear infinite;
      ">🌍</div>
      <h2 style="
        font-family:'Playfair Display',serif;
        font-size:clamp(1.8rem,4vw,3rem);
        font-weight:800;
        background:linear-gradient(135deg,#ffe8a3,#c4956a,#a57a52);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        background-clip:text;margin-bottom:0.75rem;
      ">The World Awaits!</h2>
      <p style="font-size:1rem;color:rgba(255,255,255,0.7);margin-bottom:0.5rem;">
        Every great journey begins in Business Class ✨
      </p>
      <span style="
        font-family:'Playfair Display',serif;
        font-size:0.9rem;font-style:italic;
        color:#c4956a;opacity:0.85;
      ">— Smart Voyage Premium</span>
    </div>
  `;

    const wrapper = document.createElement('div');
    wrapper.id = 'prem-easter-egg';
    wrapper.style.display = 'none';
    wrapper.innerHTML = eggHTML;
    document.body.appendChild(wrapper);

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
    @keyframes premEggGlobe {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes premEggFly {
      0%   { left:-150px; top:65%; opacity:0; transform:rotate(-5deg) scale(0.6); }
      10%  { opacity:1; }
      28%  { left:22%; top:55%; transform:rotate(-10deg) scale(1.05); }
      50%  { left:45%; top:43%; transform:rotate(-10deg) scale(1.15); }
      72%  { left:68%; top:30%; transform:rotate(-8deg) scale(1.05); opacity:1; }
      88%  { opacity:0.6; }
      100% { left:115%; top:18%; opacity:0; transform:rotate(-4deg) scale(0.8); }
    }
    @keyframes premStarFall {
      0%   { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
      100% { opacity:0; transform:translateY(50px) scale(0) rotate(180deg); }
    }
    @keyframes premCloudFade {
      0%   { opacity:0.8; transform:scale(0.3) translateX(0); }
      40%  { opacity:0.5; transform:scale(1) translateX(-15px); }
      100% { opacity:0;   transform:scale(1.5) translateX(-40px); }
    }
  `;
    document.head.appendChild(style);

    const overlay = document.getElementById('prem-ee-overlay');
    const plane = document.getElementById('prem-ee-plane');
    const message = document.getElementById('prem-ee-message');
    const trail = document.getElementById('prem-ee-trail');

    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isActive) {
        isActive = true;
        triggerEgg();
      }
    });

    function triggerEgg() {
      wrapper.style.display = 'block';

      // Dim overlay
      setTimeout(() => {
        overlay.style.pointerEvents = 'all';
        overlay.style.background = 'rgba(0,0,0,0.75)';
        overlay.style.backdropFilter = 'blur(18px)';
      }, 50);

      // Fly plane
      setTimeout(() => {
        plane.style.display = 'block';
        plane.style.animation = 'premEggFly 3.2s cubic-bezier(0.45,0.05,0.55,0.95) forwards';
        spawnStars();
      }, 250);

      // Show message
      setTimeout(() => {
        message.style.opacity = '1';
        message.style.pointerEvents = 'all';
        message.style.transform = 'translate(-50%,-50%) scale(1)';
      }, 1900);

      overlay.addEventListener('click', dismissEgg);
      message.addEventListener('click', dismissEgg);
    }

    function dismissEgg() {
      message.style.opacity = '0';
      message.style.transform = 'translate(-50%,-50%) scale(0.5)';
      message.style.pointerEvents = 'none';
      overlay.style.background = 'rgba(0,0,0,0)';
      overlay.style.backdropFilter = 'blur(0px)';
      overlay.style.pointerEvents = 'none';
      plane.style.display = 'none';
      plane.style.animation = '';
      trail.innerHTML = '';

      setTimeout(() => {
        wrapper.style.display = 'none';
        isActive = false;
      }, 650);
    }

    function spawnStars() {
      const goldColors = ['#ffe8a3', '#c4956a', '#a57a52', '#fff3cc', '#e8c87a'];
      const starChars = ['✦', '✧', '★', '✵', '✴', '⋆'];

      // Gold star burst
      for (let i = 0; i < 28; i++) {
        setTimeout(() => {
          const star = document.createElement('div');
          const size = Math.random() * 10 + 4;
          star.style.cssText = `
          position:fixed;
          font-size:${size}px;
          color:${goldColors[Math.floor(Math.random() * goldColors.length)]};
          left:${Math.random() * 100}vw;
          top:${Math.random() * 65 + 10}vh;
          pointer-events:none;
          z-index:9997;
          filter:drop-shadow(0 0 6px rgba(196,149,106,0.9));
          animation:premStarFall ${Math.random() * 1.5 + 0.8}s ease-out forwards;
        `;
          star.innerHTML = starChars[Math.floor(Math.random() * starChars.length)];
          trail.appendChild(star);
        }, i * 70);
      }

      // Gold cloud puffs from plane tail
      const planeEl = document.getElementById('prem-ee-plane');
      let cloudCount = 0;
      const cloudInterval = setInterval(() => {
        if (cloudCount > 20) { clearInterval(cloudInterval); return; }
        const rect = planeEl.getBoundingClientRect();
        const cloud = document.createElement('div');
        const size = Math.random() * 24 + 14;
        const offsetY = (Math.random() - 0.5) * 12;
        cloud.style.cssText = `
        position:fixed;
        left:${rect.left + 8}px;
        top:${rect.top + rect.height / 2 + offsetY}px;
        width:${size}px;height:${size * 0.6}px;
        background:rgba(196,149,106,0.2);
        border-radius:50%;
        pointer-events:none;z-index:9996;
        filter:blur(5px);
        animation:premCloudFade ${Math.random() * 0.7 + 1}s ease-out forwards;
      `;
        trail.appendChild(cloud);
        cloudCount++;
      }, 130);
    }
  })();
  // ===== TRIP TYPE CUSTOM SELECT =====
  const tripSelect = document.getElementById('pf-trip-select');
  if (tripSelect) {
    const trigger = tripSelect.querySelector('.pf-select-trigger');
    const options = tripSelect.querySelectorAll('.pf-select-option');
    const label = document.getElementById('pf-trip-label');
    const hidden = document.getElementById('pf-trip-type');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      tripSelect.classList.toggle('open');
      document.getElementById('pf-class-select')?.classList.remove('open');
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        label.textContent = opt.dataset.value;
        hidden.value = opt.dataset.value;
        tripSelect.classList.remove('open');
      });
    });

    document.addEventListener('click', () => tripSelect.classList.remove('open'));
  }

  // ===== PASSENGER + CLASS MODAL =====
  (function initPaxModal() {
    const trigger = document.getElementById('pf-class-select');
    const modal = document.getElementById('pax-modal');
    const backdrop = document.getElementById('pax-backdrop');
    const closeBtn = document.getElementById('pax-close');
    const applyBtn = document.getElementById('pax-apply');
    const errorEl = document.getElementById('pax-error');

    if (!trigger || !modal) return;

    const counts = { adults: 1, children: 0, infants: 0 };
    const limits = { adults: { min: 1, max: 9 }, children: { min: 0, max: 8 }, infants: { min: 0, max: 1 } };
    let selectedClass = 'Business';

    function updateLabel() {
      const total = counts.adults + counts.children + counts.infants;
      const label = document.getElementById('pf-class-label');
      if (label) label.textContent = `${selectedClass} · ${total} Traveler${total > 1 ? 's' : ''}`;
      document.getElementById('pf-class').value = selectedClass;
      document.getElementById('pf-travelers-count').value = total;
    }

    function renderCounts() {
      ['adults', 'children', 'infants'].forEach(type => {
        const numEl = document.getElementById(`count-${type}`);
        if (numEl) numEl.textContent = counts[type];

        const btns = modal.querySelectorAll(`.pax-btn[data-type="${type}"]`);
        btns.forEach(btn => {
          const dir = btn.dataset.dir;
          if (dir === '-') btn.disabled = counts[type] <= limits[type].min;
          if (dir === '+') btn.disabled = counts[type] >= limits[type].max;
        });
      });
    }

    function openModal() {
      backdrop.classList.add('open');
      modal.classList.add('open');
      errorEl.textContent = '';
    }

    function closeModal() {
      backdrop.classList.remove('open');
      modal.classList.remove('open');
    }

    trigger.querySelector('.pf-select-trigger').addEventListener('click', openModal);
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Counter buttons
    modal.querySelectorAll('.pax-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const dir = btn.dataset.dir;
        errorEl.textContent = '';

        if (dir === '+') {
          if (counts[type] >= limits[type].max) {
            const maxMsgs = {
              adults: 'Maximum 9 adults allowed',
              children: 'Maximum 8 children allowed',
              infants: 'Maximum 1 infant allowed'
            };
            errorEl.textContent = maxMsgs[type];
            return;
          }
          // Total cap of 9
          const total = counts.adults + counts.children + counts.infants;
          if (total >= 9) {
            errorEl.textContent = 'Maximum 9 passengers total';
            return;
          }
          counts[type]++;
        } else {
          if (counts[type] <= limits[type].min) return;
          counts[type]--;
        }
        renderCounts();
      });
    });

    // Class selection
    modal.querySelectorAll('.pax-class-option').forEach(opt => {
      opt.addEventListener('click', () => {
        modal.querySelectorAll('.pax-class-option').forEach(o => {
          o.classList.remove('active');
          const chk = o.querySelector('.pax-check');
          if (chk) chk.remove();
        });
        opt.classList.add('active');
        selectedClass = opt.dataset.class;
        if (!opt.querySelector('.pax-check')) {
          const chk = document.createElement('span');
          chk.className = 'pax-check';
          chk.textContent = '✓';
          opt.appendChild(chk);
        }
      });
    });

    applyBtn.addEventListener('click', () => {
      updateLabel();
      closeModal();
    });

    renderCounts();
    updateLabel();
  })();

});
