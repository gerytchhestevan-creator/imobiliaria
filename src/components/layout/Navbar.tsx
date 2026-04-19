'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (isAdmin) return null

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6',
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#1a1a1a] flex items-center justify-center text-white font-serif text-lg transition-transform group-hover:rotate-12">
            I
          </div>
          <span className={cn(
            "text-lg font-black tracking-[0.2em] uppercase transition-colors",
            isScrolled || pathname !== '/' ? "text-[#1a1a1a]" : "text-white lg:text-[#1a1a1a]" 
          )}>
            Imobi<span className="text-[#c5a059]">2%</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {[
            { label: 'Catálogo', href: '/imoveis' },
            { label: 'Como Funciona', href: '/#como-funciona' },
            { label: 'Vantagens', href: '/#como-funciona' } // Advantages are in the same section for now
          ].map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative group",
                isScrolled || pathname !== '/' ? "text-slate-500 hover:text-[#1a1a1a]" : "text-slate-300 hover:text-white lg:text-slate-500 lg:hover:text-[#1a1a1a]"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c5a059] transition-all group-hover:w-full" />
            </Link>
          ))}
          
          <Link 
            href="/#vender" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-[#1a1a1a] text-white px-6 py-3 hover:bg-[#c5a059] transition-all group"
          >
            Quero Vender
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn(
            "md:hidden p-2 transition-colors",
            isScrolled || pathname !== '/' ? "text-[#1a1a1a]" : "text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-full left-4 right-4 bg-white p-8 shadow-2xl flex flex-col gap-6 md:hidden border border-slate-100 rounded-3xl mt-4"
          >
            <Link href="/imoveis" className="text-sm font-black uppercase tracking-widest text-slate-800">Catálogo</Link>
            <Link href="/#como-funciona" className="text-sm font-black uppercase tracking-widest text-slate-800">Como Funciona</Link>
            <Link href="/#vender" className="w-full py-5 bg-[#1a1a1a] text-white text-center font-bold uppercase tracking-widest text-xs">
              Quero Vender
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
