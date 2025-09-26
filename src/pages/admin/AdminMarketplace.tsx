import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  ImageList,
  ImageListItem,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  fetchStoreItems,
  fetchStoreItemById,
  deleteStoreItem,
} from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import StoreItemDialog from "../../components/admin/StoreItemDialog";
import CategoryManagement from "../../components/admin/CategoryManagement";

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

  // Tab state
  const [tabValue, setTabValue] = useState(0);

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
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Open edit dialog with pre-filled data
  const openEditDialog = () => {
    if (!selected) return;
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Handle dialog success (refresh items list)
  const handleDialogSuccess = async () => {
    await loadItems();
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
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Marketplace Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab icon={<StoreIcon />} label="Store Items" iconPosition="start" />
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {/* Store Items Tab Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2">
              Store Items
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{
                bgcolor: "#00969b",
                "&:hover": { bgcolor: "#007a7e" },
                color: "white",
              }}
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
                      setQuery((q) => ({
                        ...q,
                        search: e.target.value,
                        page: 1,
                      }))
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
                                  sx={{
                                    bgcolor: "#00969b",
                                    color: "white",
                                    "&:hover": { bgcolor: "#007a7e" },
                                  }}
                                />
                              )}
                              {item.isPublished && (
                                <Chip
                                  label="Published"
                                  size="small"
                                  sx={{
                                    bgcolor: "#00a8ae",
                                    color: "white",
                                    "&:hover": { bgcolor: "#00969b" },
                                  }}
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
                    Page {pagination.page} of{" "}
                    {Math.max(1, pagination.totalPages)} • {pagination.total}{" "}
                    items
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

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
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
                            <ImageIcon
                              sx={{ fontSize: 64, color: "grey.400" }}
                            />
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
                      </Box>

                      <Box sx={{ flex: 1 }}>
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
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
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
                            <Chip
                              label="Featured"
                              sx={{
                                bgcolor: "#00969b",
                                color: "white",
                              }}
                            />
                          )}
                          {selected.isPublished ? (
                            <Chip
                              label="Published"
                              sx={{
                                bgcolor: "#00a8ae",
                                color: "white",
                              }}
                            />
                          ) : (
                            <Chip label="Draft" color="default" />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                )}
              </Card>
            </Box>
          </Box>

          {/* Store Item Dialog */}
          <StoreItemDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSuccess={handleDialogSuccess}
            item={dialogMode === "edit" ? selected : null}
            mode={dialogMode}
          />
        </Box>
      )}

      {/* Categories Tab */}
      {tabValue === 1 && <CategoryManagement service="store" />}
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
