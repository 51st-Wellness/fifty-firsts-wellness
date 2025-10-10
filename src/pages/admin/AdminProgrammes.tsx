import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  X,
  Play,
  Clock,
  Eye,
  EyeOff,
  Star,
  Video,
  Edit,
} from "lucide-react";
import {
  createProgrammeWithVideo,
  fetchProgrammes,
  uploadProgrammeThumbnail,
  type Programme,
} from "@/api/programme.api";

// Mux Player Modal Component
const MuxPlayerModal: React.FC<{
  programme: Programme | null;
  onClose: () => void;
}> = ({ programme, onClose }) => {
  if (!programme || !programme.muxPlaybackId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {programme.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <mux-player
              stream-type="on-demand"
              playback-id={programme.muxPlaybackId}
              metadata-video-title={programme.title}
              metadata-viewer-user-id="admin"
              controls
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {programme.description && (
            <div className="text-gray-600">
              <h4 className="font-medium mb-2">Description</h4>
              <p>{programme.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminProgrammes: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(
    null
  );
  const [viewingProgramme, setViewingProgramme] = useState<Programme | null>(
    null
  );
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProgrammes();
  }, []);

  async function loadProgrammes() {
    try {
      const res = await fetchProgrammes({ page: 1, limit: 50 });
      setProgrammes((res.data as any)?.items || []);
    } catch (e) {
      toast.error("Failed to load programmes");
    }
  }

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
      } else {
        toast.error("Please select a video file");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
      } else {
        toast.error("Please select a video file");
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleCreateAndUpload() {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }

    setCreating(true);
    setUploading(true);

    try {
      toast.loading("Uploading video to backend...", { id: "upload" });
      setUploadProgress(0);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener("load", async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          toast.success("Programme created successfully!", { id: "upload" });
          setTitle("");
          setDescription("");
          clearSelectedFile();
          loadProgrammes();
        } else {
          const error = JSON.parse(xhr.responseText);
          throw new Error(error.message || "Upload failed");
        }
        setUploading(false);
        setUploadProgress(0);
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        toast.error("Upload failed. Please try again.", { id: "upload" });
        setUploading(false);
        setUploadProgress(0);
      });

      // Prepare form data
      const formData = new FormData();
      formData.append("title", title.trim());
      if (description.trim())
        formData.append("description", description.trim());
      formData.append("video", selectedFile);

      // Send request
      xhr.open("POST", "/api/product/programme/create-with-video");

      // Add auth header if needed
      const token = localStorage.getItem("token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create programme");
      setUploading(false);
      setUploadProgress(0);
    } finally {
      setCreating(false);
    }
  }

  async function handleThumbUpload() {
    if (!selectedProgramme?.productId || !thumbFile) return;
    try {
      await uploadProgrammeThumbnail(selectedProgramme.productId, thumbFile);
      toast.success("Thumbnail uploaded");
      setThumbFile(null);
      loadProgrammes();
    } catch (e) {
      toast.error("Failed to upload thumbnail");
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Programmes</h1>
        <div className="text-sm text-gray-500">
          {programmes.length} programme{programmes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Create New Programme */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Create New Programme
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme Title *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter programme title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Enter programme description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                rows={4}
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading to backend...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleCreateAndUpload}
              disabled={creating || uploading || !title.trim() || !selectedFile}
              className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Programme...
                </>
              ) : uploading ? (
                <>
                  <Upload className="h-4 w-4" />
                  Uploading Video...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Create Programme & Upload Video
                </>
              )}
            </button>
          </div>

          {/* Right Column - File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Video className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={clearSelectedFile}
                    className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drag and drop your video file here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supports MP4, MOV, AVI, MKV, WebM (max 500MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Existing Programmes */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Existing Programmes
        </h2>

        {programmes.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No programmes yet</p>
            <p className="text-gray-400 text-sm">
              Create your first programme above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((p) => (
              <div
                key={p.productId}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 relative group">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Video className="h-12 w-12" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  {p.muxPlaybackId && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => setViewingProgramme(p)}
                        className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform scale-90 group-hover:scale-100"
                      >
                        <Play className="h-6 w-6 text-gray-800 ml-0.5" />
                      </button>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        p.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.isPublished ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </>
                      )}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {p.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {p.title}
                  </h3>

                  {p.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {typeof p.duration === "number" && p.duration > 0 ? (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {Math.round(p.duration / 60)} min
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Processing...
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedProgramme(p)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thumbnail Upload Section */}
        {selectedProgramme && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Manage: {selectedProgramme.title}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {thumbFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {thumbFile.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleThumbUpload}
                  disabled={!thumbFile}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Upload Thumbnail
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mux Player Modal */}
      <MuxPlayerModal
        programme={viewingProgramme}
        onClose={() => setViewingProgramme(null)}
      />
    </div>
  );
};

export default AdminProgrammes;
