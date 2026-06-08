import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, ChevronDown, Package, LogOut, Heart, ShieldCheck, FlaskConical, Globe, Truck, FileCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { useProducts } from "@/context/ProductsContext";
import { groupProducts } from "@/data/groupedProducts";
import { popularProductIds } from "@/data/popularPeptides";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Peptides", href: "/all-peptides" },
  { label: "Bac Water", href: "/bac-water" },
  { label: "Research Stacks", href: "/stacks" },
  { label: "Lab Results", href: "/lab-tests" },
  { label: "Peptide Calculator", href: "/calculator" },
  { label: "Protocols", href: "/protocols" },
];


const rightNavItems = [
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const { products } = useProducts();
  const peptideGroups = useMemo(
    () => groupProducts(products).sort((a, b) => a.baseName.localeCompare(b.baseName)),
    [products]
  );
  const popularGroups = useMemo(() => {
    const popularIds = new Set(popularProductIds.map(e => e.id));
    const seen = new Set<string>();
    const result = [];
    for (const p of products) {
      if (popularIds.has(p.id)) {
        const { baseName } = (() => {
          const m = p.name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g))(\s+.*)?$/i);
          return m ? { baseName: m[1].trim() } : { baseName: p.name };
        })();
        if (!seen.has(baseName)) {
          seen.add(baseName);
          result.push({ baseName, id: p.id });
        }
      }
    }
    return result.sort((a, b) => a.baseName.localeCompare(b.baseName));
  }, [products]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [allPeptidesOpen, setAllPeptidesOpen] = useState(false);
  const allPeptidesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popularOpen, setPopularOpen] = useState(false);
  const popularTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location, navigate] = useLocation();

  const openAllPeptides = useCallback(() => {
    if (allPeptidesTimer.current) clearTimeout(allPeptidesTimer.current);
    setAllPeptidesOpen(true);
  }, []);

  const closeAllPeptides = useCallback(() => {
    allPeptidesTimer.current = setTimeout(() => setAllPeptidesOpen(false), 120);
  }, []);

  const openPopular = useCallback(() => {
    if (popularTimer.current) clearTimeout(popularTimer.current);
    setPopularOpen(true);
  }, []);

  const closePopular = useCallback(() => {
    popularTimer.current = setTimeout(() => setPopularOpen(false), 120);
  }, []);
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { customer, loadingAuth, signOut } = useCustomerAuth();
  const { count: wishlistCount } = useWishlist();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutsideUser(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideUser);
    return () => document.removeEventListener("mousedown", handleClickOutsideUser);
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

  // Close user menu on route change
  useEffect(() => { setUserMenuOpen(false); }, [location]);

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

  async function handleSignOut() {
    setUserMenuOpen(false);
    await signOut();
    navigate("/");
  }

  const SearchBar = (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type="search"
        placeholder="Search peptides, categories..."
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setOpen(true); }}
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
  );

  return (
    <header style={{ fontFamily: "'Arimo', Arial, sans-serif", transition: "filter 0.3s ease" }} className="sticky top-0 z-50">
      {/* Top bar */}
      <div style={{
        background: scrolled
          ? "rgba(18,64,160,0.97)"
          : "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(8,28,80,0.35)" : "0 2px 16px rgba(8,28,80,0.25)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        position: "relative", zIndex: 2,
      }}>
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-2">

          {/* Hamburger — mobile only, left side */}
          <button
            className="md:hidden p-1 order-0 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer" }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 order-1" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
              <div style={{ display: "inline-block", maxWidth: "249px", overflow: "hidden" }}>
                <img
                  src="/omniqure-wordmark.png"
                  alt="OmniQure"
                  style={{ height: "52px", width: "auto", display: "block" }}
                />
                <span style={{ display: "block", textAlign: "center", color: "#E8A93E", fontSize: "8px", fontWeight: 900, letterSpacing: "0.18em", whiteSpace: "nowrap", overflow: "hidden", marginTop: "2px" }}>
                  PEPTIDE RESEARCH INSTITUTE
                </span>
              </div>
            </div>
          </Link>

          {/* Search */}
          <div
            className="order-3 sm:order-2 w-full sm:w-auto sm:flex-1 sm:max-w-[520px]"
            ref={containerRef}
            style={{ position: "relative" }}
          >
            {SearchBar}

            {open && results.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff",
                border: "1.5px solid #1B5CB5", borderTop: "none",
                borderRadius: "0 0 12px 12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 600, overflow: "hidden",
              }}>
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSelectResult(p.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "9px 14px", textAlign: "left",
                      border: "none", cursor: "pointer",
                      backgroundColor: i === highlighted ? "#F0F5FF" : "#fff",
                      borderBottom: i < results.length - 1 ? "1px solid #F1F5F9" : "none",
                      transition: "background-color 0.1s",
                    }}
                  >
                    <img src={p.image} alt={p.name}
                      style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
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
                    onMouseDown={() => { navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`); setOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "9px 14px",
                      textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#1B5CB5",
                      backgroundColor: "#F8FAFF", border: "none",
                      borderTop: "1px solid #E8EDF5", cursor: "pointer",
                    }}
                  >
                    View all results for "{searchQuery.trim()}" →
                  </button>
                )}
              </div>
            )}

            {open && q.length >= 1 && results.length === 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff", border: "1.5px solid #1B5CB5", borderTop: "none",
                borderRadius: "0 0 12px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 600, padding: "14px", textAlign: "center", fontSize: "13px", color: "#64748B",
              }}>
                No peptides found for "{searchQuery.trim()}"
              </div>
            )}
          </div>

          {/* Right group */}
          <div className="order-2 sm:order-3 ml-auto flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* Currency selector */}
            <div ref={currencyRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "4px 8px", borderRadius: "8px",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  cursor: "pointer", color: "#fff",
                }}
              >
                <span style={{ fontSize: "15px" }}>{currency.flag}</span>
                <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: 600 }}>{currency.code}</span>
                <span className="hidden sm:inline"><ChevronDown size={13} style={{ color: "rgba(255,255,255,0.6)" }} /></span>
              </button>

              {currencyOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  backgroundColor: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "14px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.14)", zIndex: 300,
                  minWidth: "220px", maxHeight: "360px", overflowY: "auto", overflowX: "hidden",
                  padding: "6px", scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent",
                }}>
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
                        textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 10px 3px",
                      }}>
                        {group.label}
                      </p>
                      {CURRENCIES.filter(c => group.codes.includes(c.code)).map(c => (
                        <button
                          key={c.code}
                          onMouseDown={() => { setCurrency(c.code as CurrencyCode); setCurrencyOpen(false); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            width: "100%", padding: "7px 10px", borderRadius: "8px",
                            border: "none", cursor: "pointer",
                            backgroundColor: c.code === currency.code ? "#EEF4FF" : "transparent",
                            textAlign: "left", transition: "background-color 0.1s",
                          }}
                          onMouseEnter={e => { if (c.code !== currency.code) (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC"; }}
                          onMouseLeave={e => { if (c.code !== currency.code) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
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

            {/* User: sign-in or logged-in menu */}
            {!loadingAuth && customer ? (
              <div ref={userMenuRef} style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.9)", padding: 0,
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <User size={14} color="#fff" />
                  </div>
                  <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: 600, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {customer.firstName}
                  </span>
                  <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.6)" }} className="hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    backgroundColor: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "14px",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.14)", zIndex: 300,
                    minWidth: "200px", overflow: "hidden",
                  }}>
                    {/* User info */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "2px" }}>
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p style={{ fontSize: "12px", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {customer.email}
                      </p>
                    </div>
                    {/* Menu items */}
                    <div style={{ padding: "6px" }}>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "9px 10px", borderRadius: "8px",
                          color: "#374151", textDecoration: "none",
                          fontSize: "13px", fontWeight: 500,
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                      >
                        <Package size={15} style={{ color: "#64748B" }} />
                        My Account
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "9px 10px", borderRadius: "8px",
                          color: "#374151", textDecoration: "none",
                          fontSize: "13px", fontWeight: 500,
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                      >
                        <ShoppingCart size={15} style={{ color: "#64748B" }} />
                        Track Order
                      </Link>
                    </div>
                    <div style={{ borderTop: "1px solid #F1F5F9", padding: "6px" }}>
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          width: "100%", padding: "9px 10px", borderRadius: "8px",
                          border: "none", backgroundColor: "transparent", cursor: "pointer",
                          color: "#DC2626", fontSize: "13px", fontWeight: 500, textAlign: "left",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="header-icon-btn flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
              >
                <User size={18} />
                <span className="hidden sm:inline">{loadingAuth ? "" : "Register / Sign in"}</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="header-icon-btn flex items-center gap-1.5 text-sm font-medium transition-colors relative"
              style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
            >
              <span className="relative">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center font-bold text-white rounded-full"
                    style={{
                      top: "-7px", right: "-8px",
                      minWidth: "16px", height: "16px",
                      backgroundColor: "#DC2626", fontSize: "9px", padding: "0 3px", lineHeight: 1,
                    }}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="header-icon-btn flex items-center gap-1.5 text-sm font-medium transition-colors relative"
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
                      backgroundColor: "#EF4444", fontSize: "9px", padding: "0 3px", lineHeight: 1,
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">My Cart</span>
            </Link>

          </div>

        </div>
      </div>

      {/* Main nav — tablet and above */}
      <nav
        className="bg-white hidden md:block"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: "1px solid #F8FAFC", position: "relative", zIndex: 1 }}
      >
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {navItems.map((item) => {
              const active = location === item.href || (item.href === "/all-peptides" && location.startsWith("/all-peptides"));
              if (item.label === "All Peptides") {
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={openAllPeptides}
                    onMouseLeave={closeAllPeptides}
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-3 text-sm whitespace-nowrap inline-flex items-center gap-1 transition-colors"
                      style={{
                        borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                        color: active ? "#1B5CB5" : "#475569",
                        fontWeight: active ? 600 : 500,
                        textDecoration: "none", marginBottom: "-1px",
                      }}
                    >
                      {item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: allPeptidesOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </Link>

                    {/* Dropdown mega-menu */}
                    {allPeptidesOpen && (
                      <div
                        onMouseEnter={openAllPeptides}
                        onMouseLeave={closeAllPeptides}
                        style={{
                          position: "absolute", top: "100%", left: 0,
                          backgroundColor: "#fff",
                          border: "1.5px solid #E8EDF5",
                          borderRadius: "16px",
                          boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
                          zIndex: 400,
                          minWidth: "520px",
                          padding: "16px",
                          marginTop: "2px",
                        }}
                      >
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #F1F5F9" }}>
                          <p style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                            All Peptides
                          </p>
                          <Link
                            href="/all-peptides"
                            onClick={() => setAllPeptidesOpen(false)}
                            style={{ fontSize: "12px", fontWeight: 600, color: "#1B5CB5", textDecoration: "none" }}
                          >
                            View all →
                          </Link>
                        </div>

                        {/* Peptide name list */}
                        <div style={{ maxHeight: "320px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px" }}>
                          {peptideGroups.map((group) => (
                            <Link
                              key={group.baseName}
                              href={`/product/${group.variants[0].id}`}
                              onClick={() => setAllPeptidesOpen(false)}
                              style={{
                                display: "block",
                                padding: "6px 8px", borderRadius: "8px",
                                textDecoration: "none", color: "#374151",
                                fontSize: "12.5px", fontWeight: 500,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0F5FF")}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                            >
                              {group.baseName}
                            </Link>
                          ))}
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
                          <Link
                            href="/all-peptides"
                            onClick={() => setAllPeptidesOpen(false)}
                            style={{ fontSize: "13px", fontWeight: 600, color: "#1B5CB5", textDecoration: "none" }}
                          >
                            Browse All Peptides →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              if (item.label === "Popular Peptides") {
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={openPopular}
                    onMouseLeave={closePopular}
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-3 text-sm whitespace-nowrap inline-flex items-center gap-1 transition-colors"
                      style={{
                        borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                        color: active ? "#1B5CB5" : "#475569",
                        fontWeight: active ? 600 : 500,
                        textDecoration: "none", marginBottom: "-1px",
                      }}
                    >
                      {item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: popularOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </Link>

                    {popularOpen && (
                      <div
                        onMouseEnter={openPopular}
                        onMouseLeave={closePopular}
                        style={{
                          position: "absolute", top: "100%", left: 0,
                          backgroundColor: "#fff",
                          border: "1.5px solid #E8EDF5",
                          borderRadius: "16px",
                          boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
                          zIndex: 400,
                          minWidth: "380px",
                          padding: "16px",
                          marginTop: "2px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #F1F5F9" }}>
                          <p style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                            Popular Peptides
                          </p>
                          <Link
                            href="/popular-peptides"
                            onClick={() => setPopularOpen(false)}
                            style={{ fontSize: "12px", fontWeight: 600, color: "#1B5CB5", textDecoration: "none" }}
                          >
                            View all →
                          </Link>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px" }}>
                          {popularGroups.map((g) => (
                            <Link
                              key={g.baseName}
                              href={`/product/${g.id}`}
                              onClick={() => setPopularOpen(false)}
                              style={{
                                display: "block",
                                padding: "6px 8px", borderRadius: "8px",
                                textDecoration: "none", color: "#374151",
                                fontSize: "12.5px", fontWeight: 500,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0F5FF")}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                            >
                              {g.baseName}
                            </Link>
                          ))}
                        </div>

                        <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
                          <Link
                            href="/popular-peptides"
                            onClick={() => setPopularOpen(false)}
                            style={{ fontSize: "13px", fontWeight: 600, color: "#1B5CB5", textDecoration: "none" }}
                          >
                            Browse All Popular Peptides →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm whitespace-nowrap inline-block transition-colors"
                  style={{
                    borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                    color: active ? "#1B5CB5" : "#475569",
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none", marginBottom: "-1px",
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
              className="block px-4 py-3.5 text-sm font-medium border-b border-gray-50 transition-colors"
              style={{ color: "#374151", textDecoration: "none" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {customer && (
            <>
              <Link
                href="/account"
                className="block px-4 py-3.5 text-sm font-medium border-b border-gray-50"
                style={{ color: "#1B5CB5", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); void handleSignOut(); }}
                className="block w-full text-left px-4 py-3.5 text-sm font-medium border-b border-gray-50"
                style={{ color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
