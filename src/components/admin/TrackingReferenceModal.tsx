import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { addTrackingReference } from "../../api/user.api";
import { ResponseStatus } from "../../types/response.types";

interface TrackingReferenceModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  existingTrackingReference?: string | null;
  onSuccess?: () => void;
}

const TrackingReferenceModal: React.FC<TrackingReferenceModalProps> = ({
  open,
  onClose,
  orderId,
  existingTrackingReference,
  onSuccess,
}) => {
  const [trackingRef, setTrackingRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTrackingRef(existingTrackingReference || "");
      setError(null);
    }
  }, [open, existingTrackingReference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!trackingRef.trim()) {
      setError("Tracking reference is required");
      return;
    }

    // Validate tracking reference format (alphanumeric, 10-20 characters)
    const trackingRegex = /^[A-Z0-9]{10,20}$/i;
    if (!trackingRegex.test(trackingRef.trim())) {
      setError(
        "Tracking reference must be alphanumeric and 10-20 characters long"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await addTrackingReference(orderId, trackingRef.trim());
      if (response.status === ResponseStatus.SUCCESS) {
        toast.success(
          existingTrackingReference
            ? "Tracking reference updated successfully"
            : "Tracking reference added successfully"
        );
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        throw new Error(
          response.message || "Failed to save tracking reference"
        );
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to save tracking reference";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalShippingIcon />
          {existingTrackingReference
            ? "Update Tracking Reference"
            : "Add Tracking Reference"}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Enter the Royal Mail tracking reference for this order. This will
              enable automatic tracking updates and notifications to the
              customer.
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="Tracking Reference"
              value={trackingRef}
              onChange={(e) => {
                setTrackingRef(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="e.g. AB123456789GB"
              fullWidth
              required
              disabled={loading}
              helperText="Alphanumeric, 10-20 characters"
              inputProps={{
                maxLength: 20,
                pattern: "[A-Z0-9]{10,20}",
              }}
              autoFocus
            />

            {existingTrackingReference && (
              <Alert severity="info">
                Current tracking reference:{" "}
                <strong>{existingTrackingReference}</strong>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !trackingRef.trim()}
            startIcon={
              loading ? <CircularProgress size={16} /> : <LocalShippingIcon />
            }
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              fontFamily: '"League Spartan", sans-serif',
            }}
          >
            {loading
              ? "Saving..."
              : existingTrackingReference
              ? "Update"
              : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TrackingReferenceModal;
