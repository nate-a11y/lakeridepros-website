import PartnerDetail from '@/components/partners/PartnerDetail';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { getPartnerBySlugLocal, getMediaUrl } from '@/lib/api/sanity';
import { metaDescription as buildMetaDescription, metaTitle } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ slug: string }>;
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

function canonicalPartnerPath(slug: string): string {
  return `/local-premier-partners/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalPath = canonicalPartnerPath(slug);
  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    return {
      title: 'Premier Partner Not Found | Lake Ride Pros',
    };
  }

  const description = partner.blurb || partner.description || '';
  const partnerLogo = typeof partner.logo === 'object' ? partner.logo : null;
  const imageUrl = partnerLogo
    ? getMediaUrl(partnerLogo)
    : 'https://www.lakeridepros.com/og-image.jpg';

  const title = metaTitle(partner.name);

  const metaDescription = buildMetaDescription(
    description,
    `${partner.name} is a Lake Ride Pros local premier partner at Lake of the Ozarks.`
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

export default async function PremierPartnerDetailPage({ params }: Props) {
  const { slug } = await params;
  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    permanentRedirect('/local-premier-partners');
  }

  return <PartnerDetail partner={partner} backLink="/local-premier-partners" categoryLabel="Local Premier Partners" displayCategory="Local Premier Partner" blurb={partner.blurb} description={partner.description} />;
}
