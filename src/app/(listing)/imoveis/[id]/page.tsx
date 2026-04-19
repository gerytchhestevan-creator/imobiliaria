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
    <div className="min-h-screen bg-[#fdfdfc] pb-40">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 border-b border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#c5a059] transition-colors mb-8 group"
            >
              <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Voltar ao Acervo
            </button>
            
            <div className="flex items-center gap-2 text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <MapPin className="w-3 h-3" />
              {property.neighborhood}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#1a1a1a] leading-tight mb-2">
              {property.title}
            </h1>
          </div>
          
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Valor do Ativo</span>
             <p className="text-4xl md:text-6xl font-light text-[#1a1a1a] font-mono tracking-tighter">
                {formatCurrency(property.price)}
             </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Visual Content */}
          <div className="lg:col-span-8">
            {/* Gallery */}
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
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
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mb-16">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative w-24 aspect-square overflow-hidden border-2 transition-all duration-300",
                      activeImage === i ? "border-[#c5a059] opacity-100" : "border-transparent opacity-50 grayscale hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Structured Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100 mb-16">
              <Spec icon={<Maximize className="w-5 h-5" />} label="Área Útil" value={`${property.area_sqm} m²`} />
              <Spec icon={<Bed className="w-5 h-5" />} label="Dormitórios" value={property.beds.toString()} />
              <Spec icon={<Bath className="w-5 h-5" />} label="Banheiros" value={property.baths.toString()} />
              <Spec icon={<Car className="w-5 h-5" />} label="Vagas" value={property.parking_spaces.toString()} />
            </div>

            {/* Description Editorial */}
            <div className="max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Memória Descritiva</h3>
              <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
                {property.description}
              </p>
              
              {property.features && property.features.length > 0 && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-24">
                  {property.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Sticky Action */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Economy Highlight */}
              <div className="p-10 bg-[#1a1a1a] text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] mb-4 block">Vantagem do Modelo</span>
                <p className="text-3xl font-serif italic mb-6">A única comissão de 2% do mercado.</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-mono tracking-tighter text-[#c5a059]">{formatCurrency(economy)}</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed mb-10">
                  Economia gerada apenas pela redução da comissão tradicional (6%) para o nosso modelo de performance.
                </p>
                <Link 
                  href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
                  target="_blank"
                  className="w-full py-5 bg-[#c5a059] text-[#1a1a1a] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all group"
                >
                  Agendar Visita Particular
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="p-8 border border-slate-100 space-y-6">
                 <div className="flex gap-4">
                   <ShieldCheck className="w-6 h-6 text-slate-300 flex-shrink-0" />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] mb-1">Documentação Garantida</p>
                     <p className="text-xs text-slate-500 font-light leading-snug">Imóvel auditado e revisado por nossa equipe jurídica.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <Calendar className="w-6 h-6 text-slate-300 flex-shrink-0" />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] mb-1">Visitas Imediatas</p>
                     <p className="text-xs text-slate-500 font-light leading-snug">Consultores disponíveis 7 dias por semana para acompanhamento.</p>
                   </div>
                 </div>
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
