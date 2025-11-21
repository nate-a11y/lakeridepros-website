'use client';

interface SpotifyEmbedProps {
  artistId?: string;
  title?: string;
  subtitle?: string;
}

export default function SpotifyEmbed({
  artistId = '44y7Dl9jKhtIq1SJ7uKv7v',
  title = 'Ride With The Vibe',
  subtitle = 'Listen to music from our featured artist',
}: SpotifyEmbedProps) {
  return (
    <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          <iframe
            style={{ borderRadius: '12px' }}
            src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Artist Embed"
          />
        </div>
      </div>
    </section>
  );
}
