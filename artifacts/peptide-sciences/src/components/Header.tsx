import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Peptides", href: "/all-peptides" },
  { label: "Popular Peptides", href: "/popular-peptides" },
  { label: "Bundle & Save", href: "/bundles" },
  { label: "Peptide Research", href: "/research" },
  { label: "Peptide Calculator", href: "/calculator" },
];

const rightNavItems = [
  { label: "Our Company", href: "/company" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif" }} className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-white" style={{ boxShadow: "0 1px 0 #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-2" style={{ textDecoration: "none" }}>
            <img
              src="/omniqure-logo.jpeg"
              alt="OmniQure Peptide Research Institute"
              style={{ height: "52px", width: "auto", display: "block", borderRadius: "8px" }}
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[520px]">
            <div className="relative flex items-center">
              <input
                type="search"
                placeholder="Search peptides, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-11 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "#F1F5F9",
                  color: "#0F172A",
                  border: "1.5px solid #F1F5F9",
                  borderRadius: "10px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1B5CB5";
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#F1F5F9";
                  e.currentTarget.style.backgroundColor = "#F1F5F9";
                }}
              />
              <button
                className="absolute right-0 h-10 w-11 flex items-center justify-center"
                style={{ color: "#94A3B8" }}
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5 ml-auto">
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "#475569", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#1B5CB5"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
            >
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors relative"
              style={{ color: "#475569", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#1B5CB5"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
            >
              <span className="relative">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span
                    className="absolute flex items-center justify-center font-bold text-white rounded-full"
                    style={{
                      top: "-7px", right: "-8px",
                      minWidth: "16px", height: "16px",
                      backgroundColor: "#EF4444",
                      fontSize: "9px",
                      padding: "0 3px",
                      lineHeight: 1,
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">My Cart</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden ml-2 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "#475569" }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className="bg-white hidden lg:block"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: "1px solid #F8FAFC" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm whitespace-nowrap inline-block transition-colors"
                  style={{
                    borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                    color: active ? "#1B5CB5" : "#475569",
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none",
                    marginBottom: "-1px",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            {rightNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm whitespace-nowrap transition-colors"
                style={{ color: "#64748B", textDecoration: "none", fontWeight: 500 }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl">
          {[...navItems, ...rightNavItems].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors"
              style={{ color: "#374151", textDecoration: "none" }}
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
