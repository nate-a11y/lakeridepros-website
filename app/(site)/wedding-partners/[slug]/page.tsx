import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { getPartnerBySlugLocal, getMediaUrl } from '@/lib/api/payload-local';
import type { Media } from '@/src/payload-types';

// Wedding category labels mapping
const weddingCategoryLabels: Record<string, string> = {
  'venues-destinations': 'Venues & Destinations',
  'photography-videography': 'Photography & Videography',
  'catering-culinary': 'Catering/Culinary',
  'floral-decor': 'Floral & Decor',
  'planning-coordination': 'Planning & Coordination',
  'bridal-beauty-style': 'Bridal Beauty & Style',
  'transportation': 'Transportation',
  'hotels-lodging': 'Hotels & Lodging',
  'other-services': 'Other Services',
};

type Props = {
  params: Promise<{ slug: string }>;
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    return {
      title: 'Wedding Partner Not Found | Lake Ride Pros',
    };
  }

  // Use wedding-specific content if available
  const weddingBlurb = partner.weddingBlurb || partner.blurb;
  const weddingDescription = partner.weddingDescription || partner.description;
  const description = weddingBlurb || weddingDescription || '';

  const partnerLogo = typeof partner.logo === 'object' ? partner.logo : null;
  const imageUrl = partnerLogo?.url
    ? getMediaUrl(partnerLogo.url)
    : 'https://www.lakeridepros.com/og-image.jpg';

  const title = `${partner.name} | Lake Ride Pros Wedding Partner`;

  const metaDescription = description
    ? description.slice(0, 160)
    : `${partner.name} - Lake Ride Pros trusted wedding partner at Lake of the Ozarks`;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: `https://www.lakeridepros.com/wedding-partners/${slug}`,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: `https://www.lakeridepros.com/wedding-partners/${slug}`,
      siteName: 'Lake Ride Pros',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: partner.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function WeddingPartnerDetailPage({ params }: Props) {
  const { slug } = await params;
  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    notFound();
  }

  const logoObj = typeof partner.logo === 'object' ? partner.logo : null;
  const logoUrl = logoObj?.url ? getMediaUrl(logoObj.url) : null;

  // Use wedding-specific content if available
  const displayBlurb = partner.weddingBlurb || partner.blurb;
  const displayDescription = partner.weddingDescription || partner.description;

  // Get wedding category label
  const weddingCategoryLabel = partner.weddingCategory
    ? weddingCategoryLabels[partner.weddingCategory] || partner.weddingCategory
    : 'Wedding Partner';

  return (
    <div className="min-h-screen bg-lrp-white dark:bg-dark-bg-primary">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green dark:hover:text-lrp-green">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
                  <Link href="/wedding-partners" className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green dark:hover:text-lrp-green">
                    Wedding Partners
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
                  <span className="text-lrp-text-secondary dark:text-dark-text-secondary">{partner.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Partner Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              {logoUrl && (
                <div className="flex-shrink-0 w-full md:w-auto">
                  <div className="w-full h-72 md:w-72 md:h-72 bg-gray-50 dark:bg-dark-bg-primary border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center p-6">
                    <Image
                      src={logoUrl}
                      alt={partner.name}
                      width={270}
                      height={270}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Partner Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-lrp-black dark:text-white mb-2">
                  {partner.name}
                </h1>
                <p className="text-sm text-lrp-green font-medium mb-4">
                  {weddingCategoryLabel}
                </p>

                {/* Blurb - use wedding-specific if available */}
                {displayBlurb && (
                  <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
                    {displayBlurb}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      className="flex items-center gap-2 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{partner.phone}</span>
                    </a>
                  )}
                  {partner.email && (
                    <a
                      href={`mailto:${partner.email}`}
                      className="flex items-center gap-2 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>{partner.email}</span>
                    </a>
                  )}
                  {partner.address && (
                    <div className="flex items-start gap-2 text-lrp-text-secondary dark:text-dark-text-secondary">
                      <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>{partner.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section - use wedding-specific if available */}
          {displayDescription && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-lrp-black dark:text-white mb-4">About</h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap leading-relaxed">
                {displayDescription}
              </p>
            </div>
          )}

          {/* Images Gallery */}
          {partner.images && Array.isArray(partner.images) && partner.images.length > 0 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-lrp-black dark:text-white mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partner.images.map((imageItem, index: number) => {
                  const imageObj = typeof imageItem.image === 'object' ? imageItem.image as Media : null;
                  const imageUrl = imageObj?.url ? getMediaUrl(imageObj.url) : null;

                  if (!imageUrl) return null;

                  return (
                    <div key={imageItem.id || index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <Image
                        src={imageUrl}
                        alt={`${partner.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/wedding-partners"
            className="inline-flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark font-medium"
          >
            <span>←</span>
            <span>Back to Wedding Partners</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
