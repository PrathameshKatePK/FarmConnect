import { useState } from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      to: "/admin/media",
      icon: "🖼️",
      label: "Media",
    },
    {
      to: "/admin/users",
      icon: "👥",
      label: "Users",
    },
    {
      to: "/admin/products",
      icon: "🌾",
      label: "Products",
    },
    {
      to: "/admin/categories",
      icon: "🗂️",
      label: "Categories",
    },
    {
      to: "/admin/orders",
      icon: "📦",
      label: "Orders",
    },
    {
      to: "/admin/reviews",
      icon: "⭐",
      label: "Reviews",
    },
    {
      to: "/admin/reports",
      icon: "📊",
      label: "Reports",
    },
    {
      to: "/admin/settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          w-64 min-h-screen
          bg-gray-900 text-white
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            🌾 FarmConnect
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-900 text-white w-10 h-10 rounded-lg shadow-md"
      >
        ☰
      </button>
    </>
  );
}

export default AdminSidebar;
