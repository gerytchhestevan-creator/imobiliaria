'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PropertyCardML } from '@/components/property/PropertyCardML'
import { getProperties, type PropertyData } from '@/lib/supabase/properties'
import { MessageCircle, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CompareBar } from '@/components/property/CompareButton'

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

export default function Home() {
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

  const filteredProperties = React.useMemo(() => {
    let result = [...properties]

    if (filters.propertyType !== 'all') {
      result = result.filter(p => p.property_type === filters.propertyType)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.neighborhood?.toLowerCase().includes(search)
      )
    }

    if (filters.priceMin) {
      result = result.filter(p => p.price >= Number(filters.priceMin))
    }
    if (filters.priceMax) {
      result = result.filter(p => p.price <= Number(filters.priceMax))
    }

    if (filters.beds) {
      result = result.filter(p => p.beds >= Number(filters.beds))
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
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
    <main className="min-h-screen bg-[var(--background)] pt-20">
      {/* Header removido pois o Navbar global já cuida disso */}

      {/* Filters */}
      <header className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="container mx-auto py-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center gap-4"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Comprar' },
                { value: 'house', label: 'Casas' },
                { value: 'apartment', label: 'Apartamentos' },
                { value: 'land', label: 'Terrenos' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilters(f => ({ ...f, propertyType: type.value }))}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                    filters.propertyType === type.value
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "bg-[var(--muted)] text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/10"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por bairro, rua ou referência..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full px-4 py-2 bg-[var(--muted)] border-none rounded-lg text-sm"
              />
            </div>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
              className="px-3 py-2 bg-[var(--muted)] border-none rounded-lg text-sm"
            >
              <option value="newest">Mais recentes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </motion.div>
        </div>
      </header>

      {/* Results */}
      <div className="container mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-[var(--foreground)]/70">
            <span className="font-bold text-[var(--foreground)]">{filteredProperties.length}</span> imóveis encontrados
          </p>
          <Link href="/imoveis" className="text-sm text-[var(--accent)] font-medium">
            Ver todos →
          </Link>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--card)] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-[var(--muted)]" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-2/3 bg-[var(--muted)] rounded" />
                  <div className="h-4 w-full bg-[var(--muted)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedProperties.map((property) => (
                <PropertyCardML key={property.id} property={property} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="px-4 text-sm">
                  {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-[var(--foreground)]/50 mb-4">Nenhum imóvel encontrado</p>
            <button onClick={clearFilters} className="text-[var(--accent)] font-medium hover:underline">
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Section: Vantagens */}
      <section id="vantagens" className="py-32 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-6 block">Não somos uma imobiliária</span>
            <h2 className="text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-8">
              Um novo conceito de <span className="italic text-[var(--accent)]">Vitrine.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Apenas 2%',
                desc: 'A menor taxa de performance do mercado, focada no seu lucro líquido.',
                icon: <ArrowUpRight className="w-5 h-5" />
              },
              {
                title: 'Sem Exclusividade',
                desc: 'Liberdade total para anunciar onde quiser. Zero fidelidade contratual.',
                icon: <MessageCircle className="w-5 h-5" />
              },
              {
                title: 'Curadoria Jurídica',
                desc: 'Segurança completa em todas as etapas, da análise ao contrato final.',
                icon: <ArrowUpRight className="w-5 h-5" />
              },
              {
                title: 'Branding Premium',
                desc: 'Posicionamento de alto nível para atrair os compradores certos.',
                icon: <MessageCircle className="w-5 h-5" />
              }
            ].map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[var(--card)] p-10 rounded-[40px] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] group-hover:text-[var(--foreground)] transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-bold text-xl mb-4">{v.title}</h3>
                <p className="text-sm text-[var(--foreground)]/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[var(--foreground)] text-[var(--background)] relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full -ml-48 -mb-48 blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif mb-8 max-w-4xl mx-auto leading-tight">
              Anuncie na vitrine mais <span className="italic text-[var(--accent)]">inteligente</span> do mercado.
            </h2>
            <p className="text-xl mb-12 opacity-60 font-light">Converse com um de nossos especialistas agora mesmo.</p>
            <a 
              href="https://wa.me/5542998332506?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-12 py-6 bg-[var(--accent)] text-[var(--foreground)] font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--foreground)]/60">
              © 2026 Imobi2% — Mercado imobiliário Inteligente.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-[var(--foreground)]/60">Privacidade</Link>
              <Link href="#" className="text-sm text-[var(--foreground)]/60">Termos</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <CompareBar />
    </main>
  )
}
