import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Card, CardContent } from "@mui/material";
import {
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import CategoryManagement from "../../components/admin/CategoryManagement";

// General admin page for managing categories and other general settings
const AdminGeneral: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-primary">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-semibold text-gray-900 mb-2">
          General Management
        </h1>
        <p className="text-base text-gray-600 font-primary">
          Manage categories, settings, and system configurations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="general management tabs"
          className="px-4"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
              px: 3,
              fontFamily: '"Poppins", sans-serif',
            },
          }}
        >
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
          />
          <Tab
            icon={<SettingsIcon />}
            label="Settings"
            iconPosition="start"
            disabled
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center py-12 px-6">
            <SettingsIcon
              sx={{ fontSize: 64, color: "#6b7280", mb: 3 }}
            />
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              Settings Management
            </h3>
            <p className="text-base text-gray-600 font-primary mb-4">
              System settings and configuration options will be available soon.
            </p>
            <p className="text-sm text-gray-500 font-primary">
              This feature is currently under development.
            </p>
          </div>
        </div>
      )}

      {tabValue === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center py-12 px-6">
            <StorageIcon
              sx={{ fontSize: 64, color: "#6b7280", mb: 3 }}
            />
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              Storage Management
            </h3>
            <p className="text-base text-gray-600 font-primary mb-4">
              File storage and media management will be available soon.
            </p>
            <p className="text-sm text-gray-500 font-primary">
              This feature is currently under development.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGeneral;
