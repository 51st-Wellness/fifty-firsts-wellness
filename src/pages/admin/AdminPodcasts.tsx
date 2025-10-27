import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import {
  Category as CategoryIcon,
  Podcast as PodcastIcon,
} from "@mui/icons-material";
import CategoryManagement from "../../components/admin/CategoryManagement";

// Admin page for managing podcasts and their categories
const AdminPodcasts: React.FC = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="p-6 font-primary">
      {/* Header */}
      <h1 className="text-3xl font-accent font-semibold text-gray-900 mb-6">
        Podcast Management
      </h1>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab icon={<PodcastIcon />} label="Podcasts" iconPosition="start" />
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {/* Podcasts Tab */}
          <h2 className="text-2xl font-accent font-semibold text-gray-900 mb-4">
            Podcasts
          </h2>
          <p className="text-base text-gray-600">
            Podcast management functionality will be implemented here.
            <br />
            For now, you can manage podcast categories in the Categories tab.
          </p>
        </div>
      )}

      {/* Categories Tab */}
      {tabValue === 1 && <CategoryManagement service="podcast" />}
    </div>
  );
};

export default AdminPodcasts;
