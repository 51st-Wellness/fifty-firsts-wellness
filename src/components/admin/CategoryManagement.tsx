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
  // Grid2 as Grid, // Removed due to version issues
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

  // Filter and sort categories based on search term and category type
  const filteredCategories = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by category type first (store, programme, podcast)
      const serviceOrder = { store: 0, programme: 1, podcast: 2 };
      const aOrder = serviceOrder[a.service];
      const bOrder = serviceOrder[b.service];

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // Then sort alphabetically by name within each type
      return a.name.localeCompare(b.name);
    });

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

  // Get color scheme for category type tags
  const getCategoryTypeColor = (service: CategoryService) => {
    switch (service) {
      case "store":
        return {
          backgroundColor: "#10b981", // success green
          color: "white",
        };
      case "programme":
        return {
          backgroundColor: "#f59e0b", // warning orange
          color: "white",
        };
      case "podcast":
        return {
          backgroundColor: "#5f42e5", // brand purple
          color: "white",
        };
      default:
        return {
          backgroundColor: "#00969b", // brand green (default)
          color: "white",
        };
    }
  };

  return (
    <div className="font-primary">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3, lg: 4 },
          pb: { xs: 1, sm: 2 },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            backgroundColor: "primary.50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CategoryIcon sx={{ color: "primary.main", fontSize: { xs: 20, sm: 24, lg: 28 } }} />
        </Box>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="700" 
            sx={{ 
              mb: { xs: 0, sm: 0.5 },
              fontSize: { xs: "1.125rem", sm: "1.5rem", lg: "2rem" },
              fontFamily: '"League Spartan", sans-serif' 
            }}
          >
            {title || "Categories"}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              display: { xs: "none", sm: "block" }
            }}
          >
            Manage and organize your content categories
          </Typography>
        </Box>
      </Box>

      {/* Service Filter Tabs */}
      {showServiceFilter && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: { xs: 2, sm: 3 } }}>
          <Tabs
            value={serviceTab}
            onChange={handleServiceTabChange}
            aria-label="service filter tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: { xs: 36, sm: 48 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: { xs: 36, sm: 48 },
                px: { xs: 0.75, sm: 1.5 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontFamily: '"League Spartan", sans-serif',
              },
              "& .MuiTabs-scrollButtons": {
                width: { xs: 28, sm: 40 },
              },
            }}
          >
            <Tab label="All Services" />
            <Tab label="Store" />
            <Tab label="Programmes" />
            <Tab label="Podcasts" />
          </Tabs>
        </Box>
      )}

      {/* Search and Actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: { xs: 1, sm: 2 },
          mb: { xs: 3, sm: 4 },
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
              height: { xs: 40, sm: 48 },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={handleCreate}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 2,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            boxShadow: 2,
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow: 4,
            },
          }}
          title="Add Category"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Categories List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={40} />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center py-12 px-6">
            <CategoryIcon
              sx={{ fontSize: 64, color: "#6b7280", mb: 3 }}
            />
            <h3 className="text-lg font-semibold text-gray-600 mb-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-sm text-gray-600 font-primary mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : service
                ? `Create your first category for ${serviceLabels[
                    service
                  ].toLowerCase()} products`
                : "Create your first category"}
            </p>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Add Category
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Category Header */}
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                        {category.name}
                      </h4>
                      <Chip
                        label={serviceLabels[category.service]}
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          backgroundColor: getCategoryTypeColor(
                            category.service
                          ).backgroundColor,
                          color: getCategoryTypeColor(category.service).color,
                          "& .MuiChip-label": {
                            color: getCategoryTypeColor(category.service).color,
                          },
                        }}
                      />
                    </div>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        title="Edit category"
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            backgroundColor: "primary.50",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category)}
                        title="Delete category"
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.50",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {/* Description */}
                  {category.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-primary line-clamp-3">
                        {category.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
          ))}
        </div>
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
    </div>
  );
};

export default CategoryManagement;
