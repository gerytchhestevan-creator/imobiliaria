'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--border)] py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-serif text-xl transition-transform group-hover:rotate-12">
            I
          </div>
          <span className={cn(
            "text-xl font-black tracking-[0.2em] uppercase transition-colors",
            isScrolled || pathname !== '/' ? "text-[var(--foreground)]" : "text-white lg:text-[var(--foreground)]"
          )}>
            Imobi<span className="text-[var(--accent)]">2%</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {[
              { label: 'Comprar', href: '/imoveis' },
              { label: 'Vantagens', href: '/#vantagens' }
            ].map((item) => (              <Link 
                key={item.label}
                href={item.href} 
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative group py-2",
                  isScrolled || pathname !== '/' ? "text-[var(--foreground)]/60 hover:text-[var(--foreground)]" : "text-white/80 hover:text-white lg:text-[var(--foreground)]/60 lg:hover:text-[var(--foreground)]"
                )}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-[var(--border)] pl-10">
            <ThemeToggle />
            <a
              href="https://wa.me/5542998332506?text=Olá!%20Quero%20anunciar%20um%20imóvel."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] px-6 py-3.5 hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-all group"
            >
              Anunciar
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "md:hidden p-2 transition-colors",
            isScrolled || pathname !== '/' ? "text-[var(--foreground)]" : "text-white"
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
            className="absolute top-full left-4 right-4 bg-[var(--card)] p-8 shadow-2xl flex flex-col gap-6 md:hidden border border-[var(--border)] rounded-3xl mt-4"
          >
            <Link href="/imoveis" className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Catálogo</Link>
            <div className="flex items-center justify-between">              <span className="text-sm text-[var(--foreground)]/60">Tema</span>
              <ThemeToggle />
            </div>
            <a href="https://wa.me/5542998332506?text=Olá!%20Quero%20anunciar%20um%20imóvel." target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-green-600 text-white text-center font-bold uppercase tracking-widest text-xs">
              Anunciar
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
