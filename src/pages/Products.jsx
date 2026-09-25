import { useEffect, useState } from "react";
import ProductCard from "../components/marketplace/ProductCard";
import { getProducts } from "../api/productApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [productType, setProductType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.message || "Failed to load products");
      }
    } catch (err) {
      console.error("Products error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.seller
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      productType === "ALL" ||
      product.product_type === productType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <section className="bg-green-50 border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <p className="text-green-600 font-semibold">
            🌾 FarmConnect Marketplace
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
            Explore Products
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl">
            Discover fresh agricultural produce and quality
            agricultural supplies from farmers and suppliers.
          </p>

        </div>

      </section>


      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, category or seller..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

            </div>


            {/* Type */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>

              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">
                  All Products
                </option>

                <option value="PRODUCE">
                  Produce
                </option>

                <option value="AGRICULTURAL_SUPPLY">
                  Agricultural Supplies
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* Loading */}
        {loading && (
          <div className="text-center py-16">

            <div className="text-4xl">
              🌾
            </div>

            <p className="text-gray-600 mt-3">
              Loading products...
            </p>

          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}


        {/* Empty */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl border text-center py-16">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or product type filter.
            </p>

          </div>
        )}


        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold text-gray-800">
                Products
              </h2>

              <span className="text-sm text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          </>
        )}

      </section>

    </div>
  );
}

export default Products;