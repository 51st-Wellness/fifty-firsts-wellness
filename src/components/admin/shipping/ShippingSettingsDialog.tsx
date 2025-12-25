import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { useShippingSettings } from "./hooks/useShippingSettings";
import ShippingDefaultService from "./ShippingDefaultService";
import ShippingServicesList from "./ShippingServicesList";
import ShippingAddOnsList from "./ShippingAddOnsList";

interface ShippingSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ShippingSettingsDialog: React.FC<ShippingSettingsDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const {
    config,
    loading,
    saving,
    expandedService,
    setExpandedService,
    handleSave,
    addService,
    updateService,
    deleteService,
    addWeightBand,
    updateWeightBand,
    deleteWeightBand,
    addAddOn,
    updateAddOn,
    deleteAddOn,
    setDefaultService,
  } = useShippingSettings(open);

  const handleSaveClick = async () => {
    const success = await handleSave();
    if (success) {
      onSuccess?.();
      onClose();
    }
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
            Royal Mail Click &amp; Drop shipping configuration. The default service
            code is 'OLP2' for Royal Mail 2nd Class.
            <br />
            <br />
            If you need to update the service code:
            <br />
            1. Log into your Click &amp; Drop account
            <br />
            2. Go to Settings → Services
            <br />
            3. Copy the exact service code for Royal Mail 2nd Class
            <br />
            <br />
            <strong>Tip:</strong> Find updated Royal Mail postage prices&nbsp;
            <a
              href="https://www.royalmail.com/current-postage-prices"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "#3949ab" }}
            >
              here
            </a>
            .
          </Alert>

          <ShippingDefaultService
            config={config}
            onDefaultServiceChange={setDefaultService}
          />

          <ShippingServicesList
            config={config}
            expandedService={expandedService}
            onExpandedServiceChange={setExpandedService}
            onAddService={addService}
            onUpdateService={updateService}
            onDeleteService={deleteService}
            onAddWeightBand={addWeightBand}
            onUpdateWeightBand={updateWeightBand}
            onDeleteWeightBand={deleteWeightBand}
          />

          <ShippingAddOnsList
            config={config}
            onAddAddOn={addAddOn}
            onUpdateAddOn={updateAddOn}
            onDeleteAddOn={deleteAddOn}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveClick}
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

