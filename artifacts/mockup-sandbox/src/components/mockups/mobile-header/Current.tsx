import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./_group.css";

/**
 * Current storefront header, extracted from OmniQure's Header.tsx.
 * Application contexts are intentionally represented by deterministic local
 * state so this baseline can be viewed without the storefront runtime.
 */
export function Current() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("🇬🇧 GBP");

  const navItems = [
    ["Home", "#catalogue"],
    ["Shop Peptides", "#catalogue"],
    ["Bac Water", "#bac-water"],
    ["Lab Results", "#lab-results"],
    ["Research & Education", "#research"],
  ];

  return (
    <main className="mobile-header-frame">
      <header className="oq-header">
        <div className="oq-header-inner">
          <button
            className="oq-menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
            <span>Menu</span>
          </button>

          <a className="oq-logo-link" href="#catalogue" aria-label="OmniQure home">
            <img
              className="oq-logo"
              src="/__mockup/images/omniqure-wordmark.png"
              alt="OmniQure"
            />
          </a>

          <div className="oq-actions">
            <div className="oq-currency-wrap">
              <button
                className="oq-action-button"
                aria-label="Select currency"
                onClick={() => setCurrencyOpen((open) => !open)}
              >
                <span>{currency.slice(0, 2)}</span>
                <small>Currency</small>
              </button>
              {currencyOpen && (
                <div className="oq-currency-menu">
                  {["🇬🇧 GBP", "🇪🇺 EUR", "🇺🇸 USD"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setCurrency(option);
                        setCurrencyOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a className="oq-action-button" href="#account" aria-label="Account">
              <User size={20} />
              <small>Account</small>
            </a>
            <a className="oq-cart-button" href="#cart" aria-label="Cart">
              <ShoppingCart size={20} />
              <span className="oq-cart-count">0</span>
              <small>Cart</small>
            </a>
          </div>

          <div className="oq-search-row">
            <label className="oq-search">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search peptides, categories..."
                aria-label="Search peptides and categories"
              />
              <Search size={17} />
            </label>
            {search && (
              <div className="oq-search-result">
                <strong>Search results</strong>
                <span>Browse peptides for “{search}”</span>
              </div>
            )}
          </div>
        </div>

        <nav className="oq-desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
              {label === "Shop Peptides" || label === "Research & Education" ? (
                <ChevronDown size={13} />
              ) : null}
            </a>
          ))}
          <a href="#offers">Bundle &amp; Save</a>
        </nav>

        {menuOpen && (
          <div className="oq-mobile-drawer">
            {navItems.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a href="#offers" onClick={() => setMenuOpen(false)}>Bundle &amp; Save</a>
            <a href="#wishlist" onClick={() => setMenuOpen(false)}>
              <Heart size={17} /> Wishlist
            </a>
          </div>
        )}
      </header>

      <section className="oq-catalogue" id="catalogue">
        <div className="oq-catalogue-heading">
          <div>
            <span className="oq-eyebrow">Research-grade peptides</span>
            <h1>Explore the catalogue</h1>
          </div>
          <button className="oq-filter-button">Filter <ChevronDown size={15} /></button>
        </div>
        <div className="oq-product-grid">
          {[
            ["BPC-157", "Body Protection Compound", "From £34.00"],
            ["TB-500", "Thymosin Beta-4", "From £39.00"],
            ["GHK-Cu", "Copper Peptide", "From £29.00"],
          ].map(([name, category, price]) => (
            <article className="oq-product-card" key={name}>
              <div className="oq-vial-art"><span>{name}</span></div>
              <span className="oq-card-category">{category}</span>
              <h2>{name}</h2>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Current;