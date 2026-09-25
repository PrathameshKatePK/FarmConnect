import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-green-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="max-w-3xl">

            <p className="text-green-600 font-semibold mb-3">
              🌾 Welcome to FarmConnect
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Fresh From Farmers,
              <span className="text-green-600">
                {" "}Directly To You
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-8">
              Buy fresh agricultural produce directly from
              farmers and get quality agricultural supplies
              from trusted suppliers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/products"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Explore Products
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 border border-green-600 text-green-700 rounded-lg font-medium hover:bg-green-50 transition"
              >
                Join FarmConnect
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <h2 className="text-3xl font-bold text-gray-800">
              How FarmConnect Works
            </h2>

            <p className="mt-3 text-gray-600">
              A simple marketplace connecting everyone in
              the agricultural ecosystem.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <div className="bg-white border rounded-xl p-6 text-center shadow-sm">

              <div className="text-4xl">
                👨‍🌾
              </div>

              <h3 className="text-xl font-semibold mt-4">
                Farmers
              </h3>

              <p className="text-gray-600 mt-2">
                Sell your agricultural produce directly to
                buyers at your own price.
              </p>

            </div>


            <div className="bg-white border rounded-xl p-6 text-center shadow-sm">

              <div className="text-4xl">
                🛒
              </div>

              <h3 className="text-xl font-semibold mt-4">
                Buyers
              </h3>

              <p className="text-gray-600 mt-2">
                Discover and purchase fresh produce directly
                from farmers.
              </p>

            </div>


            <div className="bg-white border rounded-xl p-6 text-center shadow-sm">

              <div className="text-4xl">
                🏪
              </div>

              <h3 className="text-xl font-semibold mt-4">
                Suppliers
              </h3>

              <p className="text-gray-600 mt-2">
                Provide seeds, fertilizers, equipment and
                other agricultural supplies to farmers.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-green-600">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">

          <h2 className="text-3xl font-bold text-white">
            Ready to connect with the agricultural
            marketplace?
          </h2>

          <p className="text-green-100 mt-3">
            Explore products and connect directly with
            farmers and suppliers.
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;