// =====================================================
// SMART VOYAGE — Shared Data Store
// Centralized content management for both landing pages
// =====================================================

const SV_DATA_KEY = 'sv_data';

const DEFAULT_DATA = {
  // Premium Page Content
  premium: {
    hero: {
      headline: 'Experience Flight,\nReimagined.',
      subheadline: 'Exclusive Business & First Class deals curated for discerning travellers. Luxury is not a privilege — it\'s a standard.',
    },
    specialOffer: {
      airline: 'Singapore Airlines',
      title: 'Business & First Class',
      routes: [
        { from: 'India', to: 'Singapore', label: 'India ⇄ Singapore' },
        { from: 'India', to: 'London', label: 'India ⇄ London' },
        { from: 'London', to: 'USA', label: 'London ⇄ USA' },
      ],
      tagline: 'And many more exclusive routes',
    },
    benefits: [
      {
        icon: '🚘',
        title: 'Complimentary Luxury Sedan',
        description: 'Airport pickup & drop in a premium sedan — included with every booking.',
      },
      {
        icon: '💎',
        title: 'Up to 25% Off Market Price',
        description: 'Exclusive negotiated rates that you won\'t find on any public platform.',
      },
      {
        icon: '👤',
        title: 'Personalized Booking Support',
        description: 'A dedicated travel concierge to handle every detail of your journey.',
      },
      {
        icon: '✨',
        title: 'First Class Upgrade',
        description: 'Lucky customers receive a complimentary upgrade to First Class.',
      },
    ],
    clients: [
      { name: 'Bright Outdoor', logo: null },
      { name: 'CreativeYrus', logo: null },
      { name: 'Asian Tours', logo: null },
    ],
    testimonials: [
      {
        text: 'Smart Voyage transformed our corporate travel. The business class rates are unmatched and the sedan service is a brilliant touch.',
        author: 'Rajesh Mehta',
        role: 'Director, Bright Outdoor',
        rating: 5,
      },
      {
        text: 'Every trip feels effortless. Their premium concierge handles everything — from seat selection to lounge access. Truly five-star.',
        author: 'Priya Sharma',
        role: 'CEO, CreativeYrus',
        rating: 5,
      },
      {
        text: 'We\'ve saved over 20% on business class fares for our entire team. The quality of service is outstanding.',
        author: 'Arjun Patel',
        role: 'Travel Manager, Asian Tours',
        rating: 5,
      },
    ],
    destinations: [
      {
        name: 'Singapore',
        image: 'images/singapore.png',
        class: 'Business Class',
        from: '₹42,999',
      },
      {
        name: 'London',
        image: 'images/london.png',
        class: 'Business Class',
        from: '₹89,999',
      },
      {
        name: 'New York',
        image: 'images/usa.png',
        class: 'First Class',
        from: '₹1,49,999',
      },
    ],
  },

  // Economy Page Content (prices for deals)
  economy: {
    deals: [
      { route: 'Mumbai → Dubai', iata: { from: 'BOM', to: 'DXB' }, price: '₹9,999', badge: 'Hot Deal', image: 'images/dubai.png' },
      { route: 'Mumbai → Delhi', iata: { from: 'BOM', to: 'DEL' }, price: '₹4,999', badge: 'Popular', image: 'images/delhi.png' },
      { route: 'Mumbai → Kerala', iata: { from: 'BOM', to: 'COK' }, price: '₹3,999', badge: 'Best Value', image: 'images/kerala.png' },
      { route: 'Mumbai → Srinagar', iata: { from: 'BOM', to: 'SXR' }, price: '₹5,499', badge: 'Scenic', image: 'images/srinagar.png' },
      { route: 'Mumbai → Jaipur', iata: { from: 'BOM', to: 'JAI' }, price: '₹4,499', badge: 'Trending', image: 'images/jaipur.png' },
      { route: 'Mumbai → Muscat', iata: { from: 'BOM', to: 'MCT' }, price: '₹9,999', badge: 'International', image: 'images/muscat.png' },
    ],
  },

  // WhatsApp CTA
  whatsappNumber: '917738836277',
  whatsappMessage: 'Hi Smart Voyage, I\'d like to book a premium flight.',
};

// Load data from localStorage or use defaults
function loadSVData() {
  try {
    const stored = localStorage.getItem(SV_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load stored data, using defaults.');
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Save data to localStorage
function saveSVData(data) {
  try {
    localStorage.setItem(SV_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

// Get WhatsApp URL
function getWhatsAppURL(data) {
  const d = data || loadSVData();
  return `https://wa.me/${d.whatsappNumber}?text=${encodeURIComponent(d.whatsappMessage)}`;
}

// Reset to defaults
function resetSVData() {
  localStorage.removeItem(SV_DATA_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
