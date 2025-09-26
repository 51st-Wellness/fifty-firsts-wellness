import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { categoryAPI } from "../../api/category.api";
import type { Category, CategoryService } from "../../types/category.types";

interface CategorySelectorProps {
  service: CategoryService;
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

// Component for selecting categories (tags) from existing categories
const CategorySelector: React.FC<CategorySelectorProps> = ({
  service,
  selectedCategories,
  onChange,
  label = "Categories",
  placeholder = "Select categories...",
  helperText = "Choose from existing categories or type to filter",
  required = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Load categories for the service
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getByService(service);
      setCategories(data);
    } catch (error: any) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
  }, [service]);

  // Handle category selection
  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const value = event.target.value;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  // Remove a selected category
  const removeCategory = (categoryToRemove: string) => {
    onChange(selectedCategories.filter((cat) => cat !== categoryToRemove));
  };

  // Get display text for selected categories
  const getSelectedCategoryNames = () => {
    return selectedCategories
      .map((catName) => {
        const category = categories.find((cat) => cat.name === catName);
        return category ? category.name : catName;
      })
      .join(", ");
  };

  return (
    <Box>
      <FormControl fullWidth required={required}>
        <InputLabel id="category-selector-label">{label}</InputLabel>
        <Select
          labelId="category-selector-label"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          placeholder={placeholder}
          renderValue={(selected) => (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  onDelete={() => removeCategory(value)}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </Stack>
          )}
        >
          {categories.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {loading ? "Loading categories..." : "No categories available"}
              </Typography>
            </MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.name}
                sx={{
                  fontWeight: selectedCategories.includes(category.name)
                    ? 600
                    : 400,
                }}
              >
                <Box>
                  <Typography variant="body2">{category.name}</Typography>
                  {category.description && (
                    <Typography variant="caption" color="text.secondary">
                      {category.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, ml: 1 }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>

      {/* Display selected categories as chips below */}
      {selectedCategories.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Selected Categories:
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ flexWrap: "wrap", gap: 0.5 }}
          >
            {selectedCategories.map((categoryName) => {
              const category = categories.find(
                (cat) => cat.name === categoryName
              );
              return (
                <Chip
                  key={categoryName}
                  label={categoryName}
                  size="small"
                  variant="outlined"
                  onDelete={() => removeCategory(categoryName)}
                  deleteIcon={<CloseIcon />}
                  title={category?.description || categoryName}
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default CategorySelector;
