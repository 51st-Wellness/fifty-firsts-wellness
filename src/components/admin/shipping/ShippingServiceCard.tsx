import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import WeightBandEditor from "./WeightBandEditor";
import type { ShippingServiceConfig, WeightBand } from "../../../api/shipping.api";

interface ShippingServiceCardProps {
  serviceKey: string;
  service: ShippingServiceConfig;
  isDefault: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<ShippingServiceConfig>) => void;
  onDelete: () => void;
  onAddWeightBand: () => void;
  onUpdateWeightBand: (index: number, updates: Partial<WeightBand>) => void;
  onDeleteWeightBand: (index: number) => void;
  canDeleteService: boolean;
}

const ShippingServiceCard: React.FC<ShippingServiceCardProps> = ({
  serviceKey,
  service,
  isDefault,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onAddWeightBand,
  onUpdateWeightBand,
  onDeleteWeightBand,
  canDeleteService,
}) => {
  return (
    <Accordion expanded={isExpanded} onChange={onToggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            pr: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {service.label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Code: {service.serviceCode} • {service.bands.length} weight bands
            </Typography>
          </Box>
          {isDefault && (
            <Chip
              label="Default"
              size="small"
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            label="Service Label"
            size="small"
            fullWidth
            value={service.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />

          <TextField
            label="Service Code"
            size="small"
            fullWidth
            value={service.serviceCode}
            onChange={(e) => onUpdate({ serviceCode: e.target.value })}
            helperText="Account-specific Royal Mail service code from your Click & Drop dashboard"
            error={!service.serviceCode}
          />

          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={service.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />

          <Divider />

          <WeightBandEditor
            bands={service.bands}
            onAddBand={onAddWeightBand}
            onUpdateBand={onUpdateWeightBand}
            onDeleteBand={onDeleteWeightBand}
            canDelete={service.bands.length > 1}
          />

          <Divider />

          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            disabled={!canDeleteService}
          >
            Delete Service
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ShippingServiceCard;

