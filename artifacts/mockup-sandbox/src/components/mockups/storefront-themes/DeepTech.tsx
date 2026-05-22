import React, { useState } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, Activity, Database, Shield, Zap } from 'lucide-react';

export function DeepTech() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#00d4ff] selection:text-[#0d1117] overflow-y-auto">
      <div dangerouslySetInnerHTML={{
        __html: `
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            .font-mono { font-family: 'JetBrains Mono', monospace; }
            .font-sans { font-family: 'Inter', sans-serif; }
            .glow-text-cyan { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
            .glow-text-green { text-shadow: 0 0 10px rgba(57, 255, 20, 0.5); }
            .glow-box-cyan { box-shadow: 0 0 15px rgba(0, 212, 255, 0.2), inset 0 0 10px rgba(0, 212, 255, 0.1); border-color: rgba(0, 212, 255, 0.5); }
            .glow-box-green { box-shadow: 0 0 15px rgba(57, 255, 20, 0.2), inset 0 0 10px rgba(57, 255, 20, 0.1); border-color: rgba(57, 255, 20, 0.5); }
            .grid-bg { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px); }
          </style>
        `
      }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-mono text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00d4ff]" />
                OMNI<span className="text-[#00d4ff]">QURE</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="font-mono text-xs text-[#8b949e] hover:text-[#00d4ff] transition-colors uppercase tracking-widest">Catalog</a>
              <a href="#" className="font-mono text-xs text-[#8b949e] hover:text-[#00d4ff] transition-colors uppercase tracking-widest">Protocols</a>
              <a href="#" className="font-mono text-xs text-[#8b949e] hover:text-[#00d4ff] transition-colors uppercase tracking-widest">Purity Tests</a>
              <a href="#" className="font-mono text-xs text-[#8b949e] hover:text-[#00d4ff] transition-colors uppercase tracking-widest">Research Data</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-[#8b949e] hover:text-[#39ff14] transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#39ff14] text-[#0d1117] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                  0
                </span>
              </button>
              <button className="md:hidden text-[#8b949e]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative border-b border-[#30363d] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1117] z-0"></div>
        <img 
          src="/__mockup/images/deeptech-hero.png" 
          alt="Molecular Network" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-start">
          <div className="inline-flex items-center space-x-2 border border-[#39ff14]/30 bg-[#39ff14]/5 px-3 py-1 rounded-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#39ff14] uppercase tracking-wider">System Status: Nominal // Synthesis Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#39ff14]">Peptide Synthesis</span>
          </h1>
          
          <p className="text-lg text-[#8b949e] max-w-2xl mb-10 font-mono text-sm leading-relaxed">
            > Initializing research protocols.<br/>
            > High-purity reference materials for advanced in-vitro studies.<br/>
            > strictly_not_for_human_consumption.exe
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button className="bg-[#00d4ff] hover:bg-[#00b0d4] text-[#0d1117] font-mono font-bold text-sm px-8 py-4 rounded-sm transition-all flex items-center justify-center glow-box-cyan">
              [ ACCESS CATALOG ] <ChevronRight className="w-4 h-4 ml-2" />
            </button>
            <button className="border border-[#30363d] hover:border-[#8b949e] bg-transparent text-white font-mono text-sm px-8 py-4 rounded-sm transition-all flex items-center justify-center">
              VIEW COA DATA
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="border-b border-[#30363d] bg-[#0d1117] overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 mx-8">
              <span className="font-mono text-xs text-[#8b949e]">HPLC PURITY >99%</span>
              <span className="text-[#30363d]">|</span>
              <span className="font-mono text-xs text-[#39ff14]">MS VERIFIED</span>
              <span className="text-[#30363d]">|</span>
              <span className="font-mono text-xs text-[#00d4ff]">USA SYNTHESIZED</span>
              <span className="text-[#30363d]">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Strip */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-[#30363d] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Featured Syntheses</h2>
            <p className="font-mono text-xs text-[#8b949e]">Target_Compounds // Phase_1</p>
          </div>
          <a href="#" className="font-mono text-xs text-[#00d4ff] hover:underline flex items-center">
            View All Data <ChevronRight className="w-3 h-3 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "BPC-157", desc: "Sequence: Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val", price: "$55.00", img: "deeptech-product1", color: "cyan" },
            { name: "TB-500", desc: "Sequence: Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys", price: "$65.00", img: "deeptech-product2", color: "green" },
            { name: "CJC-1295", desc: "Sequence: Tyr-d-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu", price: "$45.00", img: "deeptech-product3", color: "blue" }
          ].map((product, i) => (
            <div key={i} className="group border border-[#30363d] bg-[#161b22] rounded-sm overflow-hidden hover:border-[#00d4ff] transition-colors relative">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] text-white font-mono text-[10px] px-2 py-1 rounded-sm">
                  5mg
                </span>
              </div>
              <div className="aspect-square bg-[#0d1117] p-8 relative">
                <div className="absolute inset-0 grid-bg opacity-20"></div>
                <img src={`/__mockup/images/${product.img}.png`} alt={product.name} className="w-full h-full object-contain mix-blend-screen relative z-10 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 border-t border-[#30363d]">
                <h3 className="font-mono text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="font-mono text-[10px] text-[#8b949e] mb-4 truncate" title={product.desc}>{product.desc}</p>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-mono text-sm text-[#39ff14]">{product.price}</span>
                  <button className="border border-[#30363d] hover:border-[#00d4ff] hover:text-[#00d4ff] text-[#8b949e] p-2 rounded-sm transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust / Features */}
      <div className="relative border-y border-[#30363d] bg-[#0d1117] overflow-hidden">
        <img 
          src="/__mockup/images/deeptech-trust.png" 
          alt="Data visualization" 
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Activity, title: "Third-Party Tested", desc: "Independent laboratory mass spectrometry analysis." },
              { icon: Shield, title: "Secure Data", desc: "End-to-end encrypted transactions and privacy." },
              { icon: Database, title: "Cold Storage", desc: "Climate-controlled inventory management." },
              { icon: Zap, title: "Rapid Fulfillment", desc: "Same-day dispatch for verified research facilities." }
            ].map((feature, i) => (
              <div key={i} className="border border-[#30363d] bg-[#161b22]/80 backdrop-blur-sm p-6 rounded-sm">
                <feature.icon className="w-8 h-8 text-[#00d4ff] mb-4" />
                <h4 className="font-mono text-sm text-white font-bold mb-2">{feature.title}</h4>
                <p className="font-sans text-sm text-[#8b949e]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0d1117] pt-16 pb-8 border-t border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="font-mono text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#00d4ff]" />
                OMNI<span className="text-[#00d4ff]">QURE</span>
              </span>
              <p className="text-sm text-[#8b949e] font-mono leading-relaxed max-w-md">
                WARNING: The products available on this website are for strictly for in-vitro research purposes only. They are not intended for human consumption, diagnostic, or therapeutic use.
              </p>
            </div>
            
            <div>
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">Lab Results</a></li>
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">Reconstitution Calc</a></li>
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-[#8b949e] hover:text-[#00d4ff] font-sans">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#30363d] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="font-mono text-xs text-[#8b949e] mb-4 md:mb-0">
              © {new Date().getFullYear()} OmniQure Research. All rights reserved.
            </p>
            <div className="font-mono text-[10px] text-[#30363d]">
              v2.0.4-stable // sys.nominal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
