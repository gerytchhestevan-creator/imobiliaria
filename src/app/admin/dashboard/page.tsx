'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, Search, Edit2, Trash2, 
  Eye, BarChart3, Home, Users, 
  TrendingUp, CheckCircle, Clock, XCircle, Loader2,
  Check, X, Phone, MapPin, Upload
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { 
  getProperties, 
  deleteProperty, 
  type PropertyData,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getPropertyStats
} from '@/lib/supabase/properties'

type Tab = 'pending' | 'active' | 'all'

export default function AdminDashboard() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [stats, setStats] = useState({ pending: 0, active: 0, rejected: 0 })

  useEffect(() => {
    load()
  }, [activeTab])

  async function load() {
    setLoading(true)
    
    const statsData = await getPropertyStats()
    setStats(statsData)

    let data: PropertyData[] = []
    if (activeTab === 'pending') {
      data = await getPendingProperties()
    } else if (activeTab === 'active') {
      data = await getProperties({ status: 'active' })
    } else {
      data = await getProperties({})
    }
    
    setProperties(data)
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    if (confirm('Aprovar este imóvel? Ele ficará visível no site.')) {
      try {
        await approveProperty(id)
        load()
      } catch (err) {
        alert('Erro ao aprovar imóvel.')
      }
    }
  }


  const handleReject = async (id: string) => {
    if (confirm('Rejeitar este imóvel? Ele não ficará visível no site.')) {
      try {
        await rejectProperty(id)
        load()
      } catch (err) {
        alert('Erro ao rejeitar imóvel.')
      }
    }
  }

  const goToEdit = (property: PropertyData) => {
    router.push(`/admin/imoveis/${property.id}/editar`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await deleteProperty(id)
        setProperties(properties.filter(p => p.id !== id))
      } catch (err) {
        alert('Erro ao excluir imóvel.')
      }
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<Clock className="w-6 h-6" />} 
          label="Pendentes" 
          value={stats.pending.toString()} 
          color="orange" 
        />
        <StatCard 
          icon={<CheckCircle className="w-6 h-6" />} 
          label="Ativos" 
          value={stats.active.toString()} 
          color="green" 
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />} 
          label="Visualizações" 
          value="--" 
          color="purple" 
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label="Leads (WA)" 
          value="--" 
          color="blue" 
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[var(--muted)] p-1 rounded-2xl w-fit">
        <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
          Pendentes ({stats.pending})
        </TabButton>
        <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
          Ativos ({stats.active})
        </TabButton>
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          Todos
        </TabButton>
      </div>

      {/* Content */}
      <div className="bg-[var(--card)] rounded-[2rem] border border-[var(--border)] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onApprove={activeTab === 'pending' ? () => handleApprove(property.id!) : undefined}
                onReject={activeTab === 'pending' ? () => handleReject(property.id!) : undefined}
                onDelete={() => handleDelete(property.id!)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <p className="text-[var(--foreground)]/50 text-lg mb-4">
              {activeTab === 'pending' 
                ? 'Nenhum imóvel pendente.' 
                : activeTab === 'active'
                ? 'Nenhum imóvel ativo.'
                : 'Nenhum imóvel cadastrado.'}
            </p>
            <Link 
              href="/admin/imoveis/novo" 
              className="text-[var(--accent)] font-bold hover:underline"
            >
              Cadastrar novo imóvel
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl font-bold text-sm transition-all",
        active 
          ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" 
          : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
      )}
    >
      {children}
    </button>
  )
}

function PropertyCard({ 
  property, 
  onApprove, 
  onReject,
  onDelete 
}: { 
  property: PropertyData
  onApprove?: () => void
  onReject?: () => void
  onDelete: () => void
}) {
  const image = property.images?.[0] || '/placeholder.jpg'

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex">
        {/* Image */}
        <div className="w-32 h-32 bg-[var(--muted)] flex-shrink-0">
          <img src={image} alt={property.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-[var(--foreground)] line-clamp-1">{property.title}</h3>
            <StatusBadge status={property.status || 'pending'} />
          </div>

          <p className="font-black text-[var(--accent)] text-lg mb-2">
            {formatCurrency(property.price)}
          </p>

          <div className="flex items-center gap-2 text-[var(--foreground)]/60 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            {property.neighborhood}
          </div>

          {property.owner_name && (
            <div className="flex items-center gap-2 text-[var(--foreground)]/60 text-sm">
              <Phone className="w-4 h-4" />
              {property.owner_name} • {property.owner_phone}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-[var(--border)]">
        {onApprove && (
          <button 
            onClick={onApprove}
            className="flex-1 py-3 text-green-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
          >
            <Check className="w-4 h-4" />
            Aprovar
          </button>
        )}
        {onReject && (
          <button 
            onClick={onReject}
            className="flex-1 py-3 text-red-500 font-bold text-sm flex items-center justify-center gap-2 border-l border-[var(--border)] hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Rejeitar
          </button>
        )}
        <Link 
          href={`/imoveis/${property.id}`}
          target="_blank"
          className="flex-1 py-3 text-[var(--foreground)]/60 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors"
        >
          <Eye className="w-4 h-4" />
          Ver
        </Link>
        <Link 
          href={`/admin/imoveis/${property.id}/editar`}
          className="flex-1 py-3 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 border-l border-[var(--border)] hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Editar
        </Link>
        <button 
          onClick={onDelete}
          className="flex-1 py-3 text-red-500 font-bold text-sm flex items-center justify-center gap-2 border-l border-[var(--border)] hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  }

  return (
    <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", colorMap[color])}>
        {icon}
      </div>
      <p className="text-[var(--foreground)]/60 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-[var(--foreground)] tracking-tight">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string, icon: React.ReactNode, className: string }> = {
    active: { label: 'Ativo', icon: <CheckCircle className="w-3 h-3" />, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'Pendente', icon: <Clock className="w-3 h-3" />, className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    rejected: { label: 'Rejeitado', icon: <XCircle className="w-3 h-3" />, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    sold: { label: 'Vendido', icon: <XCircle className="w-3 h-3" />, className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  }
  
  const config = map[status] || map.pending

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", config.className)}>
      {config.icon}
      {config.label}
    </span>
  )
}