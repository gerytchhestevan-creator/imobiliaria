'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MoveRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center bg-[#fcfbf9] overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="absolute right-0 top-0 w-full lg:w-[45%] h-full z-0 lg:z-10 bg-slate-200">
        <Image
          src="/hero-bg.png"
          alt="Luxury Architecture"
          fill
          priority
          className="object-cover object-center grayscale-[20%] sepia-[10%] hover:grayscale-0 transition-all duration-[2s]"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-transparent to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-black/20 lg:hidden block" />
      </div>

      <div className="container relative z-20 px-6 mx-auto">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 text-[10px] md:text-xs font-black tracking-[0.2em] text-[#c5a059] uppercase border border-[#c5a059]/30 rounded-full mb-8">
              <span className="w-1 h-1 bg-[#c5a059] rounded-full animate-pulse" />
              Exclusividade & Economia
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#1a1a1a] mb-8 leading-[0.9] font-serif">
              A nova era do <br />
              <span className="italic font-normal">Real Estate.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl font-light leading-relaxed">
              Venda seu imóvel com curadoria especializada, curadoria jurídica completa e apenas <span className="text-[#1a1a1a] font-medium border-b border-[#c5a059]">2% de comissão</span>. Sem termos de exclusividade.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link
                href="#vender"
                className="group relative px-10 py-5 bg-[#1a1a1a] text-white overflow-hidden transition-all duration-500 rounded-none hover:pl-14"
              >
                <span className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <MoveRight className="w-5 h-5" />
                </span>
                <span className="relative z-10 font-bold uppercase tracking-widest text-xs">Quero Vender</span>
              </Link>
              
              <Link
                href="/imoveis"
                className="group flex items-center gap-4 text-[#1a1a1a] font-bold uppercase tracking-widest text-xs transition-all hover:gap-6"
              >
                Ver Acervo
                <ArrowRight className="w-5 h-5 text-[#c5a059]" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-slate-200 pt-12"
          >
            <div>
              <p className="font-serif text-3xl font-light text-[#1a1a1a]">2%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Fee de Performance</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-light text-[#1a1a1a]">0%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Fidelidade Contratual</p>
            </div>
            <div className="hidden md:block">
              <p className="font-serif text-3xl font-light text-[#1a1a1a]">24/7</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Suporte Jurídico</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
