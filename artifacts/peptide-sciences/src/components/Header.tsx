import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";

const LOGO_URL = "https://web.archive.org/web/20251012125939im_/https://www.peptidesciences.com/media/logo/stores/1/peptide_sciences_logo-web-white-background.png";

const navItems = [
  { label: "All Peptides", href: "/" },
  { label: "Popular Peptides", href: "/popular-peptides" },
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
          <Link href="/" className="flex-shrink-0 mr-4">
            <img
              src={LOGO_URL}
              alt="Peptide Sciences"
              style={{ height: "50px", maxWidth: "220px", objectFit: "contain" }}
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const parent = img.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="display:flex;align-items:center;gap:8px;text-decoration:none;">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="18" fill="#E7461E"/>
                        <text x="18" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="white">PS</text>
                      </svg>
                      <span style="font-size:20px;font-weight:400;color:#000;letter-spacing:0.02em;">
                        PEPTIDE<strong>SCIENCES</strong>
                      </span>
                    </div>`;
                }
              }}
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[500px]">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for peptides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-3 pr-10 outline-none text-sm"
                style={{ backgroundColor: "#EFEFEF", color: "#333", border: "none", borderRadius: "3px" }}
              />
              <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center rounded-r" style={{ backgroundColor: "#ddd" }}>
                <Search size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6 ml-auto">
            <Link href="/sign-in" className="flex items-center gap-1.5 text-sm hover:text-gray-900" style={{ color: "#555" }}>
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-1.5 text-sm hover:text-gray-900" style={{ color: "#555" }}>
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">My Cart</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors inline-block"
                style={{
                  borderBottomColor: location === item.href ? "#E7461E" : "transparent",
                  color: location === item.href ? "#E7461E" : "#333",
                  fontWeight: location === item.href ? 600 : 400,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {rightNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-3 text-sm whitespace-nowrap hover:text-gray-900"
                style={{ color: "#555", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md">
          {[...navItems, ...rightNavItems].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-50"
              style={{ color: "#333", textDecoration: "none" }}
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
