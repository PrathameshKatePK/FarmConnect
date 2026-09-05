function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="ml-12 lg:ml-0">
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            👤
          </div>

          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;