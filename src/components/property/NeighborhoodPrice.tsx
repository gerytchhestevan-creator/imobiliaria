'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { TrendingUp, MapPin } from 'lucide-react'

interface NeighborhoodPriceProps {
  neighborhood: string
}

export function NeighborhoodPrice({ neighborhood }: NeighborhoodPriceProps) {
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!neighborhood) return
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data, error } = await supabase
        .from('properties')
        .select('price')
        .ilike('neighborhood', `%${neighborhood}%`)
        .eq('status', 'active')

      if (error || !data || data.length === 0) {
        setLoading(false)
        return
      }

      const prices = data.map(p => p.price).filter(p => p > 0)
      if (prices.length === 0) {
        setLoading(false)
        return
      }

      setStats({
        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
        min: Math.min(...prices),
        max: Math.max(...prices),
        count: prices.length
      })
      setLoading(false)
    }

    fetchStats()
  }, [neighborhood])

  const format = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) return null

  if (!stats.count) return null

  return (
    <div className="p-6 bg-gray-50 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-500" />
        <span className="font-bold text-gray-900">Valores no bairro</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Média</p>
          <p className="font-bold text-gray-900">{format(stats.avg)}</p>
        </div>
        <div>
          <p className="text-gray-500">Anúncios</p>
          <p className="font-bold text-gray-900">{stats.count}</p>
        </div>
        <div>
          <p className="text-gray-500">Menor</p>
          <p className="font-bold text-gray-900">{format(stats.min)}</p>
        </div>
        <div>
          <p className="text-gray-500">Maior</p>
          <p className="font-bold text-gray-900">{format(stats.max)}</p>
        </div>
      </div>
    </div>
  )
}