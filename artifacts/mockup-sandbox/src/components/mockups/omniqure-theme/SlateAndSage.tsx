import React from 'react';
import { ShoppingCart, Search, Menu, ChevronRight, ShieldCheck, Microscope, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import './_sage.css';

const products = [
  { name: 'BPC-157', dose: '10mg', price: '$45.00', purity: '>99.4%', status: 'In Stock' },
  { name: 'TB-500', dose: '5mg', price: '$40.00', purity: '>99.2%', status: 'In Stock' },
  { name: 'Semaglutide', dose: '5mg', price: '$120.00', purity: '>99.8%', status: 'Low Stock' },
  { name: 'Selank', dose: '5mg', price: '$35.00', purity: '>99.1%', status: 'In Stock' },
  { name: 'PT-141', dose: '10mg', price: '$40.00', purity: '>99.5%', status: 'In Stock' },
  { name: 'CJC-1295', dose: '5mg', price: '$45.00', purity: '>99.3%', status: 'In Stock' },
];

export function SlateAndSage() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1C2333] font-sans selection:bg-[#5C7A5C] selection:text-white">
      {/* Announcement Bar */}
      <div className="bg-[#5C7A5C] text-white text-xs md:text-sm py-2 px-4 text-center tracking-wide font-medium">
        Free priority shipping on research orders over $150. All batches COA verified.
      </div>

      {/* Header */}
      <header className="border-b border-[#5C7A5C]/20 bg-[#F8F5F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <Menu className="w-6 h-6 text-[#1C2333]" />
          </div>
          
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#1C2333]">
              OmniQure
              <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-[#5C7A5C] font-sans font-medium mt-0.5">
                Peptide Research Institute
              </span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1C2333]/80">
            <a href="#" className="hover:text-[#5C7A5C] transition-colors">Catalog</a>
            <a href="#" className="hover:text-[#5C7A5C] transition-colors">Protocols</a>
            <a href="#" className="hover:text-[#5C7A5C] transition-colors">Quality Control</a>
            <a href="#" className="hover:text-[#5C7A5C] transition-colors">About Us</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="text-[#1C2333] hover:text-[#5C7A5C] transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-[#1C2333] hover:text-[#5C7A5C] transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#D9A05B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#5C7A5C]/30 rounded-full text-xs font-semibold uppercase tracking-wider text-[#5C7A5C] mb-6 bg-white/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D9A05B]"></span>
              Research Grade Synthetics
            </div>
            <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-[#1C2333]">
              Precision in every synthesis.
            </h2>
            <p className="text-lg md:text-xl text-[#1C2333]/70 mb-10 leading-relaxed font-light">
              Elevate your research with >99% pure, third-party verified peptides. Backed by rigorous HPLC and ESI-MS analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="sage-btn bg-[#1C2333] text-white px-8 py-4 rounded-sm font-medium flex items-center justify-center gap-2 hover:bg-[#2A344A]">
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
              <button className="sage-btn bg-transparent border border-[#1C2333] text-[#1C2333] px-8 py-4 rounded-sm font-medium flex items-center justify-center hover:bg-[#1C2333]/5">
                View Lab Results
              </button>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px] bg-[#E8EBE8] rounded-sm overflow-hidden flex items-center justify-center">
            {/* Abstract representation of a clean lab/vial since we don't have an image */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#5C7A5C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 w-64 h-80 bg-white shadow-2xl rounded-sm border border-[#5C7A5C]/10 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-24 border-2 border-[#1C2333] rounded-b-xl rounded-t-sm relative mb-6">
                <div className="absolute bottom-0 w-full h-1/3 bg-[#5C7A5C]/20 rounded-b-xl"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#D9A05B] rounded-sm"></div>
              </div>
              <div className="font-playfair text-xl font-bold text-[#1C2333] mb-1">BPC-157</div>
              <div className="text-xs text-[#5C7A5C] font-mono tracking-widest">SEQ: 124-41-3</div>
              <div className="mt-4 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C2333]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C7A5C]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A05B]"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Strip */}
      <section className="border-y border-[#5C7A5C]/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#5C7A5C]/20">
            <div className="flex flex-col items-center p-4">
              <ShieldCheck className="w-8 h-8 text-[#5C7A5C] mb-4" />
              <h3 className="font-playfair text-xl font-bold mb-2">Third-Party Tested</h3>
              <p className="text-sm text-[#1C2333]/70">Every batch is verified via HPLC & ESI-MS for >99% purity.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Microscope className="w-8 h-8 text-[#5C7A5C] mb-4" />
              <h3 className="font-playfair text-xl font-bold mb-2">Research Grade</h3>
              <p className="text-sm text-[#1C2333]/70">Synthesized in ISO-certified facilities for exact precision.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Award className="w-8 h-8 text-[#5C7A5C] mb-4" />
              <h3 className="font-playfair text-xl font-bold mb-2">COA Available</h3>
              <p className="text-sm text-[#1C2333]/70">Transparent reporting with downloadable certificates of analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-playfair text-4xl font-bold text-[#1C2333] mb-4">Featured Compounds</h2>
            <p className="text-[#1C2333]/70 max-w-2xl">Discover our most requested peptides, synthesized for uncompromised research integrity.</p>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#5C7A5C] font-medium hover:text-[#1C2333] transition-colors border-b border-transparent hover:border-[#1C2333] pb-1">
            View full catalog <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.name} className="sage-card bg-white p-6 rounded-sm border border-[#5C7A5C]/15 group">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-sm ${product.status === 'In Stock' ? 'bg-[#5C7A5C]/10 text-[#5C7A5C]' : 'bg-[#D9A05B]/10 text-[#D9A05B]'}`}>
                  {product.status}
                </span>
                <div className="flex gap-1">
                  <span className="text-[10px] font-mono bg-[#F8F5F0] px-1.5 py-0.5 rounded text-[#1C2333]/60">COA</span>
                  <span className="text-[10px] font-mono bg-[#F8F5F0] px-1.5 py-0.5 rounded text-[#1C2333]/60">HPLC</span>
                </div>
              </div>
              
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-32 border-2 border-[#1C2333]/10 rounded-b-xl rounded-t-sm relative bg-[#F8F5F0]/50 group-hover:border-[#5C7A5C]/30 transition-colors">
                  <div className="absolute bottom-0 w-full h-1/4 bg-[#5C7A5C]/10 rounded-b-xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-white border border-[#1C2333]/10 shadow-sm flex items-center justify-center">
                    <span className="text-[8px] font-mono font-bold text-[#1C2333]">{product.name}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-playfair text-2xl font-bold text-[#1C2333] mb-1">{product.name}</h3>
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className="text-[#1C2333]/70">{product.dose}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D9A05B]"></span>
                  <span className="text-[#5C7A5C] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Purity {product.purity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#5C7A5C]/10">
                  <span className="text-xl font-medium text-[#1C2333]">{product.price}</span>
                  <button className="bg-[#F8F5F0] text-[#1C2333] hover:bg-[#5C7A5C] hover:text-white p-2 rounded-sm transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C2333] text-white pt-20 pb-10 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-playfair text-2xl font-bold tracking-tight text-white mb-4">
              OmniQure
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Advancing scientific discovery through uncompromising purity and precision synthesis of research peptides.
            </p>
            <div className="text-xs text-[#D9A05B] uppercase tracking-wider font-semibold">
              Research Use Only
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4 text-white/90">Catalog</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">All Peptides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lab Equipment</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4 text-white/90">Resources</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Quality Control</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Verify COA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Protocols</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4 text-white/90">Newsletter</h4>
            <p className="text-sm text-white/60 mb-4">Subscribe for research updates and new synthesis releases.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-white/10 border border-white/20 text-white px-4 py-2 w-full text-sm focus:outline-none focus:border-[#5C7A5C]" />
              <button className="bg-[#5C7A5C] px-4 py-2 text-white hover:bg-[#4A634A] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} OmniQure Peptide Research Institute. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Return Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
