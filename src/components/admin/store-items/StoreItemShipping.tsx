import React from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  InputAdornment,
} from "@mui/material";
import type { StoreItemFormState } from "./types";
import NumberInput from "../../ui/NumberInput";

interface StoreItemShippingProps {
  formData: StoreItemFormState;
  onFormDataChange: (updates: Partial<StoreItemFormState>) => void;
}

const StoreItemShipping: React.FC<StoreItemShippingProps> = ({
  formData,
  onFormDataChange,
}) => {
  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography
        variant="subtitle2"
        sx={{ mb: 2, fontFamily: '"League Spartan", sans-serif' }}
      >
        Shipping Information (for Click & Drop)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter product dimensions and weight for accurate shipping cost
        calculation
      </Typography>

      <Stack spacing={2}>
        <NumberInput
          label="Weight (grams)"
          size="small"
          fullWidth
          value={formData.weight}
          onChange={(val) => onFormDataChange({ weight: val })}
          allowDecimals={false}
          min={0}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">g</InputAdornment>
            ),
          }}
          placeholder="0"
          helperText="Product weight for shipping calculation"
        />

        <Typography variant="caption" color="text.secondary">
          Dimensions (millimeters)
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <NumberInput
            label="Length"
            size="small"
            value={formData.length}
            onChange={(val) => onFormDataChange({ length: val })}
            allowDecimals={false}
            min={0}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">mm</InputAdornment>
              ),
            }}
            placeholder="0"
          />
          <NumberInput
            label="Width"
            size="small"
            value={formData.width}
            onChange={(val) => onFormDataChange({ width: val })}
            allowDecimals={false}
            min={0}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">mm</InputAdornment>
              ),
            }}
            placeholder="0"
          />
          <NumberInput
            label="Height"
            size="small"
            value={formData.height}
            onChange={(val) => onFormDataChange({ height: val })}
            allowDecimals={false}
            min={0}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">mm</InputAdornment>
              ),
            }}
            placeholder="0"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default StoreItemShipping;

