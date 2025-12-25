import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import {
  createProgrammeDraft,
  updateProgrammeDetails,
  type Programme,
} from "../../../../api/programme.api";
import type { ProgrammeFormData, DraftResponse } from "../types";

export const useProgrammeForm = (
  open: boolean,
  editProgramme?: Programme | null
) => {
  const [formData, setFormData] = useState<ProgrammeFormData>({
    title: "",
    description: "",
    videoFile: null,
    categories: [],
    thumbnailFile: null,
    isFeatured: false,
    isPublished: false,
  });

  const [draftResponse, setDraftResponse] = useState<DraftResponse | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backgroundUploadComplete, setBackgroundUploadComplete] =
    useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const isEditMode = !!editProgramme;

  // Initialize form data when in edit mode
  useEffect(() => {
    if (editProgramme && open) {
      setFormData({
        title: editProgramme.title || "",
        description: editProgramme.description || "",
        videoFile: null,
        categories: editProgramme.categories || [],
        thumbnailFile: null,
        isFeatured: editProgramme.isFeatured || false,
        isPublished: editProgramme.isPublished || false,
      });

      // Set draft response for edit mode
      if (isEditMode) {
        setDraftResponse({
          programme: {
            productId: editProgramme.productId,
            title: editProgramme.title,
            muxAssetId: "",
            muxPlaybackId: editProgramme.muxPlaybackId || "",
          },
          product: {
            id: editProgramme.productId,
          },
        });
        setBackgroundUploadComplete(true);
      }
    }
  }, [editProgramme, open, isEditMode]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoFile: null,
      categories: [],
      thumbnailFile: null,
      isFeatured: false,
      isPublished: false,
    });
    setDraftResponse(null);
    setBackgroundUploadComplete(false);
    setUploadProgress(0);
    setSavingDetails(false);
    setUploading(false);
    setDragActive(false);
  };

  const updateFormData = (updates: Partial<ProgrammeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

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
        updateFormData({ videoFile: file });
      } else {
        toast.error("Please select a video file");
      }
    }
  }, []);

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        updateFormData({ videoFile: file });
      } else {
        toast.error("Please select a video file");
      }
    }
  };

  const handleBackgroundUpload = () => {
    const uploadAsync = async () => {
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await createProgrammeDraft(
          formData.title.trim(),
          formData.videoFile!
        );

        setDraftResponse(response.data.data);
        setBackgroundUploadComplete(true);
        toast.success("Video uploaded successfully!");
      } catch (e: any) {
        console.error("Failed to upload video:", e);
        toast.error(
          e?.response?.data?.message || e?.message || "Failed to upload video"
        );
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };

    uploadAsync();
  };

  const handleSubmitDetails = async (): Promise<boolean> => {
    // If not in edit mode and upload is still in progress, wait for it
    if (!isEditMode && !draftResponse && uploading) {
      toast("Waiting for video upload to complete...", { icon: "⏳" });
      const waitForUpload = () => {
        return new Promise<void>((resolve) => {
          const checkUpload = () => {
            if (draftResponse || !uploading) {
              resolve();
            } else {
              setTimeout(checkUpload, 500);
            }
          };
          checkUpload();
        });
      };

      await waitForUpload();
    }

    if (!draftResponse) {
      toast.error("Video upload failed. Please try again.");
      return false;
    }

    setSavingDetails(true);

    try {
      await updateProgrammeDetails(
        draftResponse.product.id,
        formData.description.trim() || undefined,
        formData.categories.length > 0 ? formData.categories : undefined,
        formData.isFeatured,
        formData.isPublished,
        formData.thumbnailFile || undefined
      );

      toast.success(
        isEditMode
          ? "Programme updated successfully!"
          : "Programme created successfully!"
      );
      return true;
    } catch (e: any) {
      console.error("Failed to update programme details:", e);
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update programme details"
      );
      return false;
    } finally {
      setSavingDetails(false);
    }
  };

  return {
    formData,
    draftResponse,
    uploading,
    uploadProgress,
    backgroundUploadComplete,
    savingDetails,
    dragActive,
    isEditMode,
    resetForm,
    updateFormData,
    handleDrag,
    handleDrop,
    handleVideoFileSelect,
    handleBackgroundUpload,
    handleSubmitDetails,
  };
};

