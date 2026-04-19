'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, Search, Edit2, Trash2, 
  Eye, BarChart3, Home, Users, 
  TrendingUp, CheckCircle, Clock, XCircle, Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { getProperties, deleteProperty, type PropertyData } from '@/lib/supabase/properties'

export default function AdminDashboard() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const data = await getProperties({ status: 'active' }) // Or fetch all for admin
    setProperties(data)
    setLoading(false)
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
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Home className="w-6 h-6" />} label="Imóveis Ativos" value={loading ? "..." : properties.length.toString()} color="blue" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Visualizações" value="--" color="purple" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Leads (WA)" value="--" color="green" />
        <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Conversão" value="--" color="orange" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Meus Imóveis</h1>
          <p className="text-slate-500 font-medium">Gerencie o status e informações das suas listagens.</p>
        </div>
        
        <Link 
          href="/admin/imoveis/novo"
          className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Novo Imóvel
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Imóvel</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Preço</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-900 block">{property.title}</span>
                      <span className="text-xs text-slate-400 font-medium truncate max-w-[200px] block">{property.id}</span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900">
                      {formatCurrency(property.price)}
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={property.status || 'active'} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <Link href={`/imoveis/${property.id}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all shadow-sm">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => property.id && handleDelete(property.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-slate-400 text-lg">Nenhum imóvel cadastrado no Supabase.</p>
            <Link href="/admin/imoveis/novo" className="text-blue-600 font-bold mt-2 hover:underline">
              Cadastrar o primeiro imóvel
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", colorMap[color])}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, any> = {
    active: { label: 'Ativo', icon: <CheckCircle className="w-3 h-3" />, className: 'bg-green-100 text-green-700' },
    sold: { label: 'Vendido', icon: <XCircle className="w-3 h-3" />, className: 'bg-slate-100 text-slate-500' },
    paused: { label: 'Pausado', icon: <Clock className="w-3 h-3" />, className: 'bg-orange-100 text-orange-700' },
  }
  
  const config = map[status] || map.active

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", config.className)}>
      {config.icon}
      {config.label}
    </span>
  )
}
