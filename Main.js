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

// === SCROLL ANIMATIONS WITH STAGGER ===
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Add stagger effect to children if it's a grid/container
        if (entry.target.classList.contains('services-grid') ||
          entry.target.classList.contains('features-grid') ||
          entry.target.classList.contains('stats-grid')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 100}ms`;
            child.classList.add('visible');
          });
        }
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .services-grid, .features-grid, .stats-grid').forEach(el => {
    observer.observe(el);
  });
}

// ... (Counter animations remain same) ...

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

  // Icon based on type
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 1.2rem;">${icon}</span>
      <span style="font-weight: 500;">${message}</span>
    </div>
  `;

  // Style notification using new design system variables
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '24px',
    background: 'white',
    color: 'var(--slate-900)',
    padding: '16px 24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    zIndex: '10000',
    animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    maxWidth: '380px',
    fontSize: '0.95rem',
    borderLeft: `4px solid ${type === 'success' ? 'var(--emerald-500)' : type === 'error' ? '#ef4444' : '#3b82f6'}`,
    backdropFilter: 'blur(10px)',
    webkitBackdropFilter: 'blur(10px)'
  });

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ... (Performance optimizations remain same) ...

// Parallax effect for hero section (Optimized)
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.scrollY;
    const heroContent = hero.querySelector('.hero-content');
    const heroBg = hero.querySelector('.hero-bg');
    const blobs = document.querySelectorAll('.hero-blob');

    if (heroContent) {
      // Subtle parallax for content
      heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
      heroContent.style.opacity = 1 - (scrolled / 700);
    }

    if (heroBg) {
      // Slower parallax for background
      heroBg.style.transform = `translateY(${scrolled * 0.1}px)`;
    }

    // Parallax for blobs
    blobs.forEach((blob, index) => {
      const speed = 0.15 + (index * 0.05);
      blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

console.log('🚚 Emerald City Freight - System Initialized');
console.log('✅ All features loaded successfully');
