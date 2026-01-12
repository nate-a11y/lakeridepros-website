'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';

type ThemeOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

// Sun icon for light themes
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Moon icon for dark themes
const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// High contrast icon (circle with half fill)
const ContrastIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18" />
    <path d="M12 3a9 9 0 010 18" fill="currentColor" />
  </svg>
);

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    value: 'high-contrast-light',
    label: 'High Contrast Light',
    icon: <ContrastIcon className="h-4 w-4" />,
  },
  {
    value: 'high-contrast-dark',
    label: 'High Contrast Dark',
    icon: <ContrastIcon className="h-4 w-4" />,
  },
];

export default function ThemeToggle() {
  const mounted = useHasMounted();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleThemeSelect = (value: string) => {
    setTheme(value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-dark-bg-tertiary animate-pulse" />
    );
  }

  const currentTheme = themeOptions.find((t) => t.value === theme) || themeOptions[0];

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown} role="presentation">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-lg border border-transparent bg-neutral-100 dark:bg-dark-bg-tertiary hover:bg-primary hover:text-lrp-black dark:hover:bg-primary transition-all duration-200"
        style={{
          backgroundColor: 'var(--neutral-100)',
          borderColor: 'var(--dark-border)',
        }}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className="h-5 w-5 flex items-center justify-center"
          style={{ color: 'var(--foreground)' }}
        >
          {currentTheme.icon}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--dark-border)',
          }}
          role="listbox"
          aria-label="Theme options"
        >
          <div className="py-1">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeSelect(option.value)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                style={{
                  backgroundColor: theme === option.value ? 'var(--primary-alpha-20)' : 'transparent',
                  color: theme === option.value ? 'var(--primary)' : 'var(--foreground)',
                  fontWeight: theme === option.value ? 600 : 400,
                }}
                role="option"
                aria-selected={theme === option.value}
              >
                <span className="flex-shrink-0">{option.icon}</span>
                <span className="text-sm">{option.label}</span>
                {theme === option.value && (
                  <svg
                    className="ml-auto h-4 w-4"
                    style={{ color: 'var(--primary)' }}
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
