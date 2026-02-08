import Image from 'next/image';
import { getMemberLogos, getMediaUrl } from '@/lib/api/sanity';

export default async function MemberLogosSection() {
  const logos = await getMemberLogos();

  // Don't render the section if there are no logos
  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
          Proud Members Of
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo) => {
            const imageUrl = getMediaUrl(logo.logo);
            if (!imageUrl) return null;

            return (
              <div
                key={logo._id}
                className="flex items-center justify-center p-6 bg-white dark:bg-dark-bg-primary rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={imageUrl}
                  alt={logo.name}
                  width={240}
                  height={120}
                  className="h-20 md:h-28 lg:h-32 w-auto object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
