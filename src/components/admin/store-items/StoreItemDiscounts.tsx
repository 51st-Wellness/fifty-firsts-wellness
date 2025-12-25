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
            Discount settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.discountActive}
                onChange={onDiscountToggle}
              />
            }
            label="Enable discounts"
          />
        </Stack>

        <Collapse in={formData.discountActive} unmountOnExit>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Discount type"
              size="small"
              value={formData.discountType}
              onChange={onDiscountTypeChange}
              fullWidth
            >
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              <MenuItem value="FLAT">Flat amount</MenuItem>
            </TextField>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Starts at"
                type="date"
                size="small"
                value={toInputValue(formData.discountStart)}
                onChange={onDiscountDateChange("discountStart")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Ends at"
                type="date"
                size="small"
                value={toInputValue(formData.discountEnd)}
                onChange={onDiscountDateChange("discountEnd")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};

export default StoreItemDiscounts;

