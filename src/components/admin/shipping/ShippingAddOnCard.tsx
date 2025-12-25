import React from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import NumberInput from "../../ui/NumberInput";
import type { ShippingAddOn } from "../../../api/shipping.api";

interface ShippingAddOnCardProps {
  addOn: ShippingAddOn;
  onUpdate: (updates: Partial<ShippingAddOn>) => void;
  onDelete: () => void;
}

const ShippingAddOnCard: React.FC<ShippingAddOnCardProps> = ({
  addOn,
  onUpdate,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Stack spacing={2}>
        <TextField
          label="Add-on Label"
          size="small"
          fullWidth
          value={addOn.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />

        <NumberInput
          label="Price"
          size="small"
          fullWidth
          value={addOn.price}
          onChange={(val) =>
            onUpdate({
              price: val,
            })
          }
          allowDecimals={true}
          decimalPlaces={2}
          min={0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">£</InputAdornment>
            ),
          }}
          placeholder="0.00"
        />

        <TextField
          label="Description"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={addOn.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />

        <Button
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Remove Add-on
        </Button>
      </Stack>
    </Box>
  );
};

export default ShippingAddOnCard;

