'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, Upload, Save, 
  MapPin, DollarSign, Home, 
  Bed, Bath, Car, Maximize, 
  FileText, CheckCircle2, Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createProperty } from '@/lib/supabase/properties'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    property_type: 'house',
    beds: '',
    baths: '',
    parking_spaces: '',
    area_sqm: '',
    neighborhood: '',
    address: '',
    status: 'active'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Note: Local previews for now. In real app, upload to Storage.
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await createProperty({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        property_type: formData.property_type,
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        parking_spaces: Number(formData.parking_spaces),
        area_sqm: Number(formData.area_sqm),
        neighborhood: formData.neighborhood,
        address: formData.address,
        status: formData.status,
        images: images, // Normally these would be URLs from Storage
        features: ['Ar Condicionado', 'Churrasqueira'] // Default for MVP
      })
      
      alert('Imóvel cadastrado com sucesso no Supabase!')
      router.push('/admin/dashboard')
    } catch (err) {
      alert('Erro ao cadastrar imóvel no Supabase. Verifique sua conexão e chaves API.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Novo Imóvel</h1>
          <p className="text-slate-500 font-medium">Preencha os detalhes para publicar uma nova listagem no Supabase.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 text-left">
        {/* Left: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Informações Gerais
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Título do Anúncio</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text" 
                placeholder="Ex: Casa Contemporânea com Piscina"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Descrição Detalhada</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Descreva os pontos fortes do imóvel..."
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                required
              />
            </div>
          </section>

          {/* Details & Features */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Maximize className="w-5 h-5 text-blue-600" />
              Características e Medidas
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Área (m²)</label>
                <div className="relative">
                  <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="area_sqm" value={formData.area_sqm} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Quartos</label>
                <div className="relative">
                  <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="beds" value={formData.beds} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Banheiros</label>
                <div className="relative">
                  <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="baths" value={formData.baths} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Vagas</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="parking_spaces" value={formData.parking_spaces} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Localização
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Bairro (Público)</label>
                <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} type="text" placeholder="Ex: Jardim das Oliveiras" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Endereço (Privado)</label>
                <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Rua, Número, CEP" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Media & Price */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Preço e Status
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Valor de Venda</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                <input 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number" 
                  step="0.01"
                  placeholder="0,00"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Tipo de Imóvel</label>
              <select 
                name="property_type" 
                value={formData.property_type} 
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="house">Casa</option>
                <option value="apartment">Apartamento</option>
                <option value="land">Terreno</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Status Inicial</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="active">Ativo (Publicado)</option>
                <option value="paused">Pausado (Rascunho)</option>
                <option value="sold">Vendido</option>
              </select>
            </div>
          </section>

          {/* Media Section */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Fotos do Imóvel
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
                <Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 uppercase text-center px-2">Adicionar</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </section>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <Save className="w-6 h-6" />
                Publicar no Supabase
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
