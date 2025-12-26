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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "auto" },
          },
        }}
      >
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: { xs: 3, sm: 4 },
            }}
          >
            <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 40 } }} />
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
      sx={{
        "& .MuiDialog-paper": {
          margin: { xs: 1, sm: 2 },
          width: { xs: "calc(100% - 16px)", sm: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"League Spartan", sans-serif',
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: { xs: "1rem", sm: "1.25rem" },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          <LocalShippingIcon
            color="primary"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          />
          <span style={{ fontSize: "inherit" }}>Shipping Settings</span>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={saving}
          size="small"
          sx={{
            ml: { xs: 1, sm: 2 },
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "& .MuiAlert-message": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          >
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

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={onClose}
          disabled={saving}
          size="small"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={saving}
          size="small"
          startIcon={
            saving ? <CircularProgress size={14} color="inherit" sx={{ fontSize: { xs: 14, sm: 16 } }} /> : null
          }
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShippingSettingsDialog;

