'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, Upload, Save, Loader2, Trash2 } from 'lucide-react'
import { getPropertyById, updateProperty, type PropertyData } from '@/lib/supabase/properties'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getPropertyById(id as string)
      if (data) {
        setProperty(data)
        setImages(data.images || [])
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImg = Array.from(files).map(file => URL.createObjectURL(file))
      setNewImages(prev => [...prev, ...newImg])
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
  }

  const removeNewImage = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index)
    setNewImages(updated)
  }

  const handleSave = async () => {
    if (!property?.id) return
    setSaving(true)

    try {
      const allImages = [...images, ...newImages]
      await updateProperty(property.id, { images: allImages })
      alert('Fotos atualizadas!')
      router.push('/admin/dashboard')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Imóvel não encontrado</p>
      </div>
    )
  }

  const allImages = [...images, ...newImages]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Editar Fotos</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold mb-2">{property.title}</h2>
          <p className="text-gray-500">{property.neighborhood}</p>
        </div>

        {/* Current Photos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">Fotos atuais ({images.length})</h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img 
                    src={img} 
                    alt={`Foto ${i + 1}`} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Nenhuma foto cadastrada</p>
          )}
        </div>

        {/* Add New Photos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">Adicionar novas fotos ({newImages.length})</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {newImages.map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img 
                  src={img} 
                  alt={`Nova ${i + 1}`} 
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => removeNewImage(i)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-300" />
              <span className="text-xs text-gray-400 mt-2">Adicionar</span>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar alterações
        </button>
      </div>
    </div>
  )
}