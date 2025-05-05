/**
 * Contact Form Functionality
 * Fischer Telesec Website
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initNewsletterForm();
});

/**
 * Initialize contact form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            // Prepare form data
            const formData = new FormData(contactForm);
            
            // Send data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Show success message
                    showContactSuccessMessage(contactForm);
                } else {
                    // Show error message
                    showContactErrorMessage(contactForm);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showContactErrorMessage(contactForm);
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            });
        });
    }
}

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    // Handle both the main newsletter form and the footer newsletter form
    const newsletterForms = document.querySelectorAll('#newsletter-form, #footer-newsletter-form');
    
    newsletterForms.forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = form.querySelector('input[type="email"]');
                const submitBtn = form.querySelector('button[type="submit"]');
                const messageContainer = form.querySelector('.newsletter-message');
                
                // Validate email
                if (!emailInput.value.trim() || !validateField(emailInput)) {
                    if (!messageContainer) return;
                    
                    messageContainer.innerHTML = '<p class="error-message">Please enter a valid email address.</p>';
                    messageContainer.style.display = 'block';
                    setTimeout(() => {
                        messageContainer.style.display = 'none';
                    }, 3000);
                    return;
                }
                
                // Show loading state
                const originalBtnText = submitBtn.innerText;
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
                
                // Prepare form data
                const formData = new FormData(form);
                
                // Send data to Formspree
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (!messageContainer) return;
                    
                    if (data.ok) {
                        // Show success message
                        messageContainer.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                        // Reset form
                        form.reset();
                    } else {
                        // Show error message
                        messageContainer.innerHTML = '<p class="error-message">Subscription failed. Please try again.</p>';
                    }
                    messageContainer.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (messageContainer) {
                        messageContainer.innerHTML = '<p class="error-message">Subscription failed. Please try again.</p>';
                        messageContainer.style.display = 'block';
                    }
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    
                    // Hide message after 5 seconds
                    if (messageContainer) {
                        setTimeout(() => {
                            messageContainer.style.display = 'none';
                        }, 5000);
                    }
                });
            });
        }
    });
}

/**
 * Display success message after form submission
 * @param {HTMLElement} form - The form element
 */
function showContactSuccessMessage(form) {
    const formContainer = form.closest('.contact-form-col');
    
    if (!formContainer) return;
    
    // Create success message container
    const successMessage = document.createElement('div');
    successMessage.className = 'contact-success-message';
    successMessage.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out to Fischer Telesec. We have received your message and will get back to you as soon as possible, usually within 24 hours.</p>
        <div class="success-actions">
            <a href="../index.html" class="btn btn-primary">Back to Home</a>
            <a href="services.html" class="btn btn-outline">Explore Services</a>
        </div>
    `;
    
    // Replace form with success message
    formContainer.innerHTML = '';
    formContainer.appendChild(successMessage);
}

/**
 * Display error message if form submission fails
 * @param {HTMLElement} form - The form element
 */
function showContactErrorMessage(form) {
    // Create error message if it doesn't exist
    let errorMessage = form.querySelector('.form-error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        form.prepend(errorMessage);
    }
    
    errorMessage.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <p>Sorry, there was a problem sending your message. Please try again or contact us directly.</p>
        </div>
    `;
    
    // Show error message
    errorMessage.style.display = 'block';
    
    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    // Skip fields that don't need validation
    if (!field.hasAttribute('required') || field.disabled || field.type === 'hidden') {
        return true;
    }
    
    let isValid = true;
    
    // Check if field is empty
    if (field.value.trim() === '') {
        isValid = false;
    }
    
    // Additional validation for specific field types
    if (isValid && field.type === 'email') {
        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(field.value);
    }
    
    // Update field styling based on validation result
    if (isValid) {
        field.classList.remove('invalid');
        
        // Remove error message if it exists
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    } else {
        field.classList.add('invalid');
        
        // Add error message if it doesn't exist
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            let errorMessage = formGroup.querySelector('.error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                
                if (field.type === 'email') {
                    errorMessage.textContent = 'Please enter a valid email address';
                } else {
                    errorMessage.textContent = 'This field is required';
                }
                
                const hint = formGroup.querySelector('.form-hint');
                if (hint) {
                    hint.after(errorMessage);
                } else {
                    formGroup.appendChild(errorMessage);
                }
            }
        }
    }
    
    return isValid;
} 