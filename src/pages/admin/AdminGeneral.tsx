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
    <Box
      sx={{ p: 4, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="700" sx={{ mb: 1 }}>
          General Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage categories, settings, and system configurations
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 4,
          backgroundColor: "background.paper",
          borderRadius: 2,
          px: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="general management tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
              px: 3,
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
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <CategoryManagement title="All Categories" showServiceFilter={true} />
      )}

      {tabValue === 1 && (
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <SettingsIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 3 }}
            />
            <Typography variant="h5" gutterBottom fontWeight="600">
              Settings Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              System settings and configuration options will be available soon.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This feature is currently under development.
            </Typography>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <StorageIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 3 }}
            />
            <Typography variant="h5" gutterBottom fontWeight="600">
              Storage Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              File storage and media management will be available soon.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This feature is currently under development.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminGeneral;
