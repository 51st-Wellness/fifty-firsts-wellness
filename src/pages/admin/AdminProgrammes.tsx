import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createProgrammeUploadUrl,
  fetchProgrammes,
  uploadProgrammeThumbnail,
  type Programme,
} from "@/api/programme.api";

const AdminProgrammes: React.FC = () => {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(
    null
  );
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const uploaderRef = useRef<any>(null);

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

  async function handleCreate() {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setCreating(true);
    try {
      const { data } = await createProgrammeUploadUrl(title.trim());
      const payload = data?.data;
      if (!payload?.uploadUrl) throw new Error("No upload URL returned");

      toast.success("Programme created. Please select a video file...");

      // Create a file input for video selection
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "video/*";
      fileInput.style.display = "none";

      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setUploading(true);
        toast.loading("Uploading video...", { id: "upload" });

        try {
          // Create FormData for direct upload to Mux
          const formData = new FormData();
          formData.append("file", file);

          // Upload directly to Mux endpoint
          const response = await fetch(payload.uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (response.ok) {
            toast.success("Video uploaded successfully! Processing in Mux...", {
              id: "upload",
            });
            setUploading(false);
            setTitle("");
            loadProgrammes();
          } else {
            throw new Error("Upload failed");
          }
        } catch (error) {
          toast.error("Upload failed. Please try again.", { id: "upload" });
          setUploading(false);
        }
      };

      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create upload URL");
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

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Programmes</h1>

      <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-3">Create Programme</h2>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter programme title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create & Upload Video"}
          </button>
        </div>
        {uploading && (
          <div className="mt-3 text-sm text-gray-600">
            Upload in progress... keep this page open.
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Existing Programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programmes.map((p) => (
            <button
              key={p.productId}
              onClick={() => setSelectedProgramme(p)}
              className={`text-left border rounded-xl p-4 hover:border-indigo-300 transition ${
                selectedProgramme?.productId === p.productId
                  ? "border-indigo-400"
                  : "border-gray-200"
              }`}
            >
              <div className="flex gap-3">
                <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No thumbnail
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-500">
                    {p.isPublished ? "Published" : "Draft"}
                    {typeof p.duration === "number" && p.duration > 0
                      ? ` • ${Math.round(p.duration / 60)} min`
                      : ""}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedProgramme && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2">
              Selected: {selectedProgramme.title}
            </h3>
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                  className="block"
                />
              </div>
              <button
                onClick={handleThumbUpload}
                disabled={!thumbFile}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
              >
                Upload Thumbnail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProgrammes;
