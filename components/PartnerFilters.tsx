'use client'

import { Search, X, ChevronDown } from 'lucide-react'

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
    <div className="mb-8">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="partner-search" className="sr-only">
            Search partners
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary" aria-hidden="true" />
          </div>
          <input
            id="partner-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search partners..."
            aria-label="Search partners by name or description"
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-lrp-black placeholder-lrp-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-lrp-green focus:border-transparent"
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

        {/* Category Dropdown */}
        {subcategories && subcategoryLabels && onSubcategoryFilterChange && (
          <div className="relative min-w-[200px] sm:w-auto">
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter"
              value={subcategoryFilter || 'all'}
              onChange={(e) => onSubcategoryFilterChange(e.target.value)}
              className="appearance-none w-full py-3 pl-4 pr-10 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-lrp-black focus:outline-none focus:ring-2 focus:ring-lrp-green focus:border-transparent cursor-pointer"
              aria-label="Filter partners by category"
            >
              <option value="all">All Categories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategoryLabels[subcategory] || subcategory}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-lrp-text-secondary dark:text-dark-text-secondary" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
