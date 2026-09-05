import { useState } from "react";

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingUserId, setEditingUserId] = useState(null);

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "Farmer",
  status: "Active",
});
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rajesh Patil",
      email: "rajesh@example.com",
      role: "Farmer",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Sharma",
      email: "amit@example.com",
      role: "Buyer",
      status: "Active",
    },
    {
      id: 3,
      name: "Suresh Agro",
      email: "suresh@example.com",
      role: "Supplier",
      status: "Active",
    },
    {
      id: 4,
      name: "Priya Deshmukh",
      email: "priya@example.com",
      role: "Farmer",
      status: "Blocked",
    },
  ]);

  const handleDelete = (id) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "Farmer",
    status: "Active",
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData(emptyForm);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All Status" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });
const handleInputChange = (event) => {
  const { name, value } = event.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleAddUser = (event) => {
  event.preventDefault();

  if (editingUserId !== null) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUserId
          ? { ...user, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
          : user
      )
    );
    closeModal();
    return;
  }

  const newUser = {
    id: Math.max(0, ...users.map((user) => user.id)) + 1,
    name: formData.name,
    email: formData.email,
    role: formData.role,
    status: formData.status,
  };

  setUsers((prevUsers) => [...prevUsers, newUser]);

  closeModal();
};
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage Farmers, Buyers, Suppliers and Admins.
          </p>
        </div>

        <button
  onClick={() => {
    setEditingUserId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  }}
  className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  + Add User
</button>
      </div>

      {/* Search & Filters */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>All Roles</option>
            <option>Farmer</option>
            <option>Buyer</option>
            <option>Supplier</option>
            <option>Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Role
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm text-gray-600">
                      #{user.id}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {user.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
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
                    colSpan="5"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Count */}
      <p className="mt-4 text-sm text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </p>
      {/* Add User Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {editingUserId ? "Edit User" : "Add New User"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {editingUserId ? "Update this FarmConnect user's details." : "Create a new FarmConnect user."}
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
      <form onSubmit={handleAddUser} className="p-6 space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter full name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required={!editingUserId}
            placeholder="Enter email address"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleInputChange}
  required={!editingUserId}
  placeholder={
    editingUserId
      ? "Leave blank to keep the current password"
      : "Enter password"
  }
  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
/>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Farmer</option>
            <option>Buyer</option>
            <option>Supplier</option>
            <option>Admin</option>
          </select>
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
            <option>Blocked</option>
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
            {editingUserId ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Users;
