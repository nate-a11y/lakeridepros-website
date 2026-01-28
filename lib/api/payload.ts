import type {
  Service,
  Vehicle,
  BlogPost,
  Product,
  Testimonial,
  Partner,
} from '@/src/payload-types';

// Generic API response type
interface ApiResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface PaginationParams {
  limit?: number;
  page?: number;
}

interface FilterParams {
  where?: string;
  sort?: string;
  depth?: number;
}

// Use production URL if available, otherwise use localhost for development
// In Vercel, VERCEL_URL is automatically available
function getPayloadApiUrl(): string {
  // Explicit configuration takes precedence
  if (process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
    return process.env.NEXT_PUBLIC_PAYLOAD_API_URL;
  }
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  // Client-side: use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side: use Vercel URL if available, otherwise localhost
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

const API_KEY = process.env.PAYLOAD_API_KEY;

interface FetchOptions extends RequestInit {
  params?: Record<string, unknown>;
}

async function fetchFromPayload<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build query string
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const apiUrl = getPayloadApiUrl();
  const url = `${apiUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(API_KEY && { Authorization: `API-Key ${API_KEY}` }),
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error(`[Payload API] Request failed with status ${response.status}: ${response.statusText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[Payload API] Error fetching from ${url}:`, error);
    throw error;
  }
}

// Services API
export async function getServices(params?: PaginationParams & FilterParams): Promise<ApiResponse<Service>> {
  const baseParams = {
    where: JSON.stringify({ active: { equals: true } }),
    sort: 'order',
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Service>>('/services', { params: baseParams });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await fetchFromPayload<ApiResponse<Service>>('/services', {
    params: {
      where: JSON.stringify({ slug: { equals: slug }, active: { equals: true } }),
      depth: 2,
    },
  });

  // WORKAROUND: Payload API is not respecting the where clause for Services collection
  // Filter manually in application code until the API issue is resolved
  const services = response.docs || [];
  const matchingService = services.find(service => service.slug === slug && service.active);

  return matchingService || null;
}

// Vehicles API
export async function getVehicles(params?: PaginationParams & FilterParams): Promise<ApiResponse<Vehicle>> {
  const baseParams = {
    where: JSON.stringify({ available: { equals: true } }),
    sort: 'order',
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', { params: baseParams as Record<string, unknown> });
}

export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: {
      where: JSON.stringify({ featured: { equals: true }, available: { equals: true } }),
      limit,
      sort: 'order',
      depth: 2,
    },
  });
  return response.docs || [];
}

export async function getRandomVehicles(limit = 3): Promise<Vehicle[]> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: {
      where: JSON.stringify({ available: { equals: true } }),
      depth: 2,
    },
  });
  const vehicles = response.docs || [];
  // Shuffle all vehicles and return the requested limit
  const shuffled = vehicles.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: { where: JSON.stringify({ slug: { equals: slug } }), depth: 2 },
  });

  // WORKAROUND: Payload API is not respecting the where clause for Vehicles collection
  // Filter manually in application code until the API issue is resolved
  const vehicles = response.docs || [];
  const matchingVehicle = vehicles.find(vehicle => vehicle.slug === slug);

  return matchingVehicle || null;
}

// Blog API
export async function getBlogPosts(params?: PaginationParams & FilterParams): Promise<ApiResponse<BlogPost>> {
  const now = new Date();
  const baseParams = {
    where: JSON.stringify({
      and: [
        { published: { equals: true } },
        { publishedDate: { less_than_equal: now.toISOString() } },
      ],
    }),
    sort: '-publishedDate',
    depth: 2,
    ...params,
  };
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', { params: baseParams as Record<string, unknown> });

  // WORKAROUND: Payload API may not respect where clause - filter manually
  const filteredDocs = (response.docs || []).filter(post =>
    post.published &&
    (!post.publishedDate || new Date(post.publishedDate) <= now)
  );

  return { ...response, docs: filteredDocs };
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const now = new Date();
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', {
    params: {
      where: JSON.stringify({
        and: [
          { published: { equals: true } },
          { publishedDate: { less_than_equal: now.toISOString() } },
        ],
      }),
      sort: '-publishedDate',
      limit: 100, // Fetch more to filter manually
      depth: 2,
    },
  });

  // WORKAROUND: Payload API may not respect where clause - filter manually
  const filteredDocs = (response.docs || []).filter(post =>
    post.published &&
    (!post.publishedDate || new Date(post.publishedDate) <= now)
  );

  return filteredDocs.slice(0, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const now = new Date().toISOString();
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', {
    params: {
      where: JSON.stringify({
        and: [
          { slug: { equals: slug } },
          { published: { equals: true } },
          { publishedDate: { less_than_equal: now } },
        ],
      }),
      depth: 2,
      limit: 100, // Ensure we get the response even if there are many posts
    },
  });

  // WORKAROUND: Payload API is not respecting the where clause for BlogPosts collection
  // Filter manually in application code until the API issue is resolved
  const posts = response.docs || [];
  const matchingPost = posts.find(post =>
    post.slug === slug &&
    post.published &&
    (!post.publishedDate || new Date(post.publishedDate) <= new Date())
  );

  return matchingPost || null;
}

export async function getAdjacentBlogPosts(currentSlug: string): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> {
  const now = new Date();
  // Get all published posts sorted by date (only past/current dates)
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', {
    params: {
      where: JSON.stringify({
        and: [
          { published: { equals: true } },
          { publishedDate: { less_than_equal: now.toISOString() } },
        ],
      }),
      sort: '-publishedDate',
      depth: 2,
      limit: 1000,
    },
  });

  // WORKAROUND: Payload API may not respect where clause - filter manually
  const posts = (response.docs || []).filter(post =>
    post.published &&
    (!post.publishedDate || new Date(post.publishedDate) <= now)
  );
  const currentIndex = posts.findIndex(post => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  };
}

// Products API
export async function getProducts(params?: PaginationParams & FilterParams): Promise<ApiResponse<Product>> {
  const baseParams = {
    where: JSON.stringify({ status: { equals: 'active' } }),
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Product>>('/products', { params: baseParams as Record<string, unknown> });
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const response = await fetchFromPayload<ApiResponse<Product>>('/products', {
    params: {
      where: JSON.stringify({
        featured: { equals: true },
        status: { equals: 'active' }
      }),
      limit,
      depth: 2,
    },
  });
  return response.docs || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchFromPayload<ApiResponse<Product>>('/products', {
    params: {
      where: JSON.stringify({
        slug: { equals: slug },
        status: { equals: 'active' }
      }),
      depth: 2,
    },
  });

  // WORKAROUND: Payload API is not respecting the where clause for Products collection
  // Filter manually in application code until the API issue is resolved
  const products = response.docs || [];
  const matchingProduct = products.find(product => product.slug === slug && product.status === 'active');

  return matchingProduct || null;
}

// Testimonials API
export async function getTestimonials(featured = false, minRating?: number): Promise<Testimonial[]> {
  const params: Record<string, unknown> = {
    sort: 'order',
    depth: 2,
    limit: 100 // Fetch enough to get past placeholder reviews (IDs 177-237)
  };

  // Build where conditions
  const whereConditions: Record<string, unknown> = {};

  if (featured) {
    whereConditions.featured = { equals: true };
  }

  // Only show 5-star reviews on the website (keeps all in CMS for admin viewing)
  if (minRating !== undefined) {
    whereConditions.rating = { greater_than_equal: minRating };
  }

  if (Object.keys(whereConditions).length > 0) {
    params.where = JSON.stringify(whereConditions);
  }

  const response = await fetchFromPayload<ApiResponse<Testimonial>>('/testimonials', { params });

  // Filter out testimonials with placeholder content
  const placeholderTexts = ['No comment provided', 'No content provided', ''];
  const validTestimonials = (response.docs || []).filter(testimonial => {
    const content = testimonial.content?.trim() || '';
    return content.length > 0 && !placeholderTexts.includes(content);
  });

  return validTestimonials;
}

/**
 * Get random testimonials for variety across pages
 * @param count - Number of testimonials to return
 * @param featured - Only return featured testimonials
 * @param minRating - Minimum rating to include (default: 5 for public display)
 */
export async function getRandomTestimonials(count = 3, featured = false, minRating = 5): Promise<Testimonial[]> {
  const allTestimonials = await getTestimonials(featured, minRating);

  if (allTestimonials.length <= count) {
    return allTestimonials;
  }

  // Fisher-Yates shuffle algorithm for randomization
  const shuffled = [...allTestimonials];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * Get vehicle-related testimonials filtered by keywords
 * @param count - Number of testimonials to return
 * @param minRating - Minimum rating to include (default: 5 for public display)
 */
export async function getVehicleRelatedTestimonials(count = 3, minRating = 5): Promise<Testimonial[]> {
  const allTestimonials = await getTestimonials(false, minRating);

  // Keywords that indicate a vehicle-related review
  const vehicleKeywords = [
    'vehicle', 'car', 'suv', 'suburban', 'van', 'bus', 'limo', 'sprinter', 'shuttle',
    'ride', 'driver', 'driving', 'drove', 'driven',
    'clean', 'comfortable', 'spacious', 'luxury', 'luxurious',
    'seats', 'seating', 'capacity', 'room', 'roomy',
    'air conditioning', 'ac', 'amenities', 'amenity',
    'pickup', 'drop off', 'transport', 'transportation',
    'professional driver', 'chauffeur',
  ];

  // Filter testimonials that mention vehicle-related keywords
  const vehicleTestimonials = allTestimonials.filter(testimonial => {
    const content = testimonial.content.toLowerCase();
    const name = testimonial.name.toLowerCase();
    const title = testimonial.title?.toLowerCase() || '';
    const searchText = `${content} ${name} ${title}`;

    return vehicleKeywords.some(keyword => searchText.includes(keyword));
  });

  // If we don't have enough vehicle-specific reviews, fall back to all testimonials
  const testimonialsToUse = vehicleTestimonials.length >= count ? vehicleTestimonials : allTestimonials;

  if (testimonialsToUse.length <= count) {
    return testimonialsToUse;
  }

  // Fisher-Yates shuffle algorithm for randomization
  const shuffled = [...testimonialsToUse];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

// Partner type for filtering
export type PartnerType = 'premier' | 'referral' | 'wedding' | 'promotion';

// Partners API - Now uses checkbox fields instead of single category
export async function getPartners(category?: string, featured = false): Promise<Partner[]> {
  try {
    const params: Record<string, unknown> = {
      sort: 'order',
      depth: 2,
      limit: 1000, // Set high limit to fetch all partners
    };
    const whereConditions: Record<string, unknown> = {
      active: { equals: true }, // Always filter by active status
    };

    if (featured) {
      whereConditions.featured = { equals: true };
    }

    params.where = JSON.stringify(whereConditions);

    const response = await fetchFromPayload<ApiResponse<Partner>>('/partners', { params });

    let partners = response.docs || [];

    // Always filter by active
    partners = partners.filter(p => p.active === true);

    // Filter by partner type using new checkbox fields
    // Legacy category field is only used if NO checkboxes have been set (old records)
    if (category) {
      partners = partners.filter(p => {
        // Check if any checkbox has been explicitly set (new system)
        const hasCheckboxSet = p.isPremierPartner === true || p.isReferralPartner === true ||
                               p.isWeddingPartner === true || p.isPromotion === true;

        if (category === 'local-premier') {
          // If checkboxes are in use, only check checkbox. Otherwise fall back to legacy.
          return hasCheckboxSet ? p.isPremierPartner === true : p.category === 'local-premier';
        }
        if (category === 'trusted-referral') {
          // Referral partners include: those with isReferralPartner checked OR Premier Partners (they get dual exposure)
          if (hasCheckboxSet) {
            return p.isReferralPartner === true || p.isPremierPartner === true;
          }
          return p.category === 'trusted-referral' || p.category === 'local-premier';
        }
        if (category === 'wedding') {
          return hasCheckboxSet ? p.isWeddingPartner === true : p.category === 'wedding';
        }
        if (category === 'promotions') {
          return hasCheckboxSet ? p.isPromotion === true : p.category === 'promotions';
        }
        // Fallback to legacy category
        return p.category === category;
      });
    }

    if (featured) {
      partners = partners.filter(p => p.featured === true);
    }

    return partners;
  } catch (_error) {
    // Return empty array if Partners collection doesn't exist yet (during initial deployment)
    console.warn('Partners collection not found, returning empty array');
    return [];
  }
}

// Get partners by specific type using new checkbox fields
export async function getPartnersByType(type: PartnerType, featured = false): Promise<Partner[]> {
  try {
    const params: Record<string, unknown> = {
      sort: 'order',
      depth: 2,
      limit: 1000,
    };
    const whereConditions: Record<string, unknown> = {
      active: { equals: true },
    };

    if (featured) {
      whereConditions.featured = { equals: true };
    }

    params.where = JSON.stringify(whereConditions);

    const response = await fetchFromPayload<ApiResponse<Partner>>('/partners', { params });

    let partners = response.docs || [];

    // Always filter by active
    partners = partners.filter(p => p.active === true);

    // Filter by partner type using new checkbox fields
    // Legacy category field is only used if NO checkboxes have been set (old records)
    partners = partners.filter(p => {
      const hasCheckboxSet = p.isPremierPartner === true || p.isReferralPartner === true ||
                             p.isWeddingPartner === true || p.isPromotion === true;

      switch (type) {
        case 'premier':
          return hasCheckboxSet ? p.isPremierPartner === true : p.category === 'local-premier';
        case 'referral':
          if (hasCheckboxSet) {
            return p.isReferralPartner === true || p.isPremierPartner === true;
          }
          return p.category === 'trusted-referral' || p.category === 'local-premier';
        case 'wedding':
          return hasCheckboxSet ? p.isWeddingPartner === true : p.category === 'wedding';
        case 'promotion':
          return hasCheckboxSet ? p.isPromotion === true : p.category === 'promotions';
        default:
          return false;
      }
    });

    if (featured) {
      partners = partners.filter(p => p.featured === true);
    }

    return partners;
  } catch (_error) {
    console.warn('Partners collection not found, returning empty array');
    return [];
  }
}

// Pages API
export async function getPageBySlug(slug: string): Promise<Record<string, unknown> | null> {
  const response = await fetchFromPayload<ApiResponse<Record<string, unknown>>>('/pages', {
    params: {
      where: JSON.stringify({
        slug: { equals: slug },
        published: { equals: true }
      })
    },
  });

  // WORKAROUND: Payload API is not respecting the where clause for Pages collection
  // Filter manually in application code until the API issue is resolved
  const pages = response.docs || [];
  const matchingPage = pages.find(page => page.slug === slug && page.published);

  return matchingPage || null;
}

// Helper function to get media URL
export function getMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;

  // For relative URLs, use the site URL from environment
  // Falls back to production URL only if no env vars are set
  const mediaBaseUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
                       process.env.NEXT_PUBLIC_SERVER_URL ||
                       process.env.NEXT_PUBLIC_SITE_URL ||
                       'https://www.lakeridepros.com';

  return `${mediaBaseUrl}${url}`;
}

// Venue type for the events calendar
export interface Venue {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  description?: string;
  image?: { url: string; alt?: string } | string;
  address?: string;
  website?: string;
  phone?: string;
  active: boolean;
  order: number;
}

// Event type for the events calendar
export interface Event {
  id: string;
  name: string;
  slug: string;
  venue: Venue | string;
  date: string;
  time?: string;
  description?: string;
  image?: { url: string; alt?: string } | string;
  rideAvailability?: {
    rideType: 'flex' | 'elite' | 'lrp-black' | 'limo-bus' | 'rescue-squad' | 'luxury-sprinter' | 'luxury-shuttle';
    status: 'available' | 'limited' | 'reserved';
    notes?: string;
  }[];
  featured: boolean;
  active: boolean;
  order: number;
}

// Venues API
export async function getVenues(params?: PaginationParams & FilterParams): Promise<ApiResponse<Venue>> {
  const baseParams = {
    where: JSON.stringify({ active: { equals: true } }),
    sort: 'order',
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Venue>>('/venues', { params: baseParams as Record<string, unknown> });
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  const response = await fetchFromPayload<ApiResponse<Venue>>('/venues', {
    params: {
      where: JSON.stringify({ slug: { equals: slug }, active: { equals: true } }),
      depth: 2,
    },
  });

  const venues = response.docs || [];
  const matchingVenue = venues.find(venue => venue.slug === slug && venue.active);

  return matchingVenue || null;
}

// Events API
export async function getEvents(params?: PaginationParams & FilterParams): Promise<ApiResponse<Event>> {
  const baseParams = {
    where: JSON.stringify({ active: { equals: true } }),
    sort: 'date',
    depth: 2,
    limit: 100,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Event>>('/events', { params: baseParams as Record<string, unknown> });
}

export async function getUpcomingEvents(limit = 50): Promise<Event[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const response = await fetchFromPayload<ApiResponse<Event>>('/events', {
    params: {
      where: JSON.stringify({
        and: [
          { active: { equals: true } },
          { date: { greater_than_equal: today.toISOString() } },
        ],
      }),
      sort: 'date',
      depth: 2,
      limit,
    },
    cache: 'no-store', // Disable caching for real-time event updates
  });

  // Filter manually as backup
  const events = (response.docs || []).filter(event => {
    const eventDate = new Date(event.date);
    return event.active && eventDate >= today;
  });

  return events;
}

export async function getEventsByVenue(venueId: string): Promise<Event[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const response = await fetchFromPayload<ApiResponse<Event>>('/events', {
    params: {
      where: JSON.stringify({
        and: [
          { active: { equals: true } },
          { venue: { equals: venueId } },
          { date: { greater_than_equal: today.toISOString() } },
        ],
      }),
      sort: 'date',
      depth: 2,
    },
  });

  return response.docs || [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const response = await fetchFromPayload<ApiResponse<Event>>('/events', {
    params: {
      where: JSON.stringify({ slug: { equals: slug }, active: { equals: true } }),
      depth: 2,
    },
  });

  const events = response.docs || [];
  const matchingEvent = events.find(event => event.slug === slug && event.active);

  return matchingEvent || null;
}
