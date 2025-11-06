import { Metadata } from 'next';
import VehicleCard from '@/components/VehicleCard';
import { getVehicles } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Our Fleet | Lake Ride Pros',
  description: 'Browse our fleet of luxury vehicles including sedans, SUVs, limousines, and more. Find the perfect vehicle for your transportation needs.',
};

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const vehiclesData = await getVehicles().catch(() => ({ docs: [] }));
  const vehicles = vehiclesData.docs || [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Fleet</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Experience luxury and comfort with our premium vehicle selection
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                Fleet information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
