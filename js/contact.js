// Pinewood Blooms - Custom Order Form Handler

document.addEventListener('DOMContentLoaded', async function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const sizeSelect = document.getElementById('size');
    const quantityInput = document.getElementById('quantity');
    const preferredDateInput = document.getElementById('preferredDate');
    const availabilityHelp = document.getElementById('availabilityHelp');
    const preferredDateFeedback = document.getElementById('preferredDateFeedback');
    const orderSummary = document.getElementById('orderSummary');
    const blockedDates = await loadBlockedDates();

    function getSelectedSize() {
        const option = sizeSelect.selectedOptions[0];
        if (!option || !option.value) return null;

        return {
            name: option.value,
            price: Number(option.dataset.price || 0),
            minDays: Number(option.dataset.minDays || 0),
            maxDays: Number(option.dataset.maxDays || 0),
            label: option.textContent.trim()
        };
    }

    function updateOrderDetails() {
        const size = getSelectedSize();
        const quantity = Math.max(1, Number(quantityInput.value || 1));

        if (!size) {
            preferredDateInput.removeAttribute('min');
            preferredDateInput.value = '';
            preferredDateInput.setCustomValidity('');
            availabilityHelp.textContent = 'Select a size to see the earliest available date.';
            orderSummary.textContent = 'Select a size and quantity to see pricing and timing.';
            return;
        }

        const earliestDate = addAvailableDays(new Date(), size.minDays, blockedDates);
        const latestTypicalDate = addAvailableDays(new Date(), size.maxDays, blockedDates);
        const earliestDateValue = formatDateValue(earliestDate);
        const total = size.price * quantity;

        preferredDateInput.min = earliestDateValue;
        availabilityHelp.textContent = `${size.name} vases need ${size.minDays}-${size.maxDays} available days. Earliest available date: ${formatDisplayDate(earliestDate)}.`;
        orderSummary.innerHTML = `
            <strong>${escapeHtml(size.name)}:</strong> $${size.price} each + applicable NY sales tax<br>
            <strong>Estimated pre-tax total:</strong> $${total}<br>
            <strong>Sales tax:</strong> Added when your order is confirmed<br>
            <strong>Typical timing:</strong> ${formatDisplayDate(earliestDate)} to ${formatDisplayDate(latestTypicalDate)}
        `;

        validatePreferredDate();
    }

    function validatePreferredDate() {
        const size = getSelectedSize();
        const selectedValue = preferredDateInput.value;
        preferredDateInput.setCustomValidity('');

        if (!size || !selectedValue) return;

        const earliestDate = addAvailableDays(new Date(), size.minDays, blockedDates);
        const selectedDate = parseDateValue(selectedValue);

        if (selectedDate < earliestDate) {
            preferredDateInput.setCustomValidity('Please select a later date.');
            preferredDateFeedback.textContent = `Please select ${formatDisplayDate(earliestDate)} or later.`;
            return;
        }

        if (blockedDates.has(selectedValue)) {
            preferredDateInput.setCustomValidity('Please select a date that is not blocked out.');
            preferredDateFeedback.textContent = 'That date is currently blocked out. Please choose another date.';
            return;
        }

        preferredDateFeedback.textContent = 'Please select an available date.';
    }

    sizeSelect.addEventListener('change', updateOrderDetails);
    quantityInput.addEventListener('input', updateOrderDetails);
    preferredDateInput.addEventListener('input', validatePreferredDate);
    updateOrderDetails();

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        validatePreferredDate();

        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const formData = new FormData(contactForm);
        const size = getSelectedSize();
        const quantity = Math.max(1, Number(formData.get('quantity') || 1));
        const estimatedTotal = size.price * quantity;

        let messageBody = `Name: ${formData.get('name')}\n`;
        messageBody += `Email: ${formData.get('email')}\n`;
        messageBody += `Phone: ${formData.get('phone')}\n\n`;
        messageBody += `--- CUSTOM ORDER REQUEST ---\n`;
        messageBody += `Size: ${size.label}\n`;
        messageBody += `Quantity: ${quantity}\n`;
        messageBody += `Estimated Pre-Tax Total: $${estimatedTotal}\n`;
        messageBody += `Sales Tax: Applicable NY sales tax to be added when order is confirmed\n`;
        messageBody += `Color 1: ${formData.get('color1')}\n`;
        messageBody += `Color 2: ${formData.get('color2') || 'N/A'}\n`;
        messageBody += `Color 3: ${formData.get('color3') || 'N/A'}\n`;
        messageBody += `Color 4: ${formData.get('color4') || 'N/A'}\n`;
        messageBody += `Fragrance: ${formData.get('fragrance')}\n`;
        messageBody += `Pickup/Delivery: ${formData.get('fulfillment')}\n`;
        messageBody += `Preferred Date: ${formatDisplayDate(parseDateValue(formData.get('preferredDate')))}\n\n`;
        messageBody += `Special Notes:\n${formData.get('specialNotes') || 'N/A'}\n`;

        const formMessage = document.getElementById('formMessage');
        const accessKey = 'c188c090-7385-41f7-84b5-3fd56025de30';
        const subject = 'Pinewood Blooms Custom Order Request';

        if (accessKey === 'YOUR_WEB3FORM_ACCESS_KEY') {
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(messageBody);
            formMessage.innerHTML = `<div class="alert alert-info" role="alert">Online sending is not connected yet. Please email us directly at <a href="mailto:pinewoodblooms@gmail.com?subject=${encodedSubject}&body=${encodedBody}">pinewoodblooms@gmail.com</a>.</div>`;
            return;
        }

        const web3FormData = new FormData();
        web3FormData.append('access_key', accessKey);
        web3FormData.append('name', formData.get('name'));
        web3FormData.append('email', formData.get('email'));
        web3FormData.append('subject', subject);
        web3FormData.append('message', messageBody);
        web3FormData.append('from_name', 'Pinewood Blooms Website');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: web3FormData
            });

            const result = await response.json();
            if (result.success) {
                formMessage.innerHTML = '<div class="alert alert-success" role="alert">Thank you. Your custom order request has been sent, and we will follow up to confirm details.</div>';
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                updateOrderDetails();
            } else {
                formMessage.innerHTML = '<div class="alert alert-danger" role="alert">There was an error sending your request. Please try again.</div>';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formMessage.innerHTML = '<div class="alert alert-danger" role="alert">There was an error sending your request. Please try again.</div>';
        }
    });
});

async function loadBlockedDates() {
    try {
        const response = await fetch('data/block-out-days.csv');
        if (!response.ok) throw new Error(`Block-out request failed: ${response.status}`);

        const csvData = await response.text();
        return new Set(csvData
            .split(/\r?\n/)
            .slice(1)
            .map(line => line.split(',')[0].trim())
            .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)));
    } catch (error) {
        console.error('Error loading block-out days:', error);
        return new Set();
    }
}

function addAvailableDays(startDate, days, blockedDates) {
    const date = new Date(startDate);
    date.setHours(0, 0, 0, 0);

    let addedDays = 0;
    while (addedDays < days) {
        date.setDate(date.getDate() + 1);
        if (!blockedDates.has(formatDateValue(date))) {
            addedDays++;
        }
    }

    return date;
}

function parseDateValue(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
