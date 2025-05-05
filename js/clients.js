// Fischer Telesec Clients Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components specific to the clients page
  initStatCounters();
  initClientCardAnimations();
  enhanceTestimonials();
});

// Animate stat counters
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (!statNumbers.length) return;
  
  const options = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

// Counter animation function
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  const suffix = element.innerText.replace(/[0-9]/g, '').trim();
  
  const updateCount = () => {
    current += increment;
    if (current < target) {
      element.innerText = Math.floor(current) + suffix;
      requestAnimationFrame(updateCount);
    } else {
      element.innerText = target + suffix;
    }
  };
  
  updateCount();
}

// Add hover effects and animations to client cards
function initClientCardAnimations() {
  const clientCards = document.querySelectorAll('.client-card');
  
  if (!clientCards.length) return;
  
  clientCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const image = card.querySelector('img');
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const image = card.querySelector('img');
      if (image) {
        image.style.transform = 'scale(1)';
      }
    });
  });
}

// Add interactive elements to testimonials
function enhanceTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  
  if (!testimonialCards.length) return;
  
  testimonialCards.forEach(card => {
    // Add subtle hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.06)';
    });
  });
}

// Make industry cards interactive
document.addEventListener('DOMContentLoaded', () => {
  const industryCards = document.querySelectorAll('.industry-card');
  
  if (!industryCards.length) return;
  
  industryCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active state
      const isActive = card.classList.contains('active');
      
      // Reset all cards
      industryCards.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.clients-hero');
  if (!hero) return;
  
  const scrollPosition = window.scrollY;
  const translateY = scrollPosition * 0.3;
  
  // Apply parallax effect to background
  hero.style.backgroundPositionY = `-${translateY}px`;
}); 