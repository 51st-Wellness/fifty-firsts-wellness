import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import {
  Category as CategoryIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import CategoryManagement from "../../components/admin/CategoryManagement";

// General management page for managing categories and other general settings
const ManagementGeneral: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen font-primary">
      {/* Header */}
      <div className="mb-2 sm:mb-3 lg:mb-6">
        <h1
          className="text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-0.5 sm:mb-2"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          General Management
        </h1>
        <p className="text-xs sm:text-base text-gray-600 font-primary hidden sm:block">
          Manage categories, settings, and system configurations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 mb-3 sm:mb-4 lg:mb-6 overflow-hidden">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="general management tabs"
          className="px-2 sm:px-4"
          variant="scrollable"
          scrollButtons="auto"
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
              width: { xs: 32, lg: 48 },
            },
          }}
        >
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
          />
          <Tab
            icon={<StorageIcon />}
            label="Storage"
            iconPosition="start"
            disabled
          />
        </Tabs>
      </div>

      {/* Tab Content */}
      {tabValue === 0 && (
        <CategoryManagement title="All Categories" showServiceFilter={true} />
      )}

      {tabValue === 1 && (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
            <StorageIcon sx={{ fontSize: { xs: 48, sm: 56, lg: 64 }, color: "#6b7280", mb: { xs: 2, lg: 3 } }} />
            <h3
              className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Storage Management
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-primary mb-2 sm:mb-3 lg:mb-4">
              File storage and media management will be available soon.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 font-primary">
              This feature is currently under development.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementGeneral;
