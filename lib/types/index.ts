// Media/Image Types
export interface Media {
  id: string;
  alt?: string;
  url: string;
  filename: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: Media;
  features?: string[];
  pricing?: {
    basePrice?: number;
    pricingType: 'hourly' | 'fixed' | 'custom';
    notes?: string;
  };
  active: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  type: 'sedan' | 'suv' | 'van' | 'limousine' | 'bus' | 'boat' | 'other';
  description: string;
  capacity: number;
  images?: Array<{
    image: Media;
    alt?: string;
  }>;
  featuredImage?: Media;
  amenities?: Array<{
    amenity: string;
  }>;
  specifications?: {
    make?: string;
    model?: string;
    year?: number;
    color?: string;
  };
  pricing?: {
    hourlyRate?: number;
    dailyRate?: number;
    notes?: string;
  };
  available: boolean;
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any; // Rich text content
  author?: Author | string; // Can be Author object or email string
  categories?: Array<Category | string>; // Can be Category objects or ID strings
  tags?: string[];
  featuredImage?: Media;
  publishedDate?: string;
  status: 'draft' | 'published';
  published?: boolean; // Checkbox for published state
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: Media;
  email?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  images?: Media[];
  featuredImage?: Media;
  categories?: ProductCategory[];
  tags?: string[];
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  options?: ProductOption[];
  variants?: ProductVariant[];
  status: 'draft' | 'active';
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: Media;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
  options: Record<string, string>;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

// Gift Card Types
export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  purchaserEmail: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  status: 'active' | 'redeemed' | 'expired';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardBalance {
  code: string;
  balance: number;
  status: string;
  expiresAt?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  title?: string;
  company?: string;
  content: string;
  rating?: number;
  image?: Media;
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Partner Types
export interface Partner {
  id: string;
  name: string;
  category: 'wedding' | 'local-premier' | 'trusted-referral';
  subcategory?: string;
  logo: Media;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  featured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// SEO Types
export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: Media;
  noIndex?: boolean;
}

// Form Submission Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
  lastName?: string;
}

// API Response Types
export interface ApiResponse<T> {
  docs?: T[];
  doc?: T;
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

// Filter Types
export interface FilterParams {
  category?: string;
  tag?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}
