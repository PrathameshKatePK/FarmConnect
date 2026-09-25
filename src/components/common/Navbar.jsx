import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-green-600 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🌾</span>

            <span className="text-xl font-bold text-green-700">
              FarmConnect
            </span>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">

            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/about"
              className={navLinkClass}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={navLinkClass}
            >
              Contact
            </NavLink>

          </nav>


          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

            <Link
              to="/login"
              className="px-4 py-2 text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Register
            </Link>

          </div>


          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700"
            aria-label="Toggle menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t py-4">

            <nav className="flex flex-col gap-4">

              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                Products
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={navLinkClass}
              >
                Contact
              </NavLink>

              <div className="flex gap-3 pt-2">

                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-2 border border-green-600 text-green-700 rounded-lg"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Register
                </Link>

              </div>

            </nav>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;