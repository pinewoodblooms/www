// Pinewood Blooms - Product Catalog

async function loadProducts() {
    const containers = [
        document.getElementById('featured-products'),
        document.getElementById('products-grid')
    ].filter(Boolean);

    if (!containers.length) return;

    try {
        const response = await fetch('data/products.csv');
        if (!response.ok) throw new Error(`Products request failed: ${response.status}`);

        const csvData = await response.text();
        const products = parseCSV(csvData);

        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            renderProductCards(products.slice(0, 3), featuredContainer);
        }

        const productGrid = document.getElementById('products-grid');
        if (productGrid) {
            renderProductCards(products, productGrid);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        containers.forEach(container => {
            container.innerHTML = '<div class="col-12"><p class="text-muted">The product catalog is being refreshed. Please check back soon.</p></div>';
        });
    }
}

function parseCSV(csvText) {
    const rows = parseCSVRows(csvText);
    if (rows.length < 2) return [];

    const headers = rows[0].map(header => header.trim().toLowerCase());

    return rows.slice(1)
        .filter(row => row.some(value => value.trim() !== ''))
        .map(row => headers.reduce((item, header, index) => {
            item[header] = (row[index] || '').trim();
            return item;
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

function renderProductCards(products, container) {
    if (!products.length) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">New arrangements are coming soon.</p></div>';
        return;
    }

    container.innerHTML = products.map(product => {
        const imageUrl = product.imageurl || 'images/hero-wax-bouquets.png';
        const name = product.name || 'Handcrafted Arrangement';
        const description = product.description || 'Handcrafted with care in small batches.';
        const price = product.price || 'Custom quote';
        const tag = product.tag || 'Handmade';

        return `
            <div class="col-md-6 col-xl-3">
                <article class="product-card">
                    <div class="product-image-wrap">
                        <img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(name)}" class="product-image" onerror="this.src='images/hero-wax-bouquets.png'">
                        <span class="product-tag">${escapeHtml(tag)}</span>
                    </div>
                    <div class="product-body">
                        <h4 class="product-title">${escapeHtml(name)}</h4>
                        <p class="product-description">${escapeHtml(description)}</p>
                        <div class="product-footer">
                            <span class="product-price">${escapeHtml(price)}</span>
                            <a href="#contact" class="btn btn-sm">Request Similar</a>
                        </div>
                    </div>
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

function escapeAttribute(text) {
    return escapeHtml(text).replace(/"/g, '&quot;');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}
