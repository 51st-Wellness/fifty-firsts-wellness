import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";
import type { ShippingRatesConfig } from "../../../api/shipping.api";

interface ShippingDefaultServiceProps {
  config: ShippingRatesConfig;
  onDefaultServiceChange: (serviceKey: string) => void;
}

const ShippingDefaultService: React.FC<ShippingDefaultServiceProps> = ({
  config,
  onDefaultServiceChange,
}) => {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Default Shipping Service"
        subheader="Recommended service shown to customers by default"
        titleTypographyProps={{
          variant: "subtitle1",
          fontWeight: 600,
          sx: {
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        }}
        subheaderTypographyProps={{
          sx: { fontSize: { xs: "0.75rem", sm: "0.875rem" } },
        }}
        sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 1.5 } }}
      />
      <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Default Service"
          value={config.defaultService}
          onChange={(e) => onDefaultServiceChange(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        >
          {Object.entries(config.services).map(([key, service]) => (
            <MenuItem key={key} value={key} sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              {service.label}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
    </Card>
  );
};

export default ShippingDefaultService;

