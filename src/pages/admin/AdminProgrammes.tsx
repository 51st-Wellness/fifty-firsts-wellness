import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Video, Plus, X } from "lucide-react";
import {
  fetchProgrammes,
  type Programme,
  fetchSecureProgrammeById,
  deleteProgramme,
} from "@/api/programme.api";
import CreateProgrammeDialog from "@/components/admin/CreateProgrammeDialog";
import AdminProgrammeCard from "@/components/admin/AdminProgrammeCard";

// Mux Player Modal Component
const MuxPlayerModal: React.FC<{
  programme: Programme | null;
  onClose: () => void;
}> = ({ programme, onClose }) => {
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (programme?.productId) {
        setLoadingToken(true);
        try {
          const res = await fetchSecureProgrammeById(programme.productId);
          setPlaybackToken(res.playback?.signedToken || null);
        } catch (error) {
          console.error("Failed to fetch playback token", error);
          toast.error("Could not load video.");
        } finally {
          setLoadingToken(false);
        }
      }
    };

    fetchToken();
  }, [programme]);

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
            {loadingToken ? (
              <div className="w-full h-full flex items-center justify-center text-white">
                Loading video...
              </div>
            ) : playbackToken ? (
              <>
                {/* @ts-ignore */}
                <mux-player
                  stream-type="on-demand"
                  playback-id={programme.muxPlaybackId}
                  playback-token={playbackToken}
                  metadata-video-title={programme.title}
                  metadata-viewer-user-id="admin"
                  controls
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Could not load video.
              </div>
            )}
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
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(
    null
  );

  useEffect(() => {
    loadProgrammes();
  }, []);

  async function loadProgrammes() {
    try {
      setLoading(true);
      const res = await fetchProgrammes({
        page: 1,
        limit: 50,
        isPublished: undefined, // Admin should see all programmes (published and unpublished)
      });
      setProgrammes(res.data.data.items || []);
    } catch (e) {
      toast.error("Failed to load programmes");
      console.error("Error loading programmes:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProgramme(programme: Programme) {
    if (
      !confirm(
        `Are you sure you want to delete "${programme.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteProgramme(programme.productId);
      toast.success("Programme deleted successfully");
      loadProgrammes(); // Reload the list
    } catch (e: any) {
      console.error("Error deleting programme:", e);
      toast.error(e?.response?.data?.message || "Failed to delete programme");
    }
  }

  const handleEditProgramme = (programme: Programme) => {
    setEditingProgramme(programme);
  };

  const handleViewProgramme = (programme: Programme) => {
    setViewingProgramme(programme);
  };

  const handleCloseEditDialog = () => {
    setEditingProgramme(null);
  };

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
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programmes</h1>
          <p className="text-gray-600 mt-1">
            {programmes.length} programme{programmes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center">
          {/* Plus icon always aligned right */}
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors sm:hidden"
            aria-label="Create Programme"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Programme
          </button>
        </div>
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
            <AdminProgrammeCard
              key={programme.productId}
              programme={programme}
              onView={handleViewProgramme}
              onEdit={handleEditProgramme}
              onDelete={handleDeleteProgramme}
            />
          ))}
        </div>
      )}

      {/* Create Programme Dialog */}
      <CreateProgrammeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={loadProgrammes}
      />

      {/* Edit Programme Dialog */}
      <CreateProgrammeDialog
        open={!!editingProgramme}
        onClose={handleCloseEditDialog}
        onSuccess={() => {
          loadProgrammes();
          handleCloseEditDialog();
        }}
        editProgramme={editingProgramme}
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
