import React from "react";
import {
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
} from "@mui/material";
import type { StoreItemFormState } from "./types";

interface StoreItemPreOrderProps {
  formData: StoreItemFormState;
  onFormDataChange: (updates: Partial<StoreItemFormState>) => void;
}

const StoreItemPreOrder: React.FC<StoreItemPreOrderProps> = ({
  formData,
  onFormDataChange,
}) => {
  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Pre-order settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.preOrderEnabled}
                onChange={(e) =>
                  onFormDataChange({ preOrderEnabled: e.target.checked })
                }
              />
            }
            label="Enable pre-orders"
          />
        </Stack>

        <Collapse in={formData.preOrderEnabled} unmountOnExit>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              When enabled, customers can place pre-orders whenever this product
              sells out. Those orders are flagged for your team so they can be
              fulfilled once inventory is replenished.
            </Typography>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default StoreItemPreOrder;

