import React, { useEffect, useState } from "react";
import {
  Box,
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
import NumberInput from "../ui/NumberInput";

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

interface GlobalDiscountSettingsProps {
  variant?: "card" | "plain";
  onSaved?: () => void;
}

const GlobalDiscountSettings: React.FC<GlobalDiscountSettingsProps> = ({
  variant = "card",
  onSaved,
}) => {
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
        [field]: value,
      }));
    };

  const handleNumberChange =
    (field: "value" | "minOrderTotal") => (val: number) => {
      setForm((prev) => ({
        ...prev,
        [field]: val,
      }));
    };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
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
        onSaved?.();
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

  const loadingContent = (
    <Box className="flex items-center gap-2">
      <CircularProgress size={20} />
      <Typography variant="body2" color="text.secondary">
        Loading settings...
      </Typography>
    </Box>
  );

  if (loading) {
    return variant === "card" ? (
      <Card>
        <CardContent>{loadingContent}</CardContent>
      </Card>
    ) : (
      loadingContent
    );
  }

  const showValueField = form.type !== "NONE";

  const formContent = (
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
        <NumberInput
          label={
            form.type === "PERCENTAGE"
              ? "Discount percentage (%)"
              : "Discount value"
          }
          size="small"
          value={form.value}
          onChange={handleNumberChange("value")}
          allowDecimals={true}
          max={form.type === "PERCENTAGE" ? 100 : undefined}
          min={0}
          placeholder="0"
          helperText={
            form.type === "PERCENTAGE"
              ? "Maximum 100%"
              : "Enter the flat amount to deduct"
          }
        />
      )}

      <NumberInput
        label="Minimum order total"
        size="small"
        value={form.minOrderTotal}
        onChange={handleNumberChange("minOrderTotal")}
        allowDecimals={true}
        decimalPlaces={2}
        min={0}
        placeholder="0"
        helperText="Discount is applied only if the cart total meets this amount."
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
  );

  if (variant === "plain") {
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 600,
            mb: 1,
          }}
        >
          Global Discount
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure flash sales or storewide incentives with optional
          thresholds.
        </Typography>
        {formContent}
      </Box>
    );
  }

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardHeader
        title="Global Discount"
        subheader="Configure flash sales or storewide incentives with optional thresholds."
        titleTypographyProps={{
          sx: { fontFamily: '"League Spartan", sans-serif', fontWeight: 600 },
        }}
      />
      <CardContent>{formContent}</CardContent>
    </Card>
  );
};

export default GlobalDiscountSettings;
