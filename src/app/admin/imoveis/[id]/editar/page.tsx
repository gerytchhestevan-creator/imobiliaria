'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Upload, Save, Loader2, Trash2 } from 'lucide-react'
import { getPropertyById, updateProperty, uploadPropertyImage, type PropertyData } from '@/lib/supabase/properties'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<Partial<PropertyData>>({})

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getPropertyById(id as string)
      if (data) {
        setProperty(data)
        setImages(data.images || [])
        setFormData(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setNewImageFiles(prev => [...prev, ...Array.from(files)])
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
  }

  const removeNewImage = (index: number) => {
    const updated = newImageFiles.filter((_, i) => i !== index)
    setNewImageFiles(updated)
  }

  const handleSave = async () => {
    if (!property?.id) return
    setSaving(true)

    try {
      const uploadedUrls: string[] = []
      for (const file of newImageFiles) {
        const url = await uploadPropertyImage(file, property.id)
        uploadedUrls.push(url)
      }
      const allImages = [...images, ...uploadedUrls]
      
      await updateProperty(property.id, { 
        ...formData,
        images: allImages 
      })
      
      alert('Imóvel atualizado com sucesso!')
      router.push('/admin/dashboard')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar: ' + (err as Error).message)
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
          <h1 className="text-2xl font-bold">Editar Anúncio</h1>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
          <h3 className="font-bold mb-4">Informações Básicas</h3>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Título do Anúncio</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Descrição</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Preço (R$)</label>
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Tipo de Imóvel</label>
              <select
                name="property_type"
                value={formData.property_type || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              >
                <option value="house">Casa</option>
                <option value="apartment">Apartamento</option>
                <option value="land">Terreno</option>
                <option value="commercial">Comercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">Especificações</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Quartos</label>
              <input
                type="number"
                name="beds"
                value={formData.beds || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Banheiros</label>
              <input
                type="number"
                name="baths"
                value={formData.baths || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Vagas</label>
              <input
                type="number"
                name="parking_spaces"
                value={formData.parking_spaces || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Área (m²)</label>
              <input
                type="number"
                name="area_sqm"
                value={formData.area_sqm || 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">Localização</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Bairro</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Cidade</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
              />
            </div>
          </div>
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
          <h3 className="font-bold mb-4">Adicionar novas fotos ({newImageFiles.length})</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {newImageFiles.map((file, i) => (
              <div key={i} className="relative aspect-square">
                <img 
                  src={URL.createObjectURL(file)} 
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
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}
