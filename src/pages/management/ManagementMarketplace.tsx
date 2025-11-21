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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  RateReview as RateReviewIcon,
  Notifications as NotificationsIcon,
  Percent as PercentIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  fetchStoreItems,
  fetchStoreItemById,
  deleteStoreItem,
} from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import StoreItemDialog from "../../components/admin/StoreItemDialog";
import ReviewManagement from "../../components/admin/ReviewManagement";
import NotificationsPreOrdersManagement from "../../components/admin/NotificationsPreOrdersManagement";
import OrdersManagement from "../../components/admin/OrdersManagement";
import GlobalDiscountSettings from "../../components/admin/GlobalDiscountSettings";
import DiscountManagement from "../../components/admin/DiscountManagement";

// Enhanced marketplace management with Material UI dialogs and full CRUD support
const ManagementMarketplace: React.FC = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

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
  const [discountSettingsOpen, setDiscountSettingsOpen] = useState(false);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="p-6 font-primary">
      {/* Header */}
      <h1
        className="text-3xl font-semibold text-gray-900 mb-6"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        Marketplace Management
      </h1>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="marketplace management tabs"
          className="px-4"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
              px: 3,
              fontFamily: '"League Spartan", sans-serif',
            },
          }}
        >
          <Tab
            icon={<ShoppingCartIcon />}
            label="Store Items"
            iconPosition="start"
          />
          <Tab
            icon={<LocalShippingIcon />}
            label="Orders"
            iconPosition="start"
          />
          <Tab icon={<RateReviewIcon />} label="Reviews" iconPosition="start" />
          <Tab
            icon={<NotificationsIcon />}
            label="Notifications & Pre-Orders"
            iconPosition="start"
          />
          <Tab icon={<PercentIcon />} label="Discounts" iconPosition="start" />
        </Tabs>
      </div>

      {/* Tab Content */}
      {tabValue === 0 && (
        <div>
          {/* Store Items Section */}
          {/* Store Items Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2
              className="text-2xl font-semibold text-gray-900"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Store Items
            </h2>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="outlined"
                startIcon={<PercentIcon />}
                onClick={() => setDiscountSettingsOpen(true)}
                color="primary"
              >
                Global Discount
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
                color="primary"
              >
                Add New Item
              </Button>
            </div>
          </div>

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
                                  color="primary"
                                />
                              )}
                              {item.isPublished && (
                                <Chip
                                  label="Published"
                                  size="small"
                                  sx={{
                                    bgcolor: "primary.light",
                                    color: "white",
                                    "&:hover": { bgcolor: "primary.main" },
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

                        {selected.discountType &&
                          selected.discountType !== "NONE" && (
                            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                              <Chip
                                label={`Discount: ${
                                  selected.discountType === "PERCENTAGE"
                                    ? `${selected.discountValue || 0}%`
                                    : `$${selected.discountValue || 0}`
                                }`}
                                color="success"
                                variant="outlined"
                              />
                              {selected.discountActive ? (
                                <Chip
                                  label="Active"
                                  color="success"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="Inactive"
                                  color="default"
                                  size="small"
                                />
                              )}
                            </Box>
                          )}

                        {/* Categories */}
                        {selected.categories &&
                          selected.categories.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Categories:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {selected.categories.map((category, idx) => (
                                  <Chip
                                    key={idx}
                                    label={category}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                        {selected.preOrderEnabled && (
                          <Box
                            sx={{
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Pre-order details
                            </Typography>
                            <Typography variant="body2">
                              Window:{" "}
                              {formatDateRange(
                                selected.preOrderStart,
                                selected.preOrderEnd
                              )}
                            </Typography>
                            <Typography variant="body2">
                              Fulfillment:{" "}
                              {formatDate(selected.preOrderFulfillmentDate) ||
                                "TBD"}
                            </Typography>
                            <Typography variant="body2">
                              {selected.preOrderDepositRequired
                                ? `Deposit: ${
                                    formatCurrency(
                                      selected.preOrderDepositAmount
                                    ) || "$0.00"
                                  }`
                                : "No deposit required"}
                            </Typography>
                            {typeof selected.reservedPreOrderQuantity ===
                              "number" && (
                              <Typography variant="body2">
                                Reserved: {selected.reservedPreOrderQuantity}{" "}
                                units
                              </Typography>
                            )}
                          </Box>
                        )}

                        {/* Status */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {selected.isFeatured && (
                            <Chip label="Featured" color="primary" />
                          )}
                          {selected.isPublished ? (
                            <Chip
                              label="Published"
                              sx={{
                                bgcolor: "primary.light",
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
          <Dialog
            open={discountSettingsOpen}
            onClose={() => setDiscountSettingsOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Global Discount
              <IconButton
                aria-label="close"
                onClick={() => setDiscountSettingsOpen(false)}
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <GlobalDiscountSettings
                variant="plain"
                onSaved={() => {
                  handleDialogSuccess();
                  setDiscountSettingsOpen(false);
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setDiscountSettingsOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}

      {tabValue === 1 && (
        <div>
          <OrdersManagement />
        </div>
      )}

      {tabValue === 2 && (
        <div>
          <ReviewManagement />
        </div>
      )}

      {tabValue === 3 && (
        <div>
          <NotificationsPreOrdersManagement />
        </div>
      )}

      {tabValue === 4 && (
        <div>
          <DiscountManagement />
        </div>
      )}
    </div>
  );
};

export default ManagementMarketplace;

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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatCurrency(value?: number | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return currencyFormatter.format(value);
}

function formatDate(value?: string | Date | null): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(
  start?: string | Date | null,
  end?: string | Date | null
): string {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} – ${formattedEnd}`;
  }

  if (formattedStart) {
    return `Starts ${formattedStart}`;
  }

  if (formattedEnd) {
    return `Ends ${formattedEnd}`;
  }

  return "Window TBD";
}
