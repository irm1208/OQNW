import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { prefetchRoute } from "@/lib/prefetch";
import { Link, useLocation } from "wouter";
import { Search, User, Users, ShoppingCart, Menu, X, ChevronDown, ArrowUpRight, Package, LogOut, Heart, ShieldCheck, FlaskConical, Globe, Truck, BookMarked, GraduationCap, Thermometer, Activity, Layers } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { groupProducts } from "@/data/groupedProducts";
import { popularProductSlugs } from "@/data/popularPeptides";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAffiliateMe } from "@/hooks/useAffiliate";

const POPULAR_SEARCHES = [
  "BPC-157", "TB-500", "Epithalon", "Ipamorelin",
  "CJC-1295", "Ipamorelin", "GHK-Cu", "Epithalon",
  "AOD-9604", "Selank",
];

function highlightMatch(text: string, query: string) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: "#1240A0" }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

const BASE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "All Peptides", href: "/all-peptides" },
  { label: "Bac Water", href: "/bac-water" },
  { label: "Independent Results", href: "/lab-reports" },
  { label: "Peptide Calculator", href: "/calculator" },
  { label: "Research & Education", href: "/protocols" },
];

const researchLinks = [
  { label: "Protocols", href: "/protocols", icon: FlaskConical, desc: "Research protocols & dosing guides" },
  { label: "Storage & Handling", href: "/storage-guide", icon: Thermometer, desc: "Lyophilised storage, reconstitution & stability" },
  { label: "Research Results", href: "/research-results", icon: Activity, desc: "Before & after biomarker data from peer-reviewed studies" },
  { label: "Research Stacks", href: "/stacks", icon: Layers, desc: "Curated multi-peptide research stacks" },
  { label: "Glossary", href: "/glossary", icon: BookMarked, desc: "Scientific terminology & definitions" },
];


const rightNavItems = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const offerNavItems = [
  { label: "Bundle & Save", href: "/bundle-and-save", icon: Package, desc: "Save more with curated bundles" },
  { label: "Refer a Friend", href: "/refer-a-friend", icon: Heart, desc: "Share OmniQure and earn rewards" },
  { label: "Affiliate Programme", href: "/affiliate", icon: Users, desc: "Earn monetary payments on eligible sales" },
];

