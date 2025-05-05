// Fischer Telesec Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initMobileMenu();
  initScrollAnimations();
  initStickyHeader();
  initPortfolioFilters();
  initTestimonialSlider();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuBtn || !navMenu) return;
  
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Adjust aria-expanded attribute for accessibility
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    
    // Toggle menu icon
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (menuIcon.classList.contains('fa-bars')) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
    } else {
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', false);
    }
  });
}

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animatedElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Sticky Header on Scroll
function initStickyHeader() {
  const header = document.querySelector('.header');
  const topBar = document.querySelector('.top-bar');
  
  if (!header || !topBar) return;
  
  const topBarHeight = topBar.offsetHeight;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > topBarHeight) {
      header.classList.add('sticky');
      document.body.style.paddingTop = header.offsetHeight + 'px';
    } else {
      header.classList.remove('sticky');
      document.body.style.paddingTop = '0';
    }
  });
}

// Portfolio Filters
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!filterButtons.length || !portfolioItems.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to current button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Show/hide portfolio items based on filter
      portfolioItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
        } else if (item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Testimonial Slider
function initTestimonialSlider() {
  const testimonialContainer = document.querySelector('.testimonials-container');
  const testimonials = document.querySelectorAll('.testimonial-card');
  
  if (!testimonialContainer || testimonials.length < 2) return;
  
  let currentIndex = 0;
  const testimonialWidth = testimonials[0].offsetWidth + parseInt(window.getComputedStyle(testimonials[0]).marginRight);
  
  // Next/Prev buttons if they exist
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        scrollToCurrentTestimonial();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < testimonials.length - 1) {
        currentIndex++;
        scrollToCurrentTestimonial();
      }
    });
  }
  
  function scrollToCurrentTestimonial() {
    testimonialContainer.scrollTo({
      left: currentIndex * testimonialWidth,
      behavior: 'smooth'
    });
  }
  
  // Auto scroll every 5 seconds
  let autoScrollInterval;
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      scrollToCurrentTestimonial();
    }, 5000);
  }
  
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  
  // Start auto scroll
  startAutoScroll();
  
  // Pause auto scroll when user is interacting
  testimonialContainer.addEventListener('mouseenter', stopAutoScroll);
  testimonialContainer.addEventListener('mouseleave', startAutoScroll);
  testimonialContainer.addEventListener('touchstart', stopAutoScroll);
  testimonialContainer.addEventListener('touchend', startAutoScroll);
}

// Form Validation
function validateForm(formSelector) {
  const form = document.querySelector(formSelector);
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    let isValid = true;
    
    // Get all required inputs
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        showError(input, 'This field is required');
      } else {
        clearError(input);
        
        // Email validation
        if (input.type === 'email' && !isValidEmail(input.value)) {
          isValid = false;
          showError(input, 'Please enter a valid email address');
        }
        
        // Phone validation
        if (input.type === 'tel' && !isValidPhone(input.value)) {
          isValid = false;
          showError(input, 'Please enter a valid phone number');
        }
      }
    });
    
    if (!isValid) {
      e.preventDefault();
    }
  });
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
  }
  
  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('error');
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }
}

// Initialize form validation for contact and quote forms
document.addEventListener('DOMContentLoaded', () => {
  validateForm('#contact-form');
  validateForm('#quote-form');
});

// Add active class to current navigation item based on URL
document.addEventListener('DOMContentLoaded', () => {
  const currentLocation = location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    if (currentLocation === link.getAttribute('href')) {
      link.classList.add('active');
    }
  });
});

// Counter Animation for Statistics Section
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCount() {
    start += increment;
    
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target;
    }
  }
  
  updateCount();
}

// Initialize counters when they come into view
document.addEventListener('DOMContentLoaded', () => {
  const statCounters = document.querySelectorAll('.stat-counter');
  
  if (!statCounters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statCounters.forEach(counter => {
    observer.observe(counter);
  });
}); 