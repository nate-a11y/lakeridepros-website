import Image from 'next/image';
import { getMemberLogos, getMediaUrl } from '@/lib/api/sanity';

export default async function MemberLogosSection() {
  const logos = await getMemberLogos();

  // Don't render the section if there are no logos
  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="bg-lrp-gray py-14 text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-y border-black/25 py-8 lg:grid-cols-[14rem_1fr] lg:items-center">
          <h2 className="text-sm font-bold text-black/60">
            Proud members of
          </h2>
          <div className="flex flex-wrap items-center gap-10 lg:justify-end">
          {logos.map((logo) => {
            const imageUrl = getMediaUrl(logo.logo);
            if (!imageUrl) return null;

            return (
              <div
                key={logo._id}
                className="flex items-center justify-center"
              >
                <Image
                  src={imageUrl}
                  alt={logo.name}
                  width={240}
                  height={120}
                  className="h-20 w-auto object-contain md:h-24"
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
