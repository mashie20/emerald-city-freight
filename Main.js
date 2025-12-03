// ====================================
// EMERALD CITY FREIGHT - ADVANCED JAVASCRIPT
// Ultra-optimized, sophisticated interactions
// ====================================

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function () {
  initializeMap();
  initializeNavigation();
  initializeScrollAnimations();
  initializeTrackingSystem();
  initializeQuoteCalculator();
  initializeContactForm();
  initializeCounterAnimations();
  initializeSmoothScroll();
});

// === LEAFLET MAP INITIALIZATION ===
let map;
let trackingMarker;

function initializeMap() {
  // Initialize map centered on Seattle (Emerald City)
  map = L.map('map').setView([47.6062, -122.3321], 10);

  // Add custom styled tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Add custom emerald marker for headquarters
  const hqIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background: linear-gradient(135deg, #059669 0%, #14b8a6 100%); width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>',
    iconSize: [30, 30]
  });

  L.marker([47.6062, -122.3321], { icon: hqIcon })
    .addTo(map)
    .bindPopup('<b>Emerald City Freight HQ</b><br>Seattle, WA');

  // Add sample route markers
  addSampleRoutes();
}

function addSampleRoutes() {
  const routes = [
    { lat: 47.4502, lng: -122.3088, name: 'Tacoma Distribution Center' },
    { lat: 47.9790, lng: -122.2021, name: 'Everett Hub' },
    { lat: 45.5152, lng: -122.6784, name: 'Portland Terminal' },
    { lat: 49.2827, lng: -123.1207, name: 'Vancouver BC Hub' }
  ];

  routes.forEach(route => {
    const routeIcon = L.divIcon({
      className: 'route-marker',
      html: '<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>',
      iconSize: [20, 20]
    });

    L.marker([route.lat, route.lng], { icon: routeIcon })
      .addTo(map)
      .bindPopup(`<b>${route.name}</b>`);
  });
}

// === NAVIGATION ===
function initializeNavigation() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect for header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  // Close mobile menu when link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.textContent = '☰';
    });
  });
}

// === SMOOTH SCROLLING ===
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// === SCROLL ANIMATIONS ===
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

// === COUNTER ANIMATIONS ===
function initializeCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (target === 98 ? '%' : '+');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
    }
  }, 16);
}

// === TRACKING SYSTEM ===
function initializeTrackingSystem() {
  const trackingForm = document.getElementById('trackingForm');
  const trackingInput = document.getElementById('trackingInput');
  const trackingResult = document.getElementById('trackingResult');

  trackingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const trackingNumber = trackingInput.value.trim();

    if (!trackingNumber) {
      showNotification('Please enter a tracking number', 'error');
      return;
    }

    // Validate tracking number format
    if (!validateTrackingNumber(trackingNumber)) {
      showNotification('Invalid tracking number format. Use format: ECF123456789', 'error');
      return;
    }

    // Simulate tracking lookup
    simulateTracking(trackingNumber);
  });
}

function validateTrackingNumber(number) {
  // Validate format: ECF followed by 9 digits, or any alphanumeric string
  return /^ECF\d{9}$|^[A-Z0-9]{8,15}$/i.test(number);
}

function simulateTracking(trackingNumber) {
  const trackingResult = document.getElementById('trackingResult');
  const trackingNumberEl = document.getElementById('trackingNumber');
  const trackingStatus = document.getElementById('trackingStatus');
  const trackingLocation = document.getElementById('trackingLocation');
  const trackingETA = document.getElementById('trackingETA');

  // Show loading state
  trackingResult.classList.add('active');
  trackingNumberEl.textContent = 'Loading...';

  // Simulate API call delay
  setTimeout(() => {
    // Generate random tracking data
    const statuses = [
      { status: 'In Transit', location: 'Seattle, WA', eta: '2 days', coords: [47.6062, -122.3321] },
      { status: 'Out for Delivery', location: 'Portland, OR', eta: 'Today by 5 PM', coords: [45.5152, -122.6784] },
      { status: 'Delivered', location: 'Vancouver, BC', eta: 'Delivered on Dec 1', coords: [49.2827, -123.1207] },
      { status: 'At Distribution Center', location: 'Tacoma, WA', eta: '1 day', coords: [47.4502, -122.3088] }
    ];

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    trackingNumberEl.innerHTML = `<strong>Tracking #:</strong> ${trackingNumber}`;
    trackingStatus.innerHTML = `<strong>Status:</strong> <span style="color: var(--primary); font-weight: 600;">${randomStatus.status}</span>`;
    trackingLocation.innerHTML = `<strong>Current Location:</strong> ${randomStatus.location}`;
    trackingETA.innerHTML = `<strong>Estimated Delivery:</strong> ${randomStatus.eta}`;

    // Update map with tracking location
    updateTrackingMarker(randomStatus.coords, trackingNumber);

    showNotification('Tracking information retrieved successfully!', 'success');
  }, 800);
}

