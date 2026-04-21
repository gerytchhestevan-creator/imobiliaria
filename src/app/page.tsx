'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PropertyCardML } from '@/components/property/PropertyCardML'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { getProperties, type PropertyData } from '@/lib/supabase/properties'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header estilo search engine */}
      <header className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo + Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-lg">
                  I
                </div>
                <span className="text-lg font-black tracking-[0.2em] uppercase">
                  Imobi<span className="text-[var(--accent)]">2%</span>
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/imoveis" className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">Comprar</Link>
                <Link href="/anunciar" className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">Alugar</Link>
                <Link href="#como-funciona" className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">Como Funciona</Link>
                <Link href="#vantagens" className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]">Vantagens</Link>
              </nav>
            </div>

            {/* Anunciar Button */}
            <Link 
              href="/anunciar"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
            >
              Anunciar Imóvel
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--foreground)]/70">
            <span className="font-bold text-[var(--foreground)]">{filteredProperties.length}</span> imóveis encontrados
          </p>
          <Link href="/imoveis" className="text-sm text-[var(--accent)] font-medium">
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Section: Como Funciona */}
      <section id="como-funciona" className="py-20 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12"> Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Anuncie</h3>
              <p className="text-[var(--foreground)]/60">Cadastre seu imóvel em minutos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Negociamos</h3>
              <p className="text-[var(--foreground)]/60">Nossa equipe faz a curadoria e negociação</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Venda</h3>
              <p className="text-[var(--foreground)]/60">Feche o negócio com apenas 2% de comissão</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Vantagens */}
      <section id="vantagens" className="py-20 border-t border-[var(--border)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12"> Vantagens</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
              <h3 className="font-bold text-lg mb-2">Apenas 2%</h3>
              <p className="text-[var(--foreground)]/60">Comissão muito menor que o mercado</p>
            </div>
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
              <h3 className="font-bold text-lg mb-2">Sem Exclusividade</h3>
              <p className="text-[var(--foreground)]/60">Anuncie em quantas plataformas quiser</p>
            </div>
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
              <h3 className="font-bold text-lg mb-2">Curadoria Jurídica</h3>
              <p className="text-[var(--foreground)]/60">Verificação completa da documentação</p>
            </div>
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
              <h3 className="font-bold text-lg mb-2">Atendimento Personalizado</h3>
              <p className="text-[var(--foreground)]/60">Suporte dedicado durante todo o processo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--foreground)] text-[var(--background)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para vender ou comprar?</h2>
          <p className="mb-8 opacity-80">Fale com nossa equipe</p>
          <Link 
            href="https://wa.me/5511999999999"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[var(--foreground)] font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="container mx-auto px-4">
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
    </main>
  )
}