'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import { PropertyCard } from '@/components/property/PropertyCard'
import { getProperties, type PropertyData } from '@/lib/supabase/properties'

export function FeaturedProperties() {
  // Use mock data for now while DB is empty
  const MOCK_PROPERTIES: PropertyData[] = [
    {
      id: '1',
      title: 'Residência Origami',
      price: 1250000,
      neighborhood: 'Jardim das Oliveiras',
      beds: 3,
      baths: 4,
      parking_spaces: 2,
      area_sqm: 280,
      images: ['/properties/house-1.png'],
      property_type: 'house'
    },
    {
      id: '2',
      title: 'Edifício Meridien',
      price: 890000,
      neighborhood: 'Planalto',
      beds: 2,
      baths: 2,
      parking_spaces: 1,
      area_sqm: 95,
      images: ['/properties/apt-1.png'],
      property_type: 'apartment'
    },
    {
      id: '3',
      title: 'Casa da Encosta',
      price: 2100000,
      neighborhood: 'Parque das Nações',
      beds: 4,
      baths: 5,
      parking_spaces: 4,
      area_sqm: 450,
      images: ['/properties/house-2.png'],
      property_type: 'house'
    }
  ]

  return (
    <section className="py-32 bg-[#fdfdfc]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl text-left">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-4 block">Portfólio</span>
              <h2 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] leading-none">
                Curadoria de <br />
                <span className="italic">ativos singulares.</span>
              </h2>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/imoveis" 
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#c5a059] transition-colors"
            >
              Ver Acervo Completo
              <div className="w-10 h-10 border border-slate-200 flex items-center justify-center rounded-full group-hover:border-[#c5a059] transition-all">
                <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {MOCK_PROPERTIES.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
