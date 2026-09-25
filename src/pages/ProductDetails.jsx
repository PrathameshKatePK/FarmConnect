import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/productApi";
import { getLocation } from "../api/locationApi";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
const [location, setLocation] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");



  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProduct(id);

      if (response.success) {
        setProduct(response.data);

        if (response.data.location_id) {
          const locationResponse = await getLocation(
            response.data.location_id
          );

          if (locationResponse.success) {
            setLocation(locationResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl">🌾</div>

          <p className="text-gray-600 mt-3">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">

          <div className="text-5xl">🔍</div>

          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            {error || "The requested product could not be found."}
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Products
          </Link>

        </div>
      </div>
    );
  }

  const imageUrl = product.featured_image
    ? `http://localhost/FarmConnect/${product.featured_image}`
    : null;

  const isAvailable =
    product.status === "PUBLISHED" &&
    Number(product.quantity) > 0;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <div className="text-sm text-gray-500">

          <Link
            to="/"
            className="hover:text-green-600"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            to="/products"
            className="hover:text-green-600"
          >
            Products
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-700">
            {product.name}
          </span>

        </div>

      </div>


      {/* Product */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
<div className="bg-gray-100 min-h-[300px] flex items-center justify-center p-4">

  {imageUrl ? (
    <img
      src={imageUrl}
      alt={product.name}
      className="w-auto max-w-full max-h-[350px] object-contain rounded-lg"
    />
  ) : (
    <div className="text-8xl">
      🌾
    </div>
  )}

</div>


            {/* Details */}
            <div className="p-6 sm:p-8 lg:p-10">

              {/* Type */}
              <div className="flex items-center gap-3">

                <span className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  {product.product_type === "PRODUCE"
                    ? "Produce"
                    : "Agricultural Supply"}
                </span>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    isAvailable
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isAvailable
                    ? "Available"
                    : "Out of Stock"}
                </span>

              </div>


              {/* Name */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-5">
                {product.name}
              </h1>


              {/* Category */}
              {product.category && (
                <p className="text-gray-500 mt-2">
                  Category:{" "}
                  <span className="font-medium text-gray-700">
                    {product.category}
                  </span>
                </p>
              )}


              {/* Price */}
              <div className="mt-6">

                <span className="text-3xl font-bold text-green-700">
                  ₹{Number(product.price).toFixed(2)}
                </span>

                <span className="text-gray-500 ml-2">
                  / {product.unit}
                </span>

              </div>


              {/* Stock */}
              <div className="mt-5 p-4 bg-gray-50 rounded-lg">

                <p className="text-sm text-gray-500">
                  Available Quantity
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {Number(product.quantity)} {product.unit}
                </p>

              </div>


              {/* Seller */}
              <div className="mt-5 border-t pt-5">

                <p className="text-sm text-gray-500">
                  Seller
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.seller || "Unknown seller"}
                </p>

              </div>


{location && (
  <div className="mt-4">
    <h3 className="font-semibold text-gray-900">
      Location
    </h3>

    <p className="text-gray-600">
      {location.village}, {location.taluka}, {location.district},{" "}
      {location.state} - {location.pincode}
    </p>
  </div>
)}


              {/* Description */}
              {product.description && (
                <div className="mt-6 border-t pt-5">

                  <h2 className="font-semibold text-gray-800">
                    Description
                  </h2>

                  <p className="text-gray-600 mt-2 leading-7">
                    {product.description}
                  </p>

                </div>
              )}


              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">

                <button
                  disabled={!isAvailable}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                    isAvailable
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isAvailable
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

                <Link
                  to="/products"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-center hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ProductDetails;