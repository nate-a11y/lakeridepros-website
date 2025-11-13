import { getServices } from '@/lib/api/payload';
import HeaderClient from './HeaderClient';

export default async function Header() {
  // Fetch services dynamically from CMS
  let services: Array<{ name: string; slug: string }> = [];
  try {
    const servicesResponse = await getServices({ limit: 100 });
    services = servicesResponse.docs.map((service) => ({
      name: service.title,
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error fetching services for header:', error);
    // Fall back to empty array if fetch fails
  }

  return <HeaderClient services={services} />;
}
