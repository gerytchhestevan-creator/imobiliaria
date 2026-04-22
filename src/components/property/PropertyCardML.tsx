'use client'

import React from 'react'
import { useFavorite } from '@/components/property/FavoriteProvider'
import { motion } from 'framer-motion'
import { Bed, Bath, Car, Maximize, Heart, Share2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
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
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = `/imoveis/${property.id}`}
            style={{ cursor: 'pointer' }}>
        {/* Image Container */}
        <div className="relative aspect-[16/10] bg-[var(--muted)] overflow-hidden">
          <motion.img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Heart className="w-5 h-5 text-[var(--foreground)]/60 hover:text-red-500" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-3 right-14 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-[var(--foreground)]/60" />
          </button>

          {/* Compare Button */}
          <div className="absolute top-3 left-3">
            <CompareButton property={property} />
          </div>

          {/* Property Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-[var(--foreground)]/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              {property.property_type === 'house' ? 'Casa' : 
               property.property_type === 'apartment' ? 'Apartamento' :
               property.property_type === 'land' ? 'Terreno' : 'Comercial'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <p className="text-2xl font-bold text-[var(--foreground)] mb-1">
            {formatPrice(property.price)}
          </p>

          {/* Title */}
          <h3 className="text-[var(--foreground)]/80 text-sm font-medium mb-3 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-[var(--foreground)]/50 text-xs mb-4">
            {property.neighborhood}, {property.city || 'São Paulo'}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 pt-3 border-t border-[var(--border)]">
            {property.beds > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-[var(--foreground)]/50" />
                <span className="text-xs font-medium text-[var(--foreground)]/70">
                  {property.beds} {property.beds === 1 ? 'quarto' : 'quartos'}
                </span>
              </div>
            )}
            {property.baths > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-[var(--foreground)]/50" />
                <span className="text-xs font-medium text-[var(--foreground)]/70">
                  {property.baths} {property.baths === 1 ? 'banheiro' : 'banheiros'}
                </span>
              </div>
            )}
            {property.parking_spaces > 0 && (
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[var(--foreground)]/50" />
                <span className="text-xs font-medium text-[var(--foreground)]/70">
                  {property.parking_spaces} {property.parking_spaces === 1 ? 'vaga' : 'vagas'}
                </span>
              </div>
            )}
            {property.area_sqm > 0 && (
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-[var(--foreground)]/50" />
                <span className="text-xs font-medium text-[var(--foreground)]/70">
                  {property.area_sqm} m²
                </span>
              </div>
            )}
          </div>

          {/* Condo Fee (if apartment) */}
          {property.property_type === 'apartment' && (
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--foreground)]/50">
                Condomínio: R$ 500/mês (exemplo)
              </p>
            </div>
          )}
        </div>
       </div>
    </motion.div>
  )
}