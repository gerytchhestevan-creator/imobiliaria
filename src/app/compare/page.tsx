'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCompare } from '@/components/property/CompareProvider'
import { formatCurrency, cn } from '@/lib/utils'
import { 
  X, ArrowLeft, Bed, Bath, Car, Maximize, 
  Check, Info, MessageCircle, ArrowUpRight 
} from 'lucide-react'

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-40 pb-20 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif italic text-[var(--foreground)]">Nenhum imóvel selecionado</h1>
          <p className="text-[var(--foreground)]/60 max-w-md mx-auto">
            Adicione até 4 imóveis ao seu acervo de comparação para analisar cada detalhe lado a lado.
          </p>
          <Link 
            href="/imoveis" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-[10px] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-all"
          >
            Explorar Acervo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-40">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b border-[var(--border)] pb-12">
          <div className="max-w-2xl">
            <Link 
              href="/imoveis"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 hover:text-[var(--accent)] transition-all mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Voltar ao catálogo
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] tracking-tighter">
              Análise <span className="italic text-[var(--accent)]">Comparativa.</span>
            </h1>
          </div>
          <button 
            onClick={clearCompare}
            className="text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors border-b border-red-500/20 pb-1"
          >
            Limpar todos os itens
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-10">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 gap-8">
              {/* Labels Column */}
              <div className="pt-[240px] space-y-16">
                <CompareLabel label="Valor do Ativo" />
                <CompareLabel label="Dormitórios" />
                <CompareLabel label="Banheiros" />
                <CompareLabel label="Vagas" />
                <CompareLabel label="Área Útil" />
                <CompareLabel label="Bairro" />
              </div>

              {/* Properties Columns */}
              {Array.from({ length: 4 }).map((_, i) => {
                const property = compareList[i]
                
                return (
                  <div key={i} className="relative">
                    {property ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-16"
                      >
                        {/* Property Card Top */}
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group mb-8">
                          <Image 
                            src={property.images?.[0] || '/placeholder-property.jpg'} 
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                          <button 
                            onClick={() => removeFromCompare(property.id || '')}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm font-serif line-clamp-2 leading-tight">
                              {property.title}
                            </p>
                          </div>
                        </div>

                        {/* Values */}
                        <CompareValue value={formatCurrency(property.price)} highlight />
                        <CompareValue value={property.beds.toString()} />
                        <CompareValue value={property.baths.toString()} />
                        <CompareValue value={property.parking_spaces.toString()} />
                        <CompareValue value={`${property.area_sqm} m²`} />
                        <CompareValue value={property.neighborhood} />

                        {/* Action */}
                        <div className="pt-8">
                          <Link 
                            href={`/imoveis/${property.id}`}
                            className="w-full py-4 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all group"
                          >
                            Ver Detalhes
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full border-2 border-dashed border-[var(--border)] rounded-[40px] flex items-center justify-center p-8 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/20 leading-loose">
                          Adicione outro <br /> imóvel para <br /> comparar
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Floating WhatsApp CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-32 p-12 bg-[var(--foreground)] text-[var(--background)] rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div>
            <h2 className="text-3xl font-serif italic mb-2">Dúvidas sobre esses ativos?</h2>
            <p className="opacity-60 font-light">Nossos consultores jurídicos e imobiliários estão prontos para ajudar.</p>
          </div>
          
          <a 
            href="https://wa.me/5542998332506?text=Olá! Estou analisando alguns imóveis e gostaria de ajuda com a comparação."
            target="_blank"
            className="px-10 py-5 bg-[var(--accent)] text-[var(--foreground)] font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
          >
            <MessageCircle className="w-5 h-5" />
            Consultoria Gratuita
          </a>
        </motion.div>
      </div>
    </div>
  )
}

function CompareLabel({ label }: { label: string }) {
  return (
    <div className="h-10 flex items-center border-l-2 border-[var(--accent)]/20 pl-4">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">
        {label}
      </span>
    </div>
  )
}

function CompareValue({ value, highlight }: { value: string, highlight?: boolean }) {
  return (
    <div className="h-10 flex items-center">
      <span className={cn(
        "text-sm font-medium",
        highlight ? "text-xl font-mono text-[var(--accent)]" : "text-[var(--foreground)]"
      )}>
        {value}
      </span>
    </div>
  )
}
