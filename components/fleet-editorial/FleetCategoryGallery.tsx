import Gallery, { type GalleryImage } from '@/components/Gallery'
import { getVehiclesLocal, getMediaUrl } from '@/lib/api/sanity'
import { resolveSlug } from '@/types/sanity'
import styles from './FleetEditorial.module.css'

const categoryVehicles: Record<string, string> = {
  'suburbans': 'elite',
  'sprinter-van': 'executive-sprinter-van',
  'limo-bus': 'lrp-limo-bus',
  'rescue-squad': 'rescue-squad-1',
  'shuttle-bus': 'executive-shuttle-bus',
}

/** Connect enduring category URLs to real, currently published fleet photography. */
export default async function FleetCategoryGallery({ category }: { category: string }) {
  const slug = categoryVehicles[category]
  // Category pages are prerendered. Read the cached, public, available fleet
  // rather than the authenticated no-store lookup used by dynamic details.
  const vehicles = slug ? await getVehiclesLocal().catch(() => []) : []
  const vehicle = vehicles.find(item => resolveSlug(item.slug) === slug)
  if (!vehicle) return <p>Contact us for current vehicle photos and availability.</p>
  const images: GalleryImage[] = []
  const sources = new Set<string>()
  for (const item of [
    ...(vehicle.images ?? []),
    { image: vehicle.featuredImage, alt: vehicle.featuredImage?.alt },
  ]) {
    if (!item.image) continue
    const src = getMediaUrl(item.image)
    if (!src || sources.has(src)) continue
    sources.add(src)
    images.push({ src, alt: item.alt || vehicle.name })
  }
  return (
    <figure className={styles.gallery}>
      <Gallery images={images} title={vehicle.name} mode="carousel" aspectRatio="4/3" />
      <figcaption>{vehicle.name}. Explore the photos, then check availability for your plans.</figcaption>
    </figure>
  )
}
