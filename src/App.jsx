import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import Media from "./pages/admin/Media";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Reviews from "./pages/admin/Reviews";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Categories from "./pages/admin/Categories";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import MarketplaceProducts from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Home */}
        <Route
          path="/"
          element={
            <>
              <Navbar />

              <main className="min-h-screen">
                <Home />
              </main>

              <Footer />
            </>
          }
        />

        {/* Public Products */}
        <Route
          path="/products"
          element={
            <>
              <Navbar />

              <main className="min-h-screen">
                <MarketplaceProducts />
              </main>

              <Footer />
            </>
          }
        />
<Route
  path="/products/:id"
  element={
    <>
      <Navbar />

      <main className="min-h-screen">
        <ProductDetails />
      </main>

      <Footer />
    </>
  }
/>
        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="media"
            element={<Media />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="reviews"
            element={<Reviews />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;