import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Enhanced on-demand revalidation API route
 *
 * Usage:
 *   POST /api/revalidate?path=/services&secret=YOUR_SECRET
 *   POST /api/revalidate?tag=services&secret=YOUR_SECRET
 *   POST /api/revalidate (with JSON body for batch operations)
 *
 * Body format (optional):
 *   {
 *     "paths": ["/services", "/shop"],
 *     "tags": ["services", "products"],
 *     "collection": "services",
 *     "slug": "wedding-transportation"
 *   }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Check for secret to confirm this is a legitimate request
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify secret token
  if (secret !== process.env.REVALIDATION_SECRET) {
    console.error('[Revalidation] Invalid secret provided');
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  // Get parameters from query string
  const queryPath = request.nextUrl.searchParams.get('path');
  const queryTag = request.nextUrl.searchParams.get('tag');

  // Try to parse JSON body for batch operations
  let body: {
    paths?: string[];
    tags?: string[];
    collection?: string;
    slug?: string;
  } = {};

  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch {
    // Not JSON or empty body, that's fine
  }

  const pathsToRevalidate = new Set<string>();
  const tagsToRevalidate = new Set<string>();

  // Add paths from query string
  if (queryPath) {
    pathsToRevalidate.add(queryPath);
  }

  // Add tags from query string
  if (queryTag) {
    tagsToRevalidate.add(queryTag);
  }

  // Add paths from body
  if (body.paths) {
    body.paths.forEach(p => pathsToRevalidate.add(p));
  }

  // Add tags from body
  if (body.tags) {
    body.tags.forEach(t => tagsToRevalidate.add(t));
  }

  // Smart path detection based on collection and slug
  if (body.collection && body.slug) {
    const { paths, tags } = getRevalidationTargets(body.collection, body.slug);
    paths.forEach(p => pathsToRevalidate.add(p));
    tags.forEach(t => tagsToRevalidate.add(t));
  }

  // If nothing specified, return error
  if (pathsToRevalidate.size === 0 && tagsToRevalidate.size === 0) {
    return NextResponse.json(
      { message: 'Missing path, tag, or collection/slug parameters' },
      { status: 400 }
    );
  }

  try {
    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    // Revalidate all paths
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      revalidatedPaths.push(path);
      console.log(`[Revalidation] Revalidated path: ${path}`);

      // Auto-revalidate parent paths based on patterns
      const relatedPaths = getRelatedPaths(path);
      for (const relatedPath of relatedPaths) {
        if (!pathsToRevalidate.has(relatedPath)) {
          revalidatePath(relatedPath);
          revalidatedPaths.push(relatedPath);
          console.log(`[Revalidation] Revalidated related path: ${relatedPath}`);
        }
      }
    }

    // Revalidate all tags
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag, 'default');
      revalidatedTags.push(tag);
      console.log(`[Revalidation] Revalidated tag: ${tag}`);
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags,
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Revalidation] Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Error revalidating',
        error: String(err)
      },
      { status: 500 }
    );
  }
}

/**
 * Get revalidation targets based on collection type and slug
 */
function getRevalidationTargets(collection: string, slug: string): { paths: string[]; tags: string[] } {
  const paths: string[] = [];
  const tags: string[] = [];

  switch (collection) {
    case 'services':
      paths.push(`/services/${slug}`, '/services', '/');
      tags.push('services');
      break;

    case 'products':
      paths.push(`/shop/products/${slug}`, '/shop', '/');
      tags.push('products');
      break;

    case 'vehicles':
      paths.push(`/vehicles/${slug}`, '/vehicles', '/');
      tags.push('vehicles');
      break;

    case 'partners':
      paths.push('/trusted-referral-partners', '/');
      tags.push('partners');
      break;

    case 'blog-posts':
      paths.push(`/blog/${slug}`, '/blog', '/');
      tags.push('blog');
      break;

    case 'testimonials':
      // Testimonials appear on multiple pages
      paths.push('/', '/services', '/vehicles', '/trusted-referral-partners');
      tags.push('testimonials');
      break;

    default:
      paths.push('/');
  }

  return { paths, tags };
}

/**
 * Get related paths that should also be revalidated
 */
function getRelatedPaths(path: string): string[] {
  const related: string[] = [];

  // Specific service page -> revalidate services list
  if (path.startsWith('/services/') && path !== '/services') {
    related.push('/services');
  }

  // Specific product page -> revalidate shop
  if (path.startsWith('/shop/products/') || path.startsWith('/shop/')) {
    if (!path.endsWith('/shop')) {
      related.push('/shop');
    }
  }

  // Specific vehicle page -> revalidate vehicles list
  if (path.startsWith('/vehicles/') && path !== '/vehicles') {
    related.push('/vehicles');
  }

  // Specific blog post -> revalidate blog list
  if (path.startsWith('/blog/') && path !== '/blog') {
    related.push('/blog');
  }

  // Always revalidate homepage for major content changes
  if (['/services', '/shop', '/vehicles', '/trusted-referral-partners', '/blog'].includes(path)) {
    related.push('/');
  }

  // Revalidate sitemap when content changes
  if (path.startsWith('/services') || path.startsWith('/blog') || path.startsWith('/shop')) {
    related.push('/sitemap.xml');
  }

  return related;
}
