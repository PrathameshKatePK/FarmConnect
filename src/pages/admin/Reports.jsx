import { useEffect, useState } from "react";
import { getReports } from "../../api/reportApi";

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReports();

      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.message || "Failed to load reports");
      }
    } catch (err) {
      console.error("Reports error:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!reports) {
    return null;
  }

  const {
    users,
    products,
    orders,
    reviews,
    top_products,
    order_status,
    monthly_sales,
  } = reports;

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Reports
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of FarmConnect platform activity
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <ReportCard
          title="Total Users"
          value={users.total_users}
          icon="👥"
        />

        <ReportCard
          title="Total Products"
          value={products.total_products}
          icon="🌾"
        />

        <ReportCard
          title="Total Orders"
          value={orders.total_orders}
          icon="📦"
        />

        <ReportCard
          title="Total Sales"
          value={`₹${Number(orders.total_sales).toFixed(2)}`}
          icon="💰"
        />

      </div>


      {/* User / Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Users */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Overview
          </h2>

          <div className="space-y-3">

            <ReportRow
              label="Admins"
              value={users.total_admins}
            />

            <ReportRow
              label="Farmers"
              value={users.total_farmers}
            />

            <ReportRow
              label="Buyers"
              value={users.total_buyers}
            />

            <ReportRow
              label="Suppliers"
              value={users.total_suppliers}
            />

          </div>
        </div>


        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Overview
          </h2>

          <div className="space-y-3">

            <ReportRow
              label="Total Products"
              value={products.total_products}
            />

            <ReportRow
              label="Produce"
              value={products.total_produce}
            />

            <ReportRow
              label="Agricultural Supplies"
              value={products.total_supplies}
            />

          </div>
        </div>

      </div>


      {/* Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm border p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>

          {order_status.length === 0 ? (
            <p className="text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="space-y-3">

              {order_status.map((item) => (
                <div
                  key={item.order_status}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="text-gray-600">
                    {item.order_status}
                  </span>

                  <span className="font-semibold text-gray-800">
                    {item.total}
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>


        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-5">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">

            <ReportRow
              label="Pending"
              value={orders.pending_orders}
            />

            <ReportRow
              label="Accepted"
              value={orders.accepted_orders}
            />

            <ReportRow
              label="Processing"
              value={orders.processing_orders}
            />

            <ReportRow
              label="Shipped"
              value={orders.shipped_orders}
            />

            <ReportRow
              label="Delivered"
              value={orders.delivered_orders}
            />

            <ReportRow
              label="Cancelled"
              value={orders.cancelled_orders}
            />

          </div>

        </div>

      </div>


      {/* Monthly Sales */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Sales
        </h2>

        {monthly_sales.length === 0 ? (
          <p className="text-gray-500">
            No sales data available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-2">
                    Month
                  </th>

                  <th className="py-3 px-2">
                    Orders
                  </th>

                  <th className="py-3 px-2">
                    Sales
                  </th>
                </tr>
              </thead>

              <tbody>

                {monthly_sales.map((item) => (
                  <tr
                    key={item.month}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 px-2 text-gray-700">
                      {item.month}
                    </td>

                    <td className="py-3 px-2">
                      {item.total_orders}
                    </td>

                    <td className="py-3 px-2 font-semibold">
                      ₹{Number(item.total_sales).toFixed(2)}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Products
        </h2>

        {top_products.length === 0 ? (
          <p className="text-gray-500">
            No product sales available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">

                  <th className="py-3 px-2">
                    Product
                  </th>

                  <th className="py-3 px-2">
                    Type
                  </th>

                  <th className="py-3 px-2">
                    Quantity Sold
                  </th>

                  <th className="py-3 px-2">
                    Sales
                  </th>

                </tr>
              </thead>

              <tbody>

                {top_products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-0"
                  >

                    <td className="py-3 px-2 font-medium text-gray-800">
                      {product.name}
                    </td>

                    <td className="py-3 px-2">
                      {product.product_type}
                    </td>

                    <td className="py-3 px-2">
                      {product.total_quantity}
                    </td>

                    <td className="py-3 px-2 font-semibold">
                      ₹{Number(product.total_sales).toFixed(2)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Review Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          <ReportCard
            title="Reviews"
            value={reviews.total_reviews}
            icon="⭐"
          />

          <ReportCard
            title="Average"
            value={Number(reviews.average_rating).toFixed(1)}
            icon="⭐"
          />

          <ReportCard
            title="5 Star"
            value={reviews.five_star || 0}
            icon="⭐⭐⭐⭐⭐"
          />

          <ReportCard
            title="4 Star"
            value={reviews.four_star || 0}
            icon="⭐⭐⭐⭐"
          />

          <ReportCard
            title="3 Star"
            value={reviews.three_star || 0}
            icon="⭐⭐⭐"
          />

          <ReportCard
            title="1–2 Star"
            value={
              Number(reviews.two_star || 0) +
              Number(reviews.one_star || 0)
            }
            icon="⭐"
          />

        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Report Card
|--------------------------------------------------------------------------
*/

function ReportCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>

        <div className="text-2xl">
          {icon}
        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Report Row
|--------------------------------------------------------------------------
*/

function ReportRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b last:border-0 pb-2">

      <span className="text-gray-600">
        {label}
      </span>

      <span className="font-semibold text-gray-800">
        {value}
      </span>

    </div>
  );
}

export default Reports;