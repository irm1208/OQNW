import { useState, type FormEvent } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./Refined.css";

const navItems = [
  ["Home", "#catalogue"],
  ["Shop Peptides", "#catalogue"],
  ["Bac Water", "#bac-water"],
  ["Lab Results", "#lab-results"],
  ["Research & Education", "#research"],
];

const currencies = ["GBP", "EUR", "USD"];

export function Refined() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("GBP");
  const [filterOpen, setFilterOpen] = useState(false);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(search.trim().length > 0);
  };

  return (
    <main className="refined-mobile-frame">
      <header className="refined-header">
        <div className="refined-header-main">
          <div className="refined-topline">
            <button
              className="refined-menu-toggle"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={19} strokeWidth={2.2} /> : <Menu size={19} strokeWidth={2.2} />}
              <span>Menu</span>
            </button>

            <a className="refined-logo-link" href="#catalogue" aria-label="OmniQure home">
              <img
                className="refined-logo"
                src="/__mockup/images/omniqure-wordmark.png"
                alt="OmniQure"
              />
            </a>

            <div className="refined-utility">
              <div className="refined-currency-wrap">
                <button
                  className="refined-utility-button"
                  aria-label={`Select currency, currently ${currency}`}
                  aria-expanded={currencyOpen}
                  onClick={() => setCurrencyOpen((open) => !open)}
                >
                  <span className="refined-utility-symbol">{currency}</span>
                  <span>Currency</span>
                </button>
                {currencyOpen && (
                  <div className="refined-currency-menu" role="menu" aria-label="Currency options">
                    <span className="refined-menu-kicker">Display prices in</span>
                    {currencies.map((option) => (
                      <button
                        key={option}
                        role="menuitem"
                        className={option === currency ? "is-selected" : ""}
                        onClick={() => {
                          setCurrency(option);
                          setCurrencyOpen(false);
                        }}
                      >
                        <span>{option}</span>
                        {option === currency ? <span aria-hidden="true">Selected</span> : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a className="refined-utility-button refined-account-button" href="#account" aria-label="Sign in">
                <User size={18} strokeWidth={2} />
                <span>Sign in</span>
              </a>

              <a className="refined-utility-button refined-wishlist-button" href="#wishlist" aria-label="Wishlist">
                <Heart size={18} strokeWidth={2} />
                <span>Wishlist</span>
              </a>

              <a className="refined-utility-button refined-cart-button" href="#cart" aria-label="Cart">
                <ShoppingCart size={18} strokeWidth={2} />
                <span className="refined-cart-count">0</span>
                <span>Cart</span>
              </a>
            </div>
          </div>

          <form className="refined-search-shell" onSubmit={submitSearch} role="search">
            <label className="refined-search">
              <Search size={17} strokeWidth={2.1} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearched(false);
                }}
                placeholder="Search peptides, categories..."
                aria-label="Search peptides and categories"
              />
              {search ? (
                <button
                  type="button"
                  className="refined-search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    setSearched(false);
                  }}
                >
                  <X size={14} />
                </button>
              ) : null}
              <button className="refined-search-submit" type="submit" aria-label="Search">
                <span>Search</span>
              </button>
            </label>
            {searched ? (
              <div className="refined-search-result" aria-live="polite">
                <span className="refined-result-label">Catalogue search</span>
                <strong>Browse peptides for “{search.trim()}”</strong>
              </div>
            ) : null}
          </form>
        </div>

        <nav className="refined-desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
              {label === "Shop Peptides" || label === "Research & Education" ? (
                <ChevronDown size={13} strokeWidth={2.2} />
              ) : null}
            </a>
          ))}
          <a href="#offers">Bundle &amp; Save</a>
        </nav>

        {menuOpen ? (
          <nav className="refined-mobile-drawer" aria-label="Mobile navigation">
            <div className="refined-drawer-heading">
              <span>Explore OmniQure</span>
              <span>Research supply, clearly presented.</span>
            </div>
            {navItems.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setMenuOpen(false)}>
                <span>{label}</span>
                <span aria-hidden="true">Open</span>
              </a>
            ))}
            <a href="#offers" onClick={() => setMenuOpen(false)}>
              <span>Bundle &amp; Save</span>
              <span aria-hidden="true">Open</span>
            </a>
            <a href="#wishlist" onClick={() => setMenuOpen(false)}>
              <span className="refined-drawer-wishlist"><Heart size={16} /> Wishlist</span>
              <span aria-hidden="true">Open</span>
            </a>
          </nav>
        ) : null}
      </header>

      <section className="refined-catalogue" id="catalogue">
        <div className="refined-catalogue-boundary">
          <span>OmniQure catalogue</span>
          <span>For qualified research use</span>
        </div>
        <div className="refined-catalogue-heading">
          <div>
            <span className="refined-eyebrow">Research-grade peptides</span>
            <h1>Explore the catalogue</h1>
            <p>Traceable compounds, clearly documented.</p>
          </div>
          <button
            className="refined-filter-button"
            type="button"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((open) => !open)}
          >
            Filter <ChevronDown size={15} />
          </button>
        </div>
        {filterOpen ? (
          <div className="refined-filter-menu" role="dialog" aria-label="Catalogue filters">
            <span>Showing all compounds</span>
            <button type="button" onClick={() => setFilterOpen(false)}>Clear filters</button>
          </div>
        ) : null}
        <div className="refined-product-grid">
          {[
            ["BPC-157", "Body Protection Compound", "From £34.00", "01"],
            ["TB-500", "Thymosin Beta-4", "From £39.00", "02"],
            ["GHK-Cu", "Copper Peptide", "From £29.00", "03"],
          ].map(([name, category, price, index]) => (
            <article className="refined-product-card" key={name}>
              <div className="refined-vial-art">
                <span className="refined-vial-index">{index}</span>
                <span className="refined-vial-mark">{name}</span>
                <span className="refined-vial-line" />
                <span className="refined-vial-copy">RESEARCH SERIES</span>
              </div>
              <span className="refined-card-category">{category}</span>
              <h2>{name}</h2>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Refined;