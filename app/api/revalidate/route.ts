import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation API route
 * Usage: POST /api/revalidate?path=/services&secret=YOUR_SECRET
 */
export async function POST(request: NextRequest) {
  // Check for secret to confirm this is a legitimate request
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');

  // Verify secret token
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  if (!path) {
    return NextResponse.json(
      { message: 'Missing path parameter' },
      { status: 400 }
    );
  }

  try {
    // Revalidate the specified path
    revalidatePath(path);

    // Also revalidate the main services page if revalidating a specific service
    if (path.startsWith('/services/')) {
      revalidatePath('/services');
    }

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now()
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
