import React from 'react';
import { ShoppingCart, Menu, Search, Beaker, ShieldCheck, Activity, ArrowRight, Star } from 'lucide-react';
import './_navy.css';

const products = [
  { id: 1, name: 'BPC-157', desc: 'Pentadecapeptide, 5mg', price: '$45.00', purity: '>99.4%' },
  { id: 2, name: 'TB-500', desc: 'Thymosin Beta-4, 5mg', price: '$55.00', purity: '>99.2%' },
  { id: 3, name: 'Semaglutide', desc: 'GLP-1 Analogue, 3mg', price: '$85.00', purity: '>99.5%' },
  { id: 4, name: 'Selank', desc: 'Tuftsin Analogue, 5mg', price: '$40.00', purity: '>99.1%' },
  { id: 5, name: 'PT-141', desc: 'Bremelanotide, 10mg', price: '$50.00', purity: '>99.6%' },
  { id: 6, name: 'CJC-1295', desc: 'No DAC, 2mg', price: '$35.00', purity: '>99.3%' },
];

export function DeepNavy() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-300 font-sans selection:bg-[#00E5FF] selection:text-[#0A0F1E]">
      {/* Announcement Bar */}
      <div className="bg-[#00E5FF]/10 border-b border-[#00E5FF]/20 text-[#00E5FF] text-sm py-2 text-center font-medium tracking-wide">
        RESEARCH PURPOSES ONLY. FREE SHIPPING ON DOMESTIC ORDERS OVER $200.
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu className="w-6 h-6 text-slate-300 hover:text-[#00E5FF] cursor-pointer transition-colors" />
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Beaker className="w-6 h-6 text-[#00E5FF]" />
              OMNIQURE <span className="text-[#00E5FF] font-light">RESEARCH</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-white hover:text-[#00E5FF] transition-colors">Peptides</a>
            <a href="#" className="hover:text-[#00E5FF] transition-colors">Lab Equipment</a>
            <a href="#" className="hover:text-[#00E5FF] transition-colors">Protocols</a>
            <a href="#" className="hover:text-[#00E5FF] transition-colors">COA Testing</a>
          </nav>

          <div className="flex items-center gap-6">
            <Search className="w-5 h-5 hover:text-[#00E5FF] cursor-pointer transition-colors" />
            <div className="relative">
              <ShoppingCart className="w-5 h-5 hover:text-[#00E5FF] cursor-pointer transition-colors" />
              <span className="absolute -top-2 -right-2 bg-[#00E5FF] text-[#0A0F1E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00E5FF]/5 via-[#0A0F1E] to-[#0A0F1E] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-semibold mb-8">
            <Activity className="w-4 h-4" /> BATCH 424 NOW AVAILABLE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            Precision Research <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500">Uncompromised.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Synthesized under strict laboratory conditions. HPLC and ESI-MS verified purity exceeding 99%. Engineered for independent researchers demanding absolute consistency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#00E5FF] text-[#0A0F1E] px-8 py-4 rounded-md font-bold tracking-wide hover:bg-white transition-all flex items-center gap-2">
              BROWSE CATALOG <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-slate-800/50 border border-slate-700 text-white px-8 py-4 rounded-md font-bold tracking-wide hover:bg-slate-800 hover:border-slate-600 transition-all">
              VIEW LAB RESULTS
            </button>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="border-y border-slate-800 bg-[#0A0F1E]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Verified Purity', value: '>99%' },
            { label: 'Quality Control', value: '3-Tier' },
            { label: 'Active Researchers', value: '10,000+' },
            { label: 'Same-Day Dispatch', value: '24h' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Research Compounds</h2>
            <p className="text-slate-400">High-purity lyophilized peptides for laboratory use.</p>
          </div>
          <a href="#" className="hidden md:flex text-[#00E5FF] font-medium items-center gap-1 hover:text-white transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-[#00E5FF]/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-[#0A0F1E] border border-slate-800 text-xs px-2 py-1 rounded text-slate-400 font-mono">
                  {product.purity}
                </div>
              </div>
              <div className="h-48 w-full bg-slate-900/50 rounded-lg mb-6 flex items-center justify-center border border-slate-800/50 group-hover:border-[#00E5FF]/20 transition-colors">
                <Beaker className="w-12 h-12 text-slate-700 group-hover:text-[#00E5FF]/40 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-slate-400 mb-6">{product.desc}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#00E5FF]">{product.price}</span>
                <button className="bg-slate-800 text-white px-4 py-2 rounded font-medium hover:bg-[#00E5FF] hover:text-[#0A0F1E] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-slate-800 py-24 bg-gradient-to-b from-[#0A0F1E] to-[#0A0F1E]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-16 h-16 text-[#00E5FF] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Uncompromising Quality Assurance</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12">
            Every batch undergoes rigorous third-party testing via High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry. COA documents are available for all compounds.
          </p>
          <div className="flex justify-center gap-4 text-sm font-mono text-slate-500">
            <span>HPLC-VERIFIED</span>
            <span>•</span>
            <span>ESI-MS CERTIFIED</span>
            <span>•</span>
            <span>ISO 9001:2015</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-16 pb-8 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
              <Beaker className="w-6 h-6 text-[#00E5FF]" />
              OMNIQURE <span className="text-[#00E5FF] font-light">RESEARCH</span>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Supplying the global scientific community with highest-purity research peptides. All products are strictly for laboratory research and development purposes only.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Catalog</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-[#00E5FF]">All Peptides</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Lab Supplies</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Bulk Orders</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Testing Results</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-[#00E5FF]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Return Policy</a></li>
              <li><a href="#" className="hover:text-[#00E5FF]">Shipping Info</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-600 border-t border-slate-800 pt-8">
          <p className="mb-2 uppercase tracking-widest text-[#00E5FF]/50 font-bold">WARNING: NOT FOR HUMAN CONSUMPTION</p>
          <p>© 2025 OmniQure Peptide Research Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
