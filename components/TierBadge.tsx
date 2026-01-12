/**
 * TierBadge Component
 * Displays pricing tier badges for vehicles (Flex, Elite, LRP Black)
 */

// Pricing tier display configuration
const TIER_CONFIG: Record<string, { label: string; lightClassName: string; darkClassName: string }> = {
  flex: {
    label: 'Flex',
    lightClassName: 'bg-blue-600 text-white',
    darkClassName: 'dark:bg-blue-500 dark:text-white',
  },
  elite: {
    label: 'Elite',
    lightClassName: 'bg-purple-700 text-white',
    darkClassName: 'dark:bg-purple-600 dark:text-white',
  },
  'lrp-black': {
    label: 'LRP Black',
    lightClassName: 'bg-black text-amber-400 border border-amber-400',
    darkClassName: 'dark:bg-neutral-900 dark:text-amber-400 dark:border-amber-400',
  },
};

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-xs';

  return (
    <span
      className={`rounded-full font-semibold ${sizeClasses} ${config.lightClassName} ${config.darkClassName}`}
    >
      {config.label}
    </span>
  );
}

interface TierBadgesProps {
  tiers: string[] | null | undefined;
  size?: 'sm' | 'md';
  className?: string;
}

export function TierBadges({ tiers, size = 'md', className = '' }: TierBadgesProps) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {tiers.map((tier) => (
        <TierBadge key={tier} tier={tier} size={size} />
      ))}
    </div>
  );
}

export default TierBadges;