function updateTrackingMarker(coords, trackingNumber) {
  // Remove old tracking marker if exists
  if (trackingMarker) {
    map.removeLayer(trackingMarker);
  }

  // Create pulse animation marker
  const trackingIcon = L.divIcon({
    className: 'tracking-marker',
    html: `<div style="position: relative;">
            <div style="background: #10b981; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5); animation: pulse 2s ease-in-out infinite;"></div>
           </div>`,
    iconSize: [40, 40]
  });

  trackingMarker = L.marker(coords, { icon: trackingIcon })
    .addTo(map)
    .bindPopup(`<b>Tracking: ${trackingNumber}</b><br>Current Location`);

  // Pan map to marker
  map.setView(coords, 12, { animate: true });

  // Add pulse animation CSS if not exists
  if (!document.getElementById('pulse-animation')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation';
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  }
}

// === QUOTE CALCULATOR ===
function initializeQuoteCalculator() {
  const quoteForm = document.getElementById('quoteForm');

  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const weight = parseFloat(document.getElementById('weight').value);
    const service = document.getElementById('service').value;
    const cargo = document.getElementById('cargo').value;

    // Validate inputs
    if (!origin || !destination || !weight || !service || !cargo) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (weight <= 0) {
      showNotification('Weight must be greater than 0', 'error');
      return;
    }

    // Calculate quote
    calculateQuote(origin, destination, weight, service, cargo);
  });
}

function calculateQuote(origin, destination, weight, service, cargo) {
  const quoteResult = document.getElementById('quoteResult');
  const quoteAmount = document.getElementById('quoteAmount');
  const deliveryTime = document.getElementById('deliveryTime');

  // Base rates per pound
  const baseRates = {
    'ground': 0.50,
    'air': 2.00,
    'ocean': 0.30,
    'expedited': 3.50
  };

  // Cargo type multipliers
  const cargoMultipliers = {
    'general': 1.0,
    'fragile': 1.3,
    'perishable': 1.5,
    'hazardous': 2.0
  };

  // Delivery times
  const deliveryTimes = {
    'ground': '3-5 business days',
    'air': '1-2 business days',
    'ocean': '2-4 weeks',
    'expedited': '24 hours'
  };

  // Calculate total
  const baseRate = baseRates[service] || 0.50;
  const cargoMultiplier = cargoMultipliers[cargo] || 1.0;
  const distanceMultiplier = 1.0 + (Math.random() * 0.5); // Simulate distance calculation

  const total = (weight * baseRate * cargoMultiplier * distanceMultiplier).toFixed(2);

  // Animate result display
  quoteResult.classList.remove('active');
  setTimeout(() => {
    quoteAmount.textContent = `$${total}`;
    deliveryTime.textContent = deliveryTimes[service];
    quoteResult.classList.add('active');

    showNotification('Quote calculated successfully!', 'success');

    // Scroll to result
    quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// === CONTACT FORM ===
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate
    if (!name || !email || !message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Simulate form submission
    const button = contactForm.querySelector('button[type="submit"]');
    button.classList.add('loading');
    button.textContent = 'Sending...';

    setTimeout(() => {
      button.classList.remove('loading');
      button.textContent = 'Send Message';

      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
    }, 1500);
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: type === 'success' ? 'var(--emerald-600)' : type === 'error' ? '#dc2626' : 'var(--gray-800)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-2xl)',
    zIndex: '10000',
    animation: 'slideInRight 0.3s ease-out',
    maxWidth: '350px',
    fontSize: '0.95rem',
    fontWeight: '500'
  });

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 4000);

  // Add animation styles if not exists
  if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// === PERFORMANCE OPTIMIZATIONS ===

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lazy load images (if we add them later)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// === ADDITIONAL ENHANCEMENTS ===

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Parallax effect for hero section
window.addEventListener('scroll', debounce(() => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / 600);
    }
  }
}, 10));

console.log('🚚 Emerald City Freight - System Initialized');
console.log('✅ All features loaded successfully');
