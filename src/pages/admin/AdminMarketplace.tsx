import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Divider,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  fetchStoreItems,
  fetchStoreItemById,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
} from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";

// Enhanced marketplace admin with Material UI dialogs and full CRUD support
const AdminMarketplace: React.FC = () => {
  // State for items list
  const [query, setQuery] = useState({ page: 1, limit: 12, search: "" });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [submitting, setSubmitting] = useState(false);

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
  const [tagInput, setTagInput] = useState("");
  const [displayFile, setDisplayFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [displayPreview, setDisplayPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const debouncedSearch = useDebounce(query.search, 350);

  // Load items from API
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchStoreItems({
        ...query,
        search: debouncedSearch || undefined,
      });
      setItems(response.data?.items || []);
      setPagination(response.data?.pagination || pagination);

      // Auto-select first item if none selected
      if (response.data?.items?.length && !selected) {
        setSelected(response.data.items[0]);
      }
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load store items");
    } finally {
      setLoading(false);
    }
  }, [query.page, query.limit, debouncedSearch]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Select item and fetch full details
  const onSelectItem = async (item: StoreItem) => {
    setSelected(item);
    try {
      const response = await fetchStoreItemById(item.productId);
      if (response.data) {
        setSelected(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    }
  };

  // Open create dialog
  const openCreateDialog = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      tags: [],
      isFeatured: false,
      isPublished: false,
    });
    setTagInput("");
    setDisplayFile(null);
    setImageFiles([]);
    setDisplayPreview("");
    setImagePreviews([]);
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Open edit dialog with pre-filled data
  const openEditDialog = () => {
    if (!selected) return;

    setFormData({
      name: selected.name || "",
      description: selected.description || "",
      price: selected.price || 0,
      stock: selected.stock || 0,
      tags: selected.tags || [],
      isFeatured: selected.isFeatured || false,
      isPublished: selected.isPublished || false,
    });
    setTagInput("");
    setDisplayFile(null);
    setImageFiles([]);
    setDisplayPreview(selected.display?.url || "");
    setImagePreviews(selected.images || []);
    setDialogMode("edit");
    setDialogOpen(true);
  };

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

  // Add tag to form
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove tag from form
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
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

      if (dialogMode === "create") {
        await createStoreItem(submitData as any);
        toast.success("Store item created successfully");
      } else if (selected) {
        await updateStoreItem(selected.productId, submitData as any);
        toast.success("Store item updated successfully");
      }

      // Refresh the items list
      await loadItems();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error(
        `Failed to ${dialogMode === "create" ? "create" : "update"} item`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const handleDelete = async () => {
    if (!selected?.productId) return;

    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteStoreItem(selected.productId);
      toast.success("Store item deleted successfully");
      await loadItems();
      setSelected(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Marketplace Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ bgcolor: "indigo.600", "&:hover": { bgcolor: "indigo.700" } }}
        >
          Add New Item
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, height: "calc(100vh - 200px)" }}>
        {/* Items List - Fixed Left Side */}
        <Box
          sx={{
            width: { xs: "100%", md: "420px" },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search items..."
                value={query.search}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, search: e.target.value, page: 1 }))
                }
              />
            </Box>

            <Box sx={{ flex: 1, overflow: "auto" }}>
              {loading && items.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading items...
                  </Typography>
                </Box>
              ) : items.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No items found
                  </Typography>
                </Box>
              ) : (
                items.map((item) => (
                  <Card
                    key={item.productId}
                    variant={
                      selected?.productId === item.productId
                        ? "outlined"
                        : "elevation"
                    }
                    sx={{
                      m: 1,
                      cursor: "pointer",
                      bgcolor:
                        selected?.productId === item.productId
                          ? "action.selected"
                          : "background.paper",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => onSelectItem(item)}
                  >
                    <Box sx={{ display: "flex", p: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          overflow: "hidden",
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.display?.url ? (
                          <img
                            src={item.display.url}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <ImageIcon color="disabled" />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.price}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                          {item.isFeatured && (
                            <Chip
                              label="Featured"
                              size="small"
                              color="primary"
                            />
                          )}
                          {item.isPublished && (
                            <Chip
                              label="Published"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary">
                Page {pagination.page} of {Math.max(1, pagination.totalPages)} •{" "}
                {pagination.total} items
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Item Details - Right Side */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: { xs: selected ? "block" : "none", md: "block" },
          }}
        >
          <Card sx={{ height: "fit-content" }}>
            {!selected ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Select an item to view details
                </Typography>
              </Box>
            ) : (
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    {selected.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={openEditDialog} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {/* Display Image/Video */}
                    <Box
                      sx={{
                        aspectRatio: "1",
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {selected.display?.url ? (
                        selected.display.type === "video" ? (
                          <video
                            src={selected.display.url}
                            controls
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src={selected.display.url}
                            alt={selected.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )
                      ) : (
                        <ImageIcon sx={{ fontSize: 64, color: "grey.400" }} />
                      )}
                    </Box>

                    {/* Additional Images */}
                    {selected.images && selected.images.length > 0 && (
                      <ImageList cols={4} gap={8}>
                        {selected.images.map((img, idx) => (
                          <ImageListItem key={idx}>
                            <img
                              src={img}
                              alt={`Additional ${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selected.description || "No description provided"}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h4"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        ${selected.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {selected.stock} items
                      </Typography>
                    </Box>

                    {/* Tags */}
                    {selected.tags && selected.tags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Tags:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {selected.tags.map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Status */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {selected.isFeatured && (
                        <Chip label="Featured" color="primary" />
                      )}
                      {selected.isPublished ? (
                        <Chip label="Published" color="success" />
                      ) : (
                        <Chip label="Draft" color="default" />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            )}
          </Card>
        </Box>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create"
            ? "Create New Store Item"
            : "Edit Store Item"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
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
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
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
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Tags</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>

              {/* File Uploads */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Media Files
                </Typography>

                {/* Display File */}
                <Box sx={{ mb: 2 }}>
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
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <img
                          src={displayPreview}
                          alt="Display preview"
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Box>

                {/* Additional Images */}
                <Box sx={{ mb: 2 }}>
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
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Options */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
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
              </Grid>

              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "indigo.600", "&:hover": { bgcolor: "indigo.700" } }}
          >
            {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            {submitting
              ? "Saving..."
              : dialogMode === "create"
              ? "Create"
              : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMarketplace;

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
