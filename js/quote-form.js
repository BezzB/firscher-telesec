/**
 * Quote Request Form Functionality
 * Fischer Telesec Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form elements
    initMultiStepForm();
    initFormValidation();
    initFormSubmission();
    initNewsletterForm();
});

/**
 * Initialize multi-step form navigation
 */
function initMultiStepForm() {
    const formSteps = document.querySelectorAll('.form-step');
    const formContents = document.querySelectorAll('.form-step-content');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Next button handler
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = parseInt(button.dataset.next) - 1;
            const nextStep = parseInt(button.dataset.next);
            
            // Basic validation for required fields in current step
            const currentContent = document.getElementById(`step-${currentStep}`);
            const requiredFields = currentContent.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            // Hide all content sections
            formContents.forEach(content => content.classList.remove('active'));
            
            // Reset all steps
            formSteps.forEach(step => step.classList.remove('active'));
            
            // Mark previous steps as completed
            for (let i = 1; i < nextStep; i++) {
                document.querySelector(`.form-step[data-step="${i}"]`).classList.add('completed');
            }
            
            // Show active step content
            document.getElementById(`step-${nextStep}`).classList.add('active');
            document.querySelector(`.form-step[data-step="${nextStep}"]`).classList.add('active');
            
            // Smooth scroll to top of form
            const formContainer = document.querySelector('.quote-form-container');
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Previous button handler
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = parseInt(button.dataset.prev);
            
            // Hide all content sections
            formContents.forEach(content => content.classList.remove('active'));
            
            // Reset all steps
            formSteps.forEach(step => {
                step.classList.remove('active');
                if (parseInt(step.dataset.step) < prevStep) {
                    step.classList.add('completed');
                } else {
                    step.classList.remove('completed');
                }
            });
            
            // Show active step content
            document.getElementById(`step-${prevStep}`).classList.add('active');
            document.querySelector(`.form-step[data-step="${prevStep}"]`).classList.add('active');
            
            // Smooth scroll to top of form
            const formContainer = document.querySelector('.quote-form-container');
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.getElementById('quote-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add validation on blur
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });
}

/**
 * Initialize form submission with AJAX to prevent redirect
 */
function initFormSubmission() {
    const form = document.getElementById('quote-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before submission
            const inputs = form.querySelectorAll('input, select, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Find the first invalid field's step and activate it
                const invalidField = form.querySelector('.invalid');
                if (invalidField) {
                    const stepContent = invalidField.closest('.form-step-content');
                    if (stepContent) {
                        const stepId = stepContent.id.split('-')[1];
                        
                        // Activate the correct step
                        document.querySelectorAll('.form-step-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        document.querySelectorAll('.form-step').forEach(step => {
                            step.classList.remove('active');
                            if (parseInt(step.dataset.step) < parseInt(stepId)) {
                                step.classList.add('completed');
                            } else {
                                step.classList.remove('completed');
                            }
                        });
                        
                        stepContent.classList.add('active');
                        document.querySelector(`.form-step[data-step="${stepId}"]`).classList.add('active');
                        
                        // Focus the first invalid field
                        invalidField.focus();
                        
                        // Scroll to form
                        const formContainer = document.querySelector('.quote-form-container');
                        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
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
                if (data.ok) {
                    // Show success message
                    showSuccessMessage(form);
                } else {
                    // Show error message
                    showErrorMessage(form);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage(form);
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
        });
    }
}

/**
 * Display success message after form submission
 * @param {HTMLElement} form - The form element
 */
function showSuccessMessage(form) {
    const formContainer = form.closest('.quote-form-container');
    
    // Create success message container
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Thank You for Your Request!</h3>
        <p>Your quote request has been successfully submitted. Our team will review your requirements and get back to you within 24-48 hours.</p>
        <p class="reference-number">Reference #: QR-${generateReferenceNumber()}</p>
        <div class="success-actions">
            <a href="../index.html" class="btn btn-primary">Back to Home</a>
            <a href="contact.html" class="btn btn-outline">Contact Us</a>
        </div>
    `;
    
    // Replace form with success message
    formContainer.innerHTML = '';
    formContainer.appendChild(successMessage);
    
    // Scroll to success message
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display error message if form submission fails
 * @param {HTMLElement} form - The form element
 */
function showErrorMessage(form) {
    // Create error message if it doesn't exist
    let errorMessage = document.querySelector('.form-error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        form.prepend(errorMessage);
    }
    
    errorMessage.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <p>Sorry, there was a problem submitting your request. Please try again or contact us directly.</p>
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
 * Generate a random reference number for the quote request
 * @returns {string} - A reference number
 */
function generateReferenceNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
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
    } else {
        field.classList.add('invalid');
    }
    
    return isValid;
}

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const messageContainer = newsletterForm.querySelector('.newsletter-message');
            
            // Validate email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
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
            const formData = new FormData(newsletterForm);
            
            // Send data to Formspree
            fetch(newsletterForm.action, {
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
                    messageContainer.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                    // Reset form
                    newsletterForm.reset();
                } else {
                    // Show error message
                    messageContainer.innerHTML = '<p class="error-message">Subscription failed. Please try again.</p>';
                }
                messageContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                messageContainer.innerHTML = '<p class="error-message">Subscription failed. Please try again.</p>';
                messageContainer.style.display = 'block';
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageContainer.style.display = 'none';
                }, 5000);
            });
        });
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
} 