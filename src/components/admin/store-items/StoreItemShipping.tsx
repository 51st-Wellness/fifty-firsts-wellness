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
      <Divider sx={{ my: { xs: 0.75, sm: 1 } }} />
      <Typography
        variant="subtitle2"
        sx={{
          mb: { xs: 1.5, sm: 2 },
          fontFamily: '"League Spartan", sans-serif',
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Shipping Information (for Click & Drop)
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        }}
      >
        Enter product dimensions and weight for accurate shipping cost
        calculation
      </Typography>

      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
              <InputAdornment position="end" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                g
              </InputAdornment>
            ),
          }}
          placeholder="0"
          helperText="Product weight for shipping calculation"
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
            "& .MuiFormHelperText-root": {
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            },
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Dimensions (millimeters)
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: { xs: 1.5, sm: 2 },
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
                <InputAdornment position="end" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  mm
                </InputAdornment>
              ),
            }}
            placeholder="0"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
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
                <InputAdornment position="end" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  mm
                </InputAdornment>
              ),
            }}
            placeholder="0"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
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
                <InputAdornment position="end" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  mm
                </InputAdornment>
              ),
            }}
            placeholder="0"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default StoreItemShipping;

