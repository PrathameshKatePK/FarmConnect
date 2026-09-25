import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      <AdminSidebar />

      <div className="flex-1 min-w-0 flex flex-col">

        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;