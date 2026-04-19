'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, DollarSign, Home as HomeIcon, Loader2, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { getProperties, type PropertyData } from '@/lib/supabase/properties'
import { cn } from '@/lib/utils'

export default function ListingPage() {
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperties() {
      setLoading(true)
      // For MVP simulation, we'll fetch all and filter client-side if needed
      const data = await getProperties({ status: 'active' })
      let filtered = data
      
      if (filterType !== 'all') {
        filtered = filtered.filter(p => p.property_type === filterType)
      }
      
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setProperties(filtered)
      setLoading(false)
    }
    loadProperties()
  }, [filterType, searchQuery])

  return (
    <div className="min-h-screen bg-[#fdfdfc] pt-40 pb-32">
      <div className="container mx-auto px-6">
        {/* Header - Architectural Style */}
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-4 block">Catálogo Exclusivo</span>
            <h1 className="text-6xl md:text-8xl font-serif text-[#1a1a1a] leading-none mb-8 italic">
              O Acervo
            </h1>
            <p className="text-lg text-slate-500 font-light max-w-xl">
              Uma seleção rigorosa de imóveis que combinam localização privilegiada, arquitetura de excelência e a transparência do modelo 2%.
            </p>
          </motion.div>
        </div>

        {/* Minimalist Filter Bar */}
        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-12 mb-16 pb-8 border-b border-slate-100">
          <div className="flex flex-wrap gap-12">
            <FilterButton 
              label="Todos" 
              active={filterType === 'all'} 
              onClick={() => setFilterType('all')} 
            />
            <FilterButton 
              label="Casas" 
              active={filterType === 'house'} 
              onClick={() => setFilterType('house')} 
            />
            <FilterButton 
              label="Apartamentos" 
              active={filterType === 'apartment'} 
              onClick={() => setFilterType('apartment')} 
            />
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#c5a059] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por bairro ou nome..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-transparent border-none text-sm font-medium focus:ring-0 outline-none placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>

        {/* Property Grid */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="aspect-[4/5] bg-slate-50 animate-pulse" />
                    <div className="h-4 w-1/3 bg-slate-50 animate-pulse" />
                    <div className="h-8 w-full bg-slate-50 animate-pulse" />
                  </div>
                ))}
              </motion.div>
            ) : properties.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
              >
                {properties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center"
              >
                <p className="text-2xl font-serif italic text-slate-400 mb-4">Nenhum ativo encontrado.</p>
                <button 
                  onClick={() => {setFilterType('all'); setSearchQuery('')}}
                  className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] border-b border-[#c5a059] pb-1"
                >
                  Limpar todos os filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative pb-2 overflow-hidden",
        active ? "text-[#1a1a1a]" : "text-slate-300 hover:text-slate-500"
      )}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="filterUnderline"
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a059]"
        />
      )}
    </button>
  )
}
