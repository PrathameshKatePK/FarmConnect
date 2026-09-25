import { useEffect, useState } from "react";
import {
  getMedia,
  uploadMedia,
  deleteMedia,
} from "../../api/mediaApi";

function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [altText, setAltText] = useState("");

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMedia();

      if (response.success) {
        setMedia(response.data || []);
      } else {
        setError(response.message || "Failed to load media");
      }
    } catch (error) {
      console.error("Media fetch error:", error);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const response = await uploadMedia(
        selectedFile,
        altText
      );

      if (response.success) {
        setSelectedFile(null);
        setAltText("");

        document.getElementById("mediaFile").value = "";

        await fetchMedia();
      } else {
        setError(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteMedia(id);

      if (response.success) {
        setMedia((prevMedia) =>
          prevMedia.filter((item) => item.id !== id)
        );
      } else {
        setError(response.message || "Failed to delete media");
      }
    } catch (error) {
      console.error("Delete media error:", error);
      setError("Failed to delete media");
    }
  };

  const filteredMedia = media.filter((item) =>
    item.file_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const getImageUrl = (filePath) => {
    return `http://localhost/FarmConnect/${filePath}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const sizeInKB = Number(bytes) / 1024;

    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }

    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Media
          </h1>

          <p className="text-gray-500 mt-1">
            Manage uploaded images and media files.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {media.length} media file{media.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* File */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>

            <input
              id="mediaFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or WEBP. Maximum size: 5 MB.
            </p>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text
            </label>

            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium">
              {selectedFile.name}
            </span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg transition"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          Loading media...
        </div>
      )}

      {/* Empty */}
      {!loading && filteredMedia.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-3">🖼️</div>

          <h3 className="text-lg font-semibold text-gray-700">
            No media found
          </h3>

          <p className="text-gray-500 mt-1">
            Upload an image to see it here.
          </p>
        </div>
      )}

      {/* Media Grid */}
      {!loading && filteredMedia.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={getImageUrl(item.file_path)}
                  alt={item.alt_text || item.file_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-4">
                <h3
                  className="font-medium text-gray-800 truncate"
                  title={item.file_name}
                >
                  {item.file_name}
                </h3>

                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>
                    Type: {item.mime_type || "Image"}
                  </p>

                  <p>
                    Size: {formatFileSize(item.file_size)}
                  </p>

                  <p>
                    Uploaded:{" "}
                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <a
                    href={getImageUrl(item.file_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Media;