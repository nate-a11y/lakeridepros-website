# Lake Ride Pros - CMS Collections Guide

## 📚 Overview

This guide explains how your Payload CMS collections are connected to your website pages and how to ensure your content appears correctly.

---

## ✅ Collection Status & Connections

### 1. **Services Collection** → `/services` page
- **Collection Slug**: `services`
- **Admin URL**: `/admin/collections/services`
- **Frontend Page**: `/services`
- **API Function**: `getServices()` in `/lib/api/payload.ts`

#### ⚠️ **IMPORTANT: Active Filter**
**Only services marked as `active = true` will appear on the website!**

#### Required Fields:
- `title` - Service name
- `slug` - URL-friendly identifier (e.g., "wedding-transportation")
- `description` - Full description
- `active` - **MUST BE CHECKED** for service to show

#### Optional Fields:
- `shortDescription` - Brief summary for cards
- `icon` - Icon identifier
- `image` - Service image (upload to Media collection)
- `features` - Array of feature bullet points
- `pricing` - Pricing information

#### How to Add a Service:
1. Go to `/admin/collections/services`
2. Click "Create New"
3. Fill in all required fields
4. **CHECK the "Active" checkbox** ✅
5. Set an `order` number (lower = appears first)
6. Click "Save"
7. Visit `/services` to see your new service

---

### 2. **Vehicles Collection** → `/fleet` page
- **Collection Slug**: `vehicles`
- **Admin URL**: `/admin/collections/vehicles`
- **Frontend Page**: `/fleet`
- **API Function**: `getVehicles()` in `/lib/api/payload.ts`

#### ⚠️ **IMPORTANT: Available Filter**
**Only vehicles marked as `available = true` will appear on the website!**

#### Required Fields:
- `name` - Vehicle name
- `slug` - URL-friendly identifier (e.g., "limo-bus")
- `description` - Full description
- `capacity` - Number of passengers
- `available` - **MUST BE CHECKED** for vehicle to show

#### Optional Fields:
- `image` - Vehicle photo (upload to Media collection)
- `hourlyRate` - Hourly rental rate
- `features` - Array of vehicle features
- `category` - Vehicle type/category
- `featured` - Check to show on homepage
- `order` - Display order (lower = appears first)

#### How to Add a Vehicle:
1. Go to `/admin/collections/vehicles`
2. Click "Create New"
3. Fill in all required fields
4. **CHECK the "Available" checkbox** ✅
5. Upload an image (optional but recommended)
6. Add features as an array
7. Set `order` number for display sequence
8. Check "Featured" to show on homepage
9. Click "Save"

---

### 3. **Blog Posts Collection** → `/blog` page
- **Collection Slug**: `blog-posts`
- **Admin URL**: `/admin/collections/blog-posts`
- **Frontend Page**: `/blog`
- **API Function**: `getBlogPosts()` in `/lib/api/payload.ts`

#### ⚠️ **IMPORTANT: Published Filter**
**Only posts marked as `published = true` will appear on the website!**

#### Required Fields:
- `title` - Post title
- `slug` - URL-friendly identifier
- `content` - Post content (rich text editor)
- `published` - **MUST BE CHECKED** for post to show
- `publishedDate` - Publication date

#### Optional Fields:
- `excerpt` - Brief summary
- `featuredImage` - Header image
- `author` - Author information
- `categories` - Post categories
- `metaDescription` - SEO description

---

### 4. **Products Collection** → `/shop` page
- **Collection Slug**: `products`
- **Admin URL**: `/admin/collections/products`
- **Frontend Page**: `/shop`
- **API Function**: `getProducts()` in `/lib/api/payload.ts`

#### ⚠️ **IMPORTANT: Status Filter**
**Only products with `status = 'active'` will appear in the shop!**

#### Required Fields:
- `name` - Product name
- `slug` - URL-friendly identifier
- `price` - Product price
- `status` - **MUST BE "active"** to show

#### Optional Fields:
- `description` - Product description
- `images` - Product photos
- `inventory` - Stock quantity
- `featured` - Show on featured products sections
- `categories` - Product categories

---

