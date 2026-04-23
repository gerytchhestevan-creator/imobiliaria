'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PropertyCardML } from '@/components/property/PropertyCardML'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { getProperties, type PropertyData } from '@/lib/supabase/properties'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CompareBar } from '@/components/property/CompareButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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

const ITEMS_PER_PAGE = 12

export default function ListingPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    propertyType: 'all',
    priceMin: '',
    priceMax: '',
    beds: '',
    baths: '',
    areaMin: '',
    areaMax: '',
    garages: '',
    sortBy: 'newest',
  })

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    setLoading(true)
    const data = await getProperties({ status: 'active' })
    setProperties(data)
    setLoading(false)
  }

  const filteredProperties = useMemo(() => {
    let result = [...properties]

    // Filter by property type
    if (filters.propertyType !== 'all') {
      result = result.filter(p => p.property_type === filters.propertyType)
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.neighborhood?.toLowerCase().includes(search) ||
        p.address?.toLowerCase().includes(search)
      )
    }

    // Filter by price
    if (filters.priceMin) {
      result = result.filter(p => p.price >= Number(filters.priceMin))
    }
    if (filters.priceMax) {
      result = result.filter(p => p.price <= Number(filters.priceMax))
    }

    // Filter by bedrooms
    if (filters.beds) {
      const minBeds = filters.beds === '4' ? 4 : Number(filters.beds)
      result = result.filter(p => {
        if (filters.beds === '4') return p.beds >= 4
        return p.beds >= minBeds
      })
    }

    // Filter by bathrooms
    if (filters.baths) {
      result = result.filter(p => p.baths >= Number(filters.baths))
    }

    // Filter by garages
    if (filters.garages) {
      result = result.filter(p => p.parking_spaces >= Number(filters.garages))
    }

    // Filter by area
    if (filters.areaMin) {
      result = result.filter(p => p.area_sqm >= Number(filters.areaMin))
    }
    if (filters.areaMax) {
      result = result.filter(p => p.area_sqm <= Number(filters.areaMax))
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'area':
        result.sort((a, b) => b.area_sqm - a.area_sqm)
        break
      case 'newest':
      default:
        result.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
    }

    return result
  }, [properties, filters])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const clearFilters = () => {
    setFilters({
      search: '',
      propertyType: 'all',
      priceMin: '',
      priceMax: '',
      beds: '',
      baths: '',
      areaMin: '',
      areaMax: '',
      garages: '',
      sortBy: 'newest',
    })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-20">
      <div className="container mx-auto">
        {/* Banner Header */}
        <div className="mb-12 py-12 border-b border-[var(--border)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-4 tracking-tight">
              Uma vitrine <span className="italic text-[var(--accent)]">curada</span> para você.
            </h1>
            <p className="text-lg text-[var(--foreground)]/60 max-w-2xl font-light">
              Explore nossa vitrine de imóveis exclusivos, selecionados para quem busca o equilíbrio perfeito entre design, localização e o modelo inteligente de venda.
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="sticky top-[80px] z-30 mb-10">
          <PropertyFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            resultCount={filteredProperties.length}
          />
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--card)] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-[var(--muted)]" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-2/3 bg-[var(--muted)] rounded" />
                  <div className="h-4 w-full bg-[var(--muted)] rounded" />
                  <div className="h-4 w-1/2 bg-[var(--muted)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map((property) => (
                <PropertyCardML key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[var(--foreground)] text-[var(--background)]'
                            : 'bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-[var(--foreground)]/50 mb-4">
              Nenhum imóvel encontrado
            </p>
            <button
              onClick={clearFilters}
              className="text-[var(--accent)] font-medium hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
      
      <CompareBar />
    </div>
  )
}