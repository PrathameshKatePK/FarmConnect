import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>

              <h2 className="text-xl font-bold text-white">
                FarmConnect
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6">
              Connecting farmers, buyers and agricultural
              suppliers through a simple and reliable
              marketplace.
            </p>

          </div>


          {/* Quick Links */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <Link
                to="/"
                className="hover:text-white transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/about"
                className="hover:text-white transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="hover:text-white transition"
              >
                Contact
              </Link>

            </div>

          </div>


          {/* Marketplace */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Marketplace
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <Link
                to="/products"
                className="hover:text-white transition"
              >
                Fresh Produce
              </Link>

              <Link
                to="/products"
                className="hover:text-white transition"
              >
                Agricultural Supplies
              </Link>

              <Link
                to="/register"
                className="hover:text-white transition"
              >
                Become a Seller
              </Link>

            </div>

          </div>


          {/* Contact */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-sm">

              <p>📧 admin@farmconnect.com</p>

              <p>📞 +91 9876543210</p>

              <p>📍 Maharashtra, India</p>

            </div>

          </div>

        </div>

      </div>


      {/* Copyright */}
      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <p className="text-sm text-center">
            © {new Date().getFullYear()} FarmConnect.
            All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;