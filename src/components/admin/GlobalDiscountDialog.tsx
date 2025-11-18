import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  FormControlLabel,
  Switch,
  LinearProgress,
  Alert,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  fetchStoreItems,
  updateStoreItem,
} from "../../api/marketplace.api";
import type {
  DiscountType,
  StoreItem,
} from "../../types/marketplace.types";

interface GlobalDiscountDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingDiscount?: StoreItem | null;
}

const DEFAULT_FORM = {
  discountName: "",
  discountType: "NONE" as DiscountType,
  discountValue: 0,
  discountActive: false,
  discountStart: "",
  discountEnd: "",
};

const clampValue = (type: DiscountType, value: number) => {
  if (type === "PERCENTAGE") {
    return Math.min(Math.max(value, 0), 100);
  }
  return Math.max(value, 0);
};

const GlobalDiscountDialog: React.FC<GlobalDiscountDialogProps> = ({
  open,
  onClose,
  onSuccess,
  existingDiscount,
}) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ total: number; processed: number }>(
    { total: 0, processed: 0 }
  );

  const resetState = useCallback(() => {
    const savedName = localStorage.getItem("globalDiscountName") || "";
    if (existingDiscount) {
      const startDate = existingDiscount.discountStart
        ? new Date(existingDiscount.discountStart).toISOString().slice(0, 16)
        : "";
      const endDate = existingDiscount.discountEnd
        ? new Date(existingDiscount.discountEnd).toISOString().slice(0, 16)
        : "";
      setForm({
        discountName: savedName,
        discountType: existingDiscount.discountType || "NONE",
        discountValue: existingDiscount.discountValue || 0,
        discountActive: existingDiscount.discountActive || false,
        discountStart: startDate,
        discountEnd: endDate,
      });
    } else {
      setForm({ ...DEFAULT_FORM, discountName: savedName });
    }
    setProgress({ total: 0, processed: 0 });
  }, [existingDiscount]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const hasActiveDiscount =
    form.discountType !== "NONE" && form.discountValue > 0;

  const isApplyDisabled = useMemo(() => {
    if (form.discountType === "NONE") {
      return false;
    }
    return form.discountValue <= 0 || !form.discountName.trim();
  }, [form.discountType, form.discountValue, form.discountName]);

  const toISO = (value: string) =>
    value ? new Date(value).toISOString() : "";

  const fetchAllStoreItems = async (): Promise<StoreItem[]> => {
    let page = 1;
    const limit = 50;
    const allItems: StoreItem[] = [];
    let hasMore = true;

    while (hasMore) {
      const response = await fetchStoreItems({ page, limit });
      const payload = response.data;
      if (!payload) break;
      allItems.push(...(payload.items || []));
      const pagination = payload.pagination;
      if (!pagination) {
        hasMore = false;
      } else {
        hasMore = pagination.hasMore;
        page += 1;
      }
    }

    return allItems;
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const items = await fetchAllStoreItems();
      if (!items.length) {
        toast("No products found to update");
        setLoading(false);
        return;
      }
      setProgress({ total: items.length, processed: 0 });

      const payloadBase =
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
              discountValue: clampValue(
                form.discountType,
                form.discountValue
              ),
              discountActive: form.discountActive,
              discountStart: form.discountStart
                ? toISO(form.discountStart)
                : null,
              discountEnd: form.discountEnd ? toISO(form.discountEnd) : null,
            };

      for (let idx = 0; idx < items.length; idx += 1) {
        const item = items[idx];
        await updateStoreItem(item.productId, payloadBase);
        setProgress((prev) => ({
          ...prev,
          processed: prev.processed + 1,
        }));
      }

      // Store discount name in localStorage
      if (form.discountType !== "NONE" && form.discountName) {
        localStorage.setItem("globalDiscountName", form.discountName);
      } else if (form.discountType === "NONE") {
        localStorage.removeItem("globalDiscountName");
      }

      toast.success(
        form.discountType === "NONE"
          ? "Discounts cleared for all products"
          : "Global discount applied to all products"
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to apply global discount:", error);
      toast.error("Failed to apply global discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Global Discount
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Apply a promotional discount to every product in the marketplace.
            You can remove discounts by selecting "None".
          </Typography>

          <TextField
            label="Discount Name"
            placeholder="e.g., Black Friday Discount, Summer Sale"
            value={form.discountName}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                discountName: e.target.value,
              }))
            }
            size="small"
            fullWidth
            required
          />

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
              <TextField
                label={
                  form.discountType === "PERCENTAGE"
                    ? "Discount (%)"
                    : "Discount amount (£)"
                }
                type="number"
                size="small"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discountValue: Number(e.target.value) || 0,
                  }))
                }
                fullWidth
                inputProps={{
                  min: 0,
                  max: form.discountType === "PERCENTAGE" ? 100 : undefined,
                }}
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
                label="Activate immediately"
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

          {loading && (
            <Box>
              <LinearProgress />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 1 }}
              >
                Updating {progress.processed} of {progress.total} products…
              </Typography>
            </Box>
          )}

          {!hasActiveDiscount && form.discountType === "NONE" && (
            <Alert severity="info" variant="outlined">
              Selecting "None" will remove discounts from every product.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={loading ? undefined : onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={loading || isApplyDisabled}
        >
          {loading ? "Applying…" : form.discountType === "NONE" ? "Remove Discounts" : "Apply Discount"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalDiscountDialog;

