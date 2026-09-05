function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to FarmConnect
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your marketplace from here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">0</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Farmers</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">0</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Products</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">0</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Orders</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">0</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;