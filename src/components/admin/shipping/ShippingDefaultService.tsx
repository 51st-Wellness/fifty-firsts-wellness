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
          sx: { fontFamily: '"League Spartan", sans-serif' },
        }}
      />
      <CardContent>
        <TextField
          select
          fullWidth
          size="small"
          label="Default Service"
          value={config.defaultService}
          onChange={(e) => onDefaultServiceChange(e.target.value)}
        >
          {Object.entries(config.services).map(([key, service]) => (
            <MenuItem key={key} value={key}>
              {service.label}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
    </Card>
  );
};

export default ShippingDefaultService;

