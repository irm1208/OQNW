import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { products } from "@/data/products";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Peptides", href: "/all-peptides" },
  { label: "Popular Peptides", href: "/popular-peptides" },
  { label: "Research Stacks", href: "/stacks" },
  { label: "Bundle & Save", href: "/bundles" },
  { label: "Peptide Research", href: "/research" },
  { label: "Peptide Calculator", href: "/calculator" },
];

const rightNavItems = [
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    setHighlighted(-1);
  }, [searchQuery]);

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
        setSearchQuery("");
        setOpen(false);
        inputRef.current?.blur();
      } else if (q) {
        navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
        setOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function handleSelectResult(id: string) {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setOpen(false);
  }

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif", transition: "filter 0.3s ease" }} className="sticky top-0 z-50">
      {/* Top bar */}
      <div style={{
        background: scrolled
          ? "rgba(18,64,160,0.97)"
          : "linear-gradient(90deg, #0D2565 0%, #1240A0 45%, #1B5CB5 100%)",
        backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(8,28,80,0.35)" : "0 2px 16px rgba(8,28,80,0.25)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}>
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-2" style={{ textDecoration: "none" }}>
            <img
              src="/omniqure-logo.jpeg"
              alt="OmniQure Peptide Research Institute"
              style={{ height: "52px", width: "auto", display: "block", mixBlendMode: "screen" }}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                  if (searchQuery.trim().length >= 1) setOpen(true);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                }}
                onKeyDown={handleKeyDown}
                className="w-full h-10 pl-4 pr-11 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRadius: open && results.length > 0 ? "10px 10px 0 0" : "10px",
                }}
                autoComplete="off"
              />
              <button
                className="absolute right-0 h-10 w-11 flex items-center justify-center"
                style={{ color: "rgba(255,255,255,0.6)" }}
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
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1.5px solid #1B5CB5",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 200,
                  overflow: "hidden",
                }}
              >
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSelectResult(p.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "9px 14px",
                      textAlign: "left",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: i === highlighted ? "#F0F5FF" : "#fff",
                      borderBottom: i < results.length - 1 ? "1px solid #F1F5F9" : "none",
                      transition: "background-color 0.1s",
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>{p.category}</p>
                    </div>
                  </button>
                ))}
                {results.length === 7 && (
                  <button
                    onMouseDown={() => {
                      navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
                      setOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 14px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1B5CB5",
                      backgroundColor: "#F8FAFF",
                      border: "none",
                      borderTop: "1px solid #E8EDF5",
                      cursor: "pointer",
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
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1.5px solid #1B5CB5",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 200,
                  padding: "14px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#64748B",
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
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "8px",
                border: "1.5px solid rgba(255,255,255,0.25)",
                backgroundColor: "rgba(255,255,255,0.1)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              <span style={{ fontSize: "15px" }}>{currency.flag}</span>
              {currency.code}
              <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.6)" }} />
            </button>

            {currencyOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "14px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
                  zIndex: 300,
                  minWidth: "220px",
                  maxHeight: "360px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  padding: "6px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#CBD5E1 transparent",
                }}
              >
                {[
                  { label: "Popular", codes: ["GBP","USD","EUR","AUD","CAD","CHF","NZD"] },
                  { label: "Scandinavia", codes: ["DKK","NOK","SEK"] },
                  { label: "Europe", codes: ["PLN","CZK","HUF"] },
                  { label: "Asia Pacific", codes: ["JPY","SGD","HKD","KRW","TWD","MYR","THB"] },
                  { label: "Middle East", codes: ["AED"] },
                ].map(group => (
                  <div key={group.label}>
                    <p style={{
                      fontSize: "10px", fontWeight: 700, color: "#94A3B8",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      padding: "6px 10px 3px",
                    }}>
                      {group.label}
                    </p>
                    {CURRENCIES.filter(c => group.codes.includes(c.code)).map(c => (
                      <button
                        key={c.code}
                        onMouseDown={() => {
                          setCurrency(c.code as CurrencyCode);
                          setCurrencyOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: c.code === currency.code ? "#EEF4FF" : "transparent",
                          textAlign: "left",
                          transition: "background-color 0.1s",
                        }}
                        onMouseEnter={e => {
                          if (c.code !== currency.code)
                            (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC";
                        }}
                        onMouseLeave={e => {
                          if (c.code !== currency.code)
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <span style={{ fontSize: "15px", flexShrink: 0 }}>{c.flag}</span>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: c.code === currency.code ? "#1240A0" : "#0F172A", minWidth: "34px" }}>{c.code}</span>
                        <span style={{ fontSize: "12px", color: "#64748B", flex: 1 }}>{c.label}</span>
                        {c.code === currency.code && (
                          <span style={{ color: "#1B5CB5", fontSize: "13px", flexShrink: 0 }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5 ml-auto">
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
            >
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors relative"
              style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
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
            style={{ color: "rgba(255,255,255,0.85)" }}
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
