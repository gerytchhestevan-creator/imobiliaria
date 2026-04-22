'use client'

import React from 'react'
import { useFavorite } from '@/components/property/FavoriteProvider'
import { motion } from 'framer-motion'
import { Heart, Share2, ArrowUpRight } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { PropertyData } from '@/lib/supabase/properties'
import { CompareButton } from './CompareButton'

interface PropertyCardMLProps {
  property: PropertyData
}

export function PropertyCardML({ property }: PropertyCardMLProps) {
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '/placeholder-property.jpg'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

   const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorite()
   
   const handleFavorite = (e: React.MouseEvent) => {
     e.preventDefault()
     e.stopPropagation()
     if (isInFavorites(property.id || '')) {
       removeFromFavorites(property.id || '')
     } else {
       addToFavorites(property)
     }
   }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Veja este imóvel: ${property.title}`,
        url: window.location.origin + `/imoveis/${property.id}`,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-visible hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500"
            onClick={() => window.location.href = `/imoveis/${property.id}`}
            style={{ cursor: 'pointer' }}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-[var(--muted)] overflow-hidden rounded-t-[1.4rem]">
          <motion.img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-20 group-hover:translate-x-0 transition-transform duration-500 delay-75 z-20">
            <button
              onClick={handleFavorite}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-red-500 transition-all active:scale-90"
            >
              <Heart className={cn("w-5 h-5 transition-colors", isInFavorites(property.id || '') ? "fill-red-500 text-red-500" : "text-[var(--foreground)]/60")} />
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-90"
            >
              <Share2 className="w-4 h-4 text-[var(--foreground)]/60" />
            </button>
          </div>

          {/* Compare Button */}
          <div className="absolute top-4 left-4 -translate-x-20 group-hover:translate-x-0 transition-transform duration-500 z-20">
            <CompareButton property={property} variant="icon" />
          </div>

          {/* Property Type Badge */}
          <div className="absolute bottom-6 left-6">
            <span className="bg-white/90 backdrop-blur-md text-[var(--foreground)] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg border border-white/20">
              {property.property_type === 'house' ? 'Casa' : 
               property.property_type === 'apartment' ? 'Apartamento' :
               property.property_type === 'land' ? 'Terreno' : 'Comercial'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
             <p className="text-[var(--foreground)]/40 text-[10px] font-black uppercase tracking-[0.3em]">
               {property.neighborhood} • {property.city || 'São Paulo'}
             </p>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif text-[var(--foreground)] mb-6 line-clamp-1 group-hover:text-[var(--accent)] transition-colors leading-tight">
            {property.title}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-6 mb-8 py-6 border-y border-[var(--border)]">
            {property.beds > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[var(--foreground)]">{property.beds}</span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--foreground)]/40 font-black">Dorm</span>
              </div>
            )}
            {property.area_sqm > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[var(--foreground)]">{property.area_sqm}</span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--foreground)]/40 font-black">m²</span>
              </div>
            )}
            {property.parking_spaces > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[var(--foreground)]">{property.parking_spaces}</span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--foreground)]/40 font-black">Vagas</span>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <p className="text-3xl font-light text-[var(--foreground)] tracking-tighter">
              {formatPrice(property.price)}
            </p>
            <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] group-hover:border-[var(--foreground)] transition-all duration-500 shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
       </div>
    </motion.div>
  )
}