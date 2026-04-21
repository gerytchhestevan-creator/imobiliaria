'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, Upload, Save, 
  MapPin, DollarSign, Home, 
  Bed, Bath, Car, Maximize, 
  FileText, ArrowRight, Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createProperty } from '@/lib/supabase/properties'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function AnunciarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isRegistering, setIsRegistering] = useState(false)
  
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
    name: '',
    phone: '',
    status: 'pending'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email: loginData.email,
          password: loginData.password
        })
        if (error) throw error
        alert('Conta criada! Faça login.')
        setIsRegistering(false)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password
        })
        if (error) throw error
        if (data?.session) {
          router.push('/anunciar')
        }
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
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
        status: 'pending',
        images: images,
        features: ['Ar Condicionado', 'Churrasqueira']
      })
      
      setSuccess(true)
    } catch (err) {
      console.error(err)
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="bg-[var(--card)] p-12 rounded-[2rem] border border-[var(--border)] shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-[var(--foreground)] mb-4">Anúncio enviado!</h1>
            <p className="text-[var(--foreground)]/70 mb-8">
              Recebemos seu imóvel. Entraremos em contato em até 24h.
            </p>

            <a 
              href="/login"
              className="block w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-bold"
            >
              Ir para Login
            </a>
            
            <button 
              onClick={() => router.push('/')}
              className="block w-full mt-4 text-[var(--foreground)]/50 text-sm"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl text-[var(--foreground)]/60 hover:text-[var(--foreground)] shadow-sm transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <ThemeToggle />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-4">
            Anuncie seu imóvel
          </h1>
          <p className="text-[var(--foreground)]/70 text-lg max-w-2xl mx-auto">
            Preencha os dados abaixo. Nossa equipe curadoria especializada entra em contato pelo WhatsApp em até 24 horas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent)]" />
                Informações do Imóvel
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">Título do Anúncio</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Ex: Casa moderna com piscina no Jalisco"
                  className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">Descrição</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descreva os pontos fortes do imóvel..."
                  className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Área (m²)</label>
                  <div className="relative">
                    <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40" />
                    <input name="area_sqm" value={formData.area_sqm} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Quartos</label>
                  <div className="relative">
                    <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40" />
                    <input name="beds" value={formData.beds} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Banheiros</label>
                  <div className="relative">
                    <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40" />
                    <input name="baths" value={formData.baths} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Vagas</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40" />
                    <input name="parking_spaces" value={formData.parking_spaces} onChange={handleChange} type="number" className="w-full pl-10 pr-4 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="0" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--accent)]" />
                Localização
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Bairro</label>
                  <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} type="text" placeholder="Ex: Jardim das Oliveiras" className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)] ml-1">Endereço (opcional)</label>
                  <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Rua, Número" className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none" />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                Preço
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">Valor de Venda</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-[var(--foreground)]/40">R$</span>
                  <input 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number" 
                    placeholder="0,00"
                    className="w-full pl-14 pr-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">Tipo de Imóvel</label>
                <select 
                  name="property_type" 
                  value={formData.property_type} 
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none cursor-pointer font-medium"
                >
                  <option value="house">Casa</option>
                  <option value="apartment">Apartamento</option>
                  <option value="land">Terreno</option>
                  <option value="commercial">Comercial</option>
                </select>
              </div>
            </section>

            <section className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <Home className="w-5 h-5 text-[var(--accent)]" />
                Suas Informações
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">Seu Nome</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text" 
                  placeholder="Como devemos te chamar?"
                  className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)] ml-1">WhatsApp</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel" 
                  placeholder="(11) 99999-9999"
                  className="w-full px-6 py-4 bg-[var(--muted)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none"
                  required
                />
              </div>
            </section>

            <section className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[var(--accent)]" />
                Fotos
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                    <Image src={src} alt="" fill className="object-cover" />
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 hover:border-[var(--accent)] hover:bg-[var(--muted)] transition-all cursor-pointer group">
                  <Upload className="w-6 h-6 text-[var(--foreground)]/30 group-hover:text-[var(--accent)]" />
                  <span className="text-xs font-bold text-[var(--foreground)]/40 group-hover:text-[var(--accent)] uppercase text-center px-2">Adicionar</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </section>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-[var(--foreground)] text-[var(--background)] rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Save className="w-6 h-6" />
                  Enviar Anúncio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}