// Pinewood Blooms - Lead Times Configuration Loader

async function loadLeadTimes() {
    try {
        const response = await fetch('data/lead-times.csv');
        const csvData = await response.text();
        const leadTimes = parseLeadTimesCSV(csvData);
        
        // Populate lead times dropdown
        const leadTimeSelect = document.getElementById('leadTime');
        if (leadTimeSelect) {
            leadTimes.forEach(leadTime => {
                const option = document.createElement('option');
                option.value = leadTime.days;
                option.textContent = leadTime.label;
                leadTimeSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading lead times:', error);
    }
}

function parseLeadTimesCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const leadTimes = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const leadTime = {};
        
        headers.forEach((header, index) => {
            leadTime[header.toLowerCase()] = values[index] || '';
        });
        
        leadTimes.push(leadTime);
    }
    
    return leadTimes;
}

// Load lead times when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLeadTimes);
} else {
    loadLeadTimes();
}
