// Fischer Telesec Website JavaScript

// Redirect from directory listing to index.html if needed
(function() {
  // Check if we're in a directory listing by looking for common directory listing elements
  const isDirListing = document.title.includes('Index of') || 
                       document.querySelector('h1')?.textContent?.includes('Index of') ||
                       document.querySelector('title')?.textContent?.includes('Index of');
  
  // If it looks like a directory listing, redirect to index.html
  if (isDirListing) {
    window.location.href = 'index.html';
  }
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initMobileMenu();
  initScrollAnimations();
  initStickyHeader();
  initPortfolioFilters();
  initTestimonialSlider();
  debugHeroButtons();
  styleCTAButton();
  initHeroAnimations();
  initQuickSolutions();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuBtn || !navMenu) return;
  
  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
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

// Enhanced Testimonial Slider
function initTestimonialSlider() {
    const testimonialContainer = document.querySelector('.testimonials-slider');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!testimonialContainer || testimonials.length < 2) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoScrollInterval;
    
    // Add transition classes to testimonials
    testimonials.forEach(testimonial => {
        testimonial.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateX(50px)';
        testimonial.style.display = 'none';
    });
    
    function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Hide all testimonials first
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateX(50px)';
        });
        
        // Show current testimonial with animation
        const currentTestimonial = testimonials[currentIndex];
        currentTestimonial.style.display = 'block';
        
        // Trigger reflow
        currentTestimonial.offsetHeight;
        
        // Animate in
        currentTestimonial.style.opacity = '1';
        currentTestimonial.style.transform = 'translateX(0)';
        
        // Update button states with smooth transition
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === testimonials.length - 1 ? '0.5' : '1';
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Initialize slider
    updateSlider();
    
    // Event listeners for navigation with debounce
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
    
    const debouncedUpdate = debounce(() => {
        updateSlider();
    }, 50);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0 && !isAnimating) {
                currentIndex--;
                debouncedUpdate();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < testimonials.length - 1 && !isAnimating) {
                currentIndex++;
                debouncedUpdate();
            }
        });
    }
    
    // Enhanced dot navigation with hover effect
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentIndex !== index && !isAnimating) {
                currentIndex = index;
                debouncedUpdate();
            }
        });
        
        // Add hover effect
        dot.addEventListener('mouseenter', () => {
            if (!dot.classList.contains('active')) {
                dot.style.transform = 'scale(1.2)';
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (!dot.classList.contains('active')) {
                dot.style.transform = 'scale(1)';
            }
        });
    });
    
    // Auto scroll with pause on interaction
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!isAnimating) {
                currentIndex = (currentIndex + 1) % testimonials.length;
                updateSlider();
            }
        }, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Start auto scroll
    startAutoScroll();
    
    // Pause auto scroll on interaction
    testimonialContainer.addEventListener('mouseenter', stopAutoScroll);
    testimonialContainer.addEventListener('mouseleave', startAutoScroll);
    testimonialContainer.addEventListener('touchstart', stopAutoScroll);
    testimonialContainer.addEventListener('touchend', startAutoScroll);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !isAnimating) {
            if (currentIndex > 0) {
                currentIndex--;
                debouncedUpdate();
            }
        } else if (e.key === 'ArrowRight' && !isAnimating) {
            if (currentIndex < testimonials.length - 1) {
                currentIndex++;
                debouncedUpdate();
            }
        }
    });
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
    // Handle both home pages (index.html and home.html)
    const href = link.getAttribute('href');
    if ((href === 'index.html' || href === 'home.html') && 
        (currentLocation === '/' || 
         currentLocation.endsWith('/index.html') || 
         currentLocation.endsWith('index.html') ||
         currentLocation.endsWith('/home.html') ||
         currentLocation.endsWith('home.html'))) {
      link.classList.add('active');
    }
    else if (currentLocation.endsWith(link.getAttribute('href'))) {
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

// Debug Hero Buttons
function debugHeroButtons() {
  const heroButtons = document.querySelectorAll('.hero-buttons a');
  
  if (!heroButtons.length) return;
  
  heroButtons.forEach(button => {
    // Store original styles
    const isAccentButton = button.textContent.includes('Consultation');
    const originalBackground = isAccentButton ? 'linear-gradient(135deg, #00d2d3, #00a0a0)' : 'transparent';
    const hoverBackground = isAccentButton ? 'linear-gradient(135deg, #00a0a0, #00d2d3)' : 'rgba(255, 255, 255, 0.2)';
    
    // Force styles directly on the element
    button.style.display = 'inline-block';
    button.style.textDecoration = 'none';
    button.style.cursor = 'pointer';
    button.style.position = 'relative';
    button.style.zIndex = '50';
    button.style.pointerEvents = 'auto';
    button.style.transition = 'all 0.3s ease';
    
    // Add hover effects with event listeners
    button.addEventListener('mouseenter', () => {
      button.style.background = hoverBackground;
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = originalBackground;
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
    });
    
    // Add click event listener for debugging
    button.addEventListener('click', (e) => {
      console.log('Hero button clicked:', button.textContent.trim());
      // Let the default behavior happen but log it for debugging
    });
  });
}

// Style CTA Button with hover effects
function styleCTAButton() {
  const ctaButton = document.querySelector('.cta-section .btn-accent');
  
  if (!ctaButton) return;
  
  // Force styles directly on the element
  ctaButton.style.display = 'inline-block';
  ctaButton.style.background = 'linear-gradient(135deg, #00d2d3, #00a0a0)';
  ctaButton.style.color = '#001f3f';
  ctaButton.style.textDecoration = 'none';
  ctaButton.style.cursor = 'pointer';
  ctaButton.style.position = 'relative';
  ctaButton.style.zIndex = '10';
  ctaButton.style.pointerEvents = 'auto';
  ctaButton.style.transition = 'all 0.3s ease';
  
  // Add hover effects with event listeners
  ctaButton.addEventListener('mouseenter', () => {
    ctaButton.style.background = 'linear-gradient(135deg, #00a0a0, #00d2d3)';
    ctaButton.style.transform = 'translateY(-3px)';
    ctaButton.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
  });
  
  ctaButton.addEventListener('mouseleave', () => {
    ctaButton.style.background = 'linear-gradient(135deg, #00d2d3, #00a0a0)';
    ctaButton.style.transform = 'translateY(0)';
    ctaButton.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
  });
}

// Hero Section Animations
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.tech-circle, .tech-square, .tech-triangle');
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        floatingElements.forEach((element) => {
            const speed = element.classList.contains('tech-circle') ? 0.05 :
                         element.classList.contains('tech-square') ? 0.03 : 0.04;
            
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Animate text elements on scroll
    const textElements = document.querySelectorAll('.animate-text');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    textElements.forEach(element => observer.observe(element));
}

// Quick Solutions Section
function initQuickSolutions() {
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
    });
} 