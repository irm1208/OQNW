import React from 'react';
import { ShoppingCart, Menu, Search, ArrowRight, ShieldCheck, Leaf, FlaskConical } from 'lucide-react';

export function WarmEarth() {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans text-neutral-800 flex flex-col overflow-y-auto" style={{
      '--color-bg': '#faf7f2',
      '--color-terracotta': '#c4603a',
      '--color-sage': '#7c9a7e',
      '--color-text': '#2c2a29',
    } as React.CSSProperties}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-dm-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top Banner */}
      <div className="bg-[#7c9a7e] text-white text-xs font-dm-sans tracking-widest uppercase text-center py-2 px-4">
        Premium Research Grade Peptides • Not for human consumption
      </div>

      {/* Navbar */}
      <nav className="border-b border-neutral-200/50 sticky top-0 bg-[#faf7f2]/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-[#c4603a] transition-colors">
              <Menu size={24} />
            </button>
            <div className="text-2xl font-fraunces font-medium tracking-tight text-[#c4603a]">
              OmniQure<span className="text-[#7c9a7e]">.</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm font-dm-sans font-medium text-neutral-600 ml-8">
              <a href="#" className="hover:text-[#c4603a] transition-colors">Shop All</a>
              <a href="#" className="hover:text-[#c4603a] transition-colors">BPC-157</a>
              <a href="#" className="hover:text-[#c4603a] transition-colors">Semaglutide</a>
              <a href="#" className="hover:text-[#c4603a] transition-colors">Lab Results</a>
              <a href="#" className="hover:text-[#c4603a] transition-colors">About</a>
            </div>
          </div>
          <div className="flex items-center gap-6 text-neutral-600">
            <button className="hover:text-[#c4603a] transition-colors">
              <Search size={20} />
            </button>
            <button className="hover:text-[#c4603a] transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c4603a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c9a7e]/10 text-[#7c9a7e] text-xs font-dm-sans font-bold tracking-wider uppercase mb-8">
              <FlaskConical size={14} />
              <span>Research Grade Purity</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-fraunces font-light text-[#2c2a29] leading-[1.1] mb-6">
              Nurturing science with <span className="text-[#c4603a] italic">precision</span>.
            </h1>
            <p className="text-lg text-neutral-600 font-dm-sans leading-relaxed mb-10">
              U.S. synthesized peptides for clinical research. Verified by independent third-party HPLC & MS testing for guaranteed purity above 99%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#c4603a] hover:bg-[#a34d2c] text-white px-8 py-4 rounded-full font-dm-sans font-medium transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(196,96,58,0.3)]">
                Shop Catalog <ArrowRight size={18} />
              </button>
              <button className="bg-white hover:bg-neutral-50 text-[#2c2a29] border border-neutral-200 px-8 py-4 rounded-full font-dm-sans font-medium transition-all flex items-center justify-center">
                View Lab Reports
              </button>
            </div>
          </div>
          <div className="relative z-10">
            <div className="aspect-[4/5] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-[#c4603a]/10 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7c9a7e]/20 to-transparent mix-blend-overlay z-10" />
              <img 
                src="/__mockup/images/warm-earth-hero.png" 
                alt="Laboratory research vials" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#c4603a]/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#7c9a7e]/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-neutral-200/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7c9a7e]/10 flex items-center justify-center text-[#7c9a7e] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-fraunces font-medium text-lg text-[#2c2a29]">99% Guaranteed Purity</h3>
              <p className="text-sm text-neutral-500 font-dm-sans mt-1">Independent Janoshik testing</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c4603a]/10 flex items-center justify-center text-[#c4603a] shrink-0">
              <Leaf size={24} />
            </div>
            <div>
              <h3 className="font-fraunces font-medium text-lg text-[#2c2a29]">USA Synthesized</h3>
              <p className="text-sm text-neutral-500 font-dm-sans mt-1">Ethical laboratory practices</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7c9a7e]/10 flex items-center justify-center text-[#7c9a7e] shrink-0">
              <FlaskConical size={24} />
            </div>
            <div>
              <h3 className="font-fraunces font-medium text-lg text-[#2c2a29]">Lyophilized Stability</h3>
              <p className="text-sm text-neutral-500 font-dm-sans mt-1">Preserved for long-term viability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-fraunces font-light text-[#2c2a29] mb-4">Featured Compounds</h2>
              <p className="text-neutral-500 font-dm-sans max-w-xl">Carefully synthesized research materials, verified for absolute purity and stability.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-[#c4603a] font-dm-sans font-medium hover:gap-3 transition-all">
              View catalog <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] rounded-[1.5rem] bg-white overflow-hidden relative mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                <img src="/__mockup/images/warm-earth-product-1.png" alt="BPC-157" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-dm-sans font-medium text-[#c4603a]">
                  Best Seller
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-fraunces text-xl text-[#2c2a29] group-hover:text-[#c4603a] transition-colors">BPC-157</h3>
                  <p className="text-sm text-neutral-500 font-dm-sans mt-1">5mg • Lyophilized Powder</p>
                </div>
                <span className="font-dm-sans font-medium text-lg">$55.00</span>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] rounded-[1.5rem] bg-white overflow-hidden relative mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                <img src="/__mockup/images/warm-earth-product-2.png" alt="Semaglutide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-fraunces text-xl text-[#2c2a29] group-hover:text-[#c4603a] transition-colors">Semaglutide</h3>
                  <p className="text-sm text-neutral-500 font-dm-sans mt-1">3mg • Lyophilized Powder</p>
                </div>
                <span className="font-dm-sans font-medium text-lg">$120.00</span>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] rounded-[1.5rem] bg-white overflow-hidden relative mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                <img src="/__mockup/images/warm-earth-hero.png" alt="TB-500" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-fraunces text-xl text-[#2c2a29] group-hover:text-[#c4603a] transition-colors">TB-500</h3>
                  <p className="text-sm text-neutral-500 font-dm-sans mt-1">10mg • Lyophilized Powder</p>
                </div>
                <span className="font-dm-sans font-medium text-lg">$85.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info / Story Section */}
      <section className="py-24 bg-[#7c9a7e]/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             <div className="aspect-square rounded-[2rem] overflow-hidden">
               <img src="/__mockup/images/warm-earth-trust.png" alt="Microscope" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl lg:text-5xl font-fraunces font-light text-[#2c2a29] mb-6 leading-tight">
              Committed to <br/><span className="italic text-[#7c9a7e]">uncompromising</span> quality.
            </h2>
            <p className="text-lg text-neutral-600 font-dm-sans leading-relaxed mb-8">
              Every batch of our research compounds undergoes rigorous independent testing. We believe that groundbreaking research requires a foundation of absolute certainty. That's why we make our HPLC and MS reports publicly available for every product we synthesize.
            </p>
            <ul className="space-y-4 font-dm-sans text-neutral-700">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c4603a]" />
                Third-party verified &gt;99% purity
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c4603a]" />
                US-based synthesis facilities
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c4603a]" />
                Strict cold-chain storage protocols
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200/50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <div className="text-2xl font-fraunces font-medium tracking-tight text-[#c4603a] mb-6">
                OmniQure<span className="text-[#7c9a7e]">.</span>
              </div>
              <p className="text-sm text-neutral-500 font-dm-sans leading-relaxed">
                Premium research peptides and compounds. Dedicated to advancing scientific inquiry with uncompromising purity.
              </p>
            </div>
            
            <div>
              <h4 className="font-dm-sans font-bold text-[#2c2a29] mb-6 uppercase tracking-wider text-xs">Shop</h4>
              <ul className="space-y-4 text-sm font-dm-sans text-neutral-500">
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Peptides</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Blends</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Lab Supplies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-dm-sans font-bold text-[#2c2a29] mb-6 uppercase tracking-wider text-xs">Resources</h4>
              <ul className="space-y-4 text-sm font-dm-sans text-neutral-500">
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Lab Testing</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-[#c4603a] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-dm-sans font-bold text-[#2c2a29] mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
              <p className="text-sm text-neutral-500 font-dm-sans mb-4">Subscribe for research updates and exclusive offers.</p>
              <div className="flex border border-neutral-200 rounded-full overflow-hidden p-1 focus-within:border-[#7c9a7e] transition-colors">
                <input type="email" placeholder="Email address" className="bg-transparent border-none outline-none px-4 text-sm font-dm-sans w-full text-neutral-700" />
                <button className="bg-[#7c9a7e] hover:bg-[#6b856d] text-white px-4 py-2 rounded-full text-sm font-dm-sans font-medium transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400 font-dm-sans">
              © 2024 OmniQure. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-neutral-400 font-dm-sans">
              <a href="#" className="hover:text-[#2c2a29]">Privacy Policy</a>
              <a href="#" className="hover:text-[#2c2a29]">Terms of Service</a>
            </div>
          </div>

          <div className="mt-8 text-[10px] text-neutral-400 font-dm-sans leading-relaxed text-center max-w-4xl mx-auto">
            DISCLAIMER: All products sold on this website are for in-vitro research and laboratory use only. These products are not designed, intended, or approved for human consumption, diagnosis, treatment, cure, or prevention of any disease.
          </div>
        </div>
      </footer>
    </div>
  );
}
