'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface PartnerFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  subcategoryFilter?: string
  onSubcategoryFilterChange?: (value: string) => void
  subcategories?: string[]
  subcategoryLabels?: Record<string, string>
}

export default function PartnerFilters({
  searchTerm,
  onSearchChange,
  subcategoryFilter,
  onSubcategoryFilterChange,
  subcategories,
  subcategoryLabels,
}: PartnerFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search partners by name or description..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white placeholder-lrp-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-lrp-green focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-black dark:hover:text-white" />
          </button>
        )}
      </div>

      {/* Subcategory Filter (optional) */}
      {subcategories && subcategoryLabels && onSubcategoryFilterChange && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubcategoryFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              subcategoryFilter === 'all'
                ? 'bg-lrp-green text-white'
                : 'bg-lrp-gray dark:bg-dark-bg-secondary text-lrp-black dark:text-white hover:bg-lrp-green hover:text-white'
            }`}
          >
            All Categories
          </button>
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => onSubcategoryFilterChange(subcategory)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subcategoryFilter === subcategory
                  ? 'bg-lrp-green text-white'
                  : 'bg-lrp-gray dark:bg-dark-bg-secondary text-lrp-black dark:text-white hover:bg-lrp-green hover:text-white'
              }`}
            >
              {subcategoryLabels[subcategory] || subcategory}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
