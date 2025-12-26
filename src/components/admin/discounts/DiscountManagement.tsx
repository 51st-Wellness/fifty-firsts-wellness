import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Public as PublicIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { fetchStoreItems, updateStoreItem } from "../../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../../types/marketplace.types";
import { isProductDiscountActive } from "../../../utils/discounts";
import GlobalDiscountDialog from "../GlobalDiscountDialog";
import GlobalDiscountsTab from "./GlobalDiscountsTab";
import IndividualDiscountsTab from "./IndividualDiscountsTab";
import EditDiscountDialog from "./EditDiscountDialog";

const DiscountManagement: React.FC = () => {
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

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesId = item.productId?.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

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

  // Detect global discount
  const globalDiscount = useMemo(() => {
    if (itemsWithDiscounts.length === 0) return null;
    
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
      return !(
        item.discountType === globalDiscount.discountType &&
        item.discountValue === globalDiscount.discountValue &&
        item.discountActive === globalDiscount.discountActive &&
        item.discountStart === globalDiscount.discountStart &&
        item.discountEnd === globalDiscount.discountEnd
      );
    });
  }, [itemsWithDiscounts, globalDiscount]);

  // Paginated items
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

  const globalDiscountName = useMemo(() => {
    return localStorage.getItem("globalDiscountName") || "Global Discount";
  }, [items]);

  return (
    <div className="p-2 sm:p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 lg:mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "2.125rem" },
              }}
            >
              Discount Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={loadItems}
              disabled={loading}
              size="small"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1.5, sm: 2 },
                ml: { xs: 2, sm: 4 },
              }}
            >
              Refresh
            </Button>
          </div>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "block" } }}>
            View and manage global and individual product discounts
          </Typography>
        </div>
      </div>

      {/* Tabs */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontFamily: '"League Spartan", sans-serif',
              minHeight: { xs: 48, lg: 64 },
              px: { xs: 1.5, sm: 2, lg: 3 },
              fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
            },
            "& .MuiTabs-scrollButtons": {
              width: { xs: 32, lg: 40 },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1rem", lg: "1.25rem" },
              },
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
        <GlobalDiscountsTab
          globalDiscount={globalDiscount}
          items={items}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(0);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onOpenGlobalDiscountDialog={() => setGlobalDiscountDialogOpen(true)}
          onLoadItems={loadItems}
          globalDiscountName={globalDiscountName}
          anchorEl={anchorEl}
          selectedItem={selectedItem}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
        />
      )}

      {activeTab === 1 && (
        <IndividualDiscountsTab
          individualDiscounts={individualDiscounts}
          paginatedItems={paginatedItems}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(0);
          }}
          filterStatus={filterStatus}
          onFilterStatusChange={(value) => {
            setFilterStatus(value);
            setPage(0);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          stats={stats}
          globalDiscount={globalDiscount}
          anchorEl={anchorEl}
          selectedItem={selectedItem}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onEdit={handleEdit}
          onRemoveDiscount={handleRemoveDiscount}
        />
      )}

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

export default DiscountManagement;

