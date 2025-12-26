import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ShippingAddOnCard from "./ShippingAddOnCard";
import type { ShippingRatesConfig, ShippingAddOn } from "../../../api/shipping.api";

interface ShippingAddOnsListProps {
  config: ShippingRatesConfig;
  onAddAddOn: () => void;
  onUpdateAddOn: (key: string, updates: Partial<ShippingAddOn>) => void;
  onDeleteAddOn: (key: string) => void;
}

const ShippingAddOnsList: React.FC<ShippingAddOnsListProps> = ({
  config,
  onAddAddOn,
  onUpdateAddOn,
  onDeleteAddOn,
}) => {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Shipping Add-ons"
        subheader="Optional extras like Signed For, Tracked, etc."
        action={
          <Button
            startIcon={<AddIcon />}
            onClick={onAddAddOn}
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1, sm: 1.5 },
            }}
          >
            <span className="hidden sm:inline">Add Add-on</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
        titleTypographyProps={{
          variant: "h6",
          fontWeight: 600,
          sx: {
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem", lg: "1.25rem" },
          },
        }}
        subheaderTypographyProps={{
          sx: { fontSize: { xs: "0.75rem", sm: "0.875rem" } },
        }}
        sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 1.5 } }}
      />
      <CardContent sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
        {config.addOns && Object.keys(config.addOns).length > 0 ? (
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            {Object.entries(config.addOns).map(([key, addOn]) => (
              <ShippingAddOnCard
                key={key}
                addOn={addOn}
                onUpdate={(updates) => onUpdateAddOn(key, updates)}
                onDelete={() => onDeleteAddOn(key)}
              />
            ))}
          </Stack>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            No add-ons configured. Click "Add Add-on" to create one.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingAddOnsList;

