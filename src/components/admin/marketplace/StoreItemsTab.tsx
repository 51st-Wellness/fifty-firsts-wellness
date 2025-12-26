import React, { useState, useCallback } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Close as CloseIcon, LocalShipping as LocalShippingIcon, Percent as PercentIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { deleteStoreItem } from "../../../api/marketplace.api";
import StoreItemDialog from "../store-items/StoreItemDialog";
import GlobalDiscountSettings from "../GlobalDiscountSettings";
import ShippingSettingsDialog from "../shipping/ShippingSettingsDialog";
import StoreItemsHeader from "./StoreItemsHeader";
import StoreItemsList from "./StoreItemsList";
import StoreItemDetails from "./StoreItemDetails";
import { useStoreItems } from "./hooks/useStoreItems";
import { useDebounce } from "./hooks/useDebounce";

interface StoreItemsTabProps {
  query: { page: number; limit: number; search: string };
  onQueryChange: (query: { page: number; limit: number; search: string }) => void;
}

const StoreItemsTab: React.FC<StoreItemsTabProps> = ({ query, onQueryChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [discountSettingsOpen, setDiscountSettingsOpen] = useState(false);
  const [shippingSettingsOpen, setShippingSettingsOpen] = useState(false);

  const debouncedSearch = useDebounce(query.search, 350);
  const { items, loading, selected, pagination, setSelected, loadItems, selectItem } = useStoreItems(
    query,
    debouncedSearch
  );

  const openCreateDialog = () => {
    setDialogMode("create");
    setDialogOpen(true);
  };

  const openEditDialog = () => {
    if (!selected) return;
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDialogSuccess = useCallback(async () => {
    await loadItems();
  }, [loadItems]);

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

  const handleSearchChange = (value: string) => {
    onQueryChange({
      ...query,
      search: value,
      page: 1,
    });
  };

  return (
    <div>
      <StoreItemsHeader
        onAddItem={openCreateDialog}
        onOpenShippingSettings={() => setShippingSettingsOpen(true)}
        onOpenDiscountSettings={() => setDiscountSettingsOpen(true)}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, sm: 3 },
          height: { xs: "auto", md: "calc(100vh - 200px)" },
        }}
      >
        <StoreItemsList
          items={items}
          loading={loading}
          selected={selected}
          searchQuery={query.search}
          pagination={pagination}
          onSearchChange={handleSearchChange}
          onSelectItem={selectItem}
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: { xs: selected ? "block" : "none", md: "block" },
          }}
        >
          <StoreItemDetails
            item={selected}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
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

      {/* Global Discount Dialog */}
      <Dialog
        open={discountSettingsOpen}
        onClose={() => setDiscountSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
          }}
        >
          Global Discount
          <IconButton
            aria-label="close"
            onClick={() => setDiscountSettingsOpen(false)}
            edge="end"
            size="small"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          <GlobalDiscountSettings
            variant="plain"
            onSaved={() => {
              handleDialogSuccess();
              setDiscountSettingsOpen(false);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Button
            onClick={() => setDiscountSettingsOpen(false)}
            size="small"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shipping Settings Dialog */}
      <ShippingSettingsDialog
        open={shippingSettingsOpen}
        onClose={() => setShippingSettingsOpen(false)}
        onSuccess={() => {
          handleDialogSuccess();
          setShippingSettingsOpen(false);
        }}
      />
    </div>
  );
};

export default StoreItemsTab;

