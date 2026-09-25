import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboardApi";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboard();

      if (response.success) {
        setDashboard(response.data);
      } else {
        setError(response.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to FarmConnect
        </h1>

        <p className="mt-2 text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to FarmConnect
        </h1>

        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  const { users, products, orders } = dashboard;

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to FarmConnect
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your marketplace from here.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

        {/* Total Users */}
        <DashboardCard
          title="Total Users"
          value={users.total_users}
          icon="👥"
        />

        {/* Farmers */}
        <DashboardCard
          title="Farmers"
          value={users.total_farmers}
          icon="👨‍🌾"
          valueClass="text-green-600"
        />

        {/* Products */}
        <DashboardCard
          title="Products"
          value={products.total_products}
          icon="🌾"
        />

        {/* Orders */}
        <DashboardCard
          title="Orders"
          value={orders.total_orders}
          icon="📦"
        />

      </div>

      {/* Additional Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">

        <DashboardCard
          title="Buyers"
          value={users.total_buyers}
          icon="🛒"
        />

        <DashboardCard
          title="Suppliers"
          value={users.total_suppliers}
          icon="🏪"
        />

        <DashboardCard
          title="Total Sales"
          value={`₹${Number(orders.total_sales).toFixed(2)}`}
          icon="💰"
          valueClass="text-green-600"
        />

        <DashboardCard
          title="Processing Orders"
          value={orders.processing_orders}
          icon="🔄"
          valueClass="text-orange-600"
        />

      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">

        {/* Product Overview */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Product Overview
          </h2>

          <div className="space-y-3">
            <OverviewRow
              label="Total Products"
              value={products.total_products}
            />

            <OverviewRow
              label="Produce"
              value={products.total_produce}
            />

            <OverviewRow
              label="Agricultural Supplies"
              value={products.total_supplies}
            />
          </div>
        </div>

        {/* Order Overview */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Overview
          </h2>

          <div className="space-y-3">
            <OverviewRow
              label="Pending"
              value={orders.pending_orders}
            />

            <OverviewRow
              label="Processing"
              value={orders.processing_orders}
            />

            <OverviewRow
              label="Shipped"
              value={orders.shipped_orders}
            />

            <OverviewRow
              label="Delivered"
              value={orders.delivered_orders}
            />

            <OverviewRow
              label="Cancelled"
              value={orders.cancelled_orders}
            />
          </div>
        </div>

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Dashboard Card
|--------------------------------------------------------------------------
*/

function DashboardCard({
  title,
  value,
  icon,
  valueClass = "text-gray-800",
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${valueClass}`}>
            {value}
          </h2>
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
| Overview Row
|--------------------------------------------------------------------------
*/

function OverviewRow({ label, value }) {
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

export default Dashboard;