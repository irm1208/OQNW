import { useState } from "react";
import { Link, useParams } from "wouter";
import { products } from "@/data/products";
import { productDetails } from "@/data/productDetails";
import { ShoppingCart, Package, Thermometer, FlaskConical, Shield, Info, Truck, Minus, Plus } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "coa">("description");

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="hover:underline" style={{ color: "#1B5CB5" }}>
          ← Back to All Peptides
        </Link>
      </div>
    );
  }

  const detail = productDetails[product.id] ?? { id: product.id, description: "" };
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);


  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Research Warning Bar */}
      <div style={{ backgroundColor: "#fff8e1", borderBottom: "1px solid #ffe082" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-start gap-2">
          <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#e65100" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#5d4037" }}>
            <strong style={{ color: "#e65100" }}>Product Usage:</strong>{" "}
            THIS PRODUCT IS INTENDED AS A RESEARCH CHEMICAL ONLY. This designation allows the use of research chemicals
            strictly for in vitro testing and laboratory experimentation only. All product information available on this
            website is for educational purposes only. This product has not been approved by the FDA or any other
            regulatory body. Bodily introduction of any kind into humans or animals is strictly forbidden by law.
            This product should only be handled by licensed, qualified professionals.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex items-center gap-2 text-sm" style={{ color: "#666" }}>
          <Link href="/" className="hover:underline" style={{ color: "#1B5CB5" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:underline" style={{ color: "#1B5CB5" }}>
            All Peptides
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:underline"
            style={{ color: "#1B5CB5" }}
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: "#333" }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left: Product Label + Image Panel */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div
              className="border border-gray-300 rounded overflow-hidden"
              style={{ backgroundColor: "#fff" }}
            >
              {/* Label header */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ backgroundColor: "#f8f8f8", borderBottom: "1px solid #e0e0e0" }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#1B5CB5", letterSpacing: "0.12em" }}
                >
                  OmniQure
                </span>
                <div className="flex items-center gap-2">
                  {detail.refNumber && (
                    <span className="text-xs" style={{ color: "#888" }}>
                      REF {detail.refNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Product name on label */}
              <div
                className="px-3 pt-3 pb-2"
                style={{ borderBottom: "1px solid #e8e8e8" }}
              >
                <p className="font-bold leading-tight" style={{ fontSize: "17px", color: "#111" }}>
                  {product.name}
                </p>
              </div>

              {/* Scientific specs on label */}
              {(detail.casNumber || detail.formula || detail.molecularWeight) && (
                <div
                  className="px-3 py-2 space-y-0.5"
                  style={{ borderBottom: "1px solid #e8e8e8", backgroundColor: "#fafafa" }}
                >
                  {detail.casNumber && (
                    <p className="text-xs" style={{ color: "#444" }}>
                      <span className="font-semibold">CAS #:</span> {detail.casNumber}
                    </p>
                  )}
                  {detail.formula && (
                    <p className="text-xs" style={{ color: "#444" }}>
                      <span className="font-semibold">Formula:</span> {detail.formula}
                    </p>
                  )}
                  {detail.molecularWeight && (
                    <p className="text-xs" style={{ color: "#444" }}>
                      <span className="font-semibold">M.W.:</span> {detail.molecularWeight}
                    </p>
                  )}
                </div>
              )}

              {/* Purity bar */}
              <div
                className="px-3 py-2 flex items-center gap-2"
                style={{ borderBottom: "1px solid #e8e8e8" }}
              >
                <span className="text-xs font-bold" style={{ color: "#1B5CB5" }}>PURITY</span>
                <span className="text-xs font-semibold" style={{ color: "#222" }}>
                  {detail.purity || "99% HPLC"}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e0e0e0" }}>
                  <div className="h-full rounded-full" style={{ width: "99%", backgroundColor: "#1B5CB5" }} />
                </div>
              </div>

              {/* RUO disclaimer on label */}
              <div
                className="px-3 py-1.5"
                style={{ borderBottom: "1px solid #e8e8e8", backgroundColor: "#fff8f8" }}
              >
                <p className="text-xs" style={{ color: "#c62828" }}>
                  <strong>RUO</strong> — Research Use Only. Not for human or veterinary diagnostic use.
                </p>
              </div>

              {/* Product image */}
              <div
                className="relative flex items-center justify-center bg-white"
                style={{ minHeight: "260px", padding: "20px" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full object-contain"
                  style={{ maxHeight: "220px" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.25";
                  }}
                />
              </div>

              {/* Quality badges strip */}
              <div
                className="grid grid-cols-2 gap-px"
                style={{ borderTop: "1px solid #e0e0e0", backgroundColor: "#e0e0e0" }}
              >
                {[
                  { icon: <Shield size={12} />, text: "99% HPLC Purity" },
                  { icon: <Package size={12} />, text: "Lab Certified" },
                  { icon: <FlaskConical size={12} />, text: "Lab Tested" },
                  { icon: <Thermometer size={12} />, text: "Cold Chain" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-1.5 px-2 py-2 text-xs"
                    style={{ backgroundColor: "#fff", color: "#555" }}
                  >
                    <span style={{ color: "#1B5CB5" }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="flex-1">
            {/* Category tag */}
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="inline-block text-xs px-2 py-1 rounded mb-2 hover:opacity-80"
              style={{ backgroundColor: "#fff3f0", color: "#1B5CB5", border: "1px solid #fdddd6" }}
            >
              {product.category}
            </Link>

            {/* Title + FREE Shipping */}
            <h1 className="font-bold leading-tight mb-2" style={{ fontSize: "24px", color: "#111" }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded"
                  style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }}
                >
                  <Truck size={12} />
                  FREE Shipping
                </span>
              </div>

            {/* Quantity selector + Add to Cart */}
            <div className="mb-4">
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#666" }}>
                  Quantity
                </p>
                <div className="flex items-center gap-3 mb-3">
                  {/* Qty selector */}
                  <div
                    className="flex items-center rounded overflow-hidden"
                    style={{ border: "1px solid #ccc" }}
                  >
                    <button
                      onClick={decreaseQty}
                      className="flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ width: "36px", height: "40px", color: "#333" }}
                    >
                      <Minus size={14} />
                    </button>
                    <div
                      className="flex items-center justify-center text-sm font-semibold"
                      style={{ width: "44px", height: "40px", borderLeft: "1px solid #ccc", borderRight: "1px solid #ccc", color: "#111" }}
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={increaseQty}
                      className="flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ width: "36px", height: "40px", color: "#333" }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 rounded font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1B5CB5", height: "40px", fontSize: "15px", padding: "0 20px" }}
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>
                </div>

            </div>

            {/* Quick specs table */}
            <div className="rounded border border-gray-200 overflow-hidden mb-4">
              <table className="w-full text-sm">
                <tbody>
                  {detail.casNumber && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa", width: "140px" }}>CAS Number</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.casNumber}</td>
                    </tr>
                  )}
                  {detail.formula && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Formula</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.formula}</td>
                    </tr>
                  )}
                  {detail.molecularWeight && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Mol. Weight</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.molecularWeight}</td>
                    </tr>
                  )}
                  {detail.purity && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Purity</td>
                      <td className="py-2 px-3 text-xs font-semibold" style={{ color: "#2e7d32" }}>{detail.purity}</td>
                    </tr>
                  )}
                  {detail.appearance && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Appearance</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.appearance}</td>
                    </tr>
                  )}
                  {detail.storage && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Storage</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.storage}</td>
                    </tr>
                  )}
                  {detail.solubility && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Solubility</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.solubility}</td>
                    </tr>
                  )}
                  {detail.halfLife && (
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Half-Life</td>
                      <td className="py-2 px-3 text-xs" style={{ color: "#222" }}>{detail.halfLife}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 px-3 font-semibold text-xs" style={{ color: "#555", backgroundColor: "#fafafa" }}>Availability</td>
                    <td className="py-2 px-3 text-xs font-semibold" style={{ color: "#2e7d32" }}>
                      In Stock
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Also known as */}
            {detail.alsoKnownAs && (
              <p className="text-xs mb-3" style={{ color: "#777" }}>
                <strong>Also known as:</strong> {detail.alsoKnownAs}
              </p>
            )}

            {/* Research areas */}
            {detail.researchAreas && detail.researchAreas.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#555" }}>Research Areas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.researchAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded-sm text-xs"
                      style={{ backgroundColor: "#fff3f0", color: "#1B5CB5", border: "1px solid #fdddd6" }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs" style={{ color: "#aaa" }}>
              For research purposes only. Not for human or veterinary use. Must be 21+ to purchase.
            </p>
          </div>
        </div>

        {/* Description / COA Tabs */}
        <div className="mb-8">
          {/* Tab Bar */}
          <div
            className="flex border-b"
            style={{ borderColor: "#e0e0e0" }}
          >
            <button
              onClick={() => setActiveTab("description")}
              className="px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{
                color: activeTab === "description" ? "#1B5CB5" : "#555",
                borderBottom: activeTab === "description" ? "2px solid #1B5CB5" : "2px solid transparent",
                marginBottom: "-1px",
                backgroundColor: "transparent",
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("coa")}
              className="px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{
                color: activeTab === "coa" ? "#1B5CB5" : "#555",
                borderBottom: activeTab === "coa" ? "2px solid #1B5CB5" : "2px solid transparent",
                marginBottom: "-1px",
                backgroundColor: "transparent",
              }}
            >
              COA / HPLC / MS
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === "description" ? (
              <div style={{ maxWidth: "900px" }}>
                {/* Main description */}
                <div className="mb-6">
                  <p className="leading-relaxed" style={{ fontSize: "14px", color: "#333", lineHeight: "1.8" }}>
                    {detail.description}
                  </p>
                </div>

                {/* Long description (sections) */}
                {detail.longDescription && (
                  <div
                    className="mb-6 leading-relaxed"
                    style={{ fontSize: "14px", color: "#333", lineHeight: "1.8" }}
                  >
                    {detail.longDescription.split("\n\n").map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>
                )}

                {/* Sequence */}
                {detail.sequence && (
                  <div className="mb-5">
                    <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#111" }}>
                      Peptide Sequence
                    </h3>
                    <div
                      className="p-3 rounded font-mono text-xs break-all"
                      style={{ backgroundColor: "#f8f8f8", border: "1px solid #e8e8e8", color: "#333", lineHeight: "1.6" }}
                    >
                      {detail.sequence}
                    </div>
                  </div>
                )}

                {/* Research disclaimer block */}
                <div
                  className="p-4 rounded mt-6"
                  style={{ backgroundColor: "#fff8e1", border: "1px solid #ffe082" }}
                >
                  <p className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "#e65100" }}>
                    All Articles and Product Information
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#5d4037" }}>
                    ALL ARTICLES AND PRODUCT INFORMATION PROVIDED ON THIS WEBSITE ARE FOR INFORMATIONAL AND EDUCATIONAL
                    PURPOSES ONLY. The products offered on this website are furnished for in-vitro studies only. In-vitro
                    studies (Latin: in glass) are performed outside of the body. These products are not medicines or drugs
                    and have not been approved by the FDA to prevent, treat or cure any medical condition, ailment or
                    disease. Bodily introduction of any kind into humans or animals is strictly forbidden by law.
                  </p>
                </div>
              </div>
            ) : (
              /* COA / HPLC / MS Tab */
              <div style={{ maxWidth: "900px" }}>
                <div className="mb-6">
                  <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#111" }}>
                    Certificate of Analysis (COA)
                  </h3>
                  <div
                    className="p-6 rounded text-center"
                    style={{ backgroundColor: "#f8f8f8", border: "1px solid #e0e0e0" }}
                  >
                    <div className="mb-3">
                      <Shield size={36} className="mx-auto mb-2" style={{ color: "#1B5CB5" }} />
                      <p className="font-semibold text-sm" style={{ color: "#333" }}>Certificate of Analysis</p>
                      <p className="text-xs mt-1" style={{ color: "#666" }}>
                        {product.name} — Purity: {detail.purity || "99% HPLC"}
                      </p>
                    </div>
                    <div
                      className="text-left mx-auto rounded p-4 text-xs"
                      style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", maxWidth: "480px" }}
                    >
                      <table className="w-full">
                        <tbody>
                          <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Product Name</td>
                            <td className="py-1.5" style={{ color: "#222" }}>{product.name}</td>
                          </tr>
                          {detail.casNumber && (
                            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td className="py-1.5 font-semibold" style={{ color: "#555" }}>CAS Number</td>
                              <td className="py-1.5" style={{ color: "#222" }}>{detail.casNumber}</td>
                            </tr>
                          )}
                          {detail.formula && (
                            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Molecular Formula</td>
                              <td className="py-1.5" style={{ color: "#222" }}>{detail.formula}</td>
                            </tr>
                          )}
                          {detail.molecularWeight && (
                            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Molecular Weight</td>
                              <td className="py-1.5" style={{ color: "#222" }}>{detail.molecularWeight}</td>
                            </tr>
                          )}
                          <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Purity (HPLC)</td>
                            <td className="py-1.5 font-bold" style={{ color: "#2e7d32" }}>{detail.purity || "≥99%"}</td>
                          </tr>
                          {detail.appearance && (
                            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Appearance</td>
                              <td className="py-1.5" style={{ color: "#222" }}>{detail.appearance}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="py-1.5 font-semibold" style={{ color: "#555" }}>Manufacturer</td>
                            <td className="py-1.5" style={{ color: "#222" }}>OmniQure</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs mt-4" style={{ color: "#999" }}>
                      Full COA documentation available upon request for qualified researchers.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#111" }}>
                    High Performance Liquid Chromatography (HPLC)
                  </h3>
                  <div
                    className="p-6 rounded text-center"
                    style={{ backgroundColor: "#f8f8f8", border: "1px solid #e0e0e0" }}
                  >
                    <FlaskConical size={32} className="mx-auto mb-2" style={{ color: "#1B5CB5" }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: "#333" }}>HPLC Analysis</p>
                    <p className="text-xs" style={{ color: "#666" }}>
                      HPLC chromatogram confirms purity of{" "}
                      <strong style={{ color: "#2e7d32" }}>{detail.purity || "≥99%"}</strong>
                    </p>
                    <p className="text-xs mt-3" style={{ color: "#999" }}>
                      HPLC charts available upon request for qualified researchers.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#111" }}>
                    Mass Spectrometry (MS)
                  </h3>
                  <div
                    className="p-6 rounded text-center"
                    style={{ backgroundColor: "#f8f8f8", border: "1px solid #e0e0e0" }}
                  >
                    <Package size={32} className="mx-auto mb-2" style={{ color: "#1B5CB5" }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: "#333" }}>Mass Spectrometry Analysis</p>
                    {detail.molecularWeight && (
                      <p className="text-xs" style={{ color: "#666" }}>
                        Confirmed molecular weight: <strong style={{ color: "#222" }}>{detail.molecularWeight}</strong>
                      </p>
                    )}
                    <p className="text-xs mt-3" style={{ color: "#999" }}>
                      MS data available upon request for qualified researchers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research disclaimer */}
        <div
          className="mb-8 p-4 rounded"
          style={{ backgroundColor: "#fff8f0", border: "1px solid #fdddd6" }}
        >
          <h3 className="font-bold mb-2" style={{ fontSize: "13px", color: "#1B5CB5" }}>
            ⚠ Research Use Only Disclaimer
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
            The product described on this page is intended for in-vitro laboratory research use only. It is not a drug
            and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat,
            cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must
            be at least 21 years of age to purchase. By purchasing this product, you acknowledge that you are a
            qualified researcher and will use this product for legal, in-vitro research purposes only.
          </p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2
              className="font-bold mb-4 pb-2"
              style={{ fontSize: "18px", borderBottom: "2px solid #1B5CB5" }}
            >
              Related Products — {product.category}
            </h2>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}
            >
              {relatedProducts.map((related) => (
                <Link href={`/product/${related.id}`} key={related.id}>
                  <div className="border border-gray-200 rounded p-3 hover:shadow-md transition-shadow cursor-pointer bg-white h-full flex flex-col">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full object-contain mb-2"
                      style={{ height: "100px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p
                      className="text-sm font-medium leading-tight mb-2 flex-1 hover:underline"
                      style={{ color: "#1B5CB5" }}
                    >
                      {related.name}
                    </p>
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
