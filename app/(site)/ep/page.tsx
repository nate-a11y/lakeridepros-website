import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Music | Lake Ride Pros',
  description: 'Listen to the latest EP releases from Lake Ride Pros. Stream on Apple Music and Spotify.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/ep',
  },
  openGraph: {
    title: 'Music | Lake Ride Pros',
    description: 'Listen to the latest EP releases from Lake Ride Pros. Stream on Apple Music and Spotify.',
    url: 'https://www.lakeridepros.com/ep',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/ep-cover-hi-my-name-is.jpg', width: 1200, height: 1200, alt: 'Hi My Name Is - Lake Ride Pros EP Cover' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Lake Ride Pros',
    description: 'Listen to the latest EP releases from Lake Ride Pros. Stream on Apple Music and Spotify.',
    images: ['/ep-cover-hi-my-name-is.jpg'],
  },
}

interface Release {
  title: string
  cover: string
  appleMusic: string
  spotify: string
  releaseDate: string
}

const releases: Release[] = [
  {
    title: 'Hi My Name Is',
    cover: '/ep-cover-hi-my-name-is.jpg',
    appleMusic: 'https://music.apple.com/us/album/hi-my-name-is-single/1886743491',
    spotify: 'https://open.spotify.com/track/6oUaXE2a8NEVQM7SexjlVE?si=6810daf6a5f64956',
    releaseDate: '2025',
  },
]

export default function EPPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-neutral-900 dark:text-white mb-4">
          Music
        </h1>
        <p className="text-center text-lrp-text-secondary dark:text-dark-text-secondary mb-16 text-lg">
          Latest releases from Lake Ride Pros
        </p>

        <div className="space-y-20">
          {releases.map((release) => (
            <div key={release.title} className="flex flex-col items-center">
              {/* Cover Art */}
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl mb-8">
                <Image
                  src={release.cover}
                  alt={`${release.title} - EP Cover`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Release Info */}
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {release.title}
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-8">
                {release.releaseDate}
              </p>

              {/* Streaming Links */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link
                  href={release.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-neutral-900 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity border border-neutral-700"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.335-2.22-1.1-.456-.83-.164-1.9.657-2.408.39-.243.826-.378 1.277-.468.44-.09.885-.158 1.326-.24.283-.054.558-.126.768-.338.188-.194.284-.428.29-.696.002-.038.003-.076.003-.114V8.573c0-.168-.04-.322-.187-.425-.14-.1-.3-.072-.455-.036-.263.06-.524.127-.786.19l-3.24.79c-.052.012-.105.022-.148.064-.072.067-.106.15-.113.248-.003.02-.003.04-.003.06V16.7c0 .407-.048.808-.215 1.182-.27.6-.734.99-1.37 1.18-.348.105-.71.167-1.078.19-.98.05-1.845-.32-2.272-1.073-.47-.826-.188-1.896.636-2.413.39-.246.83-.385 1.286-.478.39-.08.782-.143 1.172-.217.32-.06.627-.148.867-.382.177-.176.264-.394.27-.64V7.26c0-.336.064-.66.3-.935.198-.23.455-.353.74-.42.376-.09.754-.166 1.13-.252l3.602-.882c.393-.096.787-.19 1.18-.287.2-.05.4-.075.6-.028.294.068.48.253.586.535.037.1.053.206.053.314.002 1.553.002 3.108 0 4.662z" />
                  </svg>
                  Apple Music
                </Link>
                <Link
                  href={release.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#1DB954] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Spotify
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
