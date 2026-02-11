import type { Metadata } from 'next';
import Link from 'next/link';
import SpotifyEmbed from '@/components/SpotifyEmbed';

export const metadata: Metadata = {
  title: 'Music | Lake Ride Pros',
  description:
    'Listen to Lake Ride Pros on Spotify, Apple Music, Amazon Music, and iHeart Radio. Ride with the vibe at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/music',
  },
  openGraph: {
    title: 'Music | Lake Ride Pros',
    description:
      'Listen to Lake Ride Pros on Spotify, Apple Music, Amazon Music, and iHeart Radio.',
    url: 'https://www.lakeridepros.com/music',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
};

const platforms = [
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/artist/44y7Dl9jKhtIq1SJ7uKv7v?si=AZsYjf2BRQ2uDa1Y-fRYmQ',
    color: 'bg-[#1DB954]',
    hoverColor: 'hover:bg-[#1ed760]',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'Apple Music',
    href: 'https://music.apple.com/us/artist/lake-ride-pros/1814027122',
    color: 'bg-[#FA243C]',
    hoverColor: 'hover:bg-[#ff3b50]',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.14-1.07.13-.95-.03-1.77-.56-2.07-1.49-.18-.56-.12-1.11.18-1.62.36-.63.93-.96 1.63-1.09.33-.06.67-.1 1-.15.37-.06.6-.27.64-.65.01-.07.01-.13.01-.2V9.076c0-.33-.14-.5-.46-.44-.93.18-1.86.36-2.79.55l-3.15.63c-.35.07-.5.23-.51.59v.04c-.01 2.62 0 5.24-.01 7.86 0 .45-.05.89-.27 1.29-.3.58-.76.95-1.39 1.12-.35.1-.71.13-1.07.12-.95-.04-1.77-.58-2.06-1.51-.17-.55-.11-1.09.19-1.59.36-.61.92-.94 1.61-1.07.33-.06.67-.1 1-.15.38-.06.6-.27.64-.66.01-.05.01-.1.01-.16V7.292c0-.48.18-.72.65-.83l6.78-1.37c.32-.07.65-.12.98-.17.27-.04.46.12.47.4v5.79z" />
      </svg>
    ),
  },
  {
    name: 'Amazon Music',
    href: 'https://music.amazon.com/artists/B0F8HJLZ1B/lake-ride-pros?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_zGydXAF44TrVghb5rlRyxmgqJ',
    color: 'bg-[#25D1DA]',
    hoverColor: 'hover:bg-[#3de0e8]',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4a9.6 9.6 0 110 19.2 9.6 9.6 0 010-19.2zm-1.2 5.4v8.4l6-4.2-6-4.2z" />
      </svg>
    ),
  },
  {
    name: 'iHeart Radio',
    href: 'https://www.iheart.com/artist/lake-ride-pros-46800572',
    color: 'bg-[#C6002B]',
    hoverColor: 'hover:bg-[#e0003a]',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c1.06 0 1.92.86 1.92 1.92S13.06 8.64 12 8.64 10.08 7.78 10.08 6.72 10.94 4.8 12 4.8zM7.2 9.6a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88zm9.6 0a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88zM12 10.08c2.65 0 4.8 2.15 4.8 4.8 0 1.77-.96 3.32-2.4 4.15V15.6a2.4 2.4 0 10-4.8 0v3.43a4.79 4.79 0 01-2.4-4.15c0-2.65 2.15-4.8 4.8-4.8z" />
      </svg>
    ),
  },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-lrp-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lake Ride Pros Music
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Ride with the vibe. Listen to Lake Ride Pros on all major streaming platforms.
          </p>
        </div>
      </section>

      {/* Spotify Embed */}
      <SpotifyEmbed
        artistId="44y7Dl9jKhtIq1SJ7uKv7v"
        title="Now Playing"
        subtitle="Preview our latest tracks right here"
      />

      {/* Streaming Platform Links */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Listen Everywhere
            </h2>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto">
              Find Lake Ride Pros on your favorite streaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${platform.color} ${platform.hoverColor} text-white rounded-xl p-6 flex items-center gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5 group`}
                aria-label={`Listen on ${platform.name} (opens in new tab)`}
              >
                {platform.icon}
                <div>
                  <p className="text-sm text-white/80">Listen on</p>
                  <p className="text-xl font-bold">{platform.name}</p>
                </div>
                <svg
                  className="w-5 h-5 ml-auto opacity-60 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark font-medium"
          >
            <span>&larr;</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
