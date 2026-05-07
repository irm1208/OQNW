import { Link, useParams } from "wouter";
import { products } from "@/data/products";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to All Peptides
        </Link>
      </div>
    );
  }

  const categoryProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:underline hover:text-gray-700">
            All Peptides
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:underline hover:text-gray-700"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-6 hover:underline"
          style={{ color: "#E7461E" }}
        >
          <ArrowLeft size={15} />
          Back to All Peptides
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Image */}
          <div className="flex-shrink-0 md:w-[400px]">
            <div
              className="border border-gray-200 rounded p-6 flex items-center justify-center bg-white relative"
              style={{ minHeight: "360px" }}
            >
              {/* Badge */}
              {product.soldOut && (
                <div
                  className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-sm"
                  style={{ backgroundColor: "#999", color: "#fff" }}
                >
                  Sold Out
                </div>
              )}
              {product.badge && !product.soldOut && (
                <div
                  className="absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase rounded-sm"
                  style={{
                    backgroundColor:
                      product.badge === "SAVE 15%" ? "#006BB4" : "#E7461E",
                    color: "#fff",
                  }}
                >
                  {product.badge}
                </div>
              )}

              {/* Peptide Sciences card watermark */}
              <div className="absolute top-3 left-3 text-xs text-gray-400 font-semibold tracking-wider uppercase">
                {product.soldOut ? "" : "Peptide Sciences"}
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="max-w-full object-contain"
                style={{ maxHeight: "300px" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23aaa'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="font-bold mb-4 leading-tight" style={{ fontSize: "26px" }}>
              {product.name}
            </h1>

            {product.price != null ? (
              <div className="mb-6">
                <span className="font-bold" style={{ fontSize: "28px", color: "#E7461E" }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 rounded-sm text-sm font-semibold"
                  style={{ backgroundColor: "#999", color: "#fff" }}
                >
                  Currently Out of Stock
                </span>
              </div>
            )}

            {/* Product details */}
            <div className="bg-gray-50 rounded border border-gray-200 p-4 mb-6">
              <table className="text-sm w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pr-4 font-semibold text-gray-600 w-32">Category</td>
                    <td className="py-2">
                      <Link
                        href={`/?category=${encodeURIComponent(product.category)}`}
                        className="hover:underline"
                        style={{ color: "#1979C3" }}
                      >
                        {product.category}
                      </Link>
                    </td>
                  </tr>
                  {product.badge && !product.soldOut && (
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-semibold text-gray-600">Type</td>
                      <td className="py-2">{product.badge}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 pr-4 font-semibold text-gray-600">Availability</td>
                    <td className="py-2">
                      {product.soldOut ? (
                        <span className="text-gray-500">Out of stock</span>
                      ) : (
                        <span style={{ color: "#2e7d32" }}>In stock</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA buttons */}
            {product.soldOut ? (
              <button
                className="w-full md:w-auto px-10 py-3 font-semibold rounded text-white mb-3"
                style={{ backgroundColor: "#999", cursor: "default", fontSize: "15px" }}
              >
                Notify Me When Available
              </button>
            ) : (
              <button
                className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-3 font-semibold rounded text-white hover:opacity-90 transition-opacity mb-3"
                style={{ backgroundColor: "#E7461E", fontSize: "15px" }}
              >
                <ShoppingCart size={18} />
                Add to Cart — ${product.price?.toFixed(2)}
              </button>
            )}

            <p className="text-xs text-gray-400 mt-2">
              For research purposes only. Not for human consumption.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {categoryProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="font-bold text-lg mb-5 border-b border-gray-200 pb-2">
              More in {product.category}
            </h2>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
            >
              {categoryProducts.map((related) => (
                <Link href={`/product/${related.id}`} key={related.id}>
                  <div className="border border-gray-200 rounded p-3 hover:shadow-md transition-shadow cursor-pointer bg-white">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full object-contain mb-2"
                      style={{ height: "120px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p
                      className="text-sm font-medium leading-tight hover:underline"
                      style={{ color: "#1979C3" }}
                    >
                      {related.name}
                    </p>
                    {related.price != null && (
                      <p className="text-sm font-bold mt-1" style={{ color: "#E7461E" }}>
                        ${related.price.toFixed(2)}
                      </p>
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
