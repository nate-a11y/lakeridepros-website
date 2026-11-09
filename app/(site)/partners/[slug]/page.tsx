import { getPartnerPath } from '@/lib/seo/partner-path'
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    return {
      title: 'Partner Not Found | Lake Ride Pros',
    };
  }

  // Determine canonical URL based on partner type
  const canonicalPath = getPartnerPath(partner, slug);

  const description = partner.blurb || partner.description || '';
  const partnerLogo = typeof partner.logo === 'object' ? partner.logo : null;
  const imageUrl = partnerLogo
    ? getMediaUrl(partnerLogo)
    : 'https://www.lakeridepros.com/og-image.jpg';

  const title = metaTitle(partner.name);

  const metaDescription = buildMetaDescription(
    description,
    `${partner.name} is a Lake Ride Pros trusted partner at Lake of the Ozarks.`
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

export default async function PartnerDetailPage({ params }: Props) {
  const { slug } = await params;

  // This legacy record contains internal driver promo-code instructions, not
  // customer-facing partner content.
  if (slug === 'lrp-promotions') {
    permanentRedirect('/trusted-referral-partners');
  }

  const partner = await getPartnerBySlugLocal(slug);

  if (!partner) {
    permanentRedirect('/trusted-referral-partners');
  }

  // Redirect to dedicated pages for wedding and premier partners
  const canonicalPath = getPartnerPath(partner, slug);
  if (canonicalPath !== `/partners/${encodeURIComponent(slug)}`) {
    permanentRedirect(canonicalPath);
  }

  // After redirects, this page only serves referral partners and promotions
  const categoryLabel = partner.isPromotion ? 'Promotions' : 'Trusted Referral Partners';
  const backLink = partner.isPromotion ? '/promotions' : '/trusted-referral-partners';

  return <PartnerDetail partner={partner} backLink={backLink} categoryLabel={categoryLabel} blurb={partner.blurb} description={partner.description} />;
}
