import PartnerDetail from '@/components/partners/PartnerDetail';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { getPartnerBySlugLocal, getMediaUrl } from '@/lib/api/sanity';
import { metaDescription as buildMetaDescription, metaTitle } from '@/lib/seo/metadata';

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
  'travel-agents': 'Travel Agents',
  'djs-live-bands': 'DJs / Live Bands',
  'bartenders-mobile-bar-services': 'Bartenders / Mobile Bar Services',
  'other-services': 'Other Services',
};

type Props = {
  params: Promise<{ slug: string }>;
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

function canonicalPartnerPath(slug: string): string {
  return `/wedding-partners/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalPath = canonicalPartnerPath(slug);
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
  const imageUrl = partnerLogo
    ? getMediaUrl(partnerLogo)
    : 'https://www.lakeridepros.com/og-image.jpg';

  const title = metaTitle(partner.name);

  const metaDescription = buildMetaDescription(
    description,
    `${partner.name} is a Lake Ride Pros trusted wedding partner at Lake of the Ozarks.`
  );

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: `https://www.lakeridepros.com${canonicalPath}`,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: `https://www.lakeridepros.com${canonicalPath}`,
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
    permanentRedirect('/wedding-partners');
  }

  // Use wedding-specific content if available
  const displayBlurb = partner.weddingBlurb || partner.blurb;
  const displayDescription = partner.weddingDescription || partner.description;
  const weddingCategoryLabel = partner.weddingCategory
    ? weddingCategoryLabels[partner.weddingCategory] || partner.weddingCategory
    : 'Wedding Partner';

  return <PartnerDetail partner={partner} backLink="/wedding-partners" categoryLabel="Wedding Partners" displayCategory={weddingCategoryLabel} blurb={displayBlurb} description={displayDescription} />;
}
