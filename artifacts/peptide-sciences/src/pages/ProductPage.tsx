import { Link, useParams } from "wouter";
import { products } from "@/data/products";
import { getProductDetail } from "@/data/productDetails";
import { ArrowLeft, ShoppingCart, Package, Thermometer, FlaskConical, Shield } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="hover:underline" style={{ color: "#E7461E" }}>
          ← Back to All Peptides
        </Link>
      </div>
    );
  }

  const detail = getProductDetail(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex items-center gap-2 text-sm" style={{ color: "#666" }}>
          <Link href="/" className="hover:underline" style={{ color: "#1979C3" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:underline" style={{ color: "#1979C3" }}>
            All Peptides
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:underline"
            style={{ color: "#1979C3" }}
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: "#333" }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-5 hover:underline"
          style={{ color: "#E7461E" }}
        >
          <ArrowLeft size={14} />
          Back to All Peptides
        </Link>

        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left: Image */}
          <div className="lg:w-[420px] flex-shrink-0">
            <div
              className="border border-gray-200 rounded p-6 flex items-center justify-center bg-white relative"
              style={{ minHeight: "380px" }}
            >
              {product.soldOut && (
                <div
                  className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-sm z-10"
                  style={{ backgroundColor: "#999", color: "#fff" }}
                >
                  Sold Out
                </div>
              )}
              {product.badge && !product.soldOut && (
                <div
                  className="absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase rounded-sm z-10"
                  style={{
                    backgroundColor: product.badge === "SAVE 15%" ? "#006BB4" : "#E7461E",
                    color: "#fff",
                  }}
                >
                  {product.badge}
                </div>
              )}
              <div className="absolute top-3 left-3 text-xs font-semibold tracking-wider uppercase" style={{ color: "#bbb" }}>
                Peptide Sciences
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full object-contain"
                style={{ maxHeight: "300px", marginTop: "20px" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                }}
              />
            </div>

            {/* Quality badges under image */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: <Shield size={14} />, text: "99% HPLC Purity" },
                { icon: <Package size={14} />, text: "USA Manufactured" },
                { icon: <FlaskConical size={14} />, text: "Lab Tested" },
                { icon: <Thermometer size={14} />, text: "Cold Chain Shipping" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-1.5 px-2 py-2 rounded text-xs"
                  style={{ backgroundColor: "#f9f9f9", border: "1px solid #eee", color: "#555" }}
                >
                  <span style={{ color: "#E7461E" }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1">
            {/* Category tag */}
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="inline-block text-xs px-2 py-1 rounded mb-2 hover:opacity-80"
              style={{ backgroundColor: "#fff3f0", color: "#E7461E", border: "1px solid #fdddd6" }}
            >
              {product.category}
            </Link>

            <h1 className="font-bold leading-tight mb-3" style={{ fontSize: "26px", color: "#111" }}>
              {product.name}
            </h1>

            {/* Price */}
            {product.price != null ? (
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-bold" style={{ fontSize: "30px", color: "#E7461E" }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: "#888" }}>USD</span>
              </div>
            ) : (
              <div className="mb-5">
                <span className="inline-block px-3 py-1.5 rounded text-sm font-semibold" style={{ backgroundColor: "#f0f0f0", color: "#666" }}>
                  Currently Out of Stock
                </span>
              </div>
            )}

            {/* Quick specs table */}
            <div className="rounded border border-gray-200 overflow-hidden mb-5">
              <table className="w-full text-sm">
                <tbody>
                  {detail.casNumber && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa", width: "160px" }}>CAS Number</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.casNumber}</td>
                    </tr>
                  )}
                  {detail.formula && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Formula</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.formula}</td>
                    </tr>
                  )}
                  {detail.molecularWeight && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Molecular Weight</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.molecularWeight}</td>
                    </tr>
                  )}
                  {detail.purity && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Purity</td>
                      <td className="py-2 px-3" style={{ color: "#2e7d32", fontWeight: 600 }}>{detail.purity}</td>
                    </tr>
                  )}
                  {detail.appearance && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Appearance</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.appearance}</td>
                    </tr>
                  )}
                  {detail.solubility && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Solubility</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.solubility}</td>
                    </tr>
                  )}
                  {detail.halfLife && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Half-Life</td>
                      <td className="py-2 px-3" style={{ color: "#222" }}>{detail.halfLife}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 px-3 font-semibold" style={{ color: "#555", backgroundColor: "#fafafa" }}>Availability</td>
                    <td className="py-2 px-3" style={{ color: product.soldOut ? "#999" : "#2e7d32", fontWeight: 600 }}>
                      {product.soldOut ? "Out of Stock" : "In Stock"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Also known as */}
            {detail.alsoKnownAs && (
              <p className="text-xs mb-4" style={{ color: "#777" }}>
                <strong>Also known as:</strong> {detail.alsoKnownAs}
              </p>
            )}

            {/* Research areas */}
            {detail.researchAreas && detail.researchAreas.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#555" }}>Research Areas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.researchAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded-sm text-xs"
                      style={{ backgroundColor: "#fff3f0", color: "#E7461E", border: "1px solid #fdddd6" }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {product.soldOut ? (
                <button
                  className="flex-1 py-3 rounded font-semibold text-white"
                  style={{ backgroundColor: "#999", cursor: "default", fontSize: "15px" }}
                >
                  Notify Me When Available
                </button>
              ) : (
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#E7461E", fontSize: "15px" }}
                >
                  <ShoppingCart size={18} />
                  Add to Cart — ${product.price?.toFixed(2)}
                </button>
              )}
              <Link
                href="/"
                className="flex-shrink-0 px-6 py-3 rounded font-semibold text-center hover:bg-orange-50 transition-colors"
                style={{ border: "1px solid #E7461E", color: "#E7461E", fontSize: "15px" }}
              >
                View All Peptides
              </Link>
            </div>

            <p className="text-xs" style={{ color: "#aaa" }}>
              For research purposes only. Not for human or veterinary use. Must be 21+ to purchase.
            </p>
          </div>
        </div>

        {/* Description section */}
        {detail.description && (
          <div className="mb-8">
            <h2 className="font-bold mb-3 pb-2" style={{ fontSize: "18px", borderBottom: "2px solid #E7461E" }}>
              Product Description
            </h2>
            <p className="leading-relaxed" style={{ fontSize: "14px", color: "#333", maxWidth: "900px" }}>
              {detail.description}
            </p>
          </div>
        )}

        {/* Sequence section */}
        {detail.sequence && (
          <div className="mb-8">
            <h2 className="font-bold mb-3 pb-2" style={{ fontSize: "18px", borderBottom: "2px solid #E7461E" }}>
              Peptide Sequence
            </h2>
            <div
              className="p-4 rounded font-mono text-sm break-all"
              style={{ backgroundColor: "#f8f8f8", border: "1px solid #e8e8e8", color: "#333" }}
            >
              {detail.sequence}
            </div>
          </div>
        )}

        {/* Storage section */}
        {detail.storage && (
          <div className="mb-8">
            <h2 className="font-bold mb-3 pb-2" style={{ fontSize: "18px", borderBottom: "2px solid #E7461E" }}>
              Storage & Handling
            </h2>
            <div
              className="flex gap-3 p-4 rounded"
              style={{ backgroundColor: "#f0f7ff", border: "1px solid #d0e8ff" }}
            >
              <Thermometer size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#006BB4" }} />
              <p style={{ fontSize: "14px", color: "#333" }}>{detail.storage}</p>
            </div>
          </div>
        )}

        {/* Research disclaimer */}
        <div
          className="mb-8 p-4 rounded"
          style={{ backgroundColor: "#fff8f0", border: "1px solid #fdddd6" }}
        >
          <h3 className="font-bold mb-2" style={{ fontSize: "14px", color: "#E7461E" }}>
            ⚠ Research Use Only Disclaimer
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
            The product described on this page is intended for in-vitro laboratory research use only. It is not a drug and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must be at least 21 years of age to purchase. By purchasing this product, you acknowledge that you are a qualified researcher and will use this product for legal, in-vitro research purposes only.
          </p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold mb-4 pb-2" style={{ fontSize: "18px", borderBottom: "2px solid #E7461E" }}>
              Related Products — {product.category}
            </h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {relatedProducts.map((related) => (
                <Link href={`/product/${related.id}`} key={related.id}>
                  <div className="border border-gray-200 rounded p-3 hover:shadow-md transition-shadow cursor-pointer bg-white h-full flex flex-col">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full object-contain mb-2"
                      style={{ height: "110px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p className="text-sm font-medium leading-tight mb-2 flex-1 hover:underline" style={{ color: "#1979C3" }}>
                      {related.name}
                    </p>
                    {related.price != null ? (
                      <p className="text-sm font-bold" style={{ color: "#E7461E" }}>
                        ${related.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-xs" style={{ color: "#999" }}>Out of stock</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
