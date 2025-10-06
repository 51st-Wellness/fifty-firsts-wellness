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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Podcast Management
      </Typography>

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
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Podcasts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Podcast management functionality will be implemented here.
            <br />
            For now, you can manage podcast categories in the Categories tab.
          </Typography>
        </Box>
      )}

      {/* Categories Tab */}
      {tabValue === 1 && <CategoryManagement service="podcast" />}
    </Box>
  );
};

export default AdminPodcasts;
