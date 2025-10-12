import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControlLabel,
  Switch,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  VideoFile,
  Image as ImageIcon,
  Delete,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import {
  createProgrammeDraft,
  updateProgrammeDetails,
  fetchProgrammeForEdit,
  type Programme,
} from "@/api/programme.api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DropZone = styled(Paper)(
  ({ theme, isDragActive }: { theme?: any; isDragActive: boolean }) => ({
    border: `2px dashed ${
      isDragActive ? theme.palette.primary.main : theme.palette.grey[300]
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isDragActive
      ? theme.palette.primary.light + "10"
      : "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + "05",
    },
  })
);

interface CreateProgrammeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProgramme?: Programme | null; // If provided, dialog is in edit mode
}

interface FormData {
  // Step 1
  title: string;
  description: string;
  videoFile: File | null;

  // Step 2
  categories: string[];
  thumbnailFile: File | null;
  isFeatured: boolean;
  isPublished: boolean;
}

interface DraftResponse {
  programme: {
    productId: string;
    title: string;
    muxAssetId?: string;
    muxPlaybackId?: string;
  };
  product: {
    id: string;
  };
}

const AVAILABLE_CATEGORIES = [
  "Wellness",
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Meditation",
  "Yoga",
  "Mindfulness",
  "Stress Management",
  "Sleep",
  "Personal Development",
];

const CreateProgrammeDialog: React.FC<CreateProgrammeDialogProps> = ({
  open,
  onClose,
  onSuccess,
  editProgramme,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [draftResponse, setDraftResponse] = useState<DraftResponse | null>(
    null
  );
  const [backgroundUploadComplete, setBackgroundUploadComplete] =
    useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    videoFile: null,
    categories: [],
    thumbnailFile: null,
    isFeatured: false,
    isPublished: false,
  });

  const steps = editProgramme
    ? ["Details & Publishing"]
    : ["Video & Basic Info", "Details & Publishing"];
  const isEditMode = !!editProgramme;

  // Initialize form data when in edit mode
  useEffect(() => {
    if (editProgramme && open) {
      setFormData({
        title: editProgramme.title || "",
        description: editProgramme.description || "",
        videoFile: null, // Can't edit video file in edit mode
        categories: editProgramme.categories || [],
        thumbnailFile: null,
        isFeatured: editProgramme.isFeatured || false,
        isPublished: editProgramme.isPublished || false,
      });

      // In edit mode, skip to step 2 (details)
      setActiveStep(isEditMode ? 0 : 0);

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

  const handleClose = () => {
    if (!uploading) {
      setActiveStep(0);
      setDraftResponse(null);
      setBackgroundUploadComplete(false);
      setUploadProgress(0);
      setFormData({
        title: "",
        description: "",
        videoFile: null,
        categories: [],
        thumbnailFile: null,
        isFeatured: false,
        isPublished: false,
      });
      onClose();
    }
  };

  const handleNext = async () => {
    if (isEditMode) {
      // In edit mode, we only have one step - submit details
      handleSubmitDetails();
    } else if (activeStep === 0) {
      // Validate step 1
      if (!formData.title.trim()) {
        toast.error("Please enter a title");
        return;
      }
      if (!formData.videoFile) {
        toast.error("Please select a video file");
        return;
      }

      // Start background upload
      handleBackgroundUpload();
      setActiveStep(1);
    } else {
      // Submit step 2 details
      handleSubmitDetails();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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
        setFormData((prev) => ({ ...prev, videoFile: file }));
      } else {
        toast.error("Please select a video file");
      }
    }
  }, []);

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setFormData((prev) => ({ ...prev, videoFile: file }));
      } else {
        toast.error("Please select a video file");
      }
    }
  };

  const handleThumbnailFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleBackgroundUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await createProgrammeDraft(
        formData.title.trim(),
        formData.videoFile!
      );

      setDraftResponse(response.data.data);
      setBackgroundUploadComplete(true);
      toast.success("Video uploaded successfully! Continue with details.");
    } catch (e: any) {
      console.error("Failed to upload video:", e);
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to upload video"
      );
      // Go back to step 1 on error
      setActiveStep(0);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmitDetails = async () => {
    if (!draftResponse) {
      toast.error("Please wait for video upload to complete");
      return;
    }

    setUploading(true);

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
      handleClose();
      onSuccess();
    } catch (e: any) {
      console.error("Failed to update programme details:", e);
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update programme details"
      );
    } finally {
      setUploading(false);
    }
  };

  const renderStep1 = () => (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Programme Title"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        margin="normal"
        required
        disabled={uploading}
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        margin="normal"
        multiline
        rows={4}
        disabled={uploading}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Video File *
        </Typography>

        {formData.videoFile ? (
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <VideoFile color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {formData.videoFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(formData.videoFile.size)}
              </Typography>
            </Box>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({ ...prev, videoFile: null }))
              }
              disabled={uploading}
            >
              <Delete />
            </IconButton>
          </Paper>
        ) : (
          <DropZone
            isDragActive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("video-upload")?.click()}
          >
            <CloudUpload
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Drag and drop your video file here
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports MP4, MOV, AVI, MKV, WebM (max 500MB)
            </Typography>
            <VisuallyHiddenInput
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoFileSelect}
              disabled={uploading}
            />
          </DropZone>
        )}
      </Box>
    </Box>
  );

  const renderStep2 = () => (
    <Box sx={{ mt: 2 }}>
      {/* Title field for edit mode */}
      {isEditMode && (
        <TextField
          fullWidth
          label="Programme Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          margin="normal"
          required
          disabled={uploading}
        />
      )}

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        margin="normal"
        multiline
        rows={4}
        disabled={uploading}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          value={formData.categories}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categories:
                typeof e.target.value === "string"
                  ? [e.target.value]
                  : e.target.value,
            }))
          }
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
          disabled={uploading}
        >
          {AVAILABLE_CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thumbnail Image
        </Typography>

        {formData.thumbnailFile ? (
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <ImageIcon color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {formData.thumbnailFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(formData.thumbnailFile.size)}
              </Typography>
            </Box>
            <IconButton
              onClick={() =>
                setFormData((prev) => ({ ...prev, thumbnailFile: null }))
              }
              disabled={uploading}
            >
              <Delete />
            </IconButton>
          </Paper>
        ) : (
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
            fullWidth
            sx={{ py: 2 }}
            disabled={uploading}
          >
            Upload Thumbnail
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileSelect}
            />
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isFeatured: e.target.checked,
                }))
              }
              disabled={uploading}
            />
          }
          label="Featured Programme"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              disabled={uploading}
            />
          }
          label="Publish Immediately"
        />
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={uploading}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isEditMode ? "Edit Programme" : "Create New Programme"}
        <IconButton onClick={handleClose} disabled={uploading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {uploading && activeStep === 0 && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Uploading video... Please don't close this dialog.
            </Alert>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {uploadProgress}% uploaded
            </Typography>
          </Box>
        )}

        {uploading && activeStep === 1 && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Saving programme details...
            </Alert>
            <LinearProgress />
          </Box>
        )}

        {backgroundUploadComplete && activeStep === 1 && !uploading && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Video uploaded successfully! Fill in the details below to complete
              your programme.
            </Alert>
          </Box>
        )}

        {isEditMode
          ? renderStep2()
          : activeStep === 0
          ? renderStep1()
          : renderStep2()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>

        {!isEditMode && activeStep > 0 && (
          <Button onClick={handleBack} disabled={uploading}>
            Back
          </Button>
        )}

        <Button
          onClick={handleNext}
          variant="contained"
          disabled={
            uploading ||
            (!isEditMode &&
              activeStep === 0 &&
              (!formData.title.trim() || !formData.videoFile))
          }
        >
          {isEditMode
            ? "Update Programme"
            : activeStep === steps.length - 1
            ? "Create Programme"
            : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProgrammeDialog;
