import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/userApi";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
const [editMode, setEditMode] = useState(false);
const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "BUYER",
    status: "ACTIVE",
  });


  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message);
      }

    } catch (error) {
      console.error("Users API Error:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // =========================
  // CREATE USER
  // =========================

 // =========================
// CREATE / UPDATE USER
// =========================

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setMessage("");

  try {
    let response;

    if (editMode) {
      // UPDATE EXISTING USER
      response = await updateUser(editingUserId, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      });
    } else {
      // CREATE NEW USER
      response = await createUser(formData);
    }

    if (response.success) {
      setMessage(
        editMode
          ? "User updated successfully."
          : "User created successfully."
      );

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "BUYER",
        status: "ACTIVE",
      });

      // Reset edit state
      setEditMode(false);
      setEditingUserId(null);
      setShowForm(false);

      // Refresh users
      fetchUsers();

    } else {
      setError(response.message);
    }

  } catch (error) {
    console.error(
      editMode ? "Update User Error:" : "Create User Error:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Failed to save user"
    );
  }
};
// =========================
// EDIT USER
// =========================

const handleEdit = (user) => {
  setEditMode(true);
  setEditingUserId(user.id);

  setShowForm(true);

  setError("");
  setMessage("");

  setFormData({
    username: user.username || "",
    email: user.email || "",
    password: "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    phone: user.phone || "",
    role: user.role || "BUYER",
    status: user.status || "ACTIVE",
  });
};

  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    setError("");
    setMessage("");

    const response = await deleteUser(id);

    console.log("Delete User Response:", response);

    if (response.success) {
      setMessage("User deleted successfully.");
      fetchUsers();
    } else {
      setError(response.error || response.message);
    }

  } catch (error) {
    console.error("Delete User Error:", error);

    setError(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to delete user"
    );
  }
};


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        Loading users...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage FarmConnect users
          </p>

        </div>


        <button
          onClick={() => {
  if (showForm) {
    setShowForm(false);
    setEditMode(false);
    setEditingUserId(null);
  } else {
    setShowForm(true);
    setEditMode(false);
    setEditingUserId(null);

    setFormData({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      role: "BUYER",
      status: "ACTIVE",
    });
  }

  setError("");
  setMessage("");
}}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg"
        >
          {showForm ? "Close Form" : "+ Add User"}
        </button>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}


      {/* ERROR MESSAGE */}

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      {/* ADD USER FORM */}

      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold mb-5">
  {editMode ? "Edit User" : "Add New User"}
</h2>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* Username */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

            </div>


            {/* Email */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

            </div>


            {/* Password */}

{!editMode && (
  <div>

    <label className="block text-sm font-medium mb-1">
      Password
    </label>

    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg px-3 py-2"
    />

  </div>
)}


            {/* First Name */}

            <div>

              <label className="block text-sm font-medium mb-1">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

            </div>


            {/* Last Name */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

            </div>


            {/* Phone */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

            </div>


            {/* Role */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="BUYER">Buyer</option>
                <option value="FARMER">Farmer</option>
                <option value="SUPPLIER">Supplier</option>
                <option value="ADMIN">Admin</option>
              </select>

            </div>


            {/* Status */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>

            </div>


            {/* Submit */}

            <div className="md:col-span-2 flex justify-end">

              <button
  type="submit"
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg"
>
  {editMode ? "Update User" : "Create User"}
</button>

            </div>

          </form>

        </div>

      )}


      {/* USERS TABLE */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-4">
                  ID
                </th>

                <th className="px-6 py-4">
                  Username
                </th>

                <th className="px-6 py-4">
                  Name
                </th>

                <th className="px-6 py-4">
                  Email
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-4">
                    {user.id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {user.username}
                  </td>

                  <td className="px-6 py-4">
                    {user.first_name} {user.last_name}
                  </td>

                  <td className="px-6 py-4">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    {user.status}
                  </td>

                  <td className="px-6 py-4">

  <div className="flex items-center gap-2">

    {/* EDIT */}

    <button
      onClick={() => handleEdit(user)}
      title="Edit user"
      className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
    >
      ✏️
    </button>


    {/* DELETE */}

    {Number(user.has_history) === 0 && (
      <button
        onClick={() => handleDelete(user.id)}
        title="Delete user"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
      >
        🗑️
      </button>
    )}

  </div>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Users;