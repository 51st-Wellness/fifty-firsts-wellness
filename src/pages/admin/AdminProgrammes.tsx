import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Video,
  Edit,
  Plus,
  Play,
  Clock,
  Eye,
  EyeOff,
  Star,
  X,
} from "lucide-react";
import { fetchProgrammes, type Programme } from "@/api/programme.api";
import CreateProgrammeDialog from "@/components/admin/CreateProgrammeDialog";

// Type declaration for mux-player web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mux-player": {
        "stream-type"?: "on-demand" | "live";
        "playback-id"?: string;
        "metadata-video-title"?: string;
        "metadata-viewer-user-id"?: string;
        controls?: boolean;
        style?: React.CSSProperties;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
      };
    }
  }
}

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
            {/* @ts-ignore */}
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
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingProgramme, setViewingProgramme] = useState<Programme | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadProgrammes();
  }, []);

  async function loadProgrammes() {
    try {
      setLoading(true);
      const res = await fetchProgrammes({ page: 1, limit: 50 });
      setProgrammes((res.data as any)?.items || []);
    } catch (e) {
      toast.error("Failed to load programmes");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Programmes</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programmes</h1>
          <p className="text-gray-600 mt-1">
            {programmes.length} programme{programmes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Programme
        </button>
      </div>

      {programmes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No programmes yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first programme to get started
          </p>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Programme
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((programme) => (
            <div
              key={programme.productId}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 relative group">
                {programme.thumbnail ? (
                  <img
                    src={programme.thumbnail}
                    alt={programme.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Video className="h-12 w-12" />
                  </div>
                )}

                {/* Play Overlay */}
                {programme.muxPlaybackId && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => setViewingProgramme(programme)}
                      className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform scale-90 group-hover:scale-100"
                    >
                      <Play className="h-6 w-6 text-gray-800 ml-0.5" />
                    </button>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      programme.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {programme.isPublished ? (
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

                  {programme.isFeatured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {programme.title}
                </h3>

                {programme.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {programme.description}
                  </p>
                )}

                {/* Categories */}
                {programme.categories && programme.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {programme.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {programme.categories.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{programme.categories.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  {typeof programme.duration === "number" &&
                  programme.duration > 0 ? (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.round(programme.duration / 60)} min
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Processing...
                    </div>
                  )}

                  <button
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast("Edit functionality coming soon!", { icon: "ℹ️" });
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Programme Dialog */}
      <CreateProgrammeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={loadProgrammes}
      />

      {/* Mux Player Modal */}
      <MuxPlayerModal
        programme={viewingProgramme}
        onClose={() => setViewingProgramme(null)}
      />
    </div>
  );
};

export default AdminProgrammes;
