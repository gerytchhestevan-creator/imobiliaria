'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bed, Bath, Car, Maximize, MapPin, 
  ChevronLeft, Share2, Heart, MessageCircle,
  Calendar, ShieldCheck, CheckCircle2, Loader2,
  MoveLeft, ArrowUpRight
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { getPropertyById, type PropertyData } from '@/lib/supabase/properties'
import { ContactForm } from '@/components/property/ContactForm'
import { NeighborhoodPrice } from '@/components/property/NeighborhoodPrice'
import { InvestmentCalculator } from '@/components/property/InvestmentCalculator'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activeImage, setActiveImage] = useState(0)
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperty() {
      if (!id) return
      setLoading(true)
      const data = await getPropertyById(id as string)
      setProperty(data)
      setLoading(false)
    }
    loadProperty()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfc]">
        <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfc] text-center p-6">
        <div>
          <h2 className="text-4xl font-serif italic text-[#1a1a1a] mb-6">Objeto não localizado</h2>
          <Link href="/imoveis" className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] border-b border-[#c5a059] pb-1">
            Voltar ao Acervo
          </Link>
        </div>
      </div>
    )
  }

  const economy = property.price * 0.04
  const images = property.images && property.images.length > 0 ? property.images : ['/hero-bg.png']
  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de mais informações sobre o imóvel: ${property.title} (ID: ${property.id}).`)

  return (
    <div className="min-h-screen bg-[var(--background)] pb-40">
      {/* Editorial Header */}
      <div className="pt-32 pb-20 border-b border-[var(--border)]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 hover:text-[var(--accent)] transition-all mb-12 group"
            >
              <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Voltar ao Acervo
            </button>
            
            <div className="flex items-center gap-3 text-[var(--accent)] font-black text-[10px] uppercase tracking-[0.4em] mb-6">
              <span className="w-8 h-[1px] bg-[var(--accent)]" />
              {property.neighborhood} • {property.city || 'São Paulo'}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-[var(--foreground)] leading-[0.85] mb-8 tracking-tighter">
              {property.title.split(' ').map((word, i) => (
                <span key={i} className={cn(i % 2 === 1 && "italic font-normal text-[var(--accent)]")}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-20">
        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-[var(--muted)] overflow-hidden rounded-3xl mb-8 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeImage]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Float Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Preço sob consulta</p>
                <p className="text-2xl font-light text-[var(--foreground)] font-mono">{formatCurrency(property.price)}</p>
              </div>
            </div>
            
            {/* Gallery Grid / Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-20">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden transition-all duration-500",
                      activeImage === i 
                        ? "ring-2 ring-[var(--accent)] scale-95" 
                        : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-[var(--border)] mb-20">
              <Spec icon={<Maximize className="w-5 h-5" />} label="Área Útil" value={`${property.area_sqm} m²`} />
              <Spec icon={<Bed className="w-5 h-5" />} label="Suítes" value={property.beds.toString()} />
              <Spec icon={<Bath className="w-5 h-5" />} label="Banheiros" value={property.baths.toString()} />
              <Spec icon={<Car className="w-5 h-5" />} label="Vagas" value={property.parking_spaces.toString()} />
            </div>

            {/* Content Sections */}
            <div className="max-w-3xl space-y-24">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 mb-10 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-[var(--border)]" />
                  Memória Descritiva
                </h3>
                <p className="text-lg md:text-xl text-[var(--foreground)]/80 font-normal leading-relaxed mb-12 whitespace-pre-wrap">
                  {property.description}
                </p>
                
                {property.features && property.features.length > 0 && (
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    {property.features.map(f => (
                      <div key={f} className="flex items-center gap-4 text-sm text-[var(--foreground)]/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Economy Section for Mobile */}
              <section className="lg:hidden">
                <div className="p-10 bg-[var(--foreground)] text-[var(--background)] rounded-[40px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-6 block text-center">Inteligência Imobiliária</span>
                  <h3 className="text-3xl font-serif text-center mb-8 italic">Você economiza <span className="text-[var(--accent)]">{formatCurrency(economy)}</span> neste ativo.</h3>
                  <Link 
                    href={`https://wa.me/5542998332506?text=${whatsappMessage}`}
                    target="_blank"
                    className="w-full py-5 bg-[var(--accent)] text-[var(--foreground)] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all rounded-2xl"
                  >
                    Falar com Especialista
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-10">
              {/* Form Card */}
              <div className="p-10 bg-[var(--card)] border border-[var(--border)] rounded-[40px] shadow-sm">
                <h3 className="text-2xl font-serif mb-8 text-center">Interesse no Ativo</h3>
                <ContactForm property={property} />
              </div>

              {/* Simulador Financeiro */}
              <InvestmentCalculator price={property.price} />

              {/* Economy Highlights */}
              <div className="hidden lg:block p-10 bg-[var(--foreground)] text-[var(--background)] rounded-[40px] relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-[var(--accent)]/20" />
                
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-8 block">Vantagem Exclusiva</span>
                <p className="text-3xl font-serif italic mb-10 leading-snug">
                  Curadoria Jurídica e <span className="text-[var(--accent)]">2% de Taxa</span>.
                </p>
                
                <div className="space-y-6 mb-12 py-6 border-t border-[var(--background)]/10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Economia estimada</span>
                    <span className="text-3xl font-mono text-[var(--accent)] tracking-tighter">{formatCurrency(economy)}</span>
                  </div>
                </div>

                <Link 
                  href={`https://wa.me/5542998332506?text=${whatsappMessage}`}
                  target="_blank"
                  className="w-full py-5 bg-[var(--accent)] text-[var(--foreground)] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all rounded-2xl shadow-xl"
                >
                  Agendar Visita Particular
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Neighborhood Price Context */}
              <div className="rounded-[40px] overflow-hidden">
                <NeighborhoodPrice neighborhood={property.neighborhood} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-slate-300 mb-1">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-lg font-bold text-[#1a1a1a]">{value}</span>
    </div>
  )
}
