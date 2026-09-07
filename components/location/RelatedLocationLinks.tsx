import LocationEditorialList, {
  type LocationEditorialItem,
} from '@/components/location/LocationEditorialList'
import LocationSection from '@/components/location/LocationSection'

export default function RelatedLocationLinks({
  title = 'More ways to get there',
  items,
  id = 'related-locations',
}: {
  title?: string
  items: readonly (LocationEditorialItem & { href: string })[]
  id?: string
}) {
  if (items.length === 0) return null
  return (
    <LocationSection id={id} title={title}>
      <nav aria-label={title}>
        <LocationEditorialList items={items} />
      </nav>
    </LocationSection>
  )
}
