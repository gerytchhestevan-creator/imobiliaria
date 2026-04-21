'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { PropertyData } from '@/lib/supabase/properties'

interface ContactFormProps {
  property: PropertyData
}

export function ContactForm({ property }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Olá! Gostaria de mais informações sobre o imóvel ${property.title}.`
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { error } = await supabase.from('messages').insert({
        property_id: property.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'new'
      })

      if (error) throw error

      setSent(true)
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="p-6 bg-green-50 rounded-2xl text-center">
        <p className="text-green-700 font-bold mb-2">Mensagem enviada!</p>
        <p className="text-green-600 text-sm">Entraremos em contato em breve.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Seu nome"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-sm"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-sm"
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="Seu WhatsApp"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          required
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-sm"
        />
      </div>
      <div>
        <textarea
          placeholder="Mensagem"
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          rows={3}
          required
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        Enviar Mensagem
      </button>
    </form>
  )
}