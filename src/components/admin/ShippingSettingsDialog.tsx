import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  shippingAPI,
  type ShippingRatesConfig,
  type ShippingServiceConfig,
  type ShippingAddOn,
  type WeightBand,
} from "../../api/shipping.api";
import { ResponseStatus } from "../../types/response.types";

interface ShippingSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_CONFIG: ShippingRatesConfig = {
  services: {
    ROYAL_MAIL_48: {
      label: "Royal Mail 2nd Class",
      serviceCode: "CRL1",
      description: "Standard delivery, 2-3 business days",
      bands: [
        { maxWeight: 1000, price: 4.19 },
        { maxWeight: 2000, price: 6.49 },
        { maxWeight: 5000, price: 9.99 },
      ],
    },
    ROYAL_MAIL_24: {
      label: "Royal Mail 1st Class",
      serviceCode: "CRL2",
      description: "Next day delivery",
      bands: [
        { maxWeight: 1000, price: 5.82 },
        { maxWeight: 2000, price: 8.5 },
      ],
    },
  },
  addOns: {
    SIGNED_FOR: {
      label: "Signed For",
      price: 1.5,
      description: "Requires signature on delivery",
    },
  },
  defaultService: "ROYAL_MAIL_48",
};

const ShippingSettingsDialog: React.FC<ShippingSettingsDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [config, setConfig] = useState<ShippingRatesConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedService, setExpandedService] = useState<string | false>(false);

  // Load current configuration
  useEffect(() => {
    if (open) {
      loadConfiguration();
    }
  }, [open]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const response = await shippingAPI.getShippingRates();
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setConfig(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load shipping rates:", error);
      toast.error("Failed to load shipping settings");
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await shippingAPI.updateShippingRates(config);
      if (response.status === ResponseStatus.SUCCESS) {
        toast.success("Shipping settings updated successfully");
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update shipping rates:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update shipping settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // Service management
  const addService = () => {
    const newKey = `NEW_SERVICE_${Date.now()}`;
    setConfig({
      ...config,
      services: {
        ...config.services,
        [newKey]: {
          label: "New Service",
          serviceCode: "",
          description: "",
          bands: [{ maxWeight: 1000, price: 0 }],
        },
      },
    });
    setExpandedService(newKey);
  };

  const updateService = (
    key: string,
    updates: Partial<ShippingServiceConfig>
  ) => {
    setConfig({
      ...config,
      services: {
        ...config.services,
        [key]: {
          ...config.services[key],
          ...updates,
        },
      },
    });
  };

  const deleteService = (key: string) => {
    if (Object.keys(config.services).length <= 1) {
      toast.error("You must have at least one shipping service");
      return;
    }

    const newServices = { ...config.services };
    delete newServices[key];

    // Update default service if deleted
    const newDefaultService =
      config.defaultService === key
        ? Object.keys(newServices)[0]
        : config.defaultService;

    setConfig({
      ...config,
      services: newServices,
      defaultService: newDefaultService,
    });
    toast.success("Service removed");
  };

  // Weight band management
  const addWeightBand = (serviceKey: string) => {
    const service = config.services[serviceKey];
    const lastBand = service.bands[service.bands.length - 1];
    const newMaxWeight = lastBand ? lastBand.maxWeight + 1000 : 1000;

    updateService(serviceKey, {
      bands: [...service.bands, { maxWeight: newMaxWeight, price: 0 }],
    });
  };

  const updateWeightBand = (
    serviceKey: string,
    index: number,
    updates: Partial<WeightBand>
  ) => {
    const service = config.services[serviceKey];
    const newBands = [...service.bands];
    newBands[index] = { ...newBands[index], ...updates };
    updateService(serviceKey, { bands: newBands });
  };

  const deleteWeightBand = (serviceKey: string, index: number) => {
    const service = config.services[serviceKey];
    if (service.bands.length <= 1) {
      toast.error("Service must have at least one weight band");
      return;
    }

    const newBands = service.bands.filter((_, i) => i !== index);
    updateService(serviceKey, { bands: newBands });
  };

  // Add-on management
  const addAddOn = () => {
    const newKey = `NEW_ADDON_${Date.now()}`;
    setConfig({
      ...config,
      addOns: {
        ...config.addOns,
        [newKey]: {
          label: "New Add-on",
          price: 0,
          description: "",
        },
      },
    });
  };

  const updateAddOn = (key: string, updates: Partial<ShippingAddOn>) => {
    setConfig({
      ...config,
      addOns: {
        ...config.addOns,
        [key]: {
          ...config.addOns![key],
          ...updates,
        },
      },
    });
  };

  const deleteAddOn = (key: string) => {
    const newAddOns = { ...config.addOns };
    delete newAddOns[key];
    setConfig({ ...config, addOns: newAddOns });
    toast.success("Add-on removed");
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          fontFamily: '"League Spartan", sans-serif',
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalShippingIcon color="primary" />
          Shipping Settings
        </Box>
        <IconButton
          onClick={onClose}
          disabled={saving}
          size="small"
          sx={{ ml: 2 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
                  <Alert severity="info" variant="outlined">
                    Royal Mail Click & Drop shipping configuration. The default service code is 'OLP2' for Royal Mail 2nd Class.
                    <br />
                    <br />
                    If you need to update the service code:
                    <br />
                    1. Log into your Click & Drop account
                    <br />
                    2. Go to Settings → Services
                    <br />
                    3. Copy the exact service code for Royal Mail 2nd Class
                  </Alert>

          {/* Default Service */}
          <Card variant="outlined">
            <CardHeader
              title="Default Shipping Service"
              subheader="Recommended service shown to customers by default"
              titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            />
            <CardContent>
              <TextField
                select
                fullWidth
                size="small"
                label="Default Service"
                value={config.defaultService}
                onChange={(e) =>
                  setConfig({ ...config, defaultService: e.target.value })
                }
              >
                {Object.entries(config.services).map(([key, service]) => (
                  <MenuItem key={key} value={key}>
                    {service.label}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>

          {/* Shipping Services */}
          <Card variant="outlined">
            <CardHeader
              title="Shipping Services"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={addService}
                  variant="outlined"
                  size="small"
                >
                  Add Service
                </Button>
              }
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
            />
            <CardContent>
              <Stack spacing={2}>
                {Object.entries(config.services).map(([key, service]) => (
                  <Accordion
                    key={key}
                    expanded={expandedService === key}
                    onChange={() =>
                      setExpandedService(expandedService === key ? false : key)
                    }
                  >
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
                          <Typography variant="subtitle1" fontWeight={600}>
                            {service.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code: {service.serviceCode} • {service.bands.length}{" "}
                            weight bands
                          </Typography>
                        </Box>
                        {config.defaultService === key && (
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
                          onChange={(e) =>
                            updateService(key, { label: e.target.value })
                          }
                        />

                                <TextField
                                  label="Service Code"
                                  size="small"
                                  fullWidth
                                  value={service.serviceCode}
                                  onChange={(e) =>
                                    updateService(key, { serviceCode: e.target.value })
                                  }
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
                          onChange={(e) =>
                            updateService(key, { description: e.target.value })
                          }
                        />

                        <Divider />

                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Weight Bands
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => addWeightBand(key)}
                            >
                              Add Band
                            </Button>
                          </Box>

                          <Stack spacing={1.5}>
                            {service.bands.map((band, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "flex-start",
                                }}
                              >
                                <TextField
                                  label="Max Weight (g)"
                                  type="number"
                                  size="small"
                                  value={band.maxWeight}
                                  onChange={(e) =>
                                    updateWeightBand(key, index, {
                                      maxWeight: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  inputProps={{ min: 1 }}
                                  sx={{ flex: 1 }}
                                />
                                <TextField
                                  label="Price"
                                  type="number"
                                  size="small"
                                  value={band.price}
                                  onChange={(e) =>
                                    updateWeightBand(key, index, {
                                      price: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        £
                                      </InputAdornment>
                                    ),
                                  }}
                                  inputProps={{ min: 0, step: 0.01 }}
                                  sx={{ flex: 1 }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => deleteWeightBand(key, index)}
                                  color="error"
                                  disabled={service.bands.length <= 1}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Stack>
                        </Box>

                        <Divider />

                        <Button
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteService(key)}
                          disabled={Object.keys(config.services).length <= 1}
                        >
                          Delete Service
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card variant="outlined">
            <CardHeader
              title="Shipping Add-ons"
              subheader="Optional extras like Signed For, Tracked, etc."
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={addAddOn}
                  variant="outlined"
                  size="small"
                >
                  Add Add-on
                </Button>
              }
              titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
            />
            <CardContent>
              {config.addOns && Object.keys(config.addOns).length > 0 ? (
                <Stack spacing={2}>
                  {Object.entries(config.addOns).map(([key, addOn]) => (
                    <Box
                      key={key}
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
                          onChange={(e) =>
                            updateAddOn(key, { label: e.target.value })
                          }
                        />

                        <TextField
                          label="Price"
                          type="number"
                          size="small"
                          fullWidth
                          value={addOn.price}
                          onChange={(e) =>
                            updateAddOn(key, {
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                £
                              </InputAdornment>
                            ),
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />

                        <TextField
                          label="Description"
                          size="small"
                          fullWidth
                          multiline
                          rows={2}
                          value={addOn.description || ""}
                          onChange={(e) =>
                            updateAddOn(key, { description: e.target.value })
                          }
                        />

                        <Button
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteAddOn(key)}
                        >
                          Remove Add-on
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No add-ons configured. Click "Add Add-on" to create one.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={
            saving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShippingSettingsDialog;
