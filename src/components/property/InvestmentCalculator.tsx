'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, Landmark, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CalculatorProps {
  price: number
}

export function InvestmentCalculator({ price }: CalculatorProps) {
  const [entry, setEntry] = useState(price * 0.2)
  const [months, setMonths] = useState(360)
  const [rate, setInterestRate] = useState(9.5) // % per year

  const calculateMonthly = () => {
    const principal = price - entry
    const monthlyRate = (rate / 100) / 12
    const numberOfPayments = months
    
    if (monthlyRate === 0) return principal / numberOfPayments
    
    const monthly = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    return monthly
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-10 overflow-hidden relative group">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[var(--accent)]/10 transition-colors" />

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-[var(--foreground)]">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-serif">Simulador de Ativo</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Projeção Financeira</p>
        </div>
      </div>

      <div className="space-y-8 mb-10">
        {/* Entry */}
        <div>
          <div className="flex justify-between mb-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Entrada</label>
            <span className="text-sm font-mono text-[var(--accent)]">{formatCurrency(entry)}</span>
          </div>
          <input 
            type="range" 
            min={price * 0.1} 
            max={price * 0.8} 
            step={1000}
            value={entry}
            onChange={(e) => setEntry(Number(e.target.value))}
            className="w-full accent-[var(--accent)] bg-[var(--border)] h-1 rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Period */}
        <div>
          <div className="flex justify-between mb-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Prazo</label>
            <span className="text-sm font-mono text-[var(--accent)]">{months / 12} Anos</span>
          </div>
          <input 
            type="range" 
            min={12} 
            max={420} 
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-[var(--accent)] bg-[var(--border)] h-1 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[var(--muted)] rounded-3xl border border-[var(--border)]">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/40 block mb-2">Parcela Mensal</span>
          <p className="text-3xl font-mono tracking-tighter text-[var(--foreground)]">{formatCurrency(calculateMonthly())}</p>
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/40 block mb-2">Taxa de Juros (a.a)</span>
          <p className="text-xl font-mono text-[var(--foreground)]">{rate}%</p>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
        <p className="text-[10px] text-[var(--foreground)]/40 leading-relaxed italic">
          Valores aproximados baseados na tabela Price. Sujeito à análise de crédito e variações bancárias.
        </p>
      </div>
    </div>
  )
}