### 5. **Testimonials Collection** → Homepage
- **Collection Slug**: `testimonials`
- **Admin URL**: `/admin/collections/testimonials`
- **Frontend Page**: `/` (homepage)
- **API Function**: `getTestimonials()` in `/lib/api/payload.ts`

#### Featured Testimonials:
- Homepage shows only testimonials marked as `featured = true`
- Displays in order set by `order` field

#### Required Fields:
- `customerName` - Customer's name
- `content` - Testimonial text
- `rating` - Star rating (1-5)

#### Optional Fields:
- `image` - Customer photo
- `service` - Which service they used
- `featured` - Check to show on homepage
- `order` - Display order

---

### 6. **Partners Collection** → `/wedding-partners`, `/local-premier-partners`, etc.
- **Collection Slug**: `partners`
- **Admin URL**: `/admin/collections/partners`
- **Frontend Pages**: Multiple partner pages
- **API Function**: `getPartners(category)` in `/lib/api/payload.ts`

#### Categories:
- `wedding` - Wedding vendors
- `local-premier` - Local premier partners
- `trusted-referral` - Trusted referral partners

#### Required Fields:
- `name` - Partner business name
- `category` - Partner type

#### Optional Fields:
- `logo` - Business logo
- `description` - Business description
- `website` - Website URL
- `phone` - Contact phone
- `email` - Contact email
- `address` - Physical address
- `featured` - Show as featured partner

---

### 7. **Media Collection** (Used by all collections)
- **Collection Slug**: `media`
- **Admin URL**: `/admin/collections/media`
- **Purpose**: Image and file storage
- **Storage**: Supabase cloud storage

#### How to Upload Media:
1. Go to `/admin/collections/media`
2. Click "Upload"
3. Select your file
4. Add `alt` text (important for SEO and accessibility)
5. Click "Save"
6. Use this media in any other collection by selecting it from the relationship field

---

## 🔍 Common Issues & Solutions

### Issue: "I added a service but it doesn't show on the page"

**Solution Checklist:**
1. ✅ Is the `active` checkbox checked?
2. ✅ Is the `slug` field filled in correctly?
3. ✅ Did you click "Save"?
4. ✅ Wait 60 seconds for cache to clear
5. ✅ Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: "My vehicle doesn't appear in the fleet"

**Solution:**
1. Check the `available` checkbox is **checked** ✅
2. Make sure `name`, `slug`, and `description` are filled in
3. Verify the `slug` doesn't have spaces (use hyphens: "limo-bus" not "limo bus")

### Issue: "Blog post is saved but not visible"

**Solution:**
1. Check the `published` checkbox is **checked** ✅
2. Set a `publishedDate` (can be today or past date)
3. Verify `slug` is unique and URL-friendly

### Issue: "Products not showing in shop"

**Solution:**
1. Set `status` to **"active"** (not draft, not archived)
2. Enter a valid `price`
3. Verify the `slug` is unique

---

## 🎯 Best Practices

### 1. **Always Use Slugs Correctly**
- Use lowercase letters
- Use hyphens instead of spaces
- Example: `luxury-limo-bus` ✅
- NOT: `Luxury Limo Bus` ❌
- NOT: `luxury_limo_bus` ❌

### 2. **Always Add Alt Text to Images**
- Required for accessibility
- Helps with SEO
- Describes the image for screen readers
- Example: "Luxury limo bus with LED lighting at Lake of the Ozarks"

### 3. **Use the Order Field**
- Lower numbers appear first
- Use increments of 10 (10, 20, 30...) to leave room for insertions
- Example: If you want something to appear first, set order to 1

### 4. **Test After Every Change**
- Save your changes in the admin
- Visit the frontend page
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Verify your content appears correctly

### 5. **Image Optimization**
- Upload high-quality images (at least 1200px wide)
- Use JPEG for photos, PNG for graphics with transparency
- Keep file sizes under 2MB when possible

---

## 📊 Collection Field Reference

### Services Collection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | Text | Yes | Service name |
| slug | Text | Yes | URL-friendly identifier |
| description | Textarea | Yes | Full service description |
| shortDescription | Textarea | No | Brief summary for cards |
| icon | Text | No | Icon identifier |
| image | Upload | No | Service image |
| features | Array | No | List of service features |
| pricing | Group | No | Pricing details |
| active | Checkbox | No | Must be checked to show |
| order | Number | No | Display order (lower = first) |

