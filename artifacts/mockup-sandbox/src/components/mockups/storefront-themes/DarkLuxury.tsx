import React from "react";

import { ShoppingCart, Menu, ChevronRight, Shield, Beaker, Zap, ArrowRight, Star } from "lucide-react";

export function DarkLuxury() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans overflow-x-hidden selection:bg-[#c9a84c]/30">
      <div dangerouslySetInnerHTML={{
        __html: `
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
          <style>
            .font-serif { font-family: 'Playfair Display', serif; }
            .font-sans { font-family: 'Inter', sans-serif; }
            .gold-gradient {
              background: linear-gradient(135deg, #c9a84c 0%, #a67c00 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .gold-border {
              border-image: linear-gradient(135deg, #c9a84c 0%, #a67c00 100%) 1;
            }
            .nav-link {
              position: relative;
            }
            .nav-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 1px;
              bottom: -4px;
              left: 0;
              background-color: #c9a84c;
              transition: width 0.3s ease;
            }
            .nav-link:hover::after {
              width: 100%;
            }
          </style>
        `
      }} />

      {/* Top Banner */}
      <div className="bg-black border-b border-white/5 py-2 px-4 text-center text-xs tracking-widest text-[#c9a84c]/80 uppercase">
        Research Purposes Only • Not For Human Consumption
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="font-serif text-2xl tracking-wide text-white">
              OMNI<span className="text-[#c9a84c]">QURE</span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase text-white/70">
              <a href="/peptides" className="nav-link hover:text-white transition-colors">Peptides</a>
              <a href="/stacks" className="nav-link hover:text-white transition-colors">Stacks</a>
              <a href="/about" className="nav-link hover:text-white transition-colors">Lab Results</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white/70 hover:text-[#c9a84c] transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="md:hidden text-white/70 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/dark-luxury-hero.png" 
            alt="Abstract dark luxury background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#c9a84c]"></div>
              <span className="text-[#c9a84c] tracking-[0.2em] text-sm uppercase font-medium">Exceptional Purity</span>
            </div>
            <h1 className="font-serif text-6xl md:text-7xl leading-[1.1] mb-8 text-white">
              The Pinnacle of <br />
              <span className="italic text-white/80">Peptide</span> Research
            </h1>
            <p className="text-lg text-white/60 mb-10 font-light leading-relaxed max-w-xl">
              Uncompromising quality for precise scientific outcomes. Our synthesised compounds undergo rigorous third-party HPLC and MS testing to guarantee ≥99% purity.
            </p>
            <div className="flex items-center gap-6">
              <button className="bg-[#c9a84c] text-black px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors duration-300 flex items-center gap-2">
                Explore Catalog
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="border border-white/20 text-white px-8 py-4 uppercase tracking-widest text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors duration-300">
                View Lab Results
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="border-y border-white/5 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center text-center px-6">
              <Shield className="w-8 h-8 text-[#c9a84c] mb-4 stroke-1" />
              <h3 className="font-serif text-xl text-white mb-2">Verified Purity</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">Every batch is independently tested to exceed 99% purity standards, with verifiable COAs.</p>
            </div>
            <div className="flex flex-col items-center text-center px-6 pt-12 md:pt-0">
              <Beaker className="w-8 h-8 text-[#c9a84c] mb-4 stroke-1" />
              <h3 className="font-serif text-xl text-white mb-2">Synthesised Precision</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">Manufactured in ISO-certified facilities utilizing state-of-the-art solid-phase synthesis.</p>
            </div>
            <div className="flex flex-col items-center text-center px-6 pt-12 md:pt-0">
              <Zap className="w-8 h-8 text-[#c9a84c] mb-4 stroke-1" />
              <h3 className="font-serif text-xl text-white mb-2">Secure & Discrete</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">Temperature-controlled global shipping ensures your research compounds arrive intact.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[#c9a84c] tracking-[0.2em] text-xs uppercase mb-4 block">Curated Selection</span>
              <h2 className="font-serif text-4xl text-white">Signature Compounds</h2>
            </div>
            <a href="/peptides" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest text-white/60 hover:text-[#c9a84c] transition-colors pb-2">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "BPC-157", desc: "Body Protection Compound", price: "$65.00", image: "/__mockup/images/dark-luxury-vial-1.png", purity: "99.4%" },
              { name: "TB-500", desc: "Thymosin Beta-4 Fragment", price: "$75.00", image: "/__mockup/images/dark-luxury-vial-2.png", purity: "99.2%" },
              { name: "CJC-1295 / Ipamorelin", desc: "Synergistic Blend", price: "$85.00", image: "/__mockup/images/dark-luxury-vial-3.png", purity: "99.6%" }
            ].map((product, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-[#0f0f0f] border border-white/5 transition-all duration-500 group-hover:border-[#c9a84c]/30">
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-black/80 backdrop-blur text-xs tracking-widest text-[#c9a84c] py-1 px-3 border border-[#c9a84c]/20">
                      {product.purity} PURITY
                    </span>
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-black py-3 uppercase tracking-widest text-xs font-semibold hover:bg-[#c9a84c] transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-white">{product.name}</h3>
                    <span className="text-[#c9a84c] font-medium">{product.price}</span>
                  </div>
                  <p className="text-sm text-white/50 font-light">{product.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Split Section */}
      <section className="border-y border-white/5 bg-[#0f0f0f] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 md:p-24 lg:p-32 flex flex-col justify-center">
            <h2 className="font-serif text-4xl text-white mb-6">Uncompromising Quality Control</h2>
            <p className="text-white/60 font-light leading-relaxed mb-10 max-w-md">
              We understand that the integrity of your research depends entirely on the quality of your compounds. That's why we subject every batch to rigorous independent testing, providing you with transparent, verifiable documentation.
            </p>
            <ul className="space-y-4 mb-10">
              {['High-Performance Liquid Chromatography (HPLC)', 'Mass Spectrometry (MS)', 'Independent third-party verification', 'Strict cold-chain logistics'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div>
              <a href="/about" className="inline-block border-b border-[#c9a84c] text-[#c9a84c] pb-1 uppercase tracking-widest text-sm hover:text-white hover:border-white transition-colors">
                View Testing Protocol
              </a>
            </div>
          </div>
          <div className="relative min-h-[500px] lg:min-h-full lg:border-l border-white/5 bg-[#0a0a0a]">
             <div className="absolute inset-0 flex items-center justify-center p-12">
               <div className="w-full max-w-md border border-white/10 bg-[#0f0f0f] p-8 relative">
                 <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[#c9a84c]"></div>
                 <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-[#c9a84c]"></div>
                 <h4 className="font-serif text-2xl text-white text-center mb-6 pb-6 border-b border-white/10">Certificate of Analysis</h4>
                 <div className="space-y-4 text-sm font-mono text-white/50">
                   <div className="flex justify-between"><span className="text-white/30">Batch:</span> <span>#BPC-2024-08</span></div>
                   <div className="flex justify-between"><span className="text-white/30">Compound:</span> <span className="text-white">BPC-157</span></div>
                   <div className="flex justify-between"><span className="text-white/30">Purity (HPLC):</span> <span className="text-[#c9a84c]">99.4%</span></div>
                   <div className="flex justify-between"><span className="text-white/30">Net Content:</span> <span>5.02mg</span></div>
                   <div className="flex justify-between"><span className="text-white/30">Appearance:</span> <span>White Lyophilized</span></div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/10 text-center">
                   <button className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">Download PDF Report</button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1">
              <a href="/" className="font-serif text-2xl tracking-wide text-white block mb-6">
                OMNI<span className="text-[#c9a84c]">QURE</span>
              </a>
              <p className="text-sm text-white/40 font-light leading-relaxed mb-6">
                Premium synthesized compounds for advanced research applications. 
              </p>
              <p className="text-xs text-[#c9a84c] border border-[#c9a84c]/20 inline-block px-3 py-1 uppercase tracking-wider">
                Strictly Not For Human Use
              </p>
            </div>
            
            <div>
              <h4 className="text-white uppercase tracking-widest text-xs font-semibold mb-6">Products</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="/peptides" className="hover:text-[#c9a84c] transition-colors">All Peptides</a></li>
                <li><a href="/stacks" className="hover:text-[#c9a84c] transition-colors">Research Stacks</a></li>
                <li><a href="/lab-equipment" className="hover:text-[#c9a84c] transition-colors">Lab Equipment</a></li>
                <li><a href="/new" className="hover:text-[#c9a84c] transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white uppercase tracking-widest text-xs font-semibold mb-6">Information</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="/about" className="hover:text-[#c9a84c] transition-colors">About Us</a></li>
                <li><a href="/quality" className="hover:text-[#c9a84c] transition-colors">Quality Control</a></li>
                <li><a href="/shipping" className="hover:text-[#c9a84c] transition-colors">Shipping & Returns</a></li>
                <li><a href="/contact" className="hover:text-[#c9a84c] transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white uppercase tracking-widest text-xs font-semibold mb-6">Stay Informed</h4>
              <p className="text-sm text-white/50 font-light mb-4">Subscribe for updates on new compounds and batch releases.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent border border-white/20 text-white px-4 py-2 text-sm focus:outline-none focus:border-[#c9a84c] w-full transition-colors"
                />
                <button className="bg-white text-black px-4 py-2 hover:bg-[#c9a84c] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30 font-light">
              &copy; {new Date().getFullYear()} OmniQure Sciences. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/30 font-light">
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
