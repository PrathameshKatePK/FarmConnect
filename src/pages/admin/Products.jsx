import { useState } from "react";

function Products() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Tomato",
      seller: "Rajesh Patil",
      type: "Produce",
      category: "Vegetables",
      price: 30,
      unit: "kg",
      stock: 500,
      status: "Active",
    },
    {
      id: 2,
      name: "Wheat",
      seller: "Suresh Farmer",
      type: "Produce",
      category: "Grains",
      price: 40,
      unit: "kg",
      stock: 1000,
      status: "Active",
    },
    {
      id: 3,
      name: "Hybrid Tomato Seeds",
      seller: "Agro Seeds Pvt Ltd",
      type: "Agricultural Supply",
      category: "Seeds",
      price: 450,
      unit: "packet",
      stock: 100,
      status: "Active",
    },
    {
      id: 4,
      name: "Organic Fertilizer",
      seller: "Green Agro Supplier",
      type: "Agricultural Supply",
      category: "Fertilizers",
      price: 800,
      unit: "bag",
      stock: 50,
      status: "Inactive",
    },
  ]);

  const emptyForm = {
    name: "",
    seller: "",
    type: "Produce",
    category: "Vegetables",
    price: "",
    unit: "kg",
    stock: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setFormData(emptyForm);
  };

  const handleAddProduct = (event) => {
    event.preventDefault();

    if (editingProductId !== null) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                name: formData.name,
                seller: formData.seller,
                type: formData.type,
                category: formData.category,
                price: Number(formData.price),
                unit: formData.unit,
                stock: Number(formData.stock),
                status: formData.status,
              }
            : product
        )
      );

      closeModal();
      return;
    }

    const newProduct = {
      id: Math.max(0, ...products.map((product) => product.id)) + 1,
      name: formData.name,
      seller: formData.seller,
      type: formData.type,
      category: formData.category,
      price: Number(formData.price),
      unit: formData.unit,
      stock: Number(formData.stock),
      status: formData.status,
    };

    setProducts((prevProducts) => [...prevProducts, newProduct]);

    closeModal();
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setFormData({
      name: product.name,
      seller: product.seller,
      type: product.type,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      status: product.status,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.seller.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All Types" || product.type === typeFilter;

    const matchesStatus =
      statusFilter === "All Status" || product.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      product.category === categoryFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesCategory
    );
  });

  return (
    <div>
      {/* Page Header */}
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
          onClick={() => {
            setEditingProductId(null);
            setFormData(emptyForm);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>All Types</option>
            <option>Produce</option>
            <option>Agricultural Supply</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>All Categories</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Seeds</option>
            <option>Fertilizers</option>
            <option>Crop Protection</option>
            <option>Equipment</option>
            <option>Tools</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Seller
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Type
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Stock
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm text-gray-600">
                      #{product.id}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {product.seller}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.type === "Produce"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      ₹{product.price} / {product.unit}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {product.stock} {product.unit}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
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

      {/* Product Count */}
      <p className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
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
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleAddProduct}
              className="p-6 space-y-4"
            >
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Seller */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seller
                </label>

                <input
                  type="text"
                  name="seller"
                  value={formData.seller}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter seller name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Produce</option>
                  <option>Agricultural Supply</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Seeds</option>
                  <option>Fertilizers</option>
                  <option>Crop Protection</option>
                  <option>Equipment</option>
                  <option>Tools</option>
                </select>
              </div>

              {/* Price + Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="Enter price"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>kg</option>
                    <option>quintal</option>
                    <option>ton</option>
                    <option>packet</option>
                    <option>bag</option>
                    <option>piece</option>
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter available stock"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Buttons */}
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
    </div>
  );
}

export default Products;