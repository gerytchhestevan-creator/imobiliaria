import { Hero } from '@/components/sections/Hero'
import { Advantages } from '@/components/sections/Advantages'
import { FeaturedProperties } from '@/components/sections/FeaturedProperties'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Advantages />
      <FeaturedProperties />
      
      {/* Footer / Final CTA */}
      <section id="vender" className="py-32 bg-[#fcfbf9] border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-8 block">Inicie sua venda</span>
            <h2 className="text-5xl md:text-8xl font-serif text-[#1a1a1a] mb-12 leading-none">
              Seu imóvel merece <br /> 
              <span className="italic">esse próximo nível.</span>
            </h2>
            <Link 
              href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20vender%20meu%20imóvel%20com%202%%20de%20comissão."
              className="inline-flex items-center justify-center px-12 py-6 text-xs font-black uppercase tracking-[0.2em] text-white bg-[#1a1a1a] hover:bg-[#c5a059] transition-all shadow-2xl active:scale-95 group"
            >
              Falar com Curador
              <ArrowUpRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-white border-t border-slate-50 text-slate-400">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-[#1a1a1a] flex items-center justify-center text-white font-serif text-lg">
                  I
                </div>
                <span className="text-lg font-black tracking-[0.2em] text-[#1a1a1a] uppercase">
                  Imobi<span className="text-[#c5a059]">2%</span>
                </span>
              </Link>
              <p className="max-w-[240px] text-sm font-light leading-relaxed">
                A nova inteligência para transações imobiliárias de alto padrão.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-20">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Navegação</p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/imoveis" className="hover:text-[#c5a059] transition-colors">Acervo</Link>
                  <Link href="#como-funciona" className="hover:text-[#c5a059] transition-colors">Modelo</Link>
                  <Link href="#vender" className="hover:text-[#c5a059] transition-colors">Venda Conosco</Link>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Legal</p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="#" className="hover:text-[#c5a059] transition-colors">Privacidade</Link>
                  <Link href="#" className="hover:text-[#c5a059] transition-colors">Termos</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-xs font-light">
              © 2026 Imobi2% — Architectural Real Estate Experience.
            </p>
            <p className="text-xs font-light italic">
              Feito com excelência para o mercado local.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button - More Minimal */}
      <Link 
        href="https://wa.me/5511999999999" 
        target="_blank"
        className="fixed bottom-10 right-10 z-50 w-14 h-14 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#c5a059] hover:scale-110 active:scale-90 transition-all group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </Link>
    </main>
  )
}
