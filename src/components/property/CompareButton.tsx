'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, X, Check, Loader2 } from 'lucide-react'
import { useCompare } from './CompareProvider'
import { PropertyData } from '@/lib/supabase/properties'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface CompareButtonProps {
  property: PropertyData
}

export function CompareButton({ property }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare()
  const [loading, setLoading] = useState(false)

  const isAdded = isInCompare(property.id)
  const isFull = compareList.length >= 4 && !isAdded

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAdded) {
      removeFromCompare(property.id || '')
    } else if (!isFull) {
      setLoading(true)
      addToCompare(property)
      setTimeout(() => setLoading(false), 500)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || isFull}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isAdded 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Comparando
        </>
      ) : (
        <>
          <ArrowRight className="w-4 h-4" />
          Comparar
        </>
      )}
    </button>
  )
}

export function CompareBar() {
  const { compareList, clearCompare, removeFromCompare } = useCompare()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-4 px-6 z-50 shadow-2xl">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {compareList.length} imóvel{compareList.length > 1 ? 's' : ''} selecionado{compareList.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            {compareList.map(p => (
              <button
                key={p.id}
                onClick={() => removeFromCompare(p.id || '')}
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={clearCompare}
            className="text-sm text-gray-400 hover:text-white"
          >
            Limpar
          </button>
          <Link
            href="/compare"
            className="px-6 py-2 bg-[#c5a059] text-gray-900 font-bold rounded-lg flex items-center gap-2"
          >
            Comparar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}