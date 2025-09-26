import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { createStoreItem, updateStoreItem } from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import CategorySelector from "./CategorySelector";

interface StoreItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: StoreItem | null;
  mode: "create" | "edit";
}

// Reusable dialog component for creating and editing store items
const StoreItemDialog: React.FC<StoreItemDialogProps> = ({
  open,
  onClose,
  onSuccess,
  item,
  mode,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    tags: [] as string[],
    isFeatured: false,
    isPublished: false,
  });
  const [displayFile, setDisplayFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [displayPreview, setDisplayPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        setFormData({
          name: item.name || "",
          description: item.description || "",
          price: item.price || 0,
          stock: item.stock || 0,
          tags: item.tags || [],
          isFeatured: item.isFeatured || false,
          isPublished: item.isPublished || false,
        });
        setDisplayPreview(item.display?.url || "");
        setImagePreviews(item.images || []);
      } else {
        setFormData({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          tags: [],
          isFeatured: false,
          isPublished: false,
        });
        setDisplayPreview("");
        setImagePreviews([]);
      }
      setDisplayFile(null);
      setImageFiles([]);
    }
  }, [open, mode, item]);

  // Handle file selection for display image/video
  const handleDisplayFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDisplayFile(file);
      const preview = URL.createObjectURL(file);
      setDisplayPreview(preview);
    }
  };

  // Handle multiple image files selection
  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    setImageFiles(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle category selection
  const handleCategoryChange = (categories: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: categories,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (formData.price < 0) {
      toast.error("Price must be positive");
      return;
    }
    if (formData.stock < 0) {
      toast.error("Stock must be positive");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare form data for multipart upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());
      submitData.append("stock", formData.stock.toString());
      submitData.append("isFeatured", formData.isFeatured.toString());
      submitData.append("isPublished", formData.isPublished.toString());

      // Add tags
      formData.tags.forEach((tag) => {
        submitData.append("tags", tag);
      });

      // Add display file if selected
      if (displayFile) {
        submitData.append("display", displayFile);
      }

      // Add image files if selected
      imageFiles.forEach((file) => {
        submitData.append("images", file);
      });

      if (mode === "create") {
        await createStoreItem(submitData as any);
        toast.success("Store item created successfully");
      } else if (item) {
        await updateStoreItem(item.productId, submitData as any);
        toast.success("Store item updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} item`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Create New Store Item" : "Edit Store Item"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            sx={{ mb: 2 }}
            variant="fullWidth"
          >
            <Tab label="Details" />
            <Tab label="Media" />
          </Tabs>

          {tabIndex === 0 && (
            <Stack spacing={2}>
              {/* Basic Information */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  placeholder="e.g. Wellness Journal"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Price"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Stock"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Box>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Brief, compelling description of the product"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Box>

              {/* Categories */}
              <Box>
                <CategorySelector
                  service="store"
                  selectedCategories={formData.tags}
                  onChange={handleCategoryChange}
                  label="Categories"
                  placeholder="Select categories for this store item..."
                  helperText="Choose from existing categories to help customers find this product"
                />
              </Box>

              {/* Options */}
              <Box>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={3}>
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
                      />
                    }
                    label="Featured Item"
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
                      />
                    }
                    label="Published"
                  />
                </Stack>
              </Box>
            </Stack>
          )}

          {tabIndex === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Media Files
              </Typography>

              {/* Display File */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Display Image/Video (Required for new items)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Choose Display File
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={handleDisplayFileChange}
                  />
                </Button>
                {displayPreview && (
                  <Box
                    sx={{
                      mt: 1,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    {displayFile?.type.startsWith("video/") ? (
                      <video
                        src={displayPreview}
                        style={{
                          width: 140,
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <img
                        src={displayPreview}
                        alt="Display preview"
                        style={{
                          width: 140,
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>

              {/* Additional Images */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Additional Images (Optional, max 5)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Choose Images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                  />
                </Button>
                {imagePreviews.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {imagePreviews.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          sx={{
            bgcolor: "#00969b",
            "&:hover": { bgcolor: "#007a7e" },
            color: "white",
          }}
        >
          {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreItemDialog;
