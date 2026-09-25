import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

const types = [
  "PRODUCE",
  "AGRICULTURAL_SUPPLY",
];

const statuses = [
  "ACTIVE",
  "INACTIVE",
];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  parent_id: "",
  type: "PRODUCE",
  status: "ACTIVE",
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500";

function Field({
  label,
  name,
  value,
  onChange,
  options,
  ...props
}) {
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
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
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

function Categories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const [editingCategoryId, setEditingCategoryId] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      console.log(
        "Categories API Response:",
        response
      );

      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError(
          response.message ||
            "Failed to load categories"
        );
      }
    } catch (error) {
      console.error(
        "Categories API Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const updateForm = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingCategoryId(null);
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    setFormData(emptyForm);
  };

  // =========================
  // EDIT CATEGORY
  // =========================

  const editCategory = (category) => {
    setEditingCategoryId(category.id);

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      parent_id: category.parent_id || "",
      type: category.type || "PRODUCE",
      status: category.status || "ACTIVE",
    });

    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const saveCategory = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const slug =
        formData.slug.trim() ||
        formData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const payload = {
        name: formData.name.trim(),
        slug,
        description:
          formData.description.trim() || null,
        parent_id: formData.parent_id
          ? Number(formData.parent_id)
          : null,
        type: formData.type,
        status: formData.status,
      };

      console.log(
        "Category Payload:",
        payload
      );

      let response;

      if (editingCategoryId) {
        response = await updateCategory(
          editingCategoryId,
          payload
        );
      } else {
        response = await createCategory(
          payload
        );
      }

      console.log(
        "Category Save Response:",
        response
      );

      if (!response.success) {
        setError(
          response.message ||
            "Failed to save category"
        );
        return;
      }

      setMessage(
        editingCategoryId
          ? "Category updated successfully."
          : "Category created successfully."
      );

      await fetchCategories();

      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 800);

    } catch (error) {
      console.error(
        "Category Save Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save category"
      );
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await deleteCategory(id);

      console.log(
        "Category Delete Response:",
        response
      );

      if (!response.success) {
        setError(
          response.message ||
            "Failed to delete category"
        );
        return;
      }

      setMessage(
        "Category deleted successfully."
      );

      await fetchCategories();

    } catch (error) {
      console.error(
        "Category Delete Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredCategories =
    categories.filter((category) => {
      const value =
        search.toLowerCase();

      return (
        String(category.name || "")
          .toLowerCase()
          .includes(value) ||
        String(category.slug || "")
          .toLowerCase()
          .includes(value) ||
        String(category.type || "")
          .toLowerCase()
          .includes(value)
      );
    });

  if (loading) {
    return (
      <div className="p-6">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage product categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Category
        </button>

      </div>

      {/* MESSAGES */}

      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={inputClass}
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-4">
                ID
              </th>

              <th className="text-left px-5 py-4">
                Name
              </th>

              <th className="text-left px-5 py-4">
                Slug
              </th>

              <th className="text-left px-5 py-4">
                Type
              </th>

              <th className="text-left px-5 py-4">
                Status
              </th>

              <th className="text-left px-5 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map(
                (category) => (
                  <tr
                    key={category.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">
                      {category.id}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {category.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {category.slug}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {category.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.status ===
                          "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() =>
                            editCategory(
                              category
                            )
                          }
                          className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <h2 className="text-lg font-semibold text-gray-800">
                {editingCategoryId
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={saveCategory}
              className="p-6 space-y-4"
            >

              <Field
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={updateForm}
                type="text"
                required
                placeholder="Enter category name"
              />

              <Field
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={updateForm}
                type="text"
                placeholder="Enter category slug"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={updateForm}
                  rows="3"
                  className={inputClass}
                  placeholder="Enter description"
                />
              </div>

              <Field
                label="Parent Category ID"
                name="parent_id"
                value={formData.parent_id}
                onChange={updateForm}
                type="number"
                min="1"
                placeholder="Optional"
              />

              <Field
                label="Type"
                name="type"
                value={formData.type}
                onChange={updateForm}
                options={types}
              />

              <Field
                label="Status"
                name="status"
                value={formData.status}
                onChange={updateForm}
                options={statuses}
              />

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

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
                  {editingCategoryId
                    ? "Save Changes"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;