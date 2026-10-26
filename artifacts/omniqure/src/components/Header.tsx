import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { prefetchRoute } from "@/lib/prefetch";
import { Link, useLocation } from "wouter";
import { Search, User, Users, ShoppingCart, Menu, X, ChevronDown, ChevronRight, ChevronLeft, ArrowUpRight, Package, LogOut, Heart, ShieldCheck, FlaskConical, Globe, Truck, BookMarked, GraduationCap, Thermometer, Activity, Layers, Calculator, Droplets, Gift, BookOpen, HelpCircle, Mail, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { groupProducts } from "@/data/groupedProducts";
import { popularProductSlugs } from "@/data/popularPeptides";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAffiliateMe } from "@/hooks/useAffiliate";
import PeptideMegaMenu, { DrawerShop, DrawerPopular, IndexList, BundleSpec } from "@/components/nav/PeptideMegaMenu";

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
      <strong style={{ color: "#4E68C2" }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

const BASE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop Peptides", href: "/all-peptides" },
  { label: "Bac Water", href: "/bac-water" },
  { label: "Lab Results", href: "/lab-reports" },
  { label: "Peptide Calculator", href: "/calculator" },
  { label: "Research & Education", href: "/protocols" },
];

const DESKTOP_LABELS: Record<string, string> = {
  "Shop Peptides": "All Peptides",
  "Peptide Calculator": "Calculator",
  "Research & Education": "Research",
  "Lab Results": "Lab Results",
};

const researchLinks = [
  { label: "Protocols", href: "/protocols", icon: FlaskConical, desc: "Research protocols & dosing guides" },
  { label: "Storage & Handling", href: "/storage-guide", icon: Thermometer, desc: "Lyophilised storage, reconstitution & stability" },
  { label: "Research Results", href: "/research-results", icon: Activity, desc: "Before & after biomarker data from peer-reviewed studies" },
  { label: "Research Stacks", href: "/stacks", icon: Layers, desc: "Curated multi-peptide research stacks" },
  { label: "Glossary", href: "/glossary", icon: BookMarked, desc: "Scientific terminology & definitions" },
];


