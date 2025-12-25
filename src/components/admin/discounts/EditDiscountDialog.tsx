import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import toast from "react-hot-toast";
import { updateStoreItem } from "../../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../../types/marketplace.types";
import NumberInput from "../../ui/NumberInput";

interface EditDiscountDialogProps {
  open: boolean;
  onClose: () => void;
  item: StoreItem | null;
  onSuccess?: () => void;
}

const EditDiscountDialog: React.FC<EditDiscountDialogProps> = ({
  open,
  onClose,
  item,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    discountType: "NONE" as DiscountType,
    discountValue: 0,
    discountActive: false,
    discountStart: "",
    discountEnd: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item && open) {
      const startDate = item.discountStart
        ? new Date(item.discountStart).toISOString().slice(0, 16)
        : "";
      const endDate = item.discountEnd
        ? new Date(item.discountEnd).toISOString().slice(0, 16)
        : "";

      setForm({
        discountType: item.discountType || "NONE",
        discountValue: item.discountValue || 0,
        discountActive: item.discountActive || false,
        discountStart: startDate,
        discountEnd: endDate,
      });
    }
  }, [item, open]);

  const handleSave = async () => {
    if (!item) return;

    setLoading(true);
    try {
      const payload =
        form.discountType === "NONE"
          ? {
              discountType: "NONE" as DiscountType,
              discountValue: 0,
              discountActive: false,
              discountStart: null,
              discountEnd: null,
            }
          : {
              discountType: form.discountType,
              discountValue:
                form.discountType === "PERCENTAGE"
                  ? Math.min(Math.max(form.discountValue, 0), 100)
                  : Math.max(form.discountValue, 0),
              discountActive: form.discountActive,
              discountStart: form.discountStart
                ? new Date(form.discountStart).toISOString()
                : null,
              discountEnd: form.discountEnd
                ? new Date(form.discountEnd).toISOString()
                : null,
            };

      await updateStoreItem(item.productId, payload);
      toast.success("Discount updated");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update discount:", error);
      toast.error("Failed to update discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Edit Discount - {item?.name}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            select
            label="Discount Type"
            value={form.discountType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                discountType: e.target.value as DiscountType,
                discountActive:
                  e.target.value === "NONE" ? false : prev.discountActive,
              }))
            }
            size="small"
            fullWidth
          >
            <MenuItem value="NONE">None</MenuItem>
            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            <MenuItem value="FLAT">Flat Amount (£)</MenuItem>
          </TextField>

          {form.discountType !== "NONE" && (
            <>
              <NumberInput
                label={
                  form.discountType === "PERCENTAGE"
                    ? "Discount (%)"
                    : "Discount amount (£)"
                }
                size="small"
                value={form.discountValue}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    discountValue: val,
                  }))
                }
                allowDecimals={true}
                max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                min={0}
                fullWidth
                placeholder="0"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.discountActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountActive: e.target.checked,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Active"
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Starts at"
                  type="datetime-local"
                  size="small"
                  value={form.discountStart}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountStart: e.target.value,
                    }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Ends at"
                  type="datetime-local"
                  size="small"
                  value={form.discountEnd}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountEnd: e.target.value,
                    }))
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </>
          )}

          {form.discountType === "NONE" && (
            <Alert severity="warning" variant="outlined">
              Setting discount type to "None" will remove the discount from
              this product.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={loading ? undefined : onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDiscountDialog;

