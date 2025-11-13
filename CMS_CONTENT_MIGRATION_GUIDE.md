# CMS Content Migration Guide

## Overview

The navigation (Header and Footer) are now **fully dynamic** and pull services from Payload CMS automatically. When you add new services in the CMS, they will appear in the navigation automatically.

However, there are currently **14 hardcoded service page files** that should be migrated to the CMS for easier editing.

## ✅ What's Already Dynamic

- **Header Navigation**: Fetches services from CMS and displays in Services dropdown
- **Footer Links**: Fetches services from CMS and displays in Services section
- **Sitemap**: Services are fetched from CMS and included automatically

## 🔄 Hardcoded Service Pages to Migrate

The following hardcoded service pages exist in `/app/(site)/` and should be migrated to the CMS:

### 1. `/airport-shuttle/page.tsx`
- **Target CMS Slug**: `airport-shuttle`
- **Priority**: High (popular service)
- **Has**: Full metadata, Service schema, FAQ schema

### 2. `/wedding-transportation/page.tsx`
- **Target CMS Slug**: `wedding-transportation`
- **Priority**: High (popular service)
- **Has**: Full metadata, Service schema, FAQ schema

### 3. `/corporate-transportation/page.tsx`
- **Target CMS Slug**: `corporate-transportation`
- **Priority**: High (popular service)
- **Has**: Full metadata, Service schema

### 4. `/taxi-service/page.tsx`
- **Target CMS Slug**: `taxi-service`
- **Priority**: Medium
- **Has**: Basic metadata

### 5. `/bachelor-party-transportation/page.tsx`
- **Target CMS Slug**: `bachelor-party-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 6. `/prom-transportation/page.tsx`
- **Target CMS Slug**: `prom-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 7. `/wine-tour-shuttle/page.tsx`
- **Target CMS Slug**: `wine-tour-shuttle`
- **Priority**: Medium
- **Has**: Basic metadata

### 8. `/brewery-tour-transportation/page.tsx`
- **Target CMS Slug**: `brewery-tour-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 9. `/concert-transportation/page.tsx`
- **Target CMS Slug**: `concert-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 10. `/golf-outing-transportation/page.tsx`
- **Target CMS Slug**: `golf-outing-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 11. `/charter-bus-service/page.tsx`
- **Target CMS Slug**: `charter-bus-service`
- **Priority**: Medium
- **Has**: Basic metadata

### 12. `/group-event-transportation/page.tsx`
- **Target CMS Slug**: `group-event-transportation`
- **Priority**: Medium
- **Has**: Basic metadata

### 13. `/lake-ozarks-tours/page.tsx`
- **Target CMS Slug**: `lake-ozarks-tours`
- **Priority**: Medium
- **Has**: Basic metadata

### 14. `/new-years-eve-transportation/page.tsx`
- **Target CMS Slug**: `new-years-eve-transportation`
- **Priority**: Seasonal (December high priority)
- **Has**: Basic metadata

## 📋 Migration Steps

### For Each Service Page:

1. **Open the hardcoded page file** (e.g., `/app/(site)/airport-shuttle/page.tsx`)
2. **Extract the following content**:
   - Page title (from `metadata.title`)
   - Meta description (from `metadata.description`)
   - Keywords (from `metadata.keywords`)
   - Hero section content
   - Main body content/sections
   - FAQ questions and answers (if present)
   - Any images/media used
   - Call-to-action text

3. **Add service in Payload CMS** at `/admin/collections/services`:
   - **Name**: Display name (e.g., "Airport Shuttle")
   - **Slug**: URL slug (e.g., "airport-shuttle")
   - **Description**: Full service description
   - **Short Description**: Brief summary for cards/previews
   - **Featured Image**: Hero image
   - **Content**: Use rich text editor to add full page content
   - **FAQ**: If your Services collection has FAQ fields, add them
   - **Active**: Set to `true`
   - **Order**: Set display order for navigation

4. **Test the CMS page**:
   - Visit `https://www.lakeridepros.com/services/[slug]`
   - Verify metadata, content, schemas are working
   - Check that it appears in Header navigation
   - Check that it appears in Footer links
   - Verify it's in sitemap

