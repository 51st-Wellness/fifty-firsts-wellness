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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        General Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="general management tabs"
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
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Settings management will be available soon.
            </Typography>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Storage Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Storage management will be available soon.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminGeneral;
