interface SocialIconProps {
  className?: string;
}

export function FacebookIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8.5h3V5h-3c-3.1 0-5 1.9-5 5v2H6v3.5h3V22h4v-6.5h3.2l.6-3.5H13v-2c0-1 .4-1.5 1-1.5Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="16" height="16" x="4" y="4" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 10.6 21 3h-2.6l-4.9 5.9L9.6 3H3l6.8 10.1L3 21h2.6l5.3-6.3L15.1 21H21l-6.3-10.4Zm-2.1 2.5-1.2-1.8L6.2 5h2.2l3.6 5.4 1.2 1.8 5.5 6.7h-2.2l-3.9-5.8Z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function TikTokIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z" />
    </svg>
  );
}