5. **Delete the hardcoded file** (optional - only after CMS version is live):
   - `rm app/(site)/[service-name]/page.tsx`
   - Remove the directory if now empty

## 🗄️ CMS Service Collection Fields Needed

Ensure your Payload CMS Services collection has these fields:

### Required Fields:
- `name` (text) - Display name
- `slug` (text, unique) - URL slug
- `description` (richText) - Full service description
- `shortDescription` (textarea) - Brief summary
- `active` (checkbox) - Whether service is active/published
- `order` (number) - Display order in navigation

### Recommended Fields:
- `featuredImage` (upload/relationship to media)
- `icon` (text or upload) - Icon for cards
- `price` (number) - Starting price (optional)
- `faqs` (array) - FAQ questions and answers
  - `question` (text)
  - `answer` (richText)
- `relatedServices` (relationship to Services) - For cross-linking
- `vehicles` (relationship to Vehicles) - Associated vehicles

### SEO Fields:
- `metaTitle` (text) - Custom SEO title (optional, defaults to name)
- `metaDescription` (textarea) - Custom meta description
- `keywords` (array of text) - Target keywords

## 🚀 Benefits of CMS-Based Services

1. **Easy Updates**: Edit service content directly in CMS without touching code
2. **Dynamic Navigation**: New services automatically appear in Header and Footer
3. **Automatic Sitemap**: New services automatically included in sitemap.xml
4. **Consistent Structure**: All services follow same template and structure
5. **Version Control**: CMS tracks changes and revisions
6. **No Deployments**: Content changes don't require code deployment

## 🔍 Verification Checklist

After migrating all services to CMS:

- [ ] All 14 services exist in CMS with `active: true`
- [ ] All services have proper slugs matching hardcoded URLs
- [ ] All services appear in Header Services dropdown
- [ ] All services appear in Footer Services section
- [ ] All services appear in sitemap.xml
- [ ] All service pages load at `/services/[slug]`
- [ ] All service pages have proper metadata (title, description, OG tags)
- [ ] All service pages have proper schemas (Service, LocalBusiness, FAQ)
- [ ] All hardcoded service page files removed (optional)

## 📝 Notes

- **Local Landing Pages**: The 3 local landing pages (`/transportation-osage-beach`, `/transportation-camdenton`, `/transportation-lake-ozark`) should remain as hardcoded pages since they serve a different purpose (local SEO targeting specific cities)
- **Core Service Pages**: Wedding, Airport, and Corporate pages are the most comprehensive and should be migrated first
- **Redirects**: Since the site isn't live yet, you don't need to set up 301 redirects. Just create CMS services with matching slugs
- **Legacy URLs**: Once all services are in CMS, users visiting `/airport-shuttle` will get a 404. You can either:
  1. Add 301 redirects in `next.config.mjs` (when going live)
  2. Keep hardcoded pages as fallback (not recommended long-term)
  3. Only use `/services/*` URLs going forward (recommended)

## 🎯 Recommended Migration Order

1. **Phase 1**: Top 3 services (highest traffic)
   - Airport Shuttle
   - Wedding Transportation
   - Corporate Transportation

2. **Phase 2**: Seasonal/event services
   - Bachelor Party Transportation
   - Prom Transportation
   - New Year's Eve Transportation
   - Concert Transportation

3. **Phase 3**: Tour services
   - Wine Tour Shuttle
   - Brewery Tour Transportation
   - Lake Ozarks Tours
   - Golf Outing Transportation

4. **Phase 4**: Utility services
   - Taxi Service
   - Charter Bus Service
   - Group Event Transportation

## 💡 Quick Start

To start using CMS services immediately:

1. Go to `/admin/collections/services`
2. Click "Create New"
3. Fill in all fields
4. Set `active: true`
5. Save
6. Visit `/services/[your-slug]` to see the page
7. Check Header/Footer to see it in navigation

The navigation is now fully dynamic and will update automatically as you add, edit, or remove services in the CMS!
