import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const imageUrl = product.featured_image
    ? `http://localhost/FarmConnect/${product.featured_image}`
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">

      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-5xl">
            🌾
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">

        <div className="flex items-center justify-between gap-2">

          <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">
            {product.product_type === "PRODUCE"
              ? "Produce"
              : "Agricultural Supply"}
          </span>

          {product.status === "PUBLISHED" && (
            <span className="text-xs text-green-600">
              Available
            </span>
          )}

        </div>

        <h3 className="text-lg font-semibold text-gray-800 mt-3">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Seller: {product.seller || "Unknown seller"}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <div>
            <span className="text-xl font-bold text-green-700">
              ₹{Number(product.price).toFixed(2)}
            </span>

            <span className="text-sm text-gray-500 ml-1">
              / {product.unit}
            </span>
          </div>

        </div>

        <Link
          to={`/products/${product.id}`}
          className="block text-center mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View Product
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;