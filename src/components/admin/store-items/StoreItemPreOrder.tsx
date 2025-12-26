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
      <Divider sx={{ my: { xs: 0.75, sm: 1 } }} />
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={{ xs: 1, sm: 1 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
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
                size="small"
              />
            }
            label="Enable pre-orders"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        </Stack>

        <Collapse in={formData.preOrderEnabled} unmountOnExit>
          <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
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

