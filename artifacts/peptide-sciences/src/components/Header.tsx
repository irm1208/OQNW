import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { products } from "@/data/products";

const navItems = [
  { label: "Home",             href: "/" },
  { label: "All Peptides",     href: "/all-peptides" },
  { label: "Popular Peptides", href: "/popular-peptides" },
  { label: "Bundle & Save",    href: "/bundles" },
  { label: "Peptide Research", href: "/research" },
  { label: "Peptide Calculator", href: "/calculator" },
];

const rightNavItems = [
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [searchQuery, setSearchQuery]   = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen]                 = useState(false);
  const [highlighted, setHighlighted]   = useState(-1);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [location, navigate]            = useLocation();
  const { totalItems }                  = useCart();
  const { currency, setCurrency }       = useCurrency();
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currencyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutsideCurrency(e: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideCurrency);
    return () => document.removeEventListener("mousedown", handleClickOutsideCurrency);
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const results = q.length >= 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 7)
    : [];

  useEffect(() => { setHighlighted(-1); }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "Enter" && q) {
        navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
        setOpen(false);
        inputRef.current?.blur();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && results[highlighted]) {
        navigate(`/product/${results[highlighted].id}`);
        setSearchQuery(""); setOpen(false); inputRef.current?.blur();
      } else if (q) {
        navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
        setOpen(false); inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setOpen(false); inputRef.current?.blur();
    }
  }

  function handleSelectResult(id: string) {
    navigate(`/product/${id}`);
    setSearchQuery(""); setOpen(false);
  }

  /* shared dark-glass style */
  const glassBar: React.CSSProperties = {
    background: "rgba(4, 8, 15, 0.92)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif" }} className="sticky top-0 z-50">

      {/* Neon top line */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #00D4FF 25%, #8B5CF6 75%, transparent)", opacity: 0.6 }} />

      {/* ── TOP BAR ───────────────────────────────────── */}
      <div style={{ ...glassBar, borderBottom: "1px solid rgba(0,212,255,0.12)" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-2" style={{ textDecoration: "none" }}>
            <img
              src="/omniqure-logo.jpeg"
              alt="OmniQure Peptide Research Institute"
              style={{ height: "52px", width: "auto", display: "block", borderRadius: "8px", filter: "brightness(1.05)" }}
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[520px]" ref={containerRef} style={{ position: "relative" }}>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="search"
                placeholder="Search peptides, categories..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setOpen(true); }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(0,212,255,0.15)";
                  if (searchQuery.trim().length >= 1) setOpen(true);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onKeyDown={handleKeyDown}
                className="w-full h-10 pl-4 pr-11 outline-none transition-all"
                style={{
                  backgroundColor: "rgba(0,212,255,0.04)",
                  color: "#C8D8EE",
                  border: "1.5px solid rgba(0,212,255,0.2)",
                  borderRadius: open && results.length > 0 ? "10px 10px 0 0" : "10px",
                  fontSize: "13.5px",
                }}
                autoComplete="off"
              />
              <button
                className="absolute right-0 h-10 w-11 flex items-center justify-center"
                style={{ color: "#2A4870", border: "none", background: "none", cursor: "pointer" }}
                onClick={() => {
                  if (q) {
                    navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
                    setOpen(false);
                    inputRef.current?.blur();
                  }
                }}
              >
                <Search size={16} />
              </button>
            </div>

            {/* Dropdown */}
            {open && results.length > 0 && (
              <div
                style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "#060E1C",
                  border: "1.5px solid rgba(0,212,255,0.3)",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(0,212,255,0.08)",
                  zIndex: 200, overflow: "hidden",
                }}
              >
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSelectResult(p.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "9px 14px", textAlign: "left",
                      border: "none", cursor: "pointer",
                      backgroundColor: i === highlighted ? "rgba(0,212,255,0.08)" : "transparent",
                      borderBottom: i < results.length - 1 ? "1px solid rgba(0,212,255,0.07)" : "none",
                      transition: "background-color 0.1s",
                    }}
                  >
                    <img src={p.image} alt={p.name}
                      style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", flexShrink: 0, border: "1px solid rgba(0,212,255,0.15)" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#C8D8EE", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#2A4870", margin: 0 }}>{p.category}</p>
                    </div>
                  </button>
                ))}
                {results.length === 7 && (
                  <button
                    onMouseDown={() => { navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`); setOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "9px 14px",
                      textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#00D4FF",
                      background: "rgba(0,212,255,0.04)", border: "none",
                      borderTop: "1px solid rgba(0,212,255,0.1)", cursor: "pointer",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    View all results for "{searchQuery.trim()}" →
                  </button>
                )}
              </div>
            )}

            {/* No results */}
            {open && q.length >= 1 && results.length === 0 && (
              <div
                style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "#060E1C",
                  border: "1.5px solid rgba(0,212,255,0.3)",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                  zIndex: 200, padding: "14px", textAlign: "center",
                  fontSize: "13px", color: "#2A4870",
                }}
              >
                No peptides found for "{searchQuery.trim()}"
              </div>
            )}
          </div>

          {/* Currency selector */}
          <div ref={currencyRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setCurrencyOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "5px 10px", borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.22)",
                backgroundColor: "rgba(0,212,255,0.05)",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
                color: "#7AAFCC",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <span style={{ fontSize: "15px" }}>{currency.flag}</span>
              {currency.code}
              <ChevronDown size={12} style={{ color: "#2A4870" }} />
            </button>

            {currencyOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  background: "#060E1C",
                  border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.7), 0 0 24px rgba(0,212,255,0.08)",
                  zIndex: 300, minWidth: "200px", overflow: "hidden", padding: "4px",
                }}
              >
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onMouseDown={() => { setCurrency(c.code as CurrencyCode); setCurrencyOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "8px 12px", borderRadius: "8px",
                      border: "none", cursor: "pointer", textAlign: "left",
                      backgroundColor: c.code === currency.code ? "rgba(0,212,255,0.1)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{c.flag}</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#A8C8DC", minWidth: "36px", fontFamily: "'Share Tech Mono', monospace" }}>{c.code}</span>
                    <span style={{ fontSize: "12px", color: "#2A4870" }}>{c.label}</span>
                    {c.code === currency.code && (
                      <span style={{ marginLeft: "auto", color: "#00D4FF", fontSize: "12px" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5 ml-auto">
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 font-medium transition-colors"
              style={{ color: "#2A4870", textDecoration: "none", fontSize: "13.5px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00D4FF"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2A4870"; }}
            >
              <User size={17} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-1.5 font-medium transition-colors relative"
              style={{ color: "#2A4870", textDecoration: "none", fontSize: "13.5px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00D4FF"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2A4870"; }}
            >
              <span className="relative">
                <ShoppingCart size={17} />
                {totalItems > 0 && (
                  <span
                    className="absolute flex items-center justify-center font-bold rounded-full"
                    style={{
                      top: "-7px", right: "-8px",
                      minWidth: "16px", height: "16px",
                      backgroundColor: "#00D4FF",
                      color: "#04080F",
                      fontSize: "9px", padding: "0 3px", lineHeight: 1,
                      boxShadow: "0 0 8px rgba(0,212,255,0.7)",
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
            style={{ color: "#2A4870", border: "none", background: "none", cursor: "pointer" }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── MAIN NAV ──────────────────────────────────── */}
      <nav
        className="hidden lg:block"
        style={{ ...glassBar, borderBottom: "1px solid rgba(0,212,255,0.1)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm whitespace-nowrap inline-block transition-all"
                  style={{
                    borderBottom: active ? "2px solid #00D4FF" : "2px solid transparent",
                    color: active ? "#00D4FF" : "#2A4870",
                    fontWeight: active ? 700 : 500,
                    textDecoration: "none",
                    marginBottom: "-1px",
                    textShadow: active ? "0 0 10px rgba(0,212,255,0.5)" : "none",
                    fontSize: "13px",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#7AAFCC";
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#2A4870";
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
                style={{ color: "#1E3A50", textDecoration: "none", fontWeight: 500, fontSize: "13px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#2A5F80"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#1E3A50"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ───────────────────────────────── */}
      {mobileMenuOpen && (
        <div style={{ ...glassBar, borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
          {[...navItems, ...rightNavItems].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 font-medium transition-colors"
              style={{
                color: "#2A5070", textDecoration: "none", fontSize: "13.5px",
                borderBottom: "1px solid rgba(0,212,255,0.07)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00D4FF"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2A5070"; }}
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
