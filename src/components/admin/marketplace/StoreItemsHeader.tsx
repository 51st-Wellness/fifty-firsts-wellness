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
          startIcon={<LocalShippingIcon />}
          onClick={onOpenShippingSettings}
          color="primary"
        >
          Shipping Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={<PercentIcon />}
          onClick={onOpenDiscountSettings}
          color="primary"
        >
          Global Discount
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          color="primary"
        >
          Add New Item
        </Button>
      </div>
    </div>
  );
};

export default StoreItemsHeader;

