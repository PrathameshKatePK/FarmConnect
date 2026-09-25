import { useEffect, useState } from "react";
import {
  getReviews,
  updateReview,
  deleteReview,
} from "../../api/reviewApi";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const [selectedReview, setSelectedReview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReviews();

      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError(response.message || "Failed to load reviews");
      }
    } catch (error) {
      console.error("Reviews fetch error:", error);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    const review = reviews.find((item) => item.id === id);

    if (!review) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await updateReview(id, {
        product_id: Number(review.product_id),
        buyer_id: Number(review.buyer_id),
        order_id: review.order_id
          ? Number(review.order_id)
          : null,
        rating: Number(review.rating),
        review: review.review,
        status,
        admin_note: review.admin_note,
      });

      if (response.success) {
        setReviews((prevReviews) =>
          prevReviews.map((item) =>
            item.id === id
              ? { ...item, status }
              : item
          )
        );

        if (selectedReview?.id === id) {
          setSelectedReview((prev) => ({
            ...prev,
            status,
          }));
        }
      } else {
        setError(
          response.message ||
            "Failed to update review status"
        );
      }
    } catch (error) {
      console.error("Review status update error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update review status"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      const response = await deleteReview(id);

      if (response.success) {
        setReviews((prevReviews) =>
          prevReviews.filter((item) => item.id !== id)
        );

        if (selectedReview?.id === id) {
          setSelectedReview(null);
        }
      } else {
        setError(
          response.message ||
            "Failed to delete review"
        );
      }
    } catch (error) {
      console.error("Review delete error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  const filteredReviews = reviews.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.buyer_name
        ?.toLowerCase()
        .includes(searchText) ||
      item.product_name
        ?.toLowerCase()
        .includes(searchText) ||
      item.review
        ?.toLowerCase()
        .includes(searchText) ||
      String(item.order_id || "")
        .includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      item.status === statusFilter;

    const matchesRating =
      ratingFilter === "ALL" ||
      Number(item.rating) === Number(ratingFilter);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRating
    );
  });

  const getStatusClass = (status) => {
    if (status === "PUBLISHED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "HIDDEN") {
      return "bg-gray-100 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Number(rating) || 0);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Reviews
          </h1>

          <p className="text-gray-500 mt-1">
            Manage customer reviews and ratings.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {reviews.length} review
          {reviews.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search buyer, product or review..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          {/* Rating */}
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="2">⭐⭐ 2</option>
            <option value="1">⭐ 1</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          Loading reviews...
        </div>
      )}

      {/* Empty */}
      {!loading && filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-3">
            ⭐
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No reviews found
          </h3>

          <p className="text-gray-500 mt-1">
            There are no reviews matching your filters.
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && filteredReviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    ID
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Buyer
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Rating
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Review
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredReviews.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50"
                  >
                    {/* ID */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      #{item.id}
                    </td>

                    {/* Buyer */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">
                        {item.buyer_name || "-"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {item.buyer_email || "-"}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {item.product_name || "-"}
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        {renderStars(item.rating)}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {item.rating}/5
                      </div>
                    </td>

                    {/* Review */}
                    <td className="px-5 py-4 max-w-xs">
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={item.review || ""}
                      >
                        {item.review || "No comment"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        disabled={updating}
                        onChange={(e) =>
                          handleStatusChange(
                            item.id,
                            e.target.value
                          )
                        }
                        className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusClass(
                          item.status
                        )}`}
                      >
                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="PUBLISHED">
                          Published
                        </option>

                        <option value="HIDDEN">
                          Hidden
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setSelectedReview(item)
                          }
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Review Details
              </h2>

              <button
                onClick={() =>
                  setSelectedReview(null)
                }
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Product */}
              <div>
                <p className="text-xs text-gray-500">
                  Product
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedReview.product_name || "-"}
                </p>
              </div>

              {/* Buyer */}
              <div>
                <p className="text-xs text-gray-500">
                  Buyer
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedReview.buyer_name || "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedReview.buyer_email || "-"}
                </p>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs text-gray-500">
                  Rating
                </p>

                <p className="mt-1">
                  {renderStars(selectedReview.rating)}
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedReview.rating}/5
                  </span>
                </p>
              </div>

              {/* Review */}
              <div>
                <p className="text-xs text-gray-500">
                  Review
                </p>

                <p className="text-gray-700 mt-1 bg-gray-50 rounded-lg p-4">
                  {selectedReview.review ||
                    "No comment provided."}
                </p>
              </div>

              {/* Order */}
              <div>
                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="text-gray-800 mt-1">
                  {selectedReview.order_id
                    ? `#${selectedReview.order_id}`
                    : "Not linked"}
                </p>
              </div>

              {/* Admin Note */}
              <div>
                <p className="text-xs text-gray-500">
                  Admin Note
                </p>

                <p className="text-gray-700 mt-1">
                  {selectedReview.admin_note ||
                    "No admin note."}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Status
                </p>

                <select
                  value={selectedReview.status}
                  disabled={updating}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedReview.id,
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded-lg border text-sm ${getStatusClass(
                    selectedReview.status
                  )}`}
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="HIDDEN">
                    Hidden
                  </option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Created
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    {selectedReview.created_at
                      ? new Date(
                          selectedReview.created_at
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Updated
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    {selectedReview.updated_at
                      ? new Date(
                          selectedReview.updated_at
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() =>
                  setSelectedReview(null)
                }
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleDelete(selectedReview.id)
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;