### Vehicles Collection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | Text | Yes | Vehicle name |
| slug | Text | Yes | URL-friendly identifier |
| description | Textarea | Yes | Vehicle description |
| capacity | Number | Yes | Passenger capacity |
| image | Upload | No | Vehicle photo |
| hourlyRate | Number | No | Hourly rental rate |
| features | Array | No | List of features |
| category | Text | No | Vehicle category |
| available | Checkbox | No | Must be checked to show |
| featured | Checkbox | No | Show on homepage |
| order | Number | No | Display order |

---

## 🚀 Quick Start Checklist

### Adding a New Service:
- [ ] Go to `/admin/collections/services`
- [ ] Click "Create New"
- [ ] Fill in: title, slug, description
- [ ] Upload an image (optional but recommended)
- [ ] Add features array
- [ ] **CHECK "Active" checkbox** ✅
- [ ] Set order number (e.g., 10, 20, 30)
- [ ] Click "Save"
- [ ] Visit `/services` and verify it appears

### Adding a New Vehicle:
- [ ] Go to `/admin/collections/vehicles`
- [ ] Click "Create New"
- [ ] Fill in: name, slug, description, capacity
- [ ] Upload vehicle image
- [ ] Add hourly rate
- [ ] Add features array
- [ ] **CHECK "Available" checkbox** ✅
- [ ] Set order number
- [ ] Check "Featured" if you want it on homepage
- [ ] Click "Save"
- [ ] Visit `/fleet` and verify it appears

### Adding a New Blog Post:
- [ ] Go to `/admin/collections/blog-posts`
- [ ] Click "Create New"
- [ ] Fill in: title, slug
- [ ] Write content using the rich text editor
- [ ] Add excerpt
- [ ] Upload featured image
- [ ] Set published date to today (or desired date)
- [ ] **CHECK "Published" checkbox** ✅
- [ ] Add categories/tags
- [ ] Click "Save"
- [ ] Visit `/blog` and verify it appears

---

## 🔄 Data Flow

```
CMS (Payload Admin)
  ↓
Database (Postgres)
  ↓
API (Payload REST API)
  ↓
Frontend API Functions (/lib/api/payload.ts)
  ↓
Next.js Pages (/app/(site)/*/page.tsx)
  ↓
Website (User sees content)
```

---

## 🛠️ Technical Details

### API Endpoints

All collections are accessible via REST API:

- Services: `GET /api/services`
- Vehicles: `GET /api/vehicles`
- Blog Posts: `GET /api/blog-posts`
- Products: `GET /api/products`
- Testimonials: `GET /api/testimonials`
- Partners: `GET /api/partners`
- Media: `GET /api/media`

### Filtering Examples

Services (only active):
```javascript
GET /api/services?where[active][equals]=true&sort=order
```

Vehicles (only available and featured):
```javascript
GET /api/vehicles?where[available][equals]=true&where[featured][equals]=true
```

Blog Posts (only published, sorted by date):
```javascript
GET /api/blog-posts?where[published][equals]=true&sort=-publishedDate
```

### Cache Revalidation

- Default revalidation: 60 seconds
- Changes may take up to 1 minute to appear
- Use hard refresh to bypass browser cache

---

## 📞 Need Help?

If content still doesn't appear after following this guide:

1. Check the browser console for errors (F12)
2. Verify the API endpoint is returning data: `/api/services`, `/api/vehicles`, etc.
3. Ensure all required fields are filled
4. Confirm the appropriate filter field is checked (`active`, `available`, `published`, etc.)
5. Wait 60 seconds and hard refresh

---

## 🎨 Collection Customization

All collection schemas are located in `/collections/`:
- `/collections/Services.ts`
- `/collections/Vehicles.ts`
- `/collections/BlogPosts.ts`
- `/collections/Products.ts`
- `/collections/Testimonials.ts`
- `/collections/Partners.ts`

Need to add a field? Edit the collection file and run: `npm run payload:migrate`

---

**Last Updated**: November 2024
**Payload CMS Version**: 3.x
**Next.js Version**: 15.x
