import React, { useState } from "react";
import { 
  ShoppingCart, 
  Menu, 
  Search, 
  Beaker, 
  ShieldCheck, 
  Microscope, 
  ArrowRight, 
  Activity, 
  ChevronRight, 
  X,
  FileText
} from "lucide-react";

export function ClinicalWhite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const THEME = {
    bg: "bg-white",
    text: "text-slate-900",
    textMuted: "text-slate-500",
    accent: "text-[#1a3a6b]",
    accentBg: "bg-[#1a3a6b]",
    border: "border-slate-200",
    fontMain: "font-['Inter',sans-serif]",
    fontMono: "font-['JetBrains_Mono',monospace]",
  };

  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} ${THEME.fontMain} overflow-y-auto w-full`}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      
      {/* Disclaimer Bar */}
      <div className={`w-full ${THEME.accentBg} text-white text-center py-2 px-4 text-xs tracking-widest uppercase ${THEME.fontMono} font-medium`}>
        Notice: All products are for strictly laboratory research purposes only. Not for human consumption.
      </div>

      {/* Navigation */}
      <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b ${THEME.border}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Activity className={`w-6 h-6 ${THEME.accent}`} />
              <span className={`text-xl font-semibold tracking-tight ${THEME.accent}`}>OMNIQURE</span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className={`hover:${THEME.accent} transition-colors`}>PEPTIDES</a>
              <a href="#" className={`hover:${THEME.accent} transition-colors`}>AMINO ACIDS</a>
              <a href="#" className={`hover:${THEME.accent} transition-colors`}>LAB SUPPLIES</a>
              <a href="#" className={`hover:${THEME.accent} transition-colors`}>COA REPORTS</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-900 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${THEME.accentBg} text-white text-[9px] flex items-center justify-center font-bold`}>2</span>
            </button>
            <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-6 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Activity className={`w-6 h-6 ${THEME.accent}`} />
              <span className={`text-xl font-semibold tracking-tight ${THEME.accent}`}>OMNIQURE</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6 text-slate-900" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <a href="#" className="border-b border-slate-100 pb-4 flex justify-between items-center">
              PEPTIDES <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
            <a href="#" className="border-b border-slate-100 pb-4 flex justify-between items-center">
              AMINO ACIDS <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
            <a href="#" className="border-b border-slate-100 pb-4 flex justify-between items-center">
              LAB SUPPLIES <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
            <a href="#" className="border-b border-slate-100 pb-4 flex justify-between items-center">
              COA REPORTS <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 border ${THEME.border} text-xs font-medium uppercase tracking-wider mb-8 text-[#1a3a6b]`}>
              <span className="w-2 h-2 rounded-full bg-[#1a3a6b] animate-pulse"></span>
              ISO 9001:2015 Certified Lab
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Precision Peptides for <br className="hidden md:block"/>
              <span className="text-slate-400">Advanced Research.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
              Synthesized in USA-based facilities using solid-phase peptide synthesis. Guaranteed {'>'}99% purity by HPLC and MS analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className={`${THEME.accentBg} text-white px-8 py-4 text-sm font-medium hover:bg-[#122a4d] transition-colors flex items-center justify-center gap-2`}>
                SHOP CATALOG <ArrowRight className="w-4 h-4" />
              </button>
              <button className={`bg-white text-slate-900 border ${THEME.border} px-8 py-4 text-sm font-medium hover:border-slate-400 transition-colors flex items-center justify-center gap-2`}>
                VIEW COA REPORTS <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white/50 z-10`}></div>
            <div className={`aspect-[4/3] border ${THEME.border} p-2 bg-slate-50`}>
              <img 
                src="/__mockup/images/clinical-hero.png" 
                alt="Laboratory research environment" 
                className="w-full h-full object-cover grayscale-[20%]"
              />
            </div>
            
            {/* Floating Lab Data Card */}
            <div className={`absolute -bottom-6 -left-6 bg-white border ${THEME.border} p-6 shadow-xl z-20 w-72`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs ${THEME.fontMono} text-slate-500 uppercase tracking-widest`}>Batch MS/HPLC</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-700">Purity Level</span>
                  <span className={`${THEME.fontMono} text-lg text-[#1a3a6b]`}>99.4%</span>
                </div>
                <div className="w-full h-1 bg-slate-100">
                  <div className={`h-full ${THEME.accentBg} w-[99.4%]`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`py-24 border-y ${THEME.border} bg-slate-50/50`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Research Grade Compounds</h2>
              <p className="text-slate-500">Lyophilized preparation. Sterile filtered.</p>
            </div>
            <a href="#" className={`text-sm font-medium ${THEME.accent} hover:underline hidden md:block`}>
              View Full Catalog →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "BPC-157",
                name: "BPC-157",
                variant: "Arg Salt",
                price: "$65.00",
                purity: "99.8%",
                seq: "L-Valine, glycyl-L-a-glutamyl...",
                img: "/__mockup/images/clinical-vial-1.png"
              },
              {
                id: "TB-500",
                name: "TB-500",
                variant: "Thymosin Beta-4",
                price: "$75.00",
                purity: "99.2%",
                seq: "Ac-Ser-Asp-Lys-Pro-Asp...",
                img: "/__mockup/images/clinical-vial-2.png"
              },
              {
                id: "CJC-1295",
                name: "CJC-1295",
                variant: "No DAC",
                price: "$55.00",
                purity: "99.5%",
                seq: "Tyr-d-Ala-Asp-Ala-Ile-Phe...",
                img: "/__mockup/images/clinical-vial-3.png"
              }
            ].map((product, idx) => (
              <div key={idx} className={`bg-white border ${THEME.border} group hover:border-[#1a3a6b]/30 transition-colors`}>
                <div className={`aspect-square p-8 border-b ${THEME.border} flex items-center justify-center bg-slate-50/50 relative overflow-hidden`}>
                  <img src={product.img} alt={product.name} className="w-48 h-48 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-4 right-4 text-[10px] ${THEME.fontMono} uppercase tracking-widest text-slate-400`}>
                    SKU: {product.id}-{idx}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-slate-500">{product.variant}</p>
                    </div>
                    <span className={`${THEME.fontMono} text-lg font-medium`}>{product.price}</span>
                  </div>
                  
                  <div className={`mt-6 space-y-2 py-4 border-t ${THEME.border} text-xs text-slate-500 ${THEME.fontMono}`}>
                    <div className="flex justify-between">
                      <span>Purity (HPLC):</span>
                      <span className="text-[#1a3a6b] font-medium">{product.purity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Form:</span>
                      <span>Lyophilized</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span>Seq:</span>
                      <span className="truncate ml-4">{product.seq}</span>
                    </div>
                  </div>

                  <button className={`w-full mt-4 bg-transparent border ${THEME.border} text-slate-900 py-3 text-sm font-medium hover:bg-slate-50 transition-colors uppercase tracking-wider`}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-b border-slate-200 py-16">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 border ${THEME.border}`}>
                <Microscope className={`w-8 h-8 ${THEME.accent}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Third-Party Tested</h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Every batch is independently verified via HPLC and Mass Spectrometry by Janoshik or MZ Biolabs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 border ${THEME.border}`}>
                <Beaker className={`w-8 h-8 ${THEME.accent}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3">US Synthesized</h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Manufactured in ISO-certified US facilities strictly following laboratory synthesis protocols.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 border ${THEME.border}`}>
                <ShieldCheck className={`w-8 h-8 ${THEME.accent}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Cold Chain Storage</h3>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Stored at precise temperatures to prevent degradation before shipment in insulated packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-6 h-6 text-white" />
                <span className="text-xl font-semibold tracking-tight text-white">OMNIQURE</span>
              </div>
              <p className="max-w-md mb-6 text-slate-400">
                Premium peptide synthesis and laboratory research compounds. 
                Providing scientists and researchers with precisely measured, ultra-high purity materials.
              </p>
              <div className={`text-xs ${THEME.fontMono} border border-slate-700 p-4 bg-slate-800/50 text-slate-300 max-w-md`}>
                <span className="text-red-400 font-bold">WARNING:</span> The products on this website are intended for laboratory research purposes only. They are not intended for human consumption, diagnostic, therapeutic, or agricultural use.
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Products</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Peptides Catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Amino Acids</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lab Equipment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bulk Synthesis</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-xs">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">COA Verification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Storage Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${THEME.fontMono}`}>
            <p>© {new Date().getFullYear()} OmniQure Laboratories. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Shipping</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
