import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import {
  Category as CategoryIcon,
  VideoLibrary as ProgrammeIcon,
} from "@mui/icons-material";
import CategoryManagement from "../../components/admin/CategoryManagement";

// Admin page for managing programmes and their categories
const AdminProgrammes: React.FC = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Programme Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab
            icon={<ProgrammeIcon />}
            label="Programmes"
            iconPosition="start"
          />
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
          {/* Programmes Tab */}
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Programmes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Programme management functionality will be implemented here.
            <br />
            For now, you can manage programme categories in the Categories tab.
          </Typography>
        </Box>
      )}

      {/* Categories Tab */}
      {tabValue === 1 && <CategoryManagement service="programme" />}
    </Box>
  );
};

export default AdminProgrammes;
