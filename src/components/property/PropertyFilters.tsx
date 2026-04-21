'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, SlidersHorizontal, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterState {
  search: string
  propertyType: string
  priceMin: string
  priceMax: string
  beds: string
  baths: string
  areaMin: string
  areaMax: string
  garages: string
  sortBy: string
}

interface FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClear: () => void
  resultCount: number
}

const propertyTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
]

const sortOptions = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'area', label: 'Maior área' },
]

const bedsOptions = [
  { value: '', label: 'Qualquer número' },
  { value: '1', label: '1 quarto' },
  { value: '2', label: '2 quartos' },
  { value: '3', label: '3 quartos' },
  { value: '4', label: '4+ quartos' },
]

export function PropertyFilters({ filters, onChange, onClear, resultCount }: FiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const activeFiltersCount = [
    filters.propertyType !== 'all',
    filters.priceMin,
    filters.priceMax,
    filters.beds,
    filters.baths,
    filters.areaMin,
    filters.areaMax,
    filters.garages,
  ].filter(Boolean).length

  return (
    <>
      {/* Main Filter Bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)]/40" />
            <input
              type="text"
              placeholder="Buscar por bairro, rua ou referência..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--muted)] border-none rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {propertyTypes.slice(0, 4).map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('propertyType', type.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filters.propertyType === type.value
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--muted)] text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/10"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* More Filters Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              showMobileFilters || activeFiltersCount > 0
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "bg-[var(--muted)] text-[var(--foreground)]/70"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[var(--background)] text-[var(--accent)] text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="px-4 py-2 bg-[var(--muted)] border-none rounded-lg text-sm font-medium text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="text-xs font-bold text-[var(--foreground)]/60 uppercase mb-2 block">Faixa de preço</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => updateFilter('priceMin', e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm text-[var(--foreground)]"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => updateFilter('priceMax', e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="text-xs font-bold text-[var(--foreground)]/60 uppercase mb-2 block">Quartos</label>
                    <select
                      value={filters.beds}
                      onChange={(e) => updateFilter('beds', e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm text-[var(--foreground)]"
                    >
                      {bedsOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="text-xs font-bold text-[var(--foreground)]/60 uppercase mb-2 block">Banheiros</label>
                    <select
                      value={filters.baths}
                      onChange={(e) => updateFilter('baths', e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm text-[var(--foreground)]"
                    >
                      <option value="">Qualquer</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  {/* Garages */}
                  <div>
                    <label className="text-xs font-bold text-[var(--foreground)]/60 uppercase mb-2 block">Vagas</label>
                    <select
                      value={filters.garages}
                      onChange={(e) => updateFilter('garages', e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm text-[var(--foreground)]"
                    >
                      <option value="">Qualquer</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={onClear}
                    className="mt-4 text-sm text-[var(--accent)] font-medium hover:underline"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--foreground)]/70">
          <span className="font-bold text-[var(--foreground)]">{resultCount}</span> resultados encontrados
        </p>
      </div>
    </>
  )
}