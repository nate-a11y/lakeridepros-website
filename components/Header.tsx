import { getServices } from '@/lib/api/payload';
import { getPopularServicesLocal } from '@/lib/analytics-server';
import HeaderClient from './HeaderClient';

export default async function Header() {
  // Fetch all services dynamically from CMS
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

  // Fetch popular services based on analytics - use local version for build-time
  let popularServiceSlugs: string[] = [];
  try {
    const popularServices = await getPopularServicesLocal(5);
    popularServiceSlugs = popularServices.map(s => s.slug);
  } catch (error) {
    console.error('Error fetching popular services:', error);
    // Fall back to empty array - HeaderClient will use fallback logic
  }

  return <HeaderClient services={services} popularServiceSlugs={popularServiceSlugs} />;
}
