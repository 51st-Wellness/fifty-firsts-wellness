import React from "react";
import { Button } from "@mui/material";
import {
  Add as AddIcon,
  LocalShipping as LocalShippingIcon,
  Percent as PercentIcon,
} from "@mui/icons-material";

interface StoreItemsHeaderProps {
  onAddItem: () => void;
  onOpenShippingSettings: () => void;
  onOpenDiscountSettings: () => void;
}

const StoreItemsHeader: React.FC<StoreItemsHeaderProps> = ({
  onAddItem,
  onOpenShippingSettings,
  onOpenDiscountSettings,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 lg:mb-6">
      <h2
        className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        Store Items
      </h2>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
        <Button
          variant="outlined"
          startIcon={<LocalShippingIcon />}
          onClick={onOpenShippingSettings}
          color="primary"
          size="small"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: "auto" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              marginRight: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <span className="hidden sm:inline">Shipping Settings</span>
          <span className="sm:hidden">Shipping</span>
        </Button>
        <Button
          variant="outlined"
          startIcon={<PercentIcon />}
          onClick={onOpenDiscountSettings}
          color="primary"
          size="small"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: "auto" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              marginRight: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <span className="hidden sm:inline">Global Discount</span>
          <span className="sm:hidden">Discount</span>
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          color="primary"
          size="small"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            minWidth: { xs: "auto", sm: "auto" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              marginRight: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <span className="hidden sm:inline">Add New Item</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default StoreItemsHeader;

