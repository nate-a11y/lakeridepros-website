import Image from 'next/image'
import type { ReactNode } from 'react'
import styles from './core-editorial.module.css'

const photography = {
  suv: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/5e4ab6a319db44a0b0f60eddec7f1d7f4718c65c-1024x768.avif',
    alt: 'Lake Ride Pros black SUV with signature green running-board lighting',
  },
  sprinter: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/c8efb814caf7a52fbd14beaf84ba755d02316f26-2048x1536.jpg',
    alt: 'Lake Ride Pros Executive Sprinter beside a private aircraft',
  },
  shuttle: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/cf3f2f162997d40f0d47ca91362d91d808a4130e-4000x3000.png',
    alt: 'Lake Ride Pros Executive Shuttle Bus on a tree-lined drive',
  },
  pinkPatrol: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/8952a03382bd30325c0701c9718555966456b083-1800x907.jpg',
    alt: 'The Pink Patrol, Lake Ride Pros specialty celebration shuttle',
  },
  music: {
    src: '/ep-cover-hi-my-name-is.jpg',
    alt: 'Lake Ride Pros Hi! My Name Is album cover',
  },
} as const

export default function CoreHero({ children, image, compact = false, labelledBy }: {
  children: ReactNode
  image: keyof typeof photography
  compact?: boolean
  labelledBy?: string
}) {
  const photo = photography[image]
  return (
    <section aria-labelledby={labelledBy} className={`${styles.hero} ${compact ? styles.compact : ''}`}>
      <div className={styles.heroLayout}>
        <div className={styles.heroCopy}>{children}</div>
        <div className={`${styles.heroImage} ${image === 'music' ? styles.album : image === 'pinkPatrol' ? styles.wide : ''}`}>
          <Image src={photo.src} alt={photo.alt} fill loading="eager" fetchPriority="high"
            sizes="(min-width: 1280px) 584px, (min-width: 1024px) 46vw, calc(100vw - 32px)"
            quality={75} className="object-contain" />
        </div>
      </div>
    </section>
  )
}
