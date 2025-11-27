import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControlLabel,
  Switch,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalOffer as LocalOfferIcon,
  Public as PublicIcon,
  ShoppingBag as ShoppingBagIcon,
  PowerOff as PowerOffIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { fetchStoreItems, updateStoreItem } from "../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../types/marketplace.types";
import { isProductDiscountActive } from "../../utils/discounts";
import GlobalDiscountDialog from "./GlobalDiscountDialog";
import NumberInput from "../ui/NumberInput";

interface DiscountManagementProps {}

const DiscountManagement: React.FC<DiscountManagementProps> = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [globalDiscountDialogOpen, setGlobalDiscountDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [activeTab, setActiveTab] = useState(0);

  // Load all store items
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      let pageNum = 1;
      const limit = 50;
      const allItems: StoreItem[] = [];
      let hasMore = true;

      while (hasMore) {
        const response = await fetchStoreItems({ page: pageNum, limit });
        const payload = response.data;
        if (!payload) break;
        allItems.push(...(payload.items || []));
        const pagination = payload.pagination;
        if (!pagination || !pagination.hasMore) {
          hasMore = false;
        } else {
          pageNum += 1;
        }
      }

      setItems(allItems);
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Filter items with discounts
  const itemsWithDiscounts = useMemo(() => {
    return items.filter((item) => {
      const hasDiscount = item.discountType && item.discountType !== "NONE";
      if (!hasDiscount) return false;

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesId = item.productId?.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      // Apply status filter
      if (filterStatus === "all") return true;
      const now = new Date();
      const isActive = isProductDiscountActive(item, now);
      
      if (filterStatus === "active") return isActive;
      if (filterStatus === "inactive") return !isActive && item.discountActive;
      
      if (filterStatus === "expired") {
        if (!item.discountEnd) return false;
        const endDate = new Date(item.discountEnd);
        return now > endDate;
      }

      return true;
    });
  }, [items, searchQuery, filterStatus]);

  // Detect global discount (when all products with discounts have the same discount)
  const globalDiscount = useMemo(() => {
    if (itemsWithDiscounts.length === 0) return null;
    
    // Check if all items with discounts have the same discount configuration
    const firstDiscount = itemsWithDiscounts[0];
    const allSame = itemsWithDiscounts.every((item) => {
      return (
        item.discountType === firstDiscount.discountType &&
        item.discountValue === firstDiscount.discountValue &&
        item.discountActive === firstDiscount.discountActive &&
        item.discountStart === firstDiscount.discountStart &&
        item.discountEnd === firstDiscount.discountEnd
      );
    });

    // Also check if ALL products (not just those with discounts) have this discount
    const allProductsHaveDiscount = items.length > 0 && 
      items.every((item) => {
        if (!item.discountType || item.discountType === "NONE") return false;
        return (
          item.discountType === firstDiscount.discountType &&
          item.discountValue === firstDiscount.discountValue &&
          item.discountActive === firstDiscount.discountActive &&
          item.discountStart === firstDiscount.discountStart &&
          item.discountEnd === firstDiscount.discountEnd
        );
      });

    if (allSame && allProductsHaveDiscount && itemsWithDiscounts.length === items.length) {
      return firstDiscount;
    }
    
    return null;
  }, [items, itemsWithDiscounts]);

  // Filter out items that are part of global discount
  const individualDiscounts = useMemo(() => {
    if (!globalDiscount) return itemsWithDiscounts;
    
    return itemsWithDiscounts.filter((item) => {
      // Keep items that don't match the global discount
      return !(
        item.discountType === globalDiscount.discountType &&
        item.discountValue === globalDiscount.discountValue &&
        item.discountActive === globalDiscount.discountActive &&
        item.discountStart === globalDiscount.discountStart &&
        item.discountEnd === globalDiscount.discountEnd
      );
    });
  }, [itemsWithDiscounts, globalDiscount]);

  // Paginated items (only individual discounts, not global)
  const paginatedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return individualDiscounts.slice(start, start + rowsPerPage);
  }, [individualDiscounts, page, rowsPerPage]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: StoreItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    if (selectedItem) {
      setEditDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleRemoveDiscount = async () => {
    if (!selectedItem) return;

    try {
      await updateStoreItem(selectedItem.productId, {
        discountType: "NONE" as DiscountType,
        discountValue: 0,
        discountActive: false,
        discountStart: null,
        discountEnd: null,
      });
      toast.success("Discount removed");
      loadItems();
      handleMenuClose();
    } catch (error) {
      console.error("Failed to remove discount:", error);
      toast.error("Failed to remove discount");
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFilterStatus("all");
    setSearchQuery("");
    setPage(0);
  };

  const formatDiscountValue = (item: StoreItem) => {
    if (!item.discountType || item.discountType === "NONE" || !item.discountValue) {
      return "-";
    }
    if (item.discountType === "PERCENTAGE") {
      return `${item.discountValue}%`;
    }
    return `£${item.discountValue.toFixed(2)}`;
  };

  const getDiscountStatus = (item: StoreItem) => {
    const now = new Date();
    const isActive = isProductDiscountActive(item, now);
    
    if (isActive) {
      return { label: "Active", color: "success" as const };
    }
    
    if (item.discountEnd) {
      const endDate = new Date(item.discountEnd);
      if (now > endDate) {
        return { label: "Expired", color: "error" as const };
      }
    }
    
    if (item.discountStart) {
      const startDate = new Date(item.discountStart);
      if (now < startDate) {
        return { label: "Scheduled", color: "info" as const };
      }
    }
    
    return { label: "Inactive", color: "default" as const };
  };

  const stats = useMemo(() => {
    const now = new Date();
    const active = itemsWithDiscounts.filter((item) => isProductDiscountActive(item, now)).length;
    const expired = itemsWithDiscounts.filter((item) => {
      if (!item.discountEnd) return false;
      return new Date(item.discountEnd) < now;
    }).length;
    const scheduled = itemsWithDiscounts.filter((item) => {
      if (!item.discountStart) return false;
      return new Date(item.discountStart) > now;
    }).length;

    return { total: itemsWithDiscounts.length, active, expired, scheduled };
  }, [itemsWithDiscounts]);

  // Get global discount name from localStorage
  const globalDiscountName = useMemo(() => {
    return localStorage.getItem("globalDiscountName") || "Global Discount";
  }, [items]); // Re-evaluate when items change

  // Create a single-item array for global discount to display in table
  const globalDiscountTableData = useMemo(() => {
    if (!globalDiscount) return [];
    return [{
      ...globalDiscount,
      productId: "GLOBAL",
      name: globalDiscountName,
      isGlobal: true,
    }];
  }, [globalDiscount, globalDiscountName]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600, mb: 1 }}
          >
            Discount Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage global and individual product discounts
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={loadItems}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontFamily: '"League Spartan", sans-serif',
            },
          }}
        >
          <Tab
            icon={<PublicIcon />}
            iconPosition="start"
            label="Global Discounts"
          />
          <Tab
            icon={<ShoppingBagIcon />}
            iconPosition="start"
            label="Individual Discounts"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div>
          {/* Stats Cards for Global */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Global Discount Status
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {globalDiscount ? "Active" : "None"}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Products Affected
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {globalDiscount ? items.length : 0}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                {globalDiscount ? (
                  <Chip
                    label={getDiscountStatus(globalDiscount).label}
                    color={getDiscountStatus(globalDiscount).color}
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No global discount
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  sx={{ flex: 1 }}
                  disabled={!globalDiscount}
                />
                {!globalDiscount && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setGlobalDiscountDialogOpen(true)}
                    disabled={loading}
                  >
                    Create Global Discount
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Global Discount Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Value
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Products Affected
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Start Date
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      End Date
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : globalDiscountTableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 4 }}>
                          <PublicIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            No global discount active
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setGlobalDiscountDialogOpen(true)}
                            sx={{ mt: 2 }}
                          >
                            Create Global Discount
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    globalDiscountTableData.map((item) => {
                      const status = getDiscountStatus(item);
                      return (
                        <TableRow key={item.productId} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {item.name}
                              </Typography>
                              <Chip label="Global" size="small" color="primary" sx={{ mt: 0.5 }} />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.discountType === "PERCENTAGE" ? "Percentage" : "Flat"}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDiscountValue(item)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={status.label} color={status.color} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {items.length} products
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.discountStart
                                ? new Date(item.discountStart).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.discountEnd
                                ? new Date(item.discountEnd).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedItem(item);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={globalDiscountTableData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Card>
        </div>
      )}

      {activeTab === 1 && (
        <div>
          {/* Stats Cards for Individual */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Individual
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {individualDiscounts.length}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Active
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif', color: "success.main" }}>
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Scheduled
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif', color: "info.main" }}>
                  {stats.scheduled}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Expired
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"League Spartan", sans-serif', color: "error.main" }}>
                  {stats.expired}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  size="small"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  select
                  size="small"
                  label="Status"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as typeof filterStatus);
                    setPage(0);
                  }}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* Individual Discounts Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Value
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Start Date
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      End Date
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Loading discounts...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 4 }}>
                          <LocalOfferIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            {searchQuery || filterStatus !== "all"
                              ? "No individual discounts match your filters"
                              : globalDiscount
                              ? "All products are using the global discount. No individual discounts found."
                              : "No products have individual discounts applied"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => {
                      const status = getDiscountStatus(item);
                      return (
                        <TableRow key={item.productId} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {item.productId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.discountType === "PERCENTAGE" ? "Percentage" : "Flat"}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDiscountValue(item)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={status.label} color={status.color} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.discountStart
                                ? new Date(item.discountStart).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.discountEnd
                                ? new Date(item.discountEnd).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, item)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={individualDiscounts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Card>
        </div>
      )}

      {/* Actions Menu for Individual Discounts */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && activeTab === 1}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ fontSize: 20, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem onClick={handleRemoveDiscount}>
          <DeleteIcon sx={{ fontSize: 20, mr: 1 }} />
          Remove Discount
        </MenuItem>
      </Menu>

      {/* Actions Menu for Global Discount */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && activeTab === 0 && selectedItem?.productId === "GLOBAL"}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => {
          setGlobalDiscountDialogOpen(true);
          handleMenuClose();
        }}>
          <EditIcon sx={{ fontSize: 20, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem onClick={async () => {
          if (!globalDiscount) return;
          try {
            // Fetch all items using pagination
            let pageNum = 1;
            const limit = 50;
            const allItems: StoreItem[] = [];
            let hasMore = true;

            while (hasMore) {
              const response = await fetchStoreItems({ page: pageNum, limit });
              const payload = response.data;
              if (!payload) break;
              allItems.push(...(payload.items || []));
              const pagination = payload.pagination;
              if (!pagination || !pagination.hasMore) {
                hasMore = false;
              } else {
                pageNum += 1;
              }
            }

            // Deactivate discount on all items
            for (const item of allItems) {
              await updateStoreItem(item.productId, {
                discountActive: false,
              });
            }
            toast.success("Global discount deactivated");
            loadItems();
            handleMenuClose();
          } catch (error) {
            console.error("Failed to deactivate global discount:", error);
            toast.error("Failed to deactivate global discount");
          }
        }}>
          <PowerOffIcon sx={{ fontSize: 20, mr: 1 }} />
          Deactivate
        </MenuItem>
        <MenuItem onClick={async () => {
          if (!globalDiscount) return;
          try {
            // Fetch all items using pagination
            let pageNum = 1;
            const limit = 50;
            const allItems: StoreItem[] = [];
            let hasMore = true;

            while (hasMore) {
              const response = await fetchStoreItems({ page: pageNum, limit });
              const payload = response.data;
              if (!payload) break;
              allItems.push(...(payload.items || []));
              const pagination = payload.pagination;
              if (!pagination || !pagination.hasMore) {
                hasMore = false;
              } else {
                pageNum += 1;
              }
            }

            // Remove discount from all items
            for (const item of allItems) {
              await updateStoreItem(item.productId, {
                discountType: "NONE" as DiscountType,
                discountValue: 0,
                discountActive: false,
                discountStart: null,
                discountEnd: null,
              });
            }
            localStorage.removeItem("globalDiscountName");
            toast.success("Global discount deleted");
            loadItems();
            handleMenuClose();
          } catch (error) {
            console.error("Failed to delete global discount:", error);
            toast.error("Failed to delete global discount");
          }
        }}>
          <DeleteIcon sx={{ fontSize: 20, mr: 1, color: "error.main" }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Discount Dialog */}
      <EditDiscountDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={() => {
          loadItems();
          setEditDialogOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Global Discount Dialog */}
      <GlobalDiscountDialog
        open={globalDiscountDialogOpen}
        onClose={() => setGlobalDiscountDialogOpen(false)}
        onSuccess={() => {
          loadItems();
          setGlobalDiscountDialogOpen(false);
        }}
        existingDiscount={globalDiscount}
      />
    </div>
  );
};

interface EditDiscountDialogProps {
  open: boolean;
  onClose: () => void;
  item: StoreItem | null;
  onSuccess?: () => void;
}

const EditDiscountDialog: React.FC<EditDiscountDialogProps> = ({
  open,
  onClose,
  item,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    discountType: "NONE" as DiscountType,
    discountValue: 0,
    discountActive: false,
    discountStart: "",
    discountEnd: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item && open) {
      const startDate = item.discountStart
        ? new Date(item.discountStart).toISOString().slice(0, 16)
        : "";
      const endDate = item.discountEnd
        ? new Date(item.discountEnd).toISOString().slice(0, 16)
        : "";

      setForm({
        discountType: item.discountType || "NONE",
        discountValue: item.discountValue || 0,
        discountActive: item.discountActive || false,
        discountStart: startDate,
        discountEnd: endDate,
      });
    }
  }, [item, open]);

  const handleSave = async () => {
    if (!item) return;

    setLoading(true);
    try {
      const payload =
        form.discountType === "NONE"
          ? {
              discountType: "NONE" as DiscountType,
              discountValue: 0,
              discountActive: false,
              discountStart: null,
              discountEnd: null,
            }
          : {
              discountType: form.discountType,
              discountValue:
                form.discountType === "PERCENTAGE"
                  ? Math.min(Math.max(form.discountValue, 0), 100)
                  : Math.max(form.discountValue, 0),
              discountActive: form.discountActive,
              discountStart: form.discountStart
                ? new Date(form.discountStart).toISOString()
                : null,
              discountEnd: form.discountEnd ? new Date(form.discountEnd).toISOString() : null,
            };

      await updateStoreItem(item.productId, payload);
      toast.success("Discount updated");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update discount:", error);
      toast.error("Failed to update discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}>
        Edit Discount - {item?.name}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Discount Type"
            value={form.discountType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                discountType: e.target.value as DiscountType,
                discountActive: e.target.value === "NONE" ? false : prev.discountActive,
              }))
            }
            size="small"
            fullWidth
          >
            <MenuItem value="NONE">None</MenuItem>
            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            <MenuItem value="FLAT">Flat Amount (£)</MenuItem>
          </TextField>

          {form.discountType !== "NONE" && (
            <>
                <NumberInput
                  label={
                    form.discountType === "PERCENTAGE"
                      ? "Discount (%)"
                      : "Discount amount (£)"
                  }
                  size="small"
                  value={form.discountValue}
                  onChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: val,
                    }))
                  }
                  allowDecimals={true}
                  max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                  min={0}
                  fullWidth
                  placeholder="0"
                />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.discountActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountActive: e.target.checked,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Active"
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Starts at"
                  type="datetime-local"
                  size="small"
                  value={form.discountStart}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountStart: e.target.value,
                    }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Ends at"
                  type="datetime-local"
                  size="small"
                  value={form.discountEnd}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountEnd: e.target.value,
                    }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </>
          )}

          {form.discountType === "NONE" && (
            <Alert severity="warning" variant="outlined">
              Setting discount type to "None" will remove the discount from this product.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={loading ? undefined : onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscountManagement;

