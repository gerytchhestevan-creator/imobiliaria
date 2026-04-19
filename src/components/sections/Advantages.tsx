'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, Zap, DollarSign, MoveRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Advantages() {
  return (
    <section id="como-funciona" className="py-32 bg-[#1a1a1a] text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          {/* Left: Content */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6 block">
                Por que somos diferentes
              </span>
              <h2 className="text-5xl md:text-7xl font-serif leading-[0.95] mb-12">
                Uma curadoria que <br />
                <span className="italic">valoriza seu patrimônio.</span>
              </h2>
              
              <div className="space-y-12">
                {/* Item 1 */}
                <div className="group flex gap-6">
                  <span className="text-serif text-3xl text-slate-700 group-hover:text-[#c5a059] transition-colors">01</span>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-3">Auditoria Jurídica 360º</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Não somos apenas uma plataforma. Resolvemos 100% da burocracia, garantindo que sua única preocupação seja assinar a escritura.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="group flex gap-6">
                  <span className="text-serif text-3xl text-slate-700 group-hover:text-[#c5a059] transition-colors">02</span>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-3">Liberdade Contratual</h4>
                    <p className="text-slate-400 font-light leading-relaxed">O mercado tradicional exige exclusividade. Nós exigimos apenas a sua satisfação. Você tem liberdade total para vender como desejar.</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="group flex gap-6">
                  <span className="text-serif text-3xl text-slate-700 group-hover:text-[#c5a059] transition-colors">03</span>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-widest mb-3">O Modelo 2%</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Taxa de sucesso fixa de 2%. Transparência absoluta que economiza recursos que podem ser reinvestidos na sua próxima conquista.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Illustration of Economy */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 order-1 lg:order-2"
          >
            <div className="relative p-12 md:p-16 bg-white/5 border border-white/10 rounded-none backdrop-blur-sm">
              <div className="mb-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#c5a059] mb-4">Simulação de Venda</p>
                <p className="text-4xl font-serif italic text-white leading-tight">A economia que <br /> faz a diferença.</p>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Traditional */}
                <div className="flex items-center justify-between py-6 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Mercado (6%)</span>
                  <span className="text-xl font-mono text-slate-400">R$ 48.000</span>
                </div>

                {/* Imobi2% */}
                <div className="flex items-center justify-between py-10">
                  <div>
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-[#c5a059] block mb-2">Imobi 2%</span>
                    <span className="text-5xl font-serif text-white leading-none">R$ 16.000</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Impacto</span>
                    <span className="text-3xl font-serif italic text-green-400">- R$ 32.000</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-[#c5a059]/10 border border-[#c5a059]/30">
                <p className="text-sm font-light text-slate-200 leading-relaxed italic">
                  "O capital economizado com o modelo 2% é suficiente para realizar toda a reforma do seu novo lar."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
