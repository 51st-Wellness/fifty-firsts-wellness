import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ShippingServiceCard from "./ShippingServiceCard";
import type {
  ShippingRatesConfig,
  ShippingServiceConfig,
  WeightBand,
} from "../../../api/shipping.api";

interface ShippingServicesListProps {
  config: ShippingRatesConfig;
  expandedService: string | false;
  onExpandedServiceChange: (serviceKey: string | false) => void;
  onAddService: () => void;
  onUpdateService: (
    key: string,
    updates: Partial<ShippingServiceConfig>
  ) => void;
  onDeleteService: (key: string) => void;
  onAddWeightBand: (serviceKey: string) => void;
  onUpdateWeightBand: (
    serviceKey: string,
    index: number,
    updates: Partial<WeightBand>
  ) => void;
  onDeleteWeightBand: (serviceKey: string, index: number) => void;
}

const ShippingServicesList: React.FC<ShippingServicesListProps> = ({
  config,
  expandedService,
  onExpandedServiceChange,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddWeightBand,
  onUpdateWeightBand,
  onDeleteWeightBand,
}) => {
  return (
    <Card variant="outlined">
      <CardHeader
        title="Shipping Services"
        action={
          <Button
            startIcon={<AddIcon />}
            onClick={onAddService}
            variant="outlined"
            size="small"
          >
            Add Service
          </Button>
        }
        titleTypographyProps={{
          variant: "h6",
          fontWeight: 600,
          sx: { fontFamily: '"League Spartan", sans-serif' },
        }}
      />
      <CardContent>
        <Stack spacing={2}>
          {Object.entries(config.services).map(([key, service]) => (
            <ShippingServiceCard
              key={key}
              serviceKey={key}
              service={service}
              isDefault={config.defaultService === key}
              isExpanded={expandedService === key}
              onToggle={() =>
                onExpandedServiceChange(expandedService === key ? false : key)
              }
              onUpdate={(updates) => onUpdateService(key, updates)}
              onDelete={() => onDeleteService(key)}
              onAddWeightBand={() => onAddWeightBand(key)}
              onUpdateWeightBand={(index, updates) =>
                onUpdateWeightBand(key, index, updates)
              }
              onDeleteWeightBand={(index) => onDeleteWeightBand(key, index)}
              canDeleteService={Object.keys(config.services).length > 1}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ShippingServicesList;

