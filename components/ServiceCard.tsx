import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';
import { DynamicIcon } from '@/lib/iconMapper';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const imageUrl = service.image && typeof service.image === 'object' ? getMediaUrl(service.image.url) : '/placeholder-service.jpg';

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={(service.image && typeof service.image === 'object' ? service.image.alt : null) || service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start gap-3 mb-2">
          {service.icon && (
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light">
              <DynamicIcon name={service.icon} size={20} />
            </div>
          )}
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {service.title}
          </h3>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-3">
          {service.shortDescription || service.description}
        </p>
        {service.pricing && service.pricing.basePrice && (
          <p className="mt-4 text-secondary dark:text-primary font-semibold">
            Starting at ${service.pricing.basePrice}
          </p>
        )}
      </div>
    </Link>
  );
}
