# Pinewood Blooms - Website

A beautiful, handcrafted website for Pinewood Blooms LLC, featuring nature-inspired wax flower bouquets and artisan creations.

## Overview

This is a static website built with Bootstrap 5, vanilla JavaScript, and CSV-driven content. It's hosted on GitHub Pages and is fully customizable without requiring any backend infrastructure.

### Key Features
- **6 Pages**: Home, About, Products, Events, Contact, Terms & Conditions
- **Dynamic Content**: Products, events, and lead times loaded from CSV files
- **Custom Bouquet Requests**: Contact form with conditional fields for custom orders
- **Events Management**: Farmers market and craft show schedule
- **SEO Optimized**: Meta tags, structured data, sitemap.xml, robots.txt
- **Mobile Responsive**: Bootstrap 5 responsive grid
- **Email Integration**: Web3Form for contact form submissions
- **Nature-Inspired Design**: Custom color palette with sage green primary color

## Project Structure

```
pinewoodblooms.com/
├── index.html              # Home page
├── about.html              # About page
├── products.html           # Products/Gallery page
├── events.html             # Events/Schedule page
├── contact.html            # Contact form page
├── terms.html              # Terms & Conditions
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine crawling rules
├── .gitignore              # Git ignore file
├── css/
│   └── style.css           # Custom styles with color palette
├── js/
│   ├── products.js         # Product CSV loader & renderer
│   ├── events.js           # Events CSV loader & renderer
│   ├── lead-times.js       # Lead times configuration loader
│   └── contact.js          # Web3Form contact handler
├── data/
│   ├── products.csv        # Product data template
│   ├── events.csv          # Events schedule template
│   └── lead-times.csv      # Custom bouquet lead times
└── images/                 # Product images folder
```

## Getting Started

### 1. Update CSV Data Files

Edit the CSV files in the `data/` folder with your actual business data:

#### `data/products.csv`
```csv
name,description,imageUrl,price
Product Name,Product description,image-url,Contact for Pricing
```

**Fields:**
- `name` - Product name
- `description` - Product description
- `imageUrl` - Full URL to product image
- `price` - Price or pricing info

#### `data/events.csv`
```csv
event name,date,start time,end time,location,description
Event Name,2026-05-18,9:00 AM,2:00 PM,Location,Description
```

**Fields:**
- `event name` - Name of event/market
- `date` - Date in YYYY-MM-DD format
- `start time` - Start time
- `end time` - End time
- `location` - Event location
- `description` - Event description

#### `data/lead-times.csv`
```csv
label,days
Ready in 1-2 weeks,14
```

**Fields:**
- `label` - Customer-facing label (e.g., "Ready in 1-2 weeks")
- `days` - Number of days (numeric)

### 2. Configure Web3Form for Contact Form

