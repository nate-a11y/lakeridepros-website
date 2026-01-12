import {
  Car,
  Plane,
  Users,
  Wine,
  Heart,
  Building2,
  Calendar,
  Music,
  GraduationCap,
  Beer,
  MapPin,
  Bus,
  Navigation,
  PartyPopper,
  Briefcase,
  Palmtree,
  Clock,
  Shield,
  Star,
  Check,
  Phone,
  Mail,
  Home,
  LucideIcon,
} from 'lucide-react';

// Map of icon name strings to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  // Transportation
  Car,
  Plane,
  Bus,
  Navigation,

  // Events & Occasions
  Users,
  Wine,
  Heart,
  Calendar,
  Music,
  GraduationCap,
  Beer,
  PartyPopper,

  // Business & Location
  Building2,
  Briefcase,
  MapPin,
  Home,

  // Misc
  Palmtree,
  Clock,
  Shield,
  Star,
  Check,
  Phone,
  Mail,
};

// Normalize icon name (handle various cases and formats)
export function normalizeIconName(iconName: string | undefined): string | null {
  if (!iconName) return null;

  // Remove common prefixes and clean up
  const cleaned = iconName
    .replace(/^(lucide-|icon-)/i, '')
    .trim();

  // If already in PascalCase and exists in iconMap, return as-is
  if (iconMap[cleaned]) {
    return cleaned;
  }

  // Check case-insensitive match in iconMap (for typos)
  const exactMatch = Object.keys(iconMap).find(
    key => key.toLowerCase() === cleaned.toLowerCase()
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Convert kebab-case, snake_case, or space-separated to PascalCase
  return cleaned
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Get the icon component for a given icon name
export function getIcon(iconName: string | undefined): LucideIcon | null {
  if (!iconName) return null;

  const normalized = normalizeIconName(iconName);
  if (!normalized) return null;

  return iconMap[normalized] || null;
}

// Render an icon with optional props
interface IconProps {
  name: string | undefined;
  className?: string;
  size?: number;
  fallback?: LucideIcon;
}

// DynamicIcon intentionally looks up components at runtime based on name prop
// This is a dynamic icon system for CMS-driven content
/* eslint-disable react-hooks/static-components */
export function DynamicIcon({ name, className = '', size = 24, fallback }: IconProps) {
  const IconComponent = getIcon(name) ?? fallback ?? Star;
  return <IconComponent className={className} size={size} />;
}
/* eslint-enable react-hooks/static-components */
