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

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001';
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
  return fetchFromPayload<ApiResponse<Service>>('/services', { params: params as any });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await fetchFromPayload<ApiResponse<Service>>('/services', {
    params: { where: JSON.stringify({ slug: { equals: slug } }) },
  });
  return response.docs?.[0] || null;
}

// Vehicles API
export async function getVehicles(params?: PaginationParams & FilterParams): Promise<ApiResponse<Vehicle>> {
  return fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', { params: params as any });
}

export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: {
      where: JSON.stringify({ featured: { equals: true } }),
      limit,
      sort: 'order',
    },
  });
  return response.docs || [];
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const response = await fetchFromPayload<ApiResponse<Vehicle>>('/vehicles', {
    params: { where: JSON.stringify({ slug: { equals: slug } }) },
  });
  return response.docs?.[0] || null;
}

// Blog API
export async function getBlogPosts(params?: PaginationParams & FilterParams): Promise<ApiResponse<BlogPost>> {
  const baseParams = {
    where: JSON.stringify({ published: { equals: true } }),
    sort: '-publishedDate',
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
      })
    },
  });
  return response.docs?.[0] || null;
}

// Products API
export async function getProducts(params?: PaginationParams & FilterParams): Promise<ApiResponse<Product>> {
  const baseParams = {
    where: JSON.stringify({ status: { equals: 'active' } }),
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
      })
    },
  });
  return response.docs?.[0] || null;
}

// Testimonials API
export async function getTestimonials(featured = false): Promise<Testimonial[]> {
  const params: Record<string, any> = { sort: 'order' };
  if (featured) {
    params.where = JSON.stringify({ featured: { equals: true } });
  }

  const response = await fetchFromPayload<ApiResponse<Testimonial>>('/testimonials', { params });
  return response.docs || [];
}

// Partners API
export async function getPartners(featured = false): Promise<Partner[]> {
  const params: Record<string, any> = { sort: 'order' };
  if (featured) {
    params.where = JSON.stringify({ featured: { equals: true } });
  }

  const response = await fetchFromPayload<ApiResponse<Partner>>('/partners', { params });
  return response.docs || [];
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
  return response.docs?.[0] || null;
}

// Helper function to get media URL
export function getMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${PAYLOAD_API_URL}${url}`;
}
