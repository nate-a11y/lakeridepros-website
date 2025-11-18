/**
 * Cache Revalidation Utilities
 *
 * This module provides helpers for triggering Next.js cache revalidation
 * from Payload CMS hooks and other server-side code.
 */

interface RevalidationOptions {
  collection: string;
  slug: string;
  paths?: string[];
  tags?: string[];
}

interface RevalidationResponse {
  success: boolean;
  revalidated?: {
    paths: string[];
    tags: string[];
  };
  duration?: string;
  timestamp?: string;
  error?: string;
}

/**
 * Trigger cache revalidation for a specific collection and slug
 *
 * @param options - Revalidation options
 * @returns Promise<RevalidationResponse>
 *
 * @example
 * ```ts
 * await revalidateCache({
 *   collection: 'services',
 *   slug: 'wedding-transportation'
 * });
 * ```
 */
export async function revalidateCache(
  options: RevalidationOptions
): Promise<RevalidationResponse> {
  const { collection, slug, paths, tags } = options;

  // Only run in production or if explicitly enabled
  const shouldRevalidate =
    process.env.NODE_ENV === 'production' ||
    process.env.ENABLE_REVALIDATION === 'true';

  if (!shouldRevalidate) {
    console.log(
      `[Revalidation] Skipped (not in production): ${collection}/${slug}`
    );
    return { success: true, revalidated: { paths: [], tags: [] } };
  }

  // Check for required environment variables
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!serverUrl || !secret) {
    console.warn(
      '[Revalidation] Configuration missing:',
      `SERVER_URL=${serverUrl ? 'set' : 'MISSING'},`,
      `REVALIDATION_SECRET=${secret ? 'set' : 'MISSING'}`
    );
    return {
      success: false,
      error: 'Revalidation configuration missing',
    };
  }

  // Build the API URL
  const url = `${serverUrl}/api/revalidate?secret=${secret}`;

  // Build request body
  const body = {
    collection,
    slug,
    ...(paths && { paths }),
    ...(tags && { tags }),
  };

  try {
    console.log(`[Revalidation] Triggering for ${collection}/${slug}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Revalidation] Failed with status ${response.status}:`,
        errorText
      );
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const result: RevalidationResponse = await response.json();

    console.log(
      `[Revalidation] Success for ${collection}/${slug}:`,
      `Paths: ${result.revalidated?.paths.length || 0},`,
      `Tags: ${result.revalidated?.tags.length || 0},`,
      `Duration: ${result.duration}`
    );

    return result;
  } catch (error) {
    console.error(`[Revalidation] Error for ${collection}/${slug}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Revalidate specific paths
 *
 * @param paths - Array of paths to revalidate
 * @returns Promise<RevalidationResponse>
 *
 * @example
 * ```ts
 * await revalidatePaths(['/services', '/']);
 * ```
 */
export async function revalidatePaths(
  paths: string[]
): Promise<RevalidationResponse> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!serverUrl || !secret) {
    return {
      success: false,
      error: 'Revalidation configuration missing',
    };
  }

  const url = `${serverUrl}/api/revalidate?secret=${secret}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Revalidate specific tags
 *
 * @param tags - Array of cache tags to revalidate
 * @returns Promise<RevalidationResponse>
 *
 * @example
 * ```ts
 * await revalidateTags(['services', 'products']);
 * ```
 */
export async function revalidateTags(
  tags: string[]
): Promise<RevalidationResponse> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!serverUrl || !secret) {
    return {
      success: false,
      error: 'Revalidation configuration missing',
    };
  }

  const url = `${serverUrl}/api/revalidate?secret=${secret}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Create a Payload afterChange hook for automatic revalidation
 *
 * @param collectionName - The name of the collection (e.g., 'services')
 * @returns Payload afterChange hook function
 *
 * @example
 * ```ts
 * // In your collection config:
 * export const Services: CollectionConfig = {
 *   slug: 'services',
 *   hooks: {
 *     afterChange: [createRevalidationHook('services')]
 *   }
 * }
 * ```
 */
export function createRevalidationHook(collectionName: string) {
  return async ({ doc, operation, context }: {
    doc: { slug?: string; id: string }
    operation: 'create' | 'update' | 'delete'
    context?: { skipRevalidation?: boolean }
  }) => {
    // Skip revalidation if explicitly disabled (e.g., during bulk imports)
    if (context?.skipRevalidation) {
      console.log(
        `[Revalidation Hook] Skipped for ${collectionName} (bulk operation)`
      );
      return doc;
    }

    // Only revalidate on create and update, not delete
    if (operation === 'create' || operation === 'update') {
      // Extract slug from the document
      const slug = doc.slug || doc.id;

      if (slug) {
        // Trigger revalidation asynchronously (don't block the save operation)
        revalidateCache({
          collection: collectionName,
          slug,
        }).catch((error) => {
          // Log error but don't fail the operation
          console.error(
            `[Revalidation Hook] Failed for ${collectionName}/${slug}:`,
            error
          );
        });
      }
    }

    return doc;
  };
}

/**
 * Batch revalidate multiple items
 *
 * @param items - Array of items to revalidate
 * @returns Promise<RevalidationResponse[]>
 *
 * @example
 * ```ts
 * await batchRevalidate([
 *   { collection: 'services', slug: 'wedding-transportation' },
 *   { collection: 'services', slug: 'airport-shuttle' },
 * ]);
 * ```
 */
export async function batchRevalidate(
  items: Array<{ collection: string; slug: string }>
): Promise<RevalidationResponse[]> {
  const promises = items.map((item) => revalidateCache(item));
  return Promise.all(promises);
}
