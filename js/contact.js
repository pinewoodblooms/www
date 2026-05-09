// Pinewood Blooms - Contact Form Handler with Web3Form Integration

document.addEventListener('DOMContentLoaded', function() {
    const customBouquetCheckbox = document.getElementById('customBouquet');
    const customBouquetFields = document.getElementById('customBouquetFields');
    const contactForm = document.getElementById('contactForm');
    
    // Toggle custom bouquet fields
    if (customBouquetCheckbox) {
        customBouquetCheckbox.addEventListener('change', function() {
            if (this.checked) {
                customBouquetFields.style.display = 'block';
                // Mark bouquet fields as required when visible
                document.getElementById('bouquetDescription').required = true;
                document.getElementById('leadTime').required = true;
            } else {
                customBouquetFields.style.display = 'none';
                // Mark bouquet fields as not required when hidden
                document.getElementById('bouquetDescription').required = false;
                document.getElementById('leadTime').required = false;
            }
        });
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Build message body
            let messageBody = `Name: ${formData.get('name')}\n`;
            messageBody += `Email: ${formData.get('email')}\n`;
            if (formData.get('subject')) {
                messageBody += `Subject: ${formData.get('subject')}\n`;
            }
            messageBody += `\nMessage:\n${formData.get('message')}\n`;
            
            // Add custom bouquet details if applicable
            if (formData.get('customBouquet') === 'on') {
                messageBody += `\n--- CUSTOM BOUQUET REQUEST ---\n`;
                messageBody += `Description: ${formData.get('bouquetDescription')}\n`;
                messageBody += `Preferred Timeline: ${formData.get('leadTime')}\n`;
                if (formData.get('budget')) {
                    messageBody += `Budget: ${formData.get('budget')}\n`;
                }
            }
            
            const formMessage = document.getElementById('formMessage');
            const accessKey = 'YOUR_WEB3FORM_ACCESS_KEY';

            if (accessKey === 'YOUR_WEB3FORM_ACCESS_KEY') {
                const subject = encodeURIComponent(formData.get('subject') || 'Pinewood Blooms Inquiry');
                const body = encodeURIComponent(messageBody);
                formMessage.innerHTML = `<div class="alert alert-info" role="alert">Online sending is not connected yet. Please email us directly at <a href="mailto:pinewoodblooms@gmail.com?subject=${subject}&body=${body}">pinewoodblooms@gmail.com</a>.</div>`;
                return;
            }

            // Prepare data for Web3Form
            const web3FormData = new FormData();
            web3FormData.append('access_key', accessKey);
            web3FormData.append('name', formData.get('name'));
            web3FormData.append('email', formData.get('email'));
            web3FormData.append('subject', formData.get('subject') || 'Contact Form Submission');
            web3FormData.append('message', messageBody);
            web3FormData.append('from_name', 'Pinewood Blooms Website');
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: web3FormData
                });
                
                const result = await response.json();
                if (result.success) {
                    formMessage.innerHTML = '<div class="alert alert-success" role="alert">Thank you! Your message has been sent successfully. We\'ll get back to you soon.</div>';
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                    if (customBouquetCheckbox) {
                        customBouquetCheckbox.checked = false;
                        customBouquetFields.style.display = 'none';
                    }
                } else {
                    formMessage.innerHTML = '<div class="alert alert-danger" role="alert">There was an error sending your message. Please try again.</div>';
                }
            } catch (error) {
                console.error('Form submission error:', error);
                document.getElementById('formMessage').innerHTML = '<div class="alert alert-danger" role="alert">There was an error sending your message. Please try again.</div>';
            }
        });
    }
});
