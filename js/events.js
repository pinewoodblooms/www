// Pinewood Blooms - Events Schedule

async function loadEvents() {
    const containers = [
        document.getElementById('upcoming-events'),
        document.getElementById('events-grid')
    ].filter(Boolean);

    if (!containers.length) return;

    try {
        const response = await fetch('data/events.csv');
        if (!response.ok) throw new Error(`Events request failed: ${response.status}`);

        const csvData = await response.text();
        const events = parseEventCSV(csvData)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const upcomingContainer = document.getElementById('upcoming-events');
        if (upcomingContainer) {
            renderEventCards(events.slice(0, 3), upcomingContainer);
        }

        const eventsGrid = document.getElementById('events-grid');
        if (eventsGrid) {
            renderEventCards(events, eventsGrid);
        }
    } catch (error) {
        console.error('Error loading events:', error);
        containers.forEach(container => {
            container.innerHTML = '<div class="col-12"><p class="text-muted">The event schedule is being refreshed. Please check back soon.</p></div>';
        });
    }
}

function parseEventCSV(csvText) {
    const rows = parseCSVRows(csvText);
    if (rows.length < 2) return [];

    const headers = rows[0].map(header => header.trim().toLowerCase());

    return rows.slice(1)
        .filter(row => row.some(value => value.trim() !== ''))
        .map(row => headers.reduce((event, header, index) => {
            event[header] = (row[index] || '').trim();
            return event;
        }, {}));
}

function parseCSVRows(csvText) {
    const rows = [];
    let current = '';
    let row = [];
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const next = csvText[i + 1];

        if (char === '"' && next === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') i++;
            row.push(current);
            rows.push(row);
            row = [];
            current = '';
        } else {
            current += char;
        }
    }

    if (current || row.length) {
        row.push(current);
        rows.push(row);
    }

    return rows;
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function renderEventCards(events, container) {
    if (!events.length) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No upcoming events are listed yet. Check back soon.</p></div>';
        return;
    }

    container.innerHTML = events.map(event => {
        const eventName = event['event name'] || event.eventname || 'Upcoming Event';
        const eventDate = event.date || '';
        const startTime = event['start time'] || event.starttime || '';
        const endTime = event['end time'] || event.endtime || '';
        const location = event.location || '';
        const description = event.description || event.desc || '';
        const timeRange = startTime && endTime ? `${startTime} to ${endTime}` : startTime;

        return `
            <div class="col-md-6 col-lg-4">
                <article class="event-card">
                    <div class="event-date">${escapeHtml(formatDate(eventDate))}</div>
                    <div class="event-title">${escapeHtml(eventName)}</div>
                    ${timeRange ? `<div class="event-time">Time: ${escapeHtml(timeRange)}</div>` : ''}
                    ${location ? `<div class="event-location">Location: ${escapeHtml(location)}</div>` : ''}
                    ${description ? `<div class="event-description">${escapeHtml(description)}</div>` : ''}
                </article>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEvents);
} else {
    loadEvents();
}
