import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  settingsAPI,
  type GlobalDiscountSetting,
} from "../../api/settings.api";
import type { DiscountType } from "../../types/marketplace.types";

const DISCOUNT_TYPES: { label: string; value: DiscountType }[] = [
  { label: "None", value: "NONE" },
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Flat amount", value: "FLAT" },
];

const DEFAULT_STATE: GlobalDiscountSetting = {
  isActive: false,
  type: "NONE",
  value: 0,
  minOrderTotal: 0,
  label: "Storewide discount",
};

const GlobalDiscountSettings: React.FC = () => {
  const [form, setForm] = useState<GlobalDiscountSetting>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getGlobalDiscount();
        if (
          mounted &&
          (response.status === "SUCCESS" || response.status === "success") &&
          response.data
        ) {
          setForm({
            ...DEFAULT_STATE,
            ...response.data,
          });
        }
      } catch (error: any) {
        if (mounted) {
          toast.error(
            error?.response?.data?.message || "Failed to load discount settings"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFieldChange =
    (field: keyof GlobalDiscountSetting) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "isActive" ? event.target.checked : event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "value" || field === "minOrderTotal"
            ? Number(value)
            : value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        isActive: form.isActive,
        type: form.type,
        value: Number(form.value) || 0,
        minOrderTotal: Number(form.minOrderTotal) || 0,
        label: form.label?.trim() || "Storewide discount",
      };
      const response = await settingsAPI.updateGlobalDiscount(payload);
      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data
      ) {
        setForm({ ...form, ...response.data });
        toast.success("Global discount updated");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update global discount right now"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2">
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading settings...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const showValueField = form.type !== "NONE";

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardHeader
        title="Global Discount"
        subheader="Configure flash sales or storewide incentives with optional thresholds."
        titleTypographyProps={{ sx: { fontFamily: '"League Spartan", sans-serif', fontWeight: 600 } }}
      />
      <CardContent>
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={handleFieldChange("isActive")}
                color="primary"
                disabled={form.type === "NONE"}
              />
            }
            label="Enable discount"
          />

          <TextField
            select
            label="Discount type"
            value={form.type}
            onChange={handleFieldChange("type")}
            size="small"
            fullWidth
          >
            {DISCOUNT_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {showValueField && (
            <TextField
              label={
                form.type === "PERCENTAGE"
                  ? "Discount percentage (%)"
                  : "Discount value"
              }
              type="number"
              size="small"
              value={form.value}
              onChange={handleFieldChange("value")}
              inputProps={{
                min: 0,
                max: form.type === "PERCENTAGE" ? 100 : undefined,
              }}
              helperText={
                form.type === "PERCENTAGE"
                  ? "Maximum 100%"
                  : "Enter the flat amount to deduct"
              }
            />
          )}

          <TextField
            label="Minimum order total"
            type="number"
            size="small"
            value={form.minOrderTotal}
            onChange={handleFieldChange("minOrderTotal")}
            helperText="Discount is applied only if the cart total meets this amount."
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Display label"
            size="small"
            value={form.label || ""}
            onChange={handleFieldChange("label")}
            helperText="Shown to shoppers on the checkout page."
          />

          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {saving ? "Saving" : "Save changes"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GlobalDiscountSettings;
