'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bed, Bath, Car, Maximize, MapPin, ArrowUpRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { PropertyData } from '@/lib/supabase/properties'

interface PropertyCardProps {
  property: PropertyData
  index: number
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  // Economy calculation (4% of property value)
  const economy = property.price * 0.04
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '/hero-bg.png'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-transparent"
    >
      <Link href={`/imoveis/${property.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
          
          {/* Subtle Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Luxury Label */}
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-white/90 backdrop-blur-md text-[#1a1a1a] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 flex items-center gap-2 shadow-sm">
              <span className="w-1 h-1 bg-[#c5a059] rounded-full" />
              Economia: {formatCurrency(economy)}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-12 h-12 bg-white flex items-center justify-center text-[#1a1a1a] shadow-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center gap-2 text-[#c5a059] mb-3">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{property.neighborhood}</span>
          </div>
          
          <h3 className="text-2xl font-serif text-[#1a1a1a] mb-3 group-hover:text-slate-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-xl font-light text-[#1a1a1a] mb-6 font-mono tracking-tighter">
            {formatCurrency(property.price)}
          </p>

          <div className="flex items-center gap-8 py-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">{property.beds}</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">{property.area_sqm}m²</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
