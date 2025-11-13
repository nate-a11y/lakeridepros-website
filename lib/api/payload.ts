import type {
  Service,
  Vehicle,
  BlogPost,
  Product,
  Testimonial,
  Partner,
  ApiResponse,
  PaginationParams,
  FilterParams,
} from '@/lib/types';

// Use production URL if available, otherwise use localhost for development
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
                        process.env.NEXT_PUBLIC_SERVER_URL ||
                        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
const API_KEY = process.env.PAYLOAD_API_KEY;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
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
  const url = `${PAYLOAD_API_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

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
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Payload CMS (${endpoint}):`, error);
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
  return fetchFromPayload<ApiResponse<Service>>('/services', { params: baseParams as any });
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

  console.log('🔍 getServiceBySlug called with:', { slug });
  console.log('📦 getServiceBySlug API response:', {
    totalDocs: services.length,
    services: services.map(s => ({ id: s.id, title: s.title, slug: s.slug })),
    matchingService: matchingService ? { id: matchingService.id, title: matchingService.title, slug: matchingService.slug } : null
  });

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
  return fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', { params: baseParams as any });
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

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: { where: JSON.stringify({ slug: { equals: slug } }), depth: 2 },
  });

  // WORKAROUND: Payload API is not respecting the where clause for Vehicles collection
  // Filter manually in application code until the API issue is resolved
  const vehicles = response.docs || [];
  const matchingVehicle = vehicles.find(vehicle => vehicle.slug === slug);

  console.log('🔍 getVehicleBySlug called with:', { slug });
  console.log('📦 getVehicleBySlug API response:', {
    totalDocs: vehicles.length,
    vehicles: vehicles.map(v => ({ id: v.id, title: v.title, slug: v.slug })),
    matchingVehicle: matchingVehicle ? { id: matchingVehicle.id, title: matchingVehicle.title, slug: matchingVehicle.slug } : null
  });

  return matchingVehicle || null;
}

// Blog API
export async function getBlogPosts(params?: PaginationParams & FilterParams): Promise<ApiResponse<BlogPost>> {
  const baseParams = {
    where: JSON.stringify({ published: { equals: true } }),
    sort: '-publishedDate',
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', { params: baseParams as any });
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', {
    params: {
      where: JSON.stringify({ published: { equals: true } }),
      sort: '-publishedDate',
      limit,
      depth: 2,
    },
  });
  return response.docs || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetchFromPayload<ApiResponse<BlogPost>>('/blog-posts', {
    params: {
      where: JSON.stringify({
        slug: { equals: slug },
        published: { equals: true }
      }),
      depth: 2,
    },
  });

  // WORKAROUND: Payload API is not respecting the where clause for BlogPosts collection
  // Filter manually in application code until the API issue is resolved
  const posts = response.docs || [];
  const matchingPost = posts.find(post => post.slug === slug && post.published);

  console.log('🔍 getBlogPostBySlug called with:', { slug });
  console.log('📦 getBlogPostBySlug API response:', {
    totalDocs: posts.length,
    posts: posts.map(p => ({ id: p.id, title: p.title, slug: p.slug })),
    matchingPost: matchingPost ? { id: matchingPost.id, title: matchingPost.title, slug: matchingPost.slug } : null
  });

  return matchingPost || null;
}

// Products API
export async function getProducts(params?: PaginationParams & FilterParams): Promise<ApiResponse<Product>> {
  const baseParams = {
    where: JSON.stringify({ status: { equals: 'active' } }),
    depth: 2,
    ...params,
  };
  return fetchFromPayload<ApiResponse<Product>>('/products', { params: baseParams as any });
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

  console.log('🔍 getProductBySlug called with:', { slug });
  console.log('📦 getProductBySlug API response:', {
    totalDocs: products.length,
    products: products.map(p => ({ id: p.id, name: p.name, slug: p.slug })),
    matchingProduct: matchingProduct ? { id: matchingProduct.id, name: matchingProduct.name, slug: matchingProduct.slug } : null
  });

  return matchingProduct || null;
}

// Testimonials API
export async function getTestimonials(featured = false): Promise<Testimonial[]> {
  const params: Record<string, any> = { sort: 'order', depth: 2 };
  if (featured) {
    params.where = JSON.stringify({ featured: { equals: true } });
  }

  const response = await fetchFromPayload<ApiResponse<Testimonial>>('/testimonials', { params });
  return response.docs || [];
}

// Partners API
export async function getPartners(category?: string, featured = false): Promise<Partner[]> {
  try {
    const params: Record<string, any> = { sort: 'order', depth: 2 };
    const whereConditions: Record<string, any> = {};

    if (category) {
      whereConditions.category = { equals: category };
    }
    if (featured) {
      whereConditions.featured = { equals: true };
    }

    if (Object.keys(whereConditions).length > 0) {
      params.where = JSON.stringify(whereConditions);
    }

    console.log('🔍 getPartners called with:', { category, featured, whereConditions, params });

    const response = await fetchFromPayload<ApiResponse<Partner>>('/partners', { params });

    console.log('📦 getPartners API response (before filtering):', {
      count: response.docs?.length,
      partners: response.docs?.map(p => ({ id: p.id, name: p.name, category: p.category }))
    });

    let partners = response.docs || [];

    // WORKAROUND: Payload API is not respecting the where clause for Partners collection
    // Filter manually in application code until the API issue is resolved
    if (category) {
      partners = partners.filter(p => p.category === category);
      console.log(`🔧 Manually filtered by category "${category}":`, {
        count: partners.length,
        partners: partners.map(p => ({ id: p.id, name: p.name, category: p.category }))
      });
    }
    if (featured) {
      partners = partners.filter(p => p.featured === true);
      console.log(`🔧 Manually filtered by featured:`, {
        count: partners.length,
      });
    }

    return partners;
  } catch (error) {
    // Return empty array if Partners collection doesn't exist yet (during initial deployment)
    console.warn('Partners collection not found, returning empty array');
    return [];
  }
}

// Pages API
export async function getPageBySlug(slug: string): Promise<any | null> {
  const response = await fetchFromPayload<ApiResponse<any>>('/pages', {
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

  console.log('🔍 getPageBySlug called with:', { slug });
  console.log('📦 getPageBySlug API response:', {
    totalDocs: pages.length,
    pages: pages.map(p => ({ id: p.id, title: p.title, slug: p.slug })),
    matchingPage: matchingPage ? { id: matchingPage.id, title: matchingPage.title, slug: matchingPage.slug } : null
  });

  return matchingPage || null;
}

// Helper function to get media URL
export function getMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${PAYLOAD_API_URL}${url}`;
}
