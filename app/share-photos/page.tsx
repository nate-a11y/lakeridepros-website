import type { Metadata } from 'next'
import CustomerPhotoUpload from './CustomerPhotoUpload'

export const metadata: Metadata = {
  title: 'Share Photos | Lake Ride Pros',
  description: 'Securely share photos from your Lake Ride Pros experience with our team.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function SharePhotosPage() {
  return <CustomerPhotoUpload />
}
