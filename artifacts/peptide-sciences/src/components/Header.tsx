import { useState } from "react";
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  {
    label: "All Peptides",
    href: "https://www.peptidesciences.com/all-peptides",
  },
  {
    label: "Popular Peptides",
    href: "https://www.peptidesciences.com/best-sellers",
  },
  {
    label: "Bundle & Save",
    href: "https://www.peptidesciences.com/peptide-bundles",
  },
  {
    label: "Peptide Research",
    href: "https://www.peptidesciences.com/peptide-research",
  },
  {
    label: "Peptide Information",
    href: "https://www.peptidesciences.com/peptide-information",
  },
];

const rightNavItems = [
  { label: "Our Company", href: "https://www.peptidesciences.com/our-company" },
  { label: "Contact Us", href: "https://www.peptidesciences.com/contact" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <a href="https://www.peptidesciences.com" className="flex-shrink-0 mr-4">
            <div className="flex items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#E7461E"/>
                <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">PS</text>
              </svg>
              <span style={{ fontSize: "20px", fontWeight: 400, color: "#000", letterSpacing: "0.02em" }}>
                PEPTIDE<span style={{ fontWeight: 700 }}>SCIENCES</span>
              </span>
            </div>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-[420px]">
            <div className="relative">
              <input
                type="search"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-3 pr-10 rounded-sm border-0 outline-none text-sm"
                style={{ backgroundColor: "#EFEFEF", color: "#333" }}
              />
              <button className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center bg-gray-300 rounded-r-sm">
                <Search size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6 ml-auto">
            <a
              href="https://www.peptidesciences.com/customer/account/login"
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900"
            >
              <User size={18} className="text-gray-600" />
              <span>Sign in</span>
            </a>
            <a
              href="https://www.peptidesciences.com/checkout/cart"
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900"
            >
              <ShoppingCart size={18} className="text-gray-600" />
              <span>My Cart</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          {/* Left nav */}
          <div className="flex items-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm text-gray-800 hover:text-gray-900 whitespace-nowrap border-b-2 border-transparent hover:border-gray-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right nav */}
          <div className="flex items-center">
            {rightNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm text-gray-800 hover:text-gray-900 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          {[...navItems, ...rightNavItems].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
