'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { PropertyData } from '@/lib/supabase/properties'

interface FavoriteContextType {
  favoriteList: PropertyData[]
  addToFavorites: (property: PropertyData) => void
  removeFromFavorites: (id: string) => void
  isInFavorites: (id: string) => boolean
  clearFavorites: () => void
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favoriteList, setFavoriteList] = useState<PropertyData[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('favorite_list')
    if (saved) {
      try {
        setFavoriteList(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorite_list', JSON.stringify(favoriteList))
  }, [favoriteList])

  const addToFavorites = (property: PropertyData) => {
    if (favoriteList.some(p => p.id === property.id)) return
    setFavoriteList([...favoriteList, property])
  }

  const removeFromFavorites = (id: string) => {
    setFavoriteList(favoriteList.filter(p => p.id !== id))
  }

  const isInFavorites = (id: string) => {
    return favoriteList.some(p => p.id === id)
  }

  const clearFavorites = () => {
    setFavoriteList([])
  }

  return (
    <FavoriteContext.Provider value={{ favoriteList, addToFavorites, removeFromFavorites, isInFavorites, clearFavorites }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorite() {
  const context = useContext(FavoriteContext)
  if (!context) {
    throw new Error('useFavorite must be used within FavoriteProvider')
  }
  return context
}