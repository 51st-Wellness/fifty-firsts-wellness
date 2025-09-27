import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  Chip,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { categoryAPI } from "../../api/category.api";
import type { Category, CategoryService } from "../../types/category.types";
import CategoryDialog from "./CategoryDialog";

interface CategoryManagementProps {
  service?: CategoryService;
  title?: string;
  showServiceFilter?: boolean;
}

// Component for managing categories for a specific service or all services
const CategoryManagement: React.FC<CategoryManagementProps> = ({
  service,
  title,
  showServiceFilter = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<
    CategoryService | "all"
  >(service || "all");
  const [serviceTab, setServiceTab] = useState(0);

  // Load categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams =
        selectedService === "all" ? {} : { service: selectedService };
      const data = await categoryAPI.getAll(queryParams);
      setCategories(data.data);
    } catch (error: any) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  // Initial load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle create category
  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Handle service tab change
  const handleServiceTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setServiceTab(newValue);
    const services: (CategoryService | "all")[] = [
      "all",
      "store",
      "programme",
      "podcast",
    ];
    setSelectedService(services[newValue]);
  };

  // Handle edit category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Handle delete category
  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(`Are you sure you want to delete "${category.name}"?`)
    ) {
      return;
    }

    try {
      await categoryAPI.delete(category.id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  // Handle dialog success
  const handleDialogSuccess = () => {
    loadCategories();
  };

  const serviceLabels = {
    store: "Store",
    programme: "Programme",
    podcast: "Podcast",
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <CategoryIcon />
        <Typography variant="h5" fontWeight="600">
          {title || "Categories"}
        </Typography>
      </Box>

      {/* Service Filter Tabs */}
      {showServiceFilter && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={serviceTab}
            onChange={handleServiceTabChange}
            aria-label="service filter tabs"
          >
            <Tab label="All Services" />
            <Tab label="Store" />
            <Tab label="Programmes" />
            <Tab label="Podcasts" />
          </Tabs>
        </Box>
      )}

      {/* Search and Actions */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ whiteSpace: "nowrap" }}
        >
          Add Category
        </Button>
      </Stack>

      {/* Categories List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CategoryIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? "No categories found" : "No categories yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm
                ? "Try adjusting your search terms"
                : service
                ? `Create your first category for ${serviceLabels[
                    service
                  ].toLowerCase()} products`
                : "Create your first category"}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Add Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  {/* Category Header */}
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" noWrap gutterBottom>
                        {category.name}
                      </Typography>
                      <Chip
                        label={serviceLabels[category.service]}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        title="Edit category"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category)}
                        title="Delete category"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {/* Description */}
                  {category.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </>
                  )}

                  {/* Metadata */}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        category={selectedCategory}
        mode={dialogMode}
        defaultService={selectedService === "all" ? undefined : selectedService}
      />
    </Box>
  );
};

export default CategoryManagement;
