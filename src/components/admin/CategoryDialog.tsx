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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import { categoryAPI } from "../../api/category.api";
import type { Category, CategoryService } from "../../types/category.types";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
  mode: "create" | "edit";
  defaultService?: CategoryService;
}

// Reusable dialog component for creating and editing categories
const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSuccess,
  category,
  mode,
  defaultService,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    service: defaultService || ("store" as CategoryService),
  });
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && category) {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          service: category.service,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          service: defaultService || "store",
        });
      }
    }
  }, [open, mode, category, defaultService]);

  // Handle form input changes
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  // Handle service selection change
  const handleServiceChange = (event: any) => {
    setFormData((prev) => ({ ...prev, service: event.target.value }));
  };

  // Validate form
  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.service !== "";
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "create") {
        await categoryAPI.create({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          service: formData.service,
        });
        toast.success("Category created successfully!");
      } else if (mode === "edit" && category) {
        await categoryAPI.update(category.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          service: formData.service,
        });
        toast.success("Category updated successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Create New Category" : "Edit Category"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Category Name */}
          <TextField
            name="name"
            label="Category Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="Enter category name"
            helperText="This will be used as a tag option for products"
          />

          {/* Service Selection */}
          <FormControl fullWidth required>
            <InputLabel id="service-select-label">Service</InputLabel>
            <Select
              labelId="service-select-label"
              name="service"
              value={formData.service}
              label="Service"
              onChange={handleServiceChange}
              disabled={mode === "edit"} // Prevent changing service for existing categories
            >
              <MenuItem value="store">Store</MenuItem>
              <MenuItem value="programme">Programme</MenuItem>
              <MenuItem value="podcast">Podcast</MenuItem>
            </Select>
            {mode === "edit" && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Service cannot be changed for existing categories
              </Typography>
            )}
          </FormControl>

          {/* Description */}
          <TextField
            name="description"
            label="Description (Optional)"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Enter category description"
            helperText="Optional description to help identify this category"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid() || submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create"
            : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
