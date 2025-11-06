import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/types';
import { getMediaUrl } from '@/lib/api/payload';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const imageUrl = service.image ? getMediaUrl(service.image.url) : '/placeholder-service.jpg';

  return (
    <Link
      href={`/services#${service.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={service.image?.alt || service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {service.title}
        </h3>
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
