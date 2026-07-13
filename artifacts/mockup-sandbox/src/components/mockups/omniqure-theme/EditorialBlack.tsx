import React from "react";
import { Search, ShoppingBag, Menu, ArrowRight, ShieldCheck, Microscope, Award } from "lucide-react";
import "./_editorial.css";

const PRODUCTS = [
  { name: "BPC-157", purity: ">99.8%", weight: "5mg", cas: "137525-51-0", sequence: "L-Valine, glycyl... " },
  { name: "TB-500", purity: ">99.5%", weight: "10mg", cas: "77591-33-4", sequence: "Ac-Ser-Asp-Lys... " },
  { name: "Semaglutide", purity: ">99.9%", weight: "5mg", cas: "910463-68-2", sequence: "His-Aib-Glu-Gly... " },
  { name: "Selank", purity: ">99.2%", weight: "30mg", cas: "129954-34-3", sequence: "Thr-Lys-Pro-Arg... " },
  { name: "PT-141", purity: ">99.7%", weight: "10mg", cas: "189691-06-3", sequence: "Ac-Nle-cyclo... " },
  { name: "CJC-1295", purity: ">99.6%", weight: "2mg", cas: "863288-34-0", sequence: "Tyr-D-Ala-Asp... " },
];

export function EditorialBlack() {
  return (
    <div className="editorial-container w-full selection:bg-[#E8A93E] selection:text-black">
      {/* Announcement Bar */}
      <div className="w-full bg-[#E8A93E] text-black text-xs font-mono py-2 px-4 flex justify-between items-center uppercase tracking-widest">
        <span>Research Purposes Only</span>
        <span className="hidden sm:inline-block">Global Cold-Chain Shipping Available</span>
        <span>ISO-9001 Certified</span>
      </div>

      {/* Header */}
      <header className="w-full border-b border-white/20 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-screen-2xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Menu className="w-6 h-6 hover:text-[#E8A93E] transition-colors cursor-pointer" />
            <Search className="w-5 h-5 hidden sm:block hover:text-[#E8A93E] transition-colors cursor-pointer" />
          </div>
          
          <div className="text-center flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-none">OmniQure</h1>
            <span className="text-[10px] font-mono tracking-[0.3em] editorial-gold uppercase mt-1">Peptide Research Institute</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-sm">
            <span className="hidden md:block hover:text-[#E8A93E] transition-colors cursor-pointer">Account</span>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#E8A93E] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span>(0)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex flex-col justify-center relative overflow-hidden px-6 py-20">
        <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 z-10">
            <p className="font-mono editorial-gold mb-6 tracking-widest text-sm uppercase">HPLC & ESI-MS Verified</p>
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold uppercase leading-[0.85] tracking-tighter mb-8">
              Absolute <br/> <span className="text-white">Synthesis.</span>
            </h2>
            <p className="max-w-xl text-lg sm:text-xl text-gray-400 font-light leading-relaxed mb-12 border-l border-[#E8A93E] pl-6">
              Research-grade peptides synthesized for uncompromising institutional requirements. Every batch double-blind tested for purity above 99%.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <button className="bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-[#E8A93E] transition-colors flex items-center gap-3">
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-white border-b border-white pb-1 font-mono text-sm uppercase tracking-widest hover:text-[#E8A93E] hover:border-[#E8A93E] transition-colors">
                View Latest COAs
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-4 relative h-full min-h-[400px] flex items-center justify-center">
            {/* Abstract representation of a vial/peptide */}
            <div className="w-full aspect-[3/4] border border-white/20 relative flex items-center justify-center p-8 bg-black">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#E8A93E]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#E8A93E]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#E8A93E]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#E8A93E]" />
              
              <div className="w-full h-full border border-white/10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start font-mono text-xs text-gray-500">
                  <span>FIG 1.0</span>
                  <span className="text-right">MZ: 1419.6<br/>RT: 12.4m</span>
                </div>
                <div className="w-full h-1/2 flex items-end gap-1 opacity-50">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-white" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                  ))}
                </div>
                <div className="font-mono text-xs editorial-gold uppercase tracking-widest border-t border-white/20 pt-4 mt-4">
                  Spectrometry Data
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-white/20 bg-black/50 w-full overflow-hidden flex whitespace-nowrap py-6">
        <div className="animate-marquee flex gap-16 px-8 items-center font-mono text-sm uppercase tracking-widest text-gray-400">
          <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 editorial-gold" /> Third-Party Tested</span>
          <span>•</span>
          <span className="flex items-center gap-3"><Microscope className="w-4 h-4 editorial-gold" /> GMP Compliant Facility</span>
          <span>•</span>
          <span className="flex items-center gap-3"><Award className="w-4 h-4 editorial-gold" /> &gt;99% Minimum Purity</span>
          <span>•</span>
          <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 editorial-gold" /> Third-Party Tested</span>
          <span>•</span>
          <span className="flex items-center gap-3"><Microscope className="w-4 h-4 editorial-gold" /> GMP Compliant Facility</span>
          <span>•</span>
          <span className="flex items-center gap-3"><Award className="w-4 h-4 editorial-gold" /> &gt;99% Minimum Purity</span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full py-32 px-6 bg-white text-black">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-4">Research <br/> Compounds</h3>
              <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">Select inventory for immediate dispatch</p>
            </div>
            <button className="font-mono text-sm uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#E8A93E] hover:border-[#E8A93E] transition-colors">
              View All Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/10">
            {PRODUCTS.map((product, idx) => (
              <div key={idx} className="border border-black/10 p-8 sm:p-12 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                <div className="absolute top-8 right-8 font-mono text-xs font-bold text-[#E8A93E] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                  View Data
                </div>
                <div className="font-mono text-xs text-gray-400 mb-8 pb-4 border-b border-black/10">
                  REF: {product.cas}
                </div>
                <h4 className="text-4xl font-bold uppercase tracking-tight mb-2">{product.name}</h4>
                <div className="flex gap-4 mb-12">
                  <span className="font-mono text-sm text-[#E8A93E] font-bold">{product.purity} PURITY</span>
                  <span className="font-mono text-sm text-gray-500">{product.weight}</span>
                </div>
                <div className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-8 break-all">
                  SEQ: {product.sequence}
                </div>
                <button className="w-full border border-black py-4 font-mono text-sm uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                  Add to Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black border-t border-white/20 py-20 px-6">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2">OmniQure</h2>
            <p className="font-mono text-xs editorial-gold uppercase tracking-[0.2em] mb-8">Peptide Research Institute</p>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Supplying premier research institutions globally with highest-grade synthesized peptides.
            </p>
          </div>
          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-6 border-b border-white/20 pb-4">Protocols</h5>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">COA Database</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Reconstitution Guide</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Storage Protocols</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Quality Assurance</li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-6 border-b border-white/20 pb-4">Legal</h5>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-[#E8A93E] transition-colors cursor-pointer">Compliance</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 font-mono">
          <p>FOR RESEARCH PURPOSES ONLY. NOT FOR HUMAN CONSUMPTION.</p>
          <p>© {new Date().getFullYear()} OMNIQURE RESEARCH. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
