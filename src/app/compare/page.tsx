'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PropertyData } from '@/lib/supabase/properties'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, X, Bed, Bath, Car, Maximize } from 'lucide-react'

interface PropertyItem {
  id?: string
  title: string
  price: number
  neighborhood: string
  area_sqm: number
  beds: number
  baths: number
  parking_spaces: number
  property_type: string
  images?: string[]
}

export default function ComparePage() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('compare_list')
    if (saved) {
      try {
        setProperties(JSON.parse(saved))
      } catch {
        setProperties([])
      }
    }
    setLoading(false)
  }, [])

  const handleRemove = (id: string) => {
    const updated = properties.filter(p => p.id !== id)
    setProperties(updated)
    localStorage.setItem('compare_list', JSON.stringify(updated))
  }

  const handleClear = () => {
    setProperties([])
    localStorage.setItem('compare_list', JSON.stringify([]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nenhum imóvel para comparar</h1>
          <Link href="/imoveis" className="text-amber-600 font-medium hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/imoveis" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Comparar Imóveis</h1>
          <button onClick={handleClear} className="text-gray-500 hover:text-gray-900">
            Limpar tudo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="text-left p-4 bg-gray-100 w-32"></th>
                {properties.map(p => (
                  <th key={p.id} className="text-left p-4 relative align-top">
                    <button
                      onClick={() => handleRemove(p.id || '')}
                      className="absolute top-2 right-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={p.images?.[0] || '/placeholder-property.jpg'}
                      alt={p.title}
                      className="w-full h-32 object-cover rounded-xl mb-4"
                    />
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{p.title}</h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Preço</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-bold text-gray-900">
                    {formatCurrency(p.price)}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Bairro</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 text-gray-900">{p.neighborhood}</td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Área</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 flex items-center gap-2 text-gray-700">
                    <Maximize className="w-4 h-4 text-gray-400" />
                    {p.area_sqm} m²
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Quartos</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 flex items-center gap-2 text-gray-700">
                    <Bed className="w-4 h-4 text-gray-400" />
                    {p.beds}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Banheiros</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 flex items-center gap-2 text-gray-700">
                    <Bath className="w-4 h-4 text-gray-400" />
                    {p.baths}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Vagas</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 flex items-center gap-2 text-gray-700">
                    <Car className="w-4 h-4 text-gray-400" />
                    {p.parking_spaces}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 font-medium text-gray-500">Tipo</td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 text-gray-700 capitalize">{p.property_type}</td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4"></td>
                {properties.map(p => (
                  <td key={p.id} className="p-4">
                    <Link
                      href={`/imoveis/${p.id}`}
                      className="block w-full py-2 text-center bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}