// The phone/tablet menu's research hub: every research and education page.
const researchHubLinks = [
  { label: "Lab reports", href: "/lab-reports", icon: ShieldCheck, desc: "Janoshik COA for every batch" },
  { label: "Calculator", href: "/calculator", icon: Calculator, desc: "Reconstitution and dosing maths" },
  { label: "Protocols", href: "/protocols", icon: FlaskConical, desc: "Research protocols and guides" },
  { label: "Research results", href: "/research-results", icon: Activity, desc: "Biomarker data from studies" },
  { label: "Research stacks", href: "/stacks", icon: Layers, desc: "Curated multi-peptide stacks" },
  { label: "Storage", href: "/storage-guide", icon: Thermometer, desc: "Storage, reconstitution, stability" },
  { label: "Glossary", href: "/glossary", icon: BookMarked, desc: "Scientific terms explained" },
  { label: "Research notes", href: "/blog", icon: BookOpen, desc: "Articles on each compound" },
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
      BASE_NAV_ITEMS[1], // Shop Peptides
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
  // Phones and tablets: the search row stays hidden until the search button is pressed.
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  // Phone/tablet menu: the first screen, or one of its sub-panels.
  const [drawerPanel, setDrawerPanel] = useState<null | "shop" | "research" | "offers">(null);
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const openDrawerPanel = (panel: typeof drawerPanel) => {
    setDrawerPanel(panel);
    drawerScrollRef.current?.scrollTo({ top: 0 });
  };
  useEffect(() => { if (!mobileMenuOpen) setDrawerPanel(null); }, [mobileMenuOpen]);
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
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
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
    setMobileSearchOpen(false);
    setOffersOpen(false);
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
    if (e.key === "Escape" && !isDesktop) setMobileSearchOpen(false);
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
    <div className="header-search-control relative flex items-center">
      <input
        ref={inputRef}
        type="search"
        placeholder={isDesktop ? "Search" : "Search peptides…"}
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setOpen(true); }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--cobalt)";
          e.currentTarget.style.backgroundColor = "#FFFFFF";
          if (searchQuery.trim().length >= 1) setOpen(true);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--hairline)";
          e.currentTarget.style.backgroundColor = "rgba(229,239,255,0.4)";
        }}
        onKeyDown={handleKeyDown}
        className="w-full h-8 sm:h-10 pl-3 pr-9 sm:pl-4 sm:pr-11 text-sm outline-none transition-all"
        style={{
          backgroundColor: "rgba(229,239,255,0.4)",
          color: "var(--ink)",
          border: "1px solid var(--hairline)",
          borderRadius: open && results.length > 0 ? "20px 20px 0 0" : "999px",
          fontSize: "13px",
        }}
        autoComplete="off"
      />
      <button
        type="button"
        aria-label="Search peptides"
        className="header-search-submit absolute right-0 h-8 w-9 sm:h-10 sm:w-11 flex items-center justify-center"
        style={{ color: "var(--graphite)" }}
        onClick={() => {
          if (q) {
            navigate(`/all-peptides?search=${encodeURIComponent(searchQuery.trim())}`);
            setOpen(false);
            inputRef.current?.blur();
          } else {
            // Empty field: put the cursor in it rather than doing nothing.
            inputRef.current?.focus();
          }
        }}
      >
        <span className="header-search-submit-label">Search</span>
        <Search size={16} />
      </button>
    </div>
  );

  return (
    <header style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", transition: "filter 0.3s ease" }} className="sticky top-0 z-50">
      {/* Top bar */}
      {/* Matte Navy brand band; the range pin stripe runs along its foot */}
      <div className="header-topbar header-brand" style={{
        background: "var(--oq-matte-navy)",
        boxShadow: scrolled ? "0 6px 18px -10px rgba(4,11,34,0.45)" : "none",
        transition: "box-shadow 0.3s ease",
        position: "relative", zIndex: 2,
      }}>
          <div className="pinstripe header-brand__stripe" aria-hidden="true" />
          <div data-search-open={mobileSearchOpen} className="header-inner max-w-[1280px] mx-auto px-2 sm:px-4 py-1 sm:py-3 flex flex-wrap items-center gap-x-1.5 sm:gap-x-4 gap-y-1 sm:gap-y-2">

          {/* Hamburger — mobile only, left side */}
          <button
            className="header-menu-toggle lg:hidden p-1 order-0 flex-shrink-0 flex flex-col items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "var(--ink)", background: "none", border: "none", cursor: "pointer" }}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="header-mobile-label sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "var(--graphite)" }}>Menu</span>
          </button>

          {/* Logo */}
          <Link href="/" className="header-logo-wrapper order-1" style={{ textDecoration: "none" }}>
            <img
              src="/omniqure-wordmark-white.svg"
              alt="OmniQure"
              className="header-logo"
            />
          </Link>

          {/* Desktop nav — inline in the single header row */}
          <span className="header-nav-divider hidden lg:block order-2" aria-hidden="true" />
          <nav className="header-desktop-nav hidden lg:flex order-2 items-center" aria-label="Main">
            {navItems.map((item) => {
              const active = location === item.href || (item.href === "/all-peptides" && location.startsWith("/all-peptides"));
              if (item.label === "Shop Peptides") {
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={openAllPeptides}
                    onMouseLeave={closeAllPeptides}
                  >
                    <Link
                      href={item.href}
                      className="px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] inline-flex items-center gap-1 transition-colors"
                      style={{
                        borderRadius: "6px", backgroundColor: active ? "rgba(229,239,255,0.6)" : undefined,
                        color: active ? "var(--ink)" : undefined,
                        fontWeight: active ? 600 : 500,
                        textDecoration: "none", marginBottom: "-1px",
                      }}
                    >
                      {DESKTOP_LABELS[item.label] ?? item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: allPeptidesOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </Link>

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
                      className="px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] inline-flex items-center gap-1 transition-colors"
                      style={{
                        borderRadius: "6px", backgroundColor: active ? "rgba(229,239,255,0.6)" : undefined,
                        color: active ? "var(--ink)" : undefined,
                        fontWeight: active ? 600 : 500,
                        textDecoration: "none", marginBottom: "-1px",
                      }}
                    >
                      {DESKTOP_LABELS[item.label] ?? item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: popularOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </Link>

                    {popularOpen && (
                      <div
                        onMouseEnter={openPopular}
                        onMouseLeave={closePopular}
                        style={{
                          position: "absolute", top: "100%", left: 0,
                          backgroundColor: "#fff",
                          border: "1px solid #D3D8E2",
                          borderRadius: "8px",
                          boxShadow: "0 18px 40px -20px rgba(29,41,72,0.35)",
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
                            style={{ fontSize: "12px", fontWeight: 600, color: "#4E68C2", textDecoration: "none" }}
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
                            style={{ fontSize: "13px", fontWeight: 600, color: "#4E68C2", textDecoration: "none" }}
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
                      className="px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] inline-flex items-center gap-1 transition-colors"
                      style={{
                        color: researchActive ? "var(--ink)" : undefined,
                        fontWeight: researchActive ? 600 : 500,
                        marginBottom: "-1px", background: "none", outline: "none",
                        borderLeft: "none", borderRight: "none", borderTop: "none",
                        borderRadius: "6px", backgroundColor: researchActive ? "rgba(229,239,255,0.6)" : undefined,
                        cursor: "pointer",
                      }}
                      onClick={() => setResearchOpen(o => !o)}
                    >
                      <GraduationCap className="hidden" size={14} style={{ opacity: 0.7, marginRight: "2px" }} />
                      {DESKTOP_LABELS[item.label] ?? item.label}
                      <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: researchOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </button>

                    {researchOpen && (
                      <div className="nav-drop nav-drop--research" onMouseEnter={openResearch} onMouseLeave={closeResearch}>
                <div className="pinstripe nav-drop__stripe" aria-hidden="true" />
                        <div className="nav-drop__head">
                          <p className="nav-label">Research &amp; data</p>
                          <Link href="/faq" onClick={() => setResearchOpen(false)} className="nav-link">
                            FAQ <ArrowUpRight size={13} />
                          </Link>
                        </div>
                        <IndexList items={researchHubLinks} columns={2} location={location} onNavigate={() => setResearchOpen(false)} />
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-active={active ? "true" : undefined}
                  className={`${item.href === "/" ? "header-nav-home " : ""}${item.href === "/bac-water" || item.label === "NAD+" ? "header-nav-extra " : ""}px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] inline-block transition-colors`}
                  style={{
                    borderRadius: "6px", backgroundColor: active ? "rgba(229,239,255,0.6)" : undefined,
                    color: active ? "var(--ink)" : undefined,
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none", marginBottom: "-1px",
                  }}
                  onMouseEnter={() => prefetchRoute(item.href)}
                >
                  {DESKTOP_LABELS[item.label] ?? item.label}
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
              className="px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] inline-flex items-center gap-1 transition-colors"
              style={{
                color: offersActive ? "var(--ink)" : undefined,
                fontWeight: offersActive ? 600 : 500,
                border: "none",
                borderRadius: "6px",
                backgroundColor: offersActive ? "rgba(229,239,255,0.6)" : undefined,
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
              Offers
              <ChevronDown size={13} style={{ opacity: 0.5, transition: "transform 0.2s", transform: offersOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {offersOpen && (
              <div
                id="header-incentive-offers-menu"
                className="nav-drop nav-drop--offers"
                onMouseEnter={openOffers}
                onMouseLeave={closeOffers}
              >
                <div className="pinstripe nav-drop__stripe" aria-hidden="true" />
                <div className="nav-drop__head">
                  <p className="nav-label">Offers</p>
                </div>
                <ol className="ilist">
                  {offerNavItems.map((item, index) => {
                    const active = location === item.href || location.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          ref={element => { offersLinkRefs.current[index] = element; }}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          data-active={active}
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
                          className="ilist__row"
                        >
                          <span className="ilist__text">
                            <span className="ilist__title">{item.label}</span>
                            <span className="ilist__desc">{item.desc}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
                <div className="nav-drop__tiers">
                  <BundleSpec onNavigate={() => setOffersOpen(false)} />
                </div>
              </div>
            )}
          </div>
          </nav>
          <div className="header-secondary-nav hidden 2xl:flex order-3 items-center">
            {rightNavItems.map((item) => (
              (() => {
                const active = location === item.href || location.startsWith(item.href + "/");
                return (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 my-1.5 text-[13px] whitespace-nowrap text-[#4B5569] hover:bg-[#EEF1F8] hover:text-[#22252C] transition-colors"
                style={{
                  color: active ? "var(--ink)" : undefined,
                  textDecoration: "none",
                  fontWeight: active ? 600 : 500,
                  borderRadius: "6px", backgroundColor: active ? "rgba(229,239,255,0.6)" : undefined,
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

          {/* Search */}
          <div
            className="header-search order-3 sm:order-2 lg:order-4 lg:ml-auto w-full sm:w-auto sm:flex-1 sm:max-w-[520px] lg:flex-none lg:w-[170px] lg:focus-within:w-[320px] lg:transition-[width] lg:duration-200"
            ref={containerRef}
            style={{ position: "relative" }}
          >
            {SearchBar}

            {/* Results dropdown */}
            {open && results.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                backgroundColor: "#fff",
                border: "1px solid var(--hairline)", borderTop: "none",
                borderRadius: "0 0 16px 16px",
                boxShadow: "0 12px 32px rgba(59, 98, 171,0.15)", zIndex: 600, overflow: "hidden",
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
                      backgroundColor: i === highlighted ? "rgba(78,104,194,0.08)" : "#fff",
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
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#22252C", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#4E68C2", flexShrink: 0 }}>
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
                    fontSize: "12px", fontWeight: 700, color: "#4E68C2",
                    backgroundColor: "#F0F5FF", border: "none",
                    borderTop: "1px solid #D3D8E2", cursor: "pointer",
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
                backgroundColor: "#fff", border: "1px solid var(--hairline)", borderTop: "none",
                borderRadius: "0 0 16px 16px", boxShadow: "0 12px 32px rgba(59, 98, 171,0.15)",
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
                        fontSize: "12px", fontWeight: 600, color: "#4E68C2",
                        backgroundColor: "rgba(78,104,194,0.08)", border: "1px solid #C8DDB4",
                        borderRadius: "8px", padding: "4px 11px", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#4E68C2";
                        (e.currentTarget as HTMLElement).style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(78,104,194,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "#4E68C2";
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
                backgroundColor: "#fff", border: "1px solid var(--hairline)", borderTop: "none",
                borderRadius: "0 0 16px 16px", boxShadow: "0 12px 32px rgba(59, 98, 171,0.15)",
                zIndex: 600, padding: "16px 14px", textAlign: "center",
              }}>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 8px" }}>No peptides found for &ldquo;{searchQuery.trim()}&rdquo;</p>
                <button
                  onMouseDown={() => { navigate("/all-peptides"); setOpen(false); setSearchQuery(""); }}
                  style={{ fontSize: "12px", fontWeight: 600, color: "#4E68C2", background: "none", border: "none", cursor: "pointer" }}
                >
                  Browse all 81 peptides →
                </button>
              </div>
            )}
          </div>

          {/* Right group */}
          <div className="header-action-group order-2 sm:order-3 lg:order-5 ml-auto lg:ml-0 flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Phones and tablets: opens the hidden search row */}
            <button
              type="button"
              className="header-search-toggle lg:hidden"
              aria-label={mobileSearchOpen ? "Close search" : "Search peptides"}
              aria-expanded={mobileSearchOpen}
              onClick={() => {
                const next = !mobileSearchOpen;
                setMobileSearchOpen(next);
                if (next) requestAnimationFrame(() => inputRef.current?.focus());
                else { setOpen(false); setSearchQuery(""); inputRef.current?.blur(); }
              }}
            >
              {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Currency selector */}
            <div ref={currencyRef} className="header-currency-wrap" style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                className="header-currency-btn header-utility-button flex flex-col items-center sm:flex-row sm:gap-1"
                style={{
                  height: "36px", padding: "0 12px", borderRadius: "999px",
                  border: "1px solid var(--hairline)",
                  backgroundColor: "transparent",
                  cursor: "pointer", color: "var(--graphite)",
                }}
              >
                <span className="header-currency-flag" style={{ fontSize: "15px" }}>{currency.flag}</span>
                <span className="header-currency-code-mobile" style={{ display: "none", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>{currency.code}</span>
                <span className="header-mobile-label sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "var(--graphite)" }}>Currency</span>
                <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: 500 }}>{currency.code}</span>
                <span className="hidden sm:inline"><ChevronDown size={13} style={{ color: "var(--graphite)", opacity: 0.6 }} /></span>
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
                            backgroundColor: c.code === currency.code ? "rgba(78,104,194,0.08)" : "transparent",
                            textAlign: "left", transition: "background-color 0.1s",
                          }}
                          onMouseEnter={e => { if (c.code !== currency.code) (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC"; }}
                          onMouseLeave={e => { if (c.code !== currency.code) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                        >
                          <span style={{ fontSize: "15px", flexShrink: 0 }}>{c.flag}</span>
                          <span style={{ fontSize: "12.5px", fontWeight: 700, color: c.code === currency.code ? "#4E68C2" : "#22252C", minWidth: "34px" }}>{c.code}</span>
                          <span style={{ fontSize: "12px", color: "#64748B", flex: 1 }}>{c.label}</span>
                          {c.code === currency.code && (
                            <span style={{ color: "#4E68C2", fontSize: "13px", flexShrink: 0 }}>✓</span>
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
              <div ref={userMenuRef} className="header-user-wrap" style={{ position: "relative", flexShrink: 0 }}>
                  <button
                  onClick={() => setUserMenuOpen(o => !o)}
                    className="header-utility-button flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--graphite)", padding: 0,
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "rgba(78,104,194,0.08)", border: "1px solid var(--hairline)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <User size={14} color="var(--cobalt)" />
                  </div>
                  <span className="header-mobile-label sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "var(--graphite)" }}>Account</span>
                  <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: 600, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {customer.firstName}
                  </span>
                  <ChevronDown size={12} style={{ color: "var(--graphite)", opacity: 0.6 }} className="hidden sm:block" />
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
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#22252C", marginBottom: "2px" }}>
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
                className="header-signin header-icon-btn flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-bold transition-colors"
                style={{ color: "var(--graphite)", textDecoration: "none", height: "36px", padding: "0 14px", borderRadius: "999px", border: "1px solid var(--hairline)", fontWeight: 500, fontSize: "13px", backgroundColor: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ice)"; prefetchRoute("/sign-in"); }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--graphite)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <User size={16} />
                <span className="header-mobile-label sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "var(--graphite)" }}>Sign in</span>
                <span className="hidden sm:inline">{loadingAuth ? "" : "Sign In"}</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="header-cart header-icon-btn flex flex-col items-center sm:flex-row sm:gap-1.5 text-sm font-bold transition-colors relative"
              style={{ color: "var(--graphite)", textDecoration: "none", height: "36px", padding: "0 14px", borderRadius: "999px", border: "1px solid var(--hairline)", fontWeight: 500, fontSize: "13px", backgroundColor: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ice)"; prefetchRoute("/cart"); }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--graphite)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <span className="relative">
                <ShoppingCart size={16} />
                {totalItems > 0 && (
                  <span
                    className="absolute flex items-center justify-center font-bold text-white rounded-full"
                    style={{
                      top: "-7px", right: "-8px",
                      minWidth: "16px", height: "16px",
                      backgroundColor: "var(--cobalt)", fontSize: "9px", padding: "0 3px", lineHeight: 1,
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
              <span className="header-mobile-label sm:hidden" style={{ fontSize: "9px", fontWeight: 500, lineHeight: 1, color: "var(--graphite)" }}>Cart</span>
              <span className="hidden sm:inline">Cart</span>
            </Link>

          </div>

        </div>
      </div>



      {/* Desktop mega menu: full width under the header bar */}
      {allPeptidesOpen && isDesktop && (
        <PeptideMegaMenu
          groups={peptideGroups}
          formatPrice={formatPrice}
          onNavigate={() => setAllPeptidesOpen(false)}
          onMouseEnter={openAllPeptides}
          onMouseLeave={closeAllPeptides}
        />
      )}

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
            {/* Navy band with the white wordmark, then the range pin stripe */}
            <div className="mnav-head" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
              <img src="/omniqure-wordmark-white.svg" alt="OmniQure" className="mnav-head__logo" />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu" className="mnav-head__close">
                <X size={18} />
              </button>
            </div>
            <div className="pinstripe" aria-hidden="true" />

            <div ref={drawerScrollRef} className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
              {drawerPanel === null ? (
                <div className="mnav">
                  {/* Main destinations: one large, scannable list */}
                  <ul className="mnav__primary">
                    <li>
                      <button type="button" className="mnav__item" onClick={() => openDrawerPanel("shop")}>
                        Shop peptides <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </li>
                    <li>
                      <button type="button" className="mnav__item" onClick={() => openDrawerPanel("research")}>
                        Research <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </li>
                    <li>
                      <Link href="/lab-reports" className="mnav__item" onClick={() => setMobileMenuOpen(false)}>Lab reports</Link>
                    </li>
                    <li>
                      <Link href="/calculator" className="mnav__item" onClick={() => setMobileMenuOpen(false)}>Calculator</Link>
                    </li>
                    <li>
                      <button type="button" className="mnav__item" onClick={() => openDrawerPanel("offers")}>
                        Offers <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </li>
                  </ul>

                  <DrawerPopular groups={peptideGroups} formatPrice={formatPrice} onNavigate={() => setMobileMenuOpen(false)} />

                  <Link href="/bundle-and-save" className="mnav__note" onClick={() => setMobileMenuOpen(false)}>
                    <span className="mnav__note-label">Bundle &amp; save</span>
                    Free 10ml BAC water with 3+ vials
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>

                  <ul className="mnav__secondary">
                    {[
                      { label: "About us", href: "/about" },
                      { label: "Contact us", href: "/contact" },
                      { label: "FAQ", href: "/faq" },
                    ].map(item => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>

                  {/* Account: a navy panel so sign-in stands out */}
                  <div className="mnav__account">
                    {customer ? (
                      <>
                        <p className="mnav__account-hello">Signed in{customer.firstName ? ` as ${customer.firstName}` : ""}</p>
                        <Link href="/account" className="mnav__account-cta" onClick={() => setMobileMenuOpen(false)}>
                          <User size={16} /> My account
                        </Link>
                        {isApprovedAffiliate && (
                          <Link href="/affiliate" className="mnav__account-link" onClick={() => setMobileMenuOpen(false)}>
                            <Users size={16} /> Partner dashboard
                          </Link>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mnav__account-hello">Track orders, reorder and earn rewards.</p>
                        <Link href="/sign-in" className="mnav__account-cta" onClick={() => setMobileMenuOpen(false)}>
                          <User size={16} /> Sign in
                        </Link>
                        <Link href="/sign-up" className="mnav__account-link mnav__account-link--center" onClick={() => setMobileMenuOpen(false)}>
                          New here? Create an account
                        </Link>
                      </>
                    )}
                    <div className="mnav__account-row">
                      <Link href="/wishlist" className="mnav__account-link" onClick={() => setMobileMenuOpen(false)}>
                        <Heart size={16} /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                      </Link>
                      <label className="mnav__currency">
                        <Globe size={16} /> <span className="sr-only">Currency</span>
                        <select value={currency.code} onChange={(e) => setCurrency(e.target.value as CurrencyCode)} aria-label="Currency">
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {customer && (
                      <button type="button" className="mnav__signout" onClick={() => { setMobileMenuOpen(false); void handleSignOut(); }}>
                        <LogOut size={16} /> Sign out
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mnav-panel">
                  <button type="button" className="mnav-panel__back" onClick={() => openDrawerPanel(null)}>
                    <ChevronLeft size={18} aria-hidden="true" /> Menu
                  </button>
                  <h2 className="mnav-panel__title">
                    {drawerPanel === "shop" ? "Shop peptides" : drawerPanel === "research" ? "Research" : "Offers"}
                  </h2>

                  {drawerPanel === "shop" && (
                    <DrawerShop groups={peptideGroups} formatPrice={formatPrice} onNavigate={() => setMobileMenuOpen(false)} />
                  )}

                  {drawerPanel === "research" && (
                    <ul className="mnav-list">
                      {[...researchHubLinks, { label: "FAQ", href: "/faq", desc: "Purity, storage, shipping and payment" }].map(link => (
                        <li key={link.href}>
                          <Link href={link.href} className="mnav-row" onClick={() => setMobileMenuOpen(false)}>
                            <span>
                              <span className="mnav-row__title">{link.label}</span>
                              <span className="mnav-row__desc">{link.desc}</span>
                            </span>
                            <ChevronRight size={16} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {drawerPanel === "offers" && (
                    <>
                      <BundleSpec onNavigate={() => setMobileMenuOpen(false)} />
                      <ul className="mnav-list mnav-list--after">
                        {offerNavItems.filter(item => item.href !== "/bundle-and-save").map(item => (
                          <li key={item.href}>
                            <Link href={item.href} className="mnav-row" onClick={() => setMobileMenuOpen(false)}>
                              <span>
                                <span className="mnav-row__title">{item.label}</span>
                                <span className="mnav-row__desc">{item.desc}</span>
                              </span>
                              <ChevronRight size={16} aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
