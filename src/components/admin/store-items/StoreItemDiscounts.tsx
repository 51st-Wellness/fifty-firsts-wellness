import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Collapse,
  Divider,
} from "@mui/material";
import type { StoreItemFormState } from "./types";
import NumberInput from "../../ui/NumberInput";
import { toInputValue } from "./utils";

interface StoreItemDiscountsProps {
  formData: StoreItemFormState;
  onFormDataChange: (updates: Partial<StoreItemFormState>) => void;
  onDiscountTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountDateChange: (
    field: "discountStart" | "discountEnd"
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StoreItemDiscounts: React.FC<StoreItemDiscountsProps> = ({
  formData,
  onFormDataChange,
  onDiscountTypeChange,
  onDiscountToggle,
  onDiscountDateChange,
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
            Discount settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.discountActive}
                onChange={onDiscountToggle}
                size="small"
              />
            }
            label="Enable discounts"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        </Stack>

        <Collapse in={formData.discountActive} unmountOnExit>
          <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
            <TextField
              select
              label="Discount type"
              size="small"
              value={formData.discountType}
              onChange={onDiscountTypeChange}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            >
              <MenuItem value="PERCENTAGE" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Percentage
              </MenuItem>
              <MenuItem value="FLAT" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Flat amount
              </MenuItem>
            </TextField>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 2 }}>
              <NumberInput
                label={
                  formData.discountType === "PERCENTAGE"
                    ? "Discount (%)"
                    : "Discount amount"
                }
                size="small"
                value={formData.discountValue}
                onChange={(val) => onFormDataChange({ discountValue: val })}
                allowDecimals={true}
                max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
                min={0}
                placeholder="0"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 2 }}>
              <TextField
                label="Starts at"
                type="date"
                size="small"
                value={toInputValue(formData.discountStart)}
                onChange={onDiscountDateChange("discountStart")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
              <TextField
                label="Ends at"
                type="date"
                size="small"
                value={toInputValue(formData.discountEnd)}
                onChange={onDiscountDateChange("discountEnd")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default StoreItemDiscounts;

