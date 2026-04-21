import { supabase, isSupabaseConfigured } from './client'

export interface PropertyData {
  id?: string
  title: string
  description: string
  price: number
  property_type: string
  beds: number
  baths: number
  parking_spaces: number
  area_sqm: number
  neighborhood: string
  city?: string
  address?: string
  images?: string[]
  features?: string[]
  status?: string
  owner_name?: string
  owner_phone?: string
  created_at?: string
}

// Mock data for preview when Supabase is not configured
const MOCK_PROPERTIES: PropertyData[] = [
  {
    id: '1',
    title: 'Residência Origami',
    description: 'Elegante residência de alto padrão com design contemporâneo. Localizada em um dos bairros mais nobres da cidade, esta casa oferece amplos espaços integrados, acabamentos em mármore e madeira, e uma área gourmet perfeita para receber.',
    price: 1250000,
    property_type: 'house',
    beds: 3,
    baths: 4,
    parking_spaces: 2,
    area_sqm: 280,
    neighborhood: 'Jardim das Oliveiras',
    images: ['/properties/house-1.png'],
    features: ['Ar Condicionado', 'Churrasqueira', 'Quintal', 'Cozinha Planejada', 'Closet'],
    status: 'active'
  },
  {
    id: '2',
    title: 'Edifício Meridien',
    description: 'Apartamento impecável com vista definitiva para o horizonte. Planta otimizada com acabamento premium. Condomínio com infraestrutura completa: piscina, academia e salão de festas.',
    price: 890000,
    property_type: 'apartment',
    beds: 2,
    baths: 2,
    parking_spaces: 1,
    area_sqm: 95,
    neighborhood: 'Planalto',
    images: ['/properties/apt-1.png'],
    features: ['Vista Privilegiada', 'Piscina', 'Academia', 'Varanda Gourmet'],
    status: 'active'
  },
  {
    id: '3',
    title: 'Casa da Encosta',
    description: 'Maravilhosa casa térrea com amplo terreno. Destaque para a área de lazer privativa com piscina aquecida e deck de madeira.',
    price: 2100000,
    property_type: 'house',
    beds: 4,
    baths: 5,
    parking_spaces: 4,
    area_sqm: 450,
    neighborhood: 'Parque das Nações',
    images: ['/properties/house-2.png'],
    features: ['Piscina Aquecida', 'Energia Solar', 'Escritório', 'Pomar'],
    status: 'active'
  }
]

export async function getProperties(filters?: { type?: string, status?: string }) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using mock data.')
    let filtered = MOCK_PROPERTIES
    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter(p => p.property_type === filters.type)
    }
    return filtered
  }

  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('property_type', filters.type)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'active')
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return data as PropertyData[]
}

export async function getPropertyById(id: string) {
  if (!isSupabaseConfigured) {
    return MOCK_PROPERTIES.find(p => p.id === id) || null
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching property:', error)
    return null
  }

  return data as PropertyData
}

export async function createProperty(property: Omit<PropertyData, 'id'>) {
  if (!isSupabaseConfigured) {
    console.error('Supabase not configured. Operation not allowed.')
    throw new Error('Supabase not configured.')
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()

  if (error) {
    console.error('Error creating property:', error)
    throw error
  }

  return data[0]
}

export async function updateProperty(id: string, updates: Partial<PropertyData>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating property:', error)
    throw error
  }

  return data[0]
}

export async function deleteProperty(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting property:', error)
    throw error
  }

  return true
}

export async function getPendingProperties() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending properties:', error)
    throw error
  }

  return data as PropertyData[]
}

export async function approveProperty(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { data, error } = await supabase
    .from('properties')
    .update({ status: 'active' })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error approving property:', error)
    throw error
  }

  return data[0]
}

export async function rejectProperty(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { data, error } = await supabase
    .from('properties')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error rejecting property:', error)
    throw error
  }

  return data[0]
}

export async function getPropertyStats() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured.')

  const { data: pending } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('status', 'pending')

  const { data: active } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('status', 'active')

  const { data: rejected } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('status', 'rejected')

  return {
    pending: pending?.length || 0,
    active: active?.length || 0,
    rejected: rejected?.length || 0
  }
}
