import { useState } from "react";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

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

        <nav className="p-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600"
          >
            🏠
            <span>Dashboard</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            🖼️
            <span>Media</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            👥
            <span>Users</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            🌾
            <span>Products</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            📦
            <span>Orders</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            ⭐
            <span>Reviews</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            📊
            <span>Reports</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            ⚙️
            <span>Settings</span>
          </a>
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