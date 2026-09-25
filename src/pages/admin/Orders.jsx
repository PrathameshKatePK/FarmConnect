import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Orders API Error:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    if (status === "ACCEPTED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "PROCESSING") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "SHIPPED") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "DELIVERED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      const response = await updateOrderStatus(
        selectedOrder.id,
        newStatus
      );

      if (!response.success) {
        alert(response.message || "Failed to update order status");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                order_status: newStatus,
              }
            : order
        )
      );

      setSelectedOrder({
        ...selectedOrder,
        order_status: newStatus,
      });
    } catch (error) {
      console.error("Update Order Status Error:", error);
      alert("Failed to update order status");
    }
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (order.buyer || "").toLowerCase().includes(searchText) ||
      (order.seller || "").toLowerCase().includes(searchText) ||
      (order.product || "").toLowerCase().includes(searchText) ||
      String(order.id).includes(searchText) ||
      (order.order_number || "").toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "All Types" ||
      order.order_type === typeFilter;

    const matchesPayment =
      paymentFilter === "All Payments" ||
      order.payment_status === paymentFilter;

    const matchesStatus =
      statusFilter === "All Status" ||
      order.order_status === statusFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesPayment &&
      matchesStatus
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Orders
      </h1>

      <p className="mt-2 text-gray-600">
        Manage FarmConnect orders from here.
      </p>

      {/* Filters */}

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg"
        />

        <div className="mt-4 flex flex-col sm:flex-row gap-3">

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option>All Types</option>
            <option value="PRODUCE">Produce</option>
            <option value="AGRICULTURAL_SUPPLY">
              Agricultural Supply
            </option>
          </select>

          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option>All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option>All Status</option>
            <option>PENDING</option>
            <option>ACCEPTED</option>
            <option>PROCESSING</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>

        </div>
      </div>

      {/* Table */}

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-gray-600">
            Loading orders...
          </p>
        ) : error ? (
          <p className="text-red-600">
            {error}
          </p>
        ) : (
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b"
                  >
                    <td className="px-4 py-3">
                      #{order.id}
                    </td>

                    <td className="px-4 py-3">
                      {order.buyer}
                    </td>

                    <td className="px-4 py-3">
                      {order.seller}
                    </td>

                    <td className="px-4 py-3">
                      {order.product}
                    </td>

                    <td className="px-4 py-3">
                      {order.order_type}
                    </td>

                    <td className="px-4 py-3">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">

          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="space-y-6">

              {/* Order Information */}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Information
                </h3>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Order ID:</strong>{" "}
                    #{selectedOrder.id}
                  </p>

                  <p>
                    <strong>Order Number:</strong>{" "}
                    {selectedOrder.order_number}
                  </p>

                  <p>
                    <strong>Product:</strong>{" "}
                    {selectedOrder.product}
                  </p>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {selectedOrder.quantity}{" "}
                    {selectedOrder.unit}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    ₹{Number(selectedOrder.price).toFixed(2)}
                  </p>

                  <p>
                    <strong>Total:</strong>{" "}
                    ₹{Number(selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Buyer */}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Buyer Information
                </h3>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.buyer}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.buyer_phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Seller */}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Seller Information
                </h3>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.seller}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.seller_phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Payment */}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Payment Information
                </h3>

                <div className="space-y-2 text-gray-600">

                  <p>
                    <strong>Method:</strong>{" "}
                    {selectedOrder.payment_method}
                  </p>

                  <p className="flex items-center gap-2">
                    <strong>Status:</strong>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {selectedOrder.payment_status}
                    </span>
                  </p>

                </div>
              </div>

              {/* Delivery */}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Delivery Information
                </h3>

                <div className="space-y-2 text-gray-600">

                  <p>
                    <strong>Order Date:</strong>{" "}
                    {selectedOrder.created_at}
                  </p>

                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {selectedOrder.delivery_address || "N/A"}
                  </p>

                  <p>
                    <strong>Expected Delivery:</strong>{" "}
                    {selectedOrder.expected_delivery || "N/A"}
                  </p>

                </div>
              </div>

            </div>

            {/* Update Status */}

            <div className="pt-4 mt-6 border-t">

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Update Order Status
              </h3>

              <select
                value={selectedOrder.order_status}
                onChange={(event) =>
                  handleStatusChange(event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

            </div>

            <div className="mt-6 text-right">

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;