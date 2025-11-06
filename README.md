# Lake Ride Pros - Luxury Transportation Website

A modern, SEO-optimized Next.js 14+ website for Lake Ride Pros, a luxury transportation company serving Lake of the Ozarks, Missouri.

## Features

- ✨ **Modern Stack**: Built with Next.js 14+, TypeScript, and Tailwind CSS
- 🎨 **Custom Design**: Luxury brand aesthetic with deep blue and gold accent colors
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🚀 **Performance**: Optimized images, React Server Components, and fast loading
- 🔍 **SEO Optimized**: Complete metadata, OpenGraph tags, and sitemap
- 🛒 **E-commerce**: Shopping cart with React Context for merchandise
- 📝 **Content Management**: Integrates with Payload CMS for dynamic content
- 💳 **Gift Cards**: Purchase and balance checking functionality
- 📧 **Forms**: Contact, newsletter signup, and booking widgets

## Pages

- **Home** (`/`) - Hero, services, vehicles, blog posts, testimonials, partners
- **Services** (`/services`) - All transportation services
- **Fleet** (`/fleet`) - Vehicle showcase with details
- **Blog** (`/blog`) - Blog posts with pagination
- **Shop** (`/shop`) - Product catalog with cart
- **Gift Cards** (`/gift-cards`) - Purchase gift cards
- **Gift Card Balance** (`/gift-card-balance`) - Check balance
- **Contact** (`/contact`) - Contact form and info

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context (Cart)
- **CMS Integration**: Payload CMS API
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Payload CMS instance running (default: http://localhost:3001)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local` with your actual values

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes
│   ├── blog/             # Blog pages
│   ├── contact/          # Contact page
│   ├── fleet/            # Fleet pages
│   ├── gift-cards/       # Gift card pages
│   ├── services/         # Services page
│   ├── shop/             # Shop pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── contexts/             # React contexts
├── lib/                  # Utilities and helpers
│   ├── api/             # API integration
│   ├── types/           # TypeScript types
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## Color Palette

- **Primary**: Deep Blue (#1e3a8a)
- **Secondary**: Gold (#f59e0b)
- **Neutrals**: Grays for text and backgrounds

## Environment Variables

See `.env.example` for all required environment variables.

## API Integration

The site integrates with Payload CMS for dynamic content. API functions are located in `lib/api/payload.ts`.

## Deployment

Deploy to Vercel (recommended), Netlify, or any Node.js hosting platform.

For Vercel deployment:
```bash
npm i -g vercel
vercel
```

Make sure to add environment variables in your hosting platform settings.

## License

Proprietary - Lake Ride Pros
