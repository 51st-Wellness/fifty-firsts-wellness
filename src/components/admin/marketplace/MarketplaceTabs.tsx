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
    <div className="bg-white rounded-xl border border-gray-200 mb-3 sm:mb-4 lg:mb-6 overflow-hidden">
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="marketplace management tabs"
        variant="scrollable"
        scrollButtons="auto"
        className="px-2 sm:px-4"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: { xs: 48, lg: 64 },
            px: { xs: 1.5, sm: 2, lg: 3 },
            fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
            fontFamily: '"League Spartan", sans-serif',
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

