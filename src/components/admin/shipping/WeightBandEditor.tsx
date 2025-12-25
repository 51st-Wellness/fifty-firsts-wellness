import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import NumberInput from "../../ui/NumberInput";
import type { WeightBand } from "../../../api/shipping.api";

interface WeightBandEditorProps {
  bands: WeightBand[];
  onAddBand: () => void;
  onUpdateBand: (index: number, updates: Partial<WeightBand>) => void;
  onDeleteBand: (index: number) => void;
  canDelete: boolean;
}

const WeightBandEditor: React.FC<WeightBandEditorProps> = ({
  bands,
  onAddBand,
  onUpdateBand,
  onDeleteBand,
  canDelete,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Weight Bands
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={onAddBand}>
          Add Band
        </Button>
      </Box>

      <Stack spacing={1.5}>
        {bands.map((band, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <NumberInput
              label="Max Weight (g)"
              size="small"
              value={band.maxWeight}
              onChange={(val) =>
                onUpdateBand(index, {
                  maxWeight: val,
                })
              }
              allowDecimals={false}
              min={1}
              placeholder="0"
              sx={{ flex: 1 }}
            />
            <NumberInput
              label="Price"
              size="small"
              value={band.price}
              onChange={(val) =>
                onUpdateBand(index, {
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
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => onDeleteBand(index)}
              color="error"
              disabled={!canDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default WeightBandEditor;

