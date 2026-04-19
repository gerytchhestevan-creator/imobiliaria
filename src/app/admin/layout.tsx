'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, LayoutDashboard, PlusCircle, 
  Settings, LogOut, MessageSquare 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Simple auth check for MVP
  const isLoginPage = pathname === '/admin'
  
  if (isLoginPage) return <>{children}</>

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/admin')
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Novo Imóvel', href: '/admin/imoveis/novo', icon: <PlusCircle className="w-5 h-5" /> },
    { label: 'Leads', href: '#', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Configurações', href: '#', icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dynamic Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col hidden lg:flex">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Imobi<span className="text-blue-500">2%</span>
            </span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                  pathname === item.href 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
