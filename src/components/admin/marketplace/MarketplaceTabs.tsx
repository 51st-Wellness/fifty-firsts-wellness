import React from "react";
import { Tabs, Tab } from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  RateReview as RateReviewIcon,
  Notifications as NotificationsIcon,
  Percent as PercentIcon,
} from "@mui/icons-material";

interface MarketplaceTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const MarketplaceTabs: React.FC<MarketplaceTabsProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
      <Tabs
        value={value}
        onChange={onChange}
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
  );
};

export default MarketplaceTabs;

