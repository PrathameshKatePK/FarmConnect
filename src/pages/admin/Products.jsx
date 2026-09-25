import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../api/productApi";
import { getMedia } from "../../api/mediaApi";

const types = ["Produce", "Agricultural Supply"];

const categories = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Seeds",
  "Fertilizers",
  "Crop Protection",
  "Equipment",
  "Tools",
];

const units = ["kg", "quintal", "ton", "packet", "bag", "piece"];

const statuses = ["Active", "Inactive"];

const emptyForm = {
  seller_id: "",
  category_id: "",
  name: "",
  slug: "",
  description: "",
  product_type: "PRODUCE",
  price: "",
  unit: "kg",
  quantity: "",
  location_id: "",
  status: "DRAFT",
  featured_image: "",
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500";

const selectOptions = (options) =>
  options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));

function Field({ label, name, value, onChange, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
        >
          {selectOptions(options)}
        </select>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          {...props}
        />
      )}
    </div>
  );
}

function Badge({ value, active, supply }) {
  const color = active
    ? "bg-green-100 text-green-700"
    : supply
    ? "bg-yellow-100 text-yellow-700"
    : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}
    >
      {value}
    </span>
  );
}

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    type: "All Types",
    category: "All Categories",
    status: "All Status",
  });

  // Product modal
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Media modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      console.log("Products API Response:", response);

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Products API Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // OPEN MEDIA LIBRARY
  // =========================

  const openMediaLibrary = async () => {
    try {
      setMediaLoading(true);
      setMediaError("");

      const response = await getMedia();

      if (response.success) {
        setMedia(response.data || []);
        setIsMediaModalOpen(true);
      } else {
        setMediaError(
          response.message || "Failed to load media."
        );
      }
    } catch (error) {
      console.error("Media API Error:", error);

      setMediaError(
        error.response?.data?.message ||
          "Failed to load media."
      );
    } finally {
      setMediaLoading(false);
    }
  };

  // =========================
  // SELECT MEDIA
  // =========================

  const selectMedia = (item) => {
    setFormData((current) => ({
      ...current,
      featured_image: item.file_path,
    }));

    setIsMediaModalOpen(false);
  };

  // =========================
  // HANDLE FORM INPUT
  // =========================

  const updateForm = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE FILTER
  // =========================

  const updateFilter = (e) => {
    const { name, value } = e.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingProductId(null);
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // =========================
  // CLOSE PRODUCT MODAL
  // =========================

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData(emptyForm);
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const editProduct = (product) => {
    setEditingProductId(product.id);

    setFormData({
      seller_id: product.seller_id || "",
      category_id: product.category_id || "",
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      product_type: product.product_type || "PRODUCE",
      price: product.price || "",
      unit: product.unit || "kg",
      quantity: product.quantity ?? "",
      location_id: product.location_id || "",
      status: product.status || "DRAFT",
      featured_image: product.featured_image || "",
    });

    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const saveProduct = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const payload = {
        seller_id: Number(formData.seller_id),
        category_id: Number(formData.category_id),

        name: formData.name.trim(),

        slug:
          formData.slug.trim() ||
          formData.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),

        description: formData.description || null,

        product_type: formData.product_type,

        price: Number(formData.price),

        unit: formData.unit,

        quantity: Number(formData.quantity || 0),

        location_id: formData.location_id
          ? Number(formData.location_id)
          : null,

        status: formData.status,

        featured_image: formData.featured_image || null,
      };

      console.log("Product Payload:", payload);

      let response;

      if (editingProductId) {
        response = await updateProduct(
          editingProductId,
          payload
        );
      } else {
        response = await createProduct(payload);
      }

      console.log("Product Save Response:", response);

      if (!response.success) {
        setError(
          response.message || "Failed to save product"
        );
        return;
      }

      setMessage(
        editingProductId
          ? "Product updated successfully."
          : "Product created successfully."
      );

      await fetchProducts();

      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Product Save Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save product"
      );
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products.filter((product) => {
    const search = filters.search.toLowerCase();

    const productName = String(
      product.name || ""
    ).toLowerCase();

    const sellerName = String(
      product.seller || ""
    ).toLowerCase();

    return (
      (productName.includes(search) ||
        sellerName.includes(search)) &&
      (filters.type === "All Types" ||
        product.type === filters.type) &&
      (filters.category === "All Categories" ||
        product.category === filters.category) &&
      (filters.status === "All Status" ||
        product.status === filters.status)
    );
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage farm produce and agricultural supplies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* FILTERS */}

      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* SEARCH */}

          <input
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={updateFilter}
            className={inputClass}
          />

          {/* TYPE */}

          <select
            name="type"
            value={filters.type}
            onChange={updateFilter}
            className={inputClass}
          >
            {selectOptions([
              "All Types",
              ...types,
            ])}
          </select>

          {/* CATEGORY */}

          <select
            name="category"
            value={filters.category}
            onChange={updateFilter}
            className={inputClass}
          >
            {selectOptions([
              "All Categories",
              ...categories,
            ])}
          </select>

          {/* STATUS */}

          <select
            name="status"
            value={filters.status}
            onChange={updateFilter}
            className={inputClass}
          >
            {selectOptions([
              "All Status",
              ...statuses,
            ])}
          </select>

        </div>
      </div>

      {/* PRODUCTS TABLE */}

      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "ID",
                  "Product",
                  "Seller",
                  "Type",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="text-left px-5 py-4 text-sm font-semibold text-gray-600"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    {/* ID */}

                    <td className="px-5 py-4 text-sm text-gray-600">
                      #{product.id}
                    </td>

                    {/* PRODUCT */}

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </td>

                    {/* SELLER */}

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {product.seller}
                    </td>

                    {/* TYPE */}

                    <td className="px-5 py-4">
                      <Badge
                        value={product.type}
                        active={product.type === "Produce"}
                        supply
                      />
                    </td>

                    {/* PRICE */}

                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      ₹{product.price} / {product.unit}
                    </td>

                    {/* STOCK */}

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {product.quantity ?? 0}{" "}
                      {product.unit || ""}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <Badge
                        value={product.status}
                        active={
                          product.status === "Active"
                        }
                      />
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            editProduct(product)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setProducts((current) =>
                              current.filter(
                                (item) =>
                                  item.id !== product.id
                              )
                            )
                          }
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* RESULT COUNT */}

      <p className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of{" "}
        {products.length} products
      </p>

      {/* =====================================================
          ADD / EDIT PRODUCT MODAL
      ===================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingProductId
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingProductId
                    ? "Update product details."
                    : "Add a new product to FarmConnect."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={saveProduct}
              className="p-6 space-y-4"
            >

              <Field
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={updateForm}
                type="text"
                required
                placeholder="Enter product name"
              />

              <Field
                label="Seller ID"
                name="seller_id"
                value={formData.seller_id}
                onChange={updateForm}
                type="number"
                min="1"
                required
                placeholder="Enter seller ID"
              />

              <Field
                label="Category ID"
                name="category_id"
                value={formData.category_id}
                onChange={updateForm}
                type="number"
                min="1"
                required
                placeholder="Enter category ID"
              />

              <Field
                label="Product Type"
                name="product_type"
                value={formData.product_type}
                onChange={updateForm}
                options={[
                  "PRODUCE",
                  "AGRICULTURAL_SUPPLY",
                ]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Field
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={updateForm}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="Enter price"
                />

                <Field
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={updateForm}
                  options={units}
                />

              </div>

              <Field
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={updateForm}
                type="number"
                min="0"
                required
                placeholder="Enter available quantity"
              />

              {/* FEATURED IMAGE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>

                {formData.featured_image ? (
                  <div className="border border-gray-200 rounded-lg p-3">

                    <img
                      src={`http://localhost/FarmConnect/${formData.featured_image}`}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <div className="flex gap-3 mt-3">

                      <button
                        type="button"
                        onClick={openMediaLibrary}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                      >
                        Change Image
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            featured_image: "",
                          }))
                        }
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openMediaLibrary}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 transition"
                  >

                    <div className="text-3xl mb-2">
                      🖼️
                    </div>

                    <p className="font-medium text-gray-700">
                      Select from Media Library
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Choose an existing product image
                    </p>

                  </button>
                )}

              </div>

              <Field
                label="Status"
                name="status"
                value={formData.status}
                onChange={updateForm}
                options={[
                  "DRAFT",
                  "PUBLISHED",
                  "OUT_OF_STOCK",
                  "INACTIVE",
                ]}
              />

              {/* FORM BUTTONS */}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingProductId
                    ? "Save Changes"
                    : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          MEDIA LIBRARY MODAL
      ===================================================== */}

      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-hidden">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Select Product Image
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Choose an image from the Media Library.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMediaModalOpen(false)
                }
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            {/* MEDIA CONTENT */}

            <div className="p-6 overflow-y-auto max-h-[70vh]">

              {mediaLoading && (
                <div className="text-center py-10 text-gray-500">
                  Loading media...
                </div>
              )}

              {mediaError && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {mediaError}
                </div>
              )}

              {!mediaLoading && media.length === 0 && (
                <div className="text-center py-10 text-gray-500">

                  <div className="text-4xl mb-3">
                    🖼️
                  </div>

                  <p>
                    No media available.
                  </p>

                </div>
              )}

              {!mediaLoading && media.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                  {media.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        selectMedia(item)
                      }
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:border-green-500 hover:ring-2 hover:ring-green-200 transition text-left"
                    >

                      {/* IMAGE */}

                      <div className="aspect-square bg-gray-100">

                        <img
                          src={`http://localhost/FarmConnect/${item.file_path}`}
                          alt={
                            item.alt_text || "Media"
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />

                      </div>

                      {/* FILE NAME */}

                      <div className="p-2">

                        <p className="text-xs text-gray-600 truncate">
                          {item.file_name ||
                            item.alt_text ||
                            `Media #${item.id}`}
                        </p>

                      </div>

                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end px-6 py-4 border-t">

              <button
                type="button"
                onClick={() =>
                  setIsMediaModalOpen(false)
                }
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Products;