export default function Header() {
  const { products: allProducts } = useProducts();
  const products = useMemo(() => allProducts.filter((p) => !isHiddenCategory(p.category)), [allProducts]);
  const navItems = useMemo(() => {
    const nadPublished = allProducts.some((p) => p.slug === "nad-plus-500mg");
    if (!nadPublished) return BASE_NAV_ITEMS;
    return [
      BASE_NAV_ITEMS[0], // Home
      BASE_NAV_ITEMS[1], // All Peptides
      { label: "NAD+", href: "/product/nad-plus-500mg" },
      ...BASE_NAV_ITEMS.slice(2),
    ];
  }, [allProducts]);
  const peptideGroups = useMemo(
    () => groupProducts(products)
      .filter((group) => group.category !== "Accessories")
      .sort((a, b) => a.baseName.localeCompare(b.baseName)),
    [products]
  );
  const popularGroups = useMemo(() => {
    const popularSlugs = new Set(popularProductSlugs.map(e => e.slug));
    const seen = new Set<string>();
    const result = [];
    for (const p of products) {
      if (popularSlugs.has(p.slug)) {
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
  const [mobileResearchOpen, setMobileResearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [allPeptidesOpen, setAllPeptidesOpen] = useState(false);
  const allPeptidesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popularOpen, setPopularOpen] = useState(false);
  const popularTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);
  const researchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [offersOpen, setOffersOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const offersTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offersButtonRef = useRef<HTMLButtonElement | null>(null);
  const offersLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [location, navigate] = useLocation();

  const openAllPeptides = useCallback(() => {
    if (allPeptidesTimer.current) clearTimeout(allPeptidesTimer.current);
    setAllPeptidesOpen(true);
    prefetchRoute("/all-peptides");
    prefetchRoute("/product");
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

  const openResearch = useCallback(() => {
    if (researchTimer.current) clearTimeout(researchTimer.current);
    setResearchOpen(true);
    prefetchRoute("/protocols");
    prefetchRoute("/storage-guide");
    prefetchRoute("/research-results");
    prefetchRoute("/stacks");
    prefetchRoute("/glossary");
  }, []);

  const closeResearch = useCallback(() => {
    researchTimer.current = setTimeout(() => setResearchOpen(false), 120);
  }, []);

  const openOffers = useCallback(() => {
    if (offersTimer.current) clearTimeout(offersTimer.current);
    setOffersOpen(true);
    offerNavItems.forEach(item => prefetchRoute(item.href));
  }, []);

  const closeOffers = useCallback(() => {
    offersTimer.current = setTimeout(() => setOffersOpen(false), 120);
  }, []);
  const { totalItems } = useCart();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { customer, loadingAuth, signOut } = useCustomerAuth();
  const { data: affiliateProfile } = useAffiliateMe(customer?.id);
  const isApprovedAffiliate = affiliateProfile?.partner?.status === "approved";
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

  // Close transient menus on route change.
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileResearchOpen(false);
    setOffersOpen(false);
    setMobileOffersOpen(false);
  }, [location]);

  const offersActive = offerNavItems.some(item => location === item.href || location.startsWith(item.href + "/"));

  function handleOffersKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOffersOpen(false);
      offersButtonRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      openOffers();
      requestAnimationFrame(() => offersLinkRefs.current[0]?.focus());
    }
  }

  // Keep the page from scrolling behind the mobile/tablet drawer and support Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
        className="w-full h-8 sm:h-10 pl-3 pr-9 sm:pl-4 sm:pr-11 text-sm outline-none transition-all"
        style={{
          backgroundColor: "rgba(255,255,255,0.12)",
          color: "#fff",
          border: "1.5px solid rgba(255,255,255,0.2)",
          borderRadius: open && results.length > 0 ? "10px 10px 0 0" : "10px",
        }}
        autoComplete="off"
      />
      <button
        className="absolute right-0 h-8 w-9 sm:h-10 sm:w-11 flex items-center justify-center"
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
        <div className="max-w-[1280px] mx-auto px-2 sm:px-4 py-1 sm:py-3 flex flex-wrap items-center gap-x-1.5 sm:gap-x-4 gap-y-1 sm:gap-y-2">

          {/* Hamburger — mobile only, left side */}
          <button
            className="lg:hidden p-1 order-0 flex-shrink-0 flex flex-col items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer" }}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Menu</span>
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 order-1" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
              <div style={{ display: "inline-block" }}>
                <img
                  src="/omniqure-wordmark.png?v=4"
                  alt="OmniQure"
                  className="w-[145px] sm:w-[230px]"
                  style={{ height: "auto", display: "block" }}
                />
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

            {/* Results dropdown */}
            {open && results.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff",
                border: "1.5px solid #1B5CB5", borderTop: "none",
                borderRadius: "0 0 14px 14px",
                boxShadow: "0 12px 32px rgba(18,64,160,0.15)", zIndex: 600, overflow: "hidden",
              }}>
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSelectResult(p.id)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: "11px",
                      width: "100%", padding: "10px 14px", textAlign: "left",
                      border: "none", cursor: "pointer",
                      backgroundColor: i === highlighted ? "#EEF4FF" : "#fff",
                      borderBottom: i < results.length - 1 ? "1px solid #F1F5F9" : "none",
                      transition: "background-color 0.1s",
                    }}
                  >
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "8px", flexShrink: 0,
                      background: "linear-gradient(145deg,#F4F8FF,#EBF2FF)",
                      border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      <img src={p.image} alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                      />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {highlightMatch(p.name, searchQuery.trim())}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#64748B" }}>{p.category}</span>
                        <span style={{ fontSize: "10px", color: "#059669", fontWeight: 700, backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "5px", padding: "1px 5px" }}>
                          {p.purity ?? "Purity not specified"}
                        </span>
                      </div>
                    </div>
                    {p.price != null && (
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#1240A0", flexShrink: 0 }}>
                        {formatPrice(p.price)}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onMouseDown={() => { navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    width: "100%", padding: "10px 14px",
                    fontSize: "12px", fontWeight: 700, color: "#1B5CB5",
                    backgroundColor: "#F0F5FF", border: "none",
                    borderTop: "1px solid #E8EDF5", cursor: "pointer",
                  }}
                >
                  <Search size={12} />
                  View all results for &ldquo;{searchQuery.trim()}&rdquo;
                </button>
              </div>
            )}

            {/* Popular searches — shown when focused with empty query */}
            {open && q.length === 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff", border: "1.5px solid #1B5CB5", borderTop: "none",
                borderRadius: "0 0 14px 14px", boxShadow: "0 12px 32px rgba(18,64,160,0.15)",
                zIndex: 600, padding: "12px 14px",
              }}>
                <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                  Popular searches
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {POPULAR_SEARCHES.map(term => (
                    <button
                      key={term}
                      onMouseDown={() => {
                        setSearchQuery(term);
                        navigate(`/all-peptides?search=${encodeURIComponent(term)}`);
                        setOpen(false);
                      }}
                      style={{
                        fontSize: "12px", fontWeight: 600, color: "#1240A0",
                        backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE",
                        borderRadius: "8px", padding: "4px 11px", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0";
                        (e.currentTarget as HTMLElement).style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#EEF4FF";
                        (e.currentTarget as HTMLElement).style.color = "#1240A0";
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {open && q.length >= 1 && results.length === 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff", border: "1.5px solid #1B5CB5", borderTop: "none",
                borderRadius: "0 0 14px 14px", boxShadow: "0 12px 32px rgba(18,64,160,0.15)",
                zIndex: 600, padding: "16px 14px", textAlign: "center",
              }}>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 8px" }}>No peptides found for &ldquo;{searchQuery.trim()}&rdquo;</p>
                <button
                  onMouseDown={() => { navigate("/all-peptides"); setOpen(false); setSearchQuery(""); }}
                  style={{ fontSize: "12px", fontWeight: 600, color: "#1B5CB5", background: "none", border: "none", cursor: "pointer" }}
                >
                  Browse all 81 peptides →
                </button>
              </div>
            )}
          </div>

          {/* Right group */}
          <div className="order-2 sm:order-3 ml-auto flex items-center gap-1.5 sm:gap-4 flex-shrink-0">

            {/* Currency selector */}
            <div ref={currencyRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                className="flex flex-col items-center sm:flex-row sm:gap-1"
                style={{
                  padding: "4px 8px", borderRadius: "8px",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  cursor: "pointer", color: "#fff",
                }}
              >
                <span style={{ fontSize: "15px" }}>{currency.flag}</span>
                <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Currency</span>
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
                  <div style={{
                    margin: "2px 4px 8px", padding: "10px 10px", borderRadius: "8px",
                    backgroundColor: "#FFF7ED", border: "1px solid #FED7AA",
                    fontSize: "11px", color: "#92400E", lineHeight: 1.45, textAlign: "center",
                  }}>
                    Prices shown for reference only.<br />
                    <strong>Payments accepted in GBP &amp; EUR only</strong><br />
                    via Pay by Bank.
                  </div>
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
                  className="flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-medium transition-colors"
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
                  <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Account</span>
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
                      {isApprovedAffiliate && (
                        <Link
                          href="/affiliate"
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
                          <Users size={15} style={{ color: "#64748B" }} />
                          Partner Dashboard
                        </Link>
                      )}
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
                className="header-icon-btn flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-bold transition-colors"
                style={{ color: "#ffffff", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E2E8F0"; prefetchRoute("/sign-in"); }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ffffff"}
              >
                <User size={18} />
                <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Sign in</span>
                <span className="hidden sm:inline">{loadingAuth ? "" : "Register / Sign in"}</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="header-icon-btn flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-bold transition-colors relative"
              style={{ color: "#ffffff", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E2E8F0"; prefetchRoute("/wishlist"); }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ffffff"}
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
              <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Wishlist</span>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="header-icon-btn flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-bold transition-colors relative"
              style={{ color: "#ffffff", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E2E8F0"; prefetchRoute("/cart"); }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#ffffff"}
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
              <span className="sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "rgba(255,255,255,0.85)" }}>Cart</span>
              <span className="hidden sm:inline">My Cart</span>
            </Link>

          </div>

        </div>
      </div>

      {/* Main nav — tablet and above */}
      <nav
        className="bg-white hidden lg:block"
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
                          {peptideGroups.filter(g => g.baseName !== "NAD+").map((group) => (
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

              if (item.label === "Research & Education") {
                const researchActive = researchLinks.some(l => location === l.href || location.startsWith(l.href + "/"));
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={openResearch}
                    onMouseLeave={closeResearch}
                  >
                    <button
                      className="px-4 py-3 text-sm whitespace-nowrap inline-flex items-center gap-1 transition-colors"
                      style={{
                        color: researchActive ? "#1B5CB5" : "#475569",
                        fontWeight: researchActive ? 600 : 500,
                        marginBottom: "-1px", background: "none", outline: "none",
                        borderLeft: "none", borderRight: "none", borderTop: "none",
                        borderBottom: researchActive ? "2px solid #1B5CB5" : "2px solid transparent",
                        cursor: "pointer", padding: "12px 16px",
                      }}
                      onClick={() => setResearchOpen(o => !o)}
                    >
                      <GraduationCap size={14} style={{ opacity: 0.7, marginRight: "2px" }} />
                      {item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: researchOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </button>

                    {researchOpen && (
                      <div
                        onMouseEnter={openResearch}
                        onMouseLeave={closeResearch}
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
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #F1F5F9" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <GraduationCap size={15} style={{ color: "#1240A0" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Research & Education</p>
                            <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Tools, data & learning resources</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          {researchLinks.map(link => {
                            const Icon = link.icon;
                            const isActive = location === link.href;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setResearchOpen(false)}
                                style={{
                                  display: "flex", alignItems: "center", gap: "12px",
                                  padding: "10px 10px", borderRadius: "10px",
                                  textDecoration: "none",
                                  backgroundColor: isActive ? "#EEF4FF" : "transparent",
                                  transition: "background-color 0.12s",
                                }}
                                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC"; }}
                                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                              >
                                <div style={{
                                  width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                                  backgroundColor: isActive ? "#DBEAFE" : "#F1F5F9",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Icon size={16} style={{ color: isActive ? "#1240A0" : "#64748B" }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <p style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "#1240A0" : "#1E293B", margin: "0 0 1px" }}>{link.label}</p>
                                  <p style={{ fontSize: "11.5px", color: "#94A3B8", margin: 0 }}>{link.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
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
                  onMouseEnter={() => prefetchRoute(item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
          <div
            style={{ position: "relative" }}
            onMouseEnter={openOffers}
            onMouseLeave={closeOffers}
          >
            <button
              ref={offersButtonRef}
              type="button"
              className="px-4 py-3 text-sm whitespace-nowrap inline-flex items-center gap-1 transition-colors"
              style={{
                color: offersActive ? "#1B5CB5" : "#64748B",
                fontWeight: offersActive ? 600 : 500,
                border: "none",
                borderBottom: offersActive ? "2px solid #1B5CB5" : "2px solid transparent",
                background: "none",
                cursor: "pointer",
                marginBottom: "-1px",
              }}
              aria-haspopup="true"
              aria-expanded={offersOpen}
              aria-controls="header-incentive-offers-menu"
              onClick={() => {
                if (offersOpen) setOffersOpen(false);
                else openOffers();
              }}
              onKeyDown={handleOffersKeyDown}
            >
              Incentive Offers
              <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: offersOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {offersOpen && (
              <div
                id="header-incentive-offers-menu"
                onMouseEnter={openOffers}
                onMouseLeave={closeOffers}
                style={{
                  position: "absolute", top: "100%", left: 0,
                  backgroundColor: "#fff",
                  border: "1.5px solid #E8EDF5",
                  borderRadius: "16px",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
                  zIndex: 400,
                  minWidth: "310px",
                  padding: "16px",
                  marginTop: "2px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowUpRight size={15} style={{ color: "#1240A0" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Incentive Offers</p>
                    <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Ways to save, share & earn</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {offerNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = location === item.href || location.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        ref={element => { offersLinkRefs.current[index] = element; }}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOffersOpen(false)}
                        onKeyDown={event => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setOffersOpen(false);
                            offersButtonRef.current?.focus();
                          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault();
                            const direction = event.key === "ArrowDown" ? 1 : -1;
                            const nextIndex = (index + direction + offerNavItems.length) % offerNavItems.length;
                            offersLinkRefs.current[nextIndex]?.focus();
                          }
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "10px", borderRadius: "10px",
                          textDecoration: "none",
                          backgroundColor: active ? "#EEF4FF" : "transparent",
                          transition: "background-color 0.12s",
                        }}
                        onMouseEnter={event => { if (!active) event.currentTarget.style.backgroundColor = "#F8FAFC"; }}
                        onMouseLeave={event => { if (!active) event.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                          backgroundColor: active ? "#DBEAFE" : "#F1F5F9",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Icon size={16} style={{ color: active ? "#1240A0" : "#64748B" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: active ? "#1240A0" : "#1E293B", margin: "0 0 1px" }}>{item.label}</p>
                          <p style={{ fontSize: "11.5px", color: "#94A3B8", margin: 0 }}>{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </div>
          <div className="flex items-center">
            {rightNavItems.map((item) => (
              (() => {
                const active = location === item.href || location.startsWith(item.href + "/");
                return (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm whitespace-nowrap transition-colors"
                style={{
                  color: active ? "#1B5CB5" : "#64748B",
                  textDecoration: "none",
                  fontWeight: active ? 600 : 500,
                  borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                  marginBottom: "-1px",
                }}
                onMouseEnter={() => prefetchRoute(item.href)}
              >
                {item.label}
              </Link>
                );
              })()
            ))}
          </div>
        </div>
      </nav>


      {/* Mobile and tablet navigation drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0"
          style={{ zIndex: 70 }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 w-full h-full border-0 cursor-default"
            style={{ backgroundColor: "rgba(15,23,42,0.42)", backdropFilter: "blur(2px)" }}
          />

          <aside
            className="absolute left-0 top-0 bottom-0 flex flex-col bg-white shadow-2xl"
            style={{ width: "min(90vw, 420px)" }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                paddingTop: "max(16px, env(safe-area-inset-top))",
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0F2F91 0%, #1240A0 48%, #1F72D1 100%)",
              }}
            >
              <span aria-hidden="true" style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", right: -86, top: -112, background: "rgba(255,255,255,0.12)" }} />
              <span aria-hidden="true" style={{ position: "absolute", width: 92, height: 92, borderRadius: "50%", right: 50, bottom: -66, border: "1px solid rgba(255,255,255,0.18)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  OmniQure
                </p>
                <p style={{ margin: "4px 0 0", color: "#fff", fontSize: "20px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Explore the site
                </p>
                <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.76)", fontSize: "12px" }}>
                  Research-grade tools, made clear.
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", zIndex: 1, borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.14)",
                  color: "#fff", cursor: "pointer", backdropFilter: "blur(8px)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
              <Link
                href="/all-peptides"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  margin: "16px 16px 8px", padding: "15px 16px", borderRadius: 16,
                  color: "#fff", textDecoration: "none", overflow: "hidden", position: "relative",
                  background: "linear-gradient(120deg, #1240A0 0%, #1B5CB5 62%, #2F80D8 100%)",
                  boxShadow: "0 10px 22px rgba(18,64,160,0.2)",
                }}
              >
                <span aria-hidden="true" style={{ position: "absolute", width: 110, height: 110, borderRadius: "50%", right: -45, top: -58, background: "rgba(255,255,255,0.12)" }} />
                <span style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ display: "block", marginBottom: 5, color: "rgba(255,255,255,0.7)", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Featured
                  </span>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 800, lineHeight: 1.15 }}>
                    Browse the collection
                  </span>
                  <span style={{ display: "block", marginTop: 4, color: "rgba(255,255,255,0.76)", fontSize: 11.5 }}>
                    Explore peptides for your research.
                  </span>
                </span>
                <span style={{ position: "relative", zIndex: 1, width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(255,255,255,0.16)" }}>
                  <ArrowUpRight size={18} />
                </span>
              </Link>

              <div style={{ padding: "8px 12px 8px" }}>
                <p style={{ margin: "0 8px 7px", color: "#94A3B8", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Main menu
                </p>
                {navItems
                  .filter(item => item.label !== "Research & Education")
                  .map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 transition-colors"
                      style={{
                        minHeight: 48, color: location === item.href ? "#1240A0" : "#334155",
                        background: location === item.href ? "linear-gradient(90deg, #EEF4FF 0%, #F7FAFF 100%)" : "transparent",
                        borderLeft: location === item.href ? "3px solid #1B5CB5" : "3px solid transparent",
                        textDecoration: "none", fontSize: 15, fontWeight: location === item.href ? 700 : 600,
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronDown size={15} style={{ transform: "rotate(-90deg)", color: location === item.href ? "#1B5CB5" : "#CBD5E1" }} />
                    </Link>
                  ))}
              </div>

              <div style={{ marginTop: 6, borderTop: "1px solid #E5EDFA", borderBottom: "1px solid #E5EDFA", background: mobileResearchOpen ? "#F8FBFF" : "#fff" }}>
                <button
                  onClick={() => setMobileResearchOpen(open => !open)}
                  aria-expanded={mobileResearchOpen}
                  style={{
                    width: "100%", minHeight: 60, padding: "0 20px", display: "flex", alignItems: "center", gap: 10,
                    border: "none", background: mobileResearchOpen ? "#F8FAFC" : "#fff",
                    color: "#475569", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #DBEAFE 0%, #EEF4FF 100%)", color: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(18,64,160,0.06)" }}>
                    <GraduationCap size={16} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 800 }}>Research &amp; Education</span>
                    <span style={{ display: "block", marginTop: 2, color: "#94A3B8", fontSize: 11 }}>Guides, data &amp; research tools</span>
                  </span>
                  <ChevronDown size={17} style={{ color: "#94A3B8", transform: mobileResearchOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {mobileResearchOpen && (
                  <div style={{ padding: "0 12px 10px", background: "#F8FAFC" }}>
                    {researchLinks.map(link => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                          style={{ color: "#475569", textDecoration: "none" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon size={17} style={{ color: "#64748B", flexShrink: 0 }} />
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{link.label}</span>
                            <span style={{ display: "block", marginTop: 2, color: "#94A3B8", fontSize: 11.5, lineHeight: 1.35 }}>{link.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 6, borderTop: "1px solid #E5EDFA", borderBottom: "1px solid #E5EDFA", background: mobileOffersOpen ? "#F8FBFF" : "#fff" }}>
                <button
                  type="button"
                  onClick={() => setMobileOffersOpen(open => !open)}
                  aria-expanded={mobileOffersOpen}
                  aria-controls="mobile-incentive-offers-menu"
                  style={{
                    width: "100%", minHeight: 52, padding: "0 12px", display: "flex", alignItems: "center", gap: 10,
                    border: "none", background: mobileOffersOpen ? "#F8FAFC" : "#fff",
                    color: offersActive ? "#1240A0" : "#475569", cursor: "pointer", textAlign: "left",
                    fontSize: 14, fontWeight: offersActive ? 800 : 600,
                  }}
                >
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #DBEAFE 0%, #EEF4FF 100%)", color: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowUpRight size={15} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block" }}>Incentive Offers</span>
                    <span style={{ display: "block", marginTop: 2, color: "#94A3B8", fontSize: 11, fontWeight: 500 }}>Save, share &amp; earn</span>
                  </span>
                  <ChevronDown size={17} style={{ color: "#94A3B8", transform: mobileOffersOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {mobileOffersOpen && (
                  <div id="mobile-incentive-offers-menu" style={{ padding: "0 12px 10px", background: "#F8FAFC" }}>
                    {offerNavItems.map(item => {
                      const Icon = item.icon;
                      const active = location === item.href || location.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                          style={{
                            color: active ? "#1240A0" : "#475569",
                            background: active ? "#EEF4FF" : "transparent",
                            textDecoration: "none",
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon size={17} style={{ color: active ? "#1240A0" : "#64748B", flexShrink: 0 }} />
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{item.label}</span>
                            <span style={{ display: "block", marginTop: 2, color: "#94A3B8", fontSize: 11.5, lineHeight: 1.35 }}>{item.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 12px 8px" }}>
                <p style={{ margin: "0 8px 7px", color: "#94A3B8", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  More
                </p>
                {[...(!customer ? [{ label: "Sign in", href: "/sign-in" }] : []), ...rightNavItems].map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3"
                    style={{ minHeight: 46, color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                    <ChevronDown size={15} style={{ transform: "rotate(-90deg)", color: "#CBD5E1" }} />
                  </Link>
                ))}
              </div>

              {customer && (
                <div style={{ margin: "4px 12px 20px", padding: "10px", borderRadius: 14, background: "#F0F5FF", border: "1px solid #DBEAFE" }}>
                  <Link
                    href="/account"
                    className="flex items-center rounded-xl px-3"
                    style={{ minHeight: 46, color: "#1240A0", textDecoration: "none", fontSize: 14, fontWeight: 700 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={17} style={{ marginRight: 10 }} />
                    My Account
                  </Link>
                  {isApprovedAffiliate && (
                    <Link
                      href="/affiliate"
                      className="flex items-center rounded-xl px-3"
                      style={{ minHeight: 46, color: "#1240A0", textDecoration: "none", fontSize: 14, fontWeight: 700 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Users size={17} style={{ marginRight: 10 }} />
                      Partner Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileMenuOpen(false); void handleSignOut(); }}
                    className="flex items-center w-full rounded-xl px-3"
                    style={{ minHeight: 46, color: "#DC2626", background: "transparent", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, textAlign: "left" }}
                  >
                    <LogOut size={17} style={{ marginRight: 10 }} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
