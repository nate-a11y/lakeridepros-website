'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset focused index when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      const currentIndex = themeOptions.findIndex(t => t.value === theme);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, theme]);

  // Focus the option when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex(prev => (prev + 1) % themeOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex(prev => (prev - 1 + themeOptions.length) % themeOptions.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setFocusedIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setFocusedIndex(themeOptions.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (focusedIndex >= 0) {
        event.preventDefault();
        handleThemeSelect(themeOptions[focusedIndex].value);
      }
    }
  }, [focusedIndex]);

  const handleThemeSelect = (value: string) => {
    setTheme(value);
    setIsOpen(false);
    setFocusedIndex(-1);
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
          aria-activedescendant={focusedIndex >= 0 ? `theme-option-${themeOptions[focusedIndex].value}` : undefined}
        >
          <div className="py-1">
            {themeOptions.map((option, index) => (
              <button
                key={option.value}
                id={`theme-option-${option.value}`}
                ref={(el) => { optionRefs.current[index] = el; }}
                onClick={() => handleThemeSelect(option.value)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                style={{
                  backgroundColor: theme === option.value ? 'var(--primary-alpha-20)' : 'transparent',
                  color: theme === option.value ? 'var(--primary)' : 'var(--foreground)',
                  fontWeight: theme === option.value ? 600 : 400,
                }}
                role="option"
                aria-selected={theme === option.value}
                tabIndex={focusedIndex === index ? 0 : -1}
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