1. Go to [web3forms.com](https://web3forms.com)
2. Sign up and create a new form
3. Copy your access key
4. In `js/contact.js`, find the line with `YOUR_WEB3FORM_ACCESS_KEY` and replace it with your actual key

### 3. Update Social Media & Contact Links

Update the following in all HTML files:
- Instagram URL: Replace `https://instagram.com` with your Instagram profile link
- Etsy URL: Replace `https://etsy.com` with your Etsy shop link
- Email: Replace `hello@pinewoodblooms.com` with your actual email

Search and replace across all `.html` files:
- `https://instagram.com` → Your Instagram URL
- `https://etsy.com` → Your Etsy URL
- `hello@pinewoodblooms.com` → Your email address

### 4. Add Product Images

1. Create product image files (JPG, PNG, or WebP)
2. Place them in the `images/` folder or host them externally
3. Update the `imageUrl` field in `products.csv` with the image paths or URLs

**For GitHub Pages hosting:**
- Store images in the `images/` folder and reference as `images/filename.jpg`
- Or use external hosting services like Cloudinary or Imgur

## Color Palette

The design uses a nature-inspired color scheme:
- **Primary**: #687262 (Sage Green)
- **Accent Warm**: #D4A574 (Warm Tan)
- **Accent Dark**: #4A3F35 (Dark Brown)
- **Accent Light**: #F5F1E8 (Off-White/Cream)

All colors can be customized in `css/style.css` using the CSS variables in the `:root` selector.

## Hosting on GitHub Pages

### 1. Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose the branch (usually `main` or `master`)

### 2. Custom Domain (Optional)
1. In GitHub Pages settings, add your custom domain
2. Update DNS records with your domain provider:
   - Create a CNAME record pointing to `username.github.io`
   - Update `sitemap.xml` and meta tags with your domain URL

### 3. Deploy
Simply push your changes to GitHub:
```bash
git add .
git commit -m "Update content"
git push origin main
```

The site will automatically rebuild and deploy.

## SEO Optimization

The site includes:
- ✅ Unique meta tags on each page (title, description)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card meta tags
- ✅ JSON-LD structured data (Organization, Product, LocalBusiness schemas)
- ✅ Sitemap.xml for search engine crawling
- ✅ Robots.txt for crawler guidance
- ✅ Mobile responsiveness (Mobile-first design)
- ✅ Fast performance (image optimization recommended)

### SEO Best Practices
1. **Images**: Optimize image file sizes (< 100KB per image)
2. **Meta descriptions**: Keep under 160 characters, unique per page
3. **Keywords**: Include relevant terms in product descriptions and page content
4. **Mobile**: Test on mobile devices using browser dev tools
5. **Performance**: Run through Google PageSpeed Insights

## Customization

### Change Brand Colors
Edit `css/style.css`:
```css
:root {
    --primary-color: #687262;
    --accent-warm: #D4A574;
    --accent-dark: #4A3F35;
    --accent-light: #F5F1E8;
}
```

### Change Fonts
Update font-family declarations in `css/style.css`:
```css
body {
    font-family: 'Your Font Name', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Your Heading Font', serif;
}
```

### Modify Layout
All HTML pages use Bootstrap 5 classes. Customize layouts by adjusting:
- Container widths: `.container` → `.container-lg`
- Grid columns: `col-md-6` → `col-lg-4`
- Spacing: `py-5`, `mb-4`, etc.

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Image Optimization**: Use tools like TinyPNG or ImageOptim to compress images
2. **Lazy Loading**: Images are loaded on-demand for better performance
3. **Caching**: GitHub Pages includes browser caching headers
4. **CDN**: Bootstrap and external resources are loaded from CDN

## Contact Form Troubleshooting

**Form not sending?**
1. Check Web3Form access key is correct
2. Verify email is not in spam folder
3. Check browser console for JavaScript errors
4. Test with different email providers

## GitHub Pages Deployment Checklist

- [ ] Update all CSV files with your business data
- [ ] Set Web3Form access key in `js/contact.js`
- [ ] Update social media and email links
- [ ] Add product images to `images/` or external hosting
- [ ] Test all links and forms locally
- [ ] Verify mobile responsiveness
- [ ] Enable GitHub Pages in repository settings
- [ ] Run through Google PageSpeed Insights
- [ ] Submit sitemap to Google Search Console

## Support & Maintenance

### Regular Maintenance Tasks
- Update product listings in `products.csv`
- Add/remove events in `events.csv`
- Adjust lead times in `lead-times.csv`
- Monitor contact form submissions
- Check website analytics

### Future Enhancements
- Add blog/news section
- Implement newsletter signup
- Add customer testimonials/reviews
- Create product categories/filtering
- Add image gallery lightbox

## License

This website is created for Pinewood Blooms LLC. All content, including text and images, is proprietary.

## Questions?

For questions about the website setup, contact:
- Email: hello@pinewoodblooms.com
- Location: New York, USA

---

**Built with ❤️ for Pinewood Blooms LLC**