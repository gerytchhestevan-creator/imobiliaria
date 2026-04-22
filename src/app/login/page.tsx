'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    email: 'teste@teste.com',
    password: '123456',
    name: '',
    phone: ''
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.replace('/admin/dashboard')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name, phone: formData.phone }
          }
        })

        if (error) throw error

        if (data.user) {
          alert('Conta criada! Faça login.')
          setIsRegistering(false)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        console.log('Login response:', data, error)

        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl" style={{ position: 'relative', zIndex: 9999 }}>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {isRegistering ? 'Criar Conta' : 'Entrar'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isRegistering ? 'Cadastre-se' : 'Entre'}
        </p>

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 bg-gray-100 rounded-xl mb-3"
            />
            <input
              type="tel"
              placeholder="WhatsApp"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full p-4 bg-gray-100 rounded-xl mb-3"
            />
          </>
        )}

        <input
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full p-4 bg-gray-100 rounded-xl mb-3"
        />

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="w-full p-4 bg-gray-100 rounded-xl mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Criar Conta' : 'Entrar')}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-amber-600 font-medium"
        >
          {isRegistering ? 'Já tem conta? Entre' : 'Não tem conta? Crie uma'}
        </button>
      </form>
    </div>
  )
}