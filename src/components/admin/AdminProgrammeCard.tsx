import React from "react";
import {
  Clock,
  Play,
  Eye,
  EyeOff,
  Star,
  Edit,
  Trash2,
  Calendar,
  Video,
} from "lucide-react";
import { Programme } from "@/api/programme.api";

interface AdminProgrammeCardProps {
  programme: Programme;
  onView?: (programme: Programme) => void;
  onEdit?: (programme: Programme) => void;
  onDelete?: (programme: Programme) => void;
}

const AdminProgrammeCard: React.FC<AdminProgrammeCardProps> = ({
  programme,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Processing...";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on action buttons
    if ((e.target as HTMLElement).closest(".action-button")) {
      return;
    }

    if (onView) {
      onView(programme);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(programme);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(programme);
    }
  };

  return (
    <article
      className="group relative bg-gradient-to-br from-white via-slate-50/30 to-gray-50/30 border border-gray-200 rounded-3xl p-5 hover:shadow-2xl hover:scale-[1.02] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-300/50"
      onClick={handleCardClick}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-slate-100/40 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" />

      {/* Thumbnail Container */}
      <div className="relative z-10 overflow-hidden rounded-2xl mb-4">
        {programme.thumbnail ? (
          <img
            src={programme.thumbnail}
            alt={programme.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-xl"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-md">
            <Video className="w-12 h-12 text-white opacity-80" />
          </div>
        )}

        {/* Play overlay on hover - only if has video */}
        {programme.muxPlaybackId && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-600/80 via-slate-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play className="w-8 h-8 text-slate-600 fill-slate-600" />
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div
            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium shadow-lg ${
              programme.isPublished
                ? "bg-green-100/90 text-green-800 backdrop-blur-sm"
                : "bg-yellow-100/90 text-yellow-800 backdrop-blur-sm"
            }`}
          >
            {programme.isPublished ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                Draft
              </>
            )}
          </div>

          {programme.isFeatured && (
            <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-purple-100/90 text-purple-800 backdrop-blur-sm shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3 flex-1">
        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {programme.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(programme.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-slate-600 transition-colors leading-tight" style={{ fontFamily: '"League Spartan", sans-serif' }}>
          {programme.title}
        </h3>

        {programme.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {programme.description}
          </p>
        )}

        {/* Categories */}
        {programme.categories && programme.categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {programme.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {programme.categories.length > 2 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                +{programme.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="action-button text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="action-button text-red-600 hover:text-red-800 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AdminProgrammeCard;
