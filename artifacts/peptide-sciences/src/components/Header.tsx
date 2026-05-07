import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";

const navItems = [
  { label: "All Peptides", href: "/" },
  { label: "Popular Peptides", href: "/?category=Popular+Peptides" },
  { label: "Bundle & Save", href: "/bundles" },
  { label: "Peptide Research", href: "/research" },
  { label: "Peptide Information", href: "/info" },
];

const rightNavItems = [
  { label: "Our Company", href: "/company" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-4 no-underline">
            <div className="flex items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#E7461E" />
                <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
                  PS
                </text>
              </svg>
              <span style={{ fontSize: "20px", fontWeight: 400, color: "#000", letterSpacing: "0.02em" }}>
                PEPTIDE<span style={{ fontWeight: 700 }}>SCIENCES</span>
              </span>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[420px]">
            <div className="relative">
              <input
                type="search"
                placeholder="Search peptides..."
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
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 no-underline"
            >
              <User size={18} className="text-gray-600" />
              <span>Sign in</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 no-underline"
            >
              <ShoppingCart size={18} className="text-gray-600" />
              <span>My Cart</span>
            </Link>
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
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm text-gray-800 hover:text-gray-900 whitespace-nowrap border-b-2 transition-colors no-underline"
                style={{
                  borderBottomColor:
                    location === item.href ? "#E7461E" : "transparent",
                  color: location === item.href ? "#E7461E" : undefined,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right nav */}
          <div className="flex items-center">
            {rightNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm text-gray-800 hover:text-gray-900 whitespace-nowrap no-underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          {[...navItems, ...rightNavItems].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
