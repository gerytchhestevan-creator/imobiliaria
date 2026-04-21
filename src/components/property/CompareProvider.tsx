'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { PropertyData } from '@/lib/supabase/properties'

interface CompareContextType {
  compareList: PropertyData[]
  addToCompare: (property: PropertyData) => void
  removeFromCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<PropertyData[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('compare_list')
    if (saved) {
      try {
        setCompareList(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('compare_list', JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (property: PropertyData) => {
    if (compareList.length >= 4) return
    if (compareList.some(p => p.id === property.id)) return
    setCompareList([...compareList, property])
  }

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(p => p.id !== id))
  }

  const isInCompare = (id: string) => {
    return compareList.some(p => p.id === id)
  }

  const clearCompare = () => {
    setCompareList([])
  }

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}