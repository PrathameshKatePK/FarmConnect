import { useState } from "react";

function Media() {
  const [media, setMedia] = useState([]);
const [search, setSearch] = useState("");
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);

    const newMedia = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setMedia((prevMedia) => [...prevMedia, ...newMedia]);
  };

  const handleDelete = (id) => {
    setMedia((prevMedia) =>
      prevMedia.filter((item) => item.id !== id)
    );
  };
const filteredMedia = media.filter((item) =>
  item.name.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Media Library
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage images and media used in FarmConnect.
          </p>
        </div>

        {/* Upload Button */}
        <label className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center cursor-pointer">
          + Add New

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search & Filter */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
  type="text"
  placeholder="Search media..."
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
/>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500">
            <option>All Media</option>
            <option>Images</option>
            <option>Videos</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <p
                  className="text-sm font-medium text-gray-800 truncate"
                  title={item.name}
                >
                  {item.name}
                </p>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-6 bg-white rounded-xl shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center p-6">
          <div className="text-6xl mb-4">
            🖼️
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No media found
          </h2>

          <p className="mt-2 text-sm text-gray-500 max-w-md">
            Upload images of products, crops, equipment and other
            agricultural items to use throughout FarmConnect.
          </p>

          <label className="mt-5 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
            Upload Media

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default Media;