import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  InputAdornment,
  Stack,
  MenuItem,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { createStoreItem, updateStoreItem } from "../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../types/marketplace.types";
import CategorySelector from "./CategorySelector";

type StoreItemFormState = {
  name: string;
  description: string;
  productUsage: string;
  productBenefits: string;
  productIngredients: string[];
  price: number;
  stock: number;
  categories: string[];
  isFeatured: boolean;
  isPublished: boolean;
  discountType: DiscountType;
  discountValue: number;
  discountActive: boolean;
  discountStart: string;
  discountEnd: string;
  preOrderEnabled: boolean;
  preOrderStart: string;
  preOrderEnd: string;
  preOrderFulfillmentDate: string;
  preOrderDepositAmount: number;
};

const createDefaultFormState = (): StoreItemFormState => ({
  name: "",
  description: "",
  productUsage: "",
  productBenefits: "",
  productIngredients: [],
  price: 0,
  stock: 0,
  categories: [],
  isFeatured: false,
  isPublished: false,
  discountType: "NONE",
  discountValue: 0,
  discountActive: false,
  discountStart: "",
  discountEnd: "",
  preOrderEnabled: false,
  preOrderStart: "",
  preOrderEnd: "",
  preOrderFulfillmentDate: "",
  preOrderDepositAmount: 0,
});

const cloneFormState = (state: StoreItemFormState): StoreItemFormState => ({
  ...state,
  productIngredients: [...state.productIngredients],
  categories: [...state.categories],
});

const areStringArraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

interface StoreItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: StoreItem | null;
  mode: "create" | "edit";
}

// Reusable dialog component for creating and editing store items
const StoreItemDialog: React.FC<StoreItemDialogProps> = ({
  open,
  onClose,
  onSuccess,
  item,
  mode,
}) => {
  // Form state
  const [formData, setFormData] = useState<StoreItemFormState>(
    createDefaultFormState
  );
  const [displayFile, setDisplayFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [displayPreview, setDisplayPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [ingredientInput, setIngredientInput] = useState("");
  const initialFormDataRef = useRef<StoreItemFormState>(
    createDefaultFormState()
  );
  const initialExistingImagesRef = useRef<string[]>([]);
  // Extract date part (YYYY-MM-DD) from ISO string for date input
  const toInputValue = (value?: string | Date | null) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert date string to ISO with start of day (00:00:00)
  const toStartOfDayISO = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  // Convert date string to ISO with end of day (23:59:59)
  const toEndOfDayISO = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  };

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        const storedDiscountType = (item as any).discountType as DiscountType;
        const discountEnabled = Boolean((item as any).discountActive);
        const resolvedDiscountType = discountEnabled
          ? storedDiscountType === "NONE"
            ? ("PERCENTAGE" as DiscountType)
            : storedDiscountType
          : ("NONE" as DiscountType);
        const nextFormState: StoreItemFormState = {
          name: item.name || "",
          description: item.description || "",
          productUsage: (item as any).productUsage || "",
          productBenefits: (item as any).productBenefits || "",
          productIngredients: Array.isArray((item as any).productIngredients)
            ? ([...(item as any).productIngredients] as string[])
            : [],
          price: Number(item.price ?? 0),
          stock: Number(item.stock ?? 0),
          categories: Array.isArray(item.categories)
            ? [...item.categories]
            : [],
          isFeatured: Boolean(item.isFeatured),
          isPublished: Boolean(item.isPublished),
          discountType: resolvedDiscountType,
          discountValue: Number((item as any).discountValue ?? 0),
          discountActive: discountEnabled,
          discountStart: toInputValue((item as any).discountStart),
          discountEnd: toInputValue((item as any).discountEnd),
          preOrderEnabled: Boolean((item as any).preOrderEnabled),
          preOrderStart: toInputValue((item as any).preOrderStart),
          preOrderEnd: toInputValue((item as any).preOrderEnd),
          preOrderFulfillmentDate: toInputValue(
            (item as any).preOrderFulfillmentDate
          ),
          preOrderDepositAmount: Number(
            (item as any).preOrderDepositAmount ?? 0
          ),
        };
        setFormData(nextFormState);
        initialFormDataRef.current = cloneFormState(nextFormState);
        setDisplayPreview(item.display?.url || "");
        const existingImages = item.images || [];
        setImagePreviews(existingImages);
        setExistingImageUrls(existingImages);
        initialExistingImagesRef.current = [...existingImages];
      } else {
        const defaultState = createDefaultFormState();
        setFormData(defaultState);
        initialFormDataRef.current = cloneFormState(defaultState);
        setDisplayPreview("");
        setImagePreviews([]);
        setExistingImageUrls([]);
        initialExistingImagesRef.current = [];
      }
      setDisplayFile(null);
      setImageFiles([]);
      setIngredientInput("");
    }
  }, [open, mode, item]);

  // Handle file selection for display image/video
  const handleDisplayFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDisplayFile(file);
      const preview = URL.createObjectURL(file);
      setDisplayPreview(preview);
    }
  };

  // Handle multiple image files selection
  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const currentTotal = imagePreviews.length;
    const remainingSlots = Math.max(0, 5 - currentTotal);

    if (files.length > remainingSlots) {
      toast.error(
        `You can only add up to ${remainingSlots} more image(s). Maximum 5 images allowed.`
      );
      return;
    }

    const newFiles = files.slice(0, remainingSlots);
    setImageFiles((prev) => [...prev, ...newFiles]);

    // Create previews for new files
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle removing an additional image
  const handleRemoveImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    const isExistingImage = index < existingImageUrls.length;

    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));

    if (isExistingImage) {
      // Remove from existing URLs (mark for deletion on backend)
      setExistingImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls.splice(index, 1);
        return newUrls;
      });
    } else {
      // Remove from new files and revoke blob URL
      const fileIndex = index - existingImageUrls.length;
      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(fileIndex, 1);
        return newFiles;
      });
      URL.revokeObjectURL(previewToRemove);
    }
  };

  // Handle category selection
  const handleCategoryChange = (categories: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categories: categories,
    }));
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;

    setFormData((prev) => ({
      ...prev,
      productIngredients: [...prev.productIngredients, trimmed],
    }));
    setIngredientInput("");
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productIngredients: prev.productIngredients.filter(
        (_, idx) => idx !== index
      ),
    }));
  };

  const handleDiscountTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextType = event.target.value as DiscountType;
    setFormData((prev) => ({
      ...prev,
      discountType: nextType,
    }));
  };

  const handleDiscountValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      discountValue: Number(event.target.value) || 0,
    }));
  };

  const handleDiscountToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setFormData((prev) => ({
      ...prev,
      discountActive: isEnabled,
      discountType:
        isEnabled && prev.discountType === "NONE"
          ? ("PERCENTAGE" as DiscountType)
          : isEnabled
          ? prev.discountType
          : ("NONE" as DiscountType),
    }));
  };

  const handleDiscountDateChange =
    (field: "discountStart" | "discountEnd") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    };

  const handlePreOrderDateChange =
    (field: "preOrderStart" | "preOrderEnd" | "preOrderFulfillmentDate") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (formData.price < 0) {
      toast.error("Price must be positive");
      return;
    }
    if (formData.stock < 0) {
      toast.error("Stock must be positive");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare form data for multipart upload
      const submitData = new FormData();
      const formKeys = Object.keys(formData) as (keyof StoreItemFormState)[];
      const changedFieldSet =
        mode === "edit"
          ? new Set<keyof StoreItemFormState>(
              formKeys.filter((key) => {
                const initialValue = initialFormDataRef.current?.[key];
                const currentValue = formData[key];
                if (
                  Array.isArray(initialValue) &&
                  Array.isArray(currentValue)
                ) {
                  return !areStringArraysEqual(
                    initialValue as string[],
                    currentValue as string[]
                  );
                }
                return initialValue !== currentValue;
              })
            )
          : new Set<keyof StoreItemFormState>(formKeys);
      const imagesChanged =
        mode === "edit" &&
        !areStringArraysEqual(
          existingImageUrls,
          initialExistingImagesRef.current
        );
      const shouldIncludeField = (field: keyof StoreItemFormState) =>
        mode === "create" || changedFieldSet.has(field);
      if (
        mode === "edit" &&
        changedFieldSet.size === 0 &&
        !imagesChanged &&
        !displayFile &&
        imageFiles.length === 0
      ) {
        toast.error("No changes to update");
        return;
      }
      const appendDateField = (
        key: keyof StoreItemFormState,
        value?: string,
        formatter?: (input: string) => string
      ) => {
        if (!shouldIncludeField(key)) {
          return;
        }
        if (value) {
          submitData.append(
            key as string,
            formatter ? formatter(value) : value
          );
        } else {
          submitData.append(key as string, "");
        }
      };
      const appendField = (
        key: keyof StoreItemFormState,
        value: string | number | boolean
      ) => {
        if (!shouldIncludeField(key)) return;
        submitData.append(key as string, value.toString());
      };
      const appendArrayField = (
        key: keyof StoreItemFormState,
        values: string[]
      ) => {
        if (!shouldIncludeField(key)) return;
        values.forEach((val) => submitData.append(key as string, val));
      };
      appendField("name", formData.name);
      appendField("description", formData.description);
      appendField("productUsage", formData.productUsage);
      appendField("productBenefits", formData.productBenefits);
      appendArrayField("productIngredients", formData.productIngredients);
      appendField("price", formData.price);
      appendField("stock", formData.stock);
      appendField("isFeatured", formData.isFeatured);
      appendField("isPublished", formData.isPublished);
      appendField("discountType", formData.discountType);
      appendField("discountValue", formData.discountValue);
      appendField("discountActive", formData.discountActive);
      appendDateField("discountStart", formData.discountStart, toStartOfDayISO);
      appendDateField("discountEnd", formData.discountEnd, toEndOfDayISO);
      appendField("preOrderEnabled", formData.preOrderEnabled);
      appendDateField("preOrderStart", formData.preOrderStart, toStartOfDayISO);
      appendDateField("preOrderEnd", formData.preOrderEnd, toEndOfDayISO);
      appendDateField(
        "preOrderFulfillmentDate",
        formData.preOrderFulfillmentDate,
        toStartOfDayISO
      );
      appendField("preOrderDepositAmount", formData.preOrderDepositAmount);

      // Add tags
      if (shouldIncludeField("categories")) {
        formData.categories.forEach((tag) => {
          submitData.append("categories", tag);
        });
      }

      // Add display file if selected
      if (displayFile) {
        submitData.append("display", displayFile);
      }

      // Add image files if selected
      imageFiles.forEach((file) => {
        submitData.append("images", file);
      });

      // For edit mode, always send existing image URLs to keep (even if empty)
      // This tells the backend which existing images to preserve
      if (mode === "edit") {
        existingImageUrls.forEach((url) => {
          submitData.append("existingImages", url);
        });
      }

      if (mode === "create") {
        await createStoreItem(submitData as any);
        toast.success("Store item created successfully");
      } else if (item) {
        await updateStoreItem(item.productId, submitData as any);
        toast.success("Store item updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} item`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Create New Store Item" : "Edit Store Item"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            sx={{ mb: 2 }}
            variant="fullWidth"
          >
            <Tab label="Details" />
            <Tab label="Media" />
          </Tabs>

          {tabIndex === 0 && (
            <Stack spacing={2}>
              {/* Basic Information */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  placeholder="e.g. Wellness Journal"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Price"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Stock"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </Box>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Brief, compelling description of the product"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Product Usage (optional)"
                  placeholder="How to use this product"
                  multiline
                  rows={4}
                  value={formData.productUsage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productUsage: e.target.value,
                    }))
                  }
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Product Benefits (optional)"
                  placeholder="Benefits of using this product"
                  multiline
                  rows={4}
                  value={formData.productBenefits}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productBenefits: e.target.value,
                    }))
                  }
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Product Ingredients
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ mb: 1 }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="Add ingredient"
                    placeholder="e.g. Organic lavender"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddIngredient}
                    disabled={!ingredientInput.trim()}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Add
                  </Button>
                </Stack>
                {formData.productIngredients.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.productIngredients.map((ingredient, idx) => (
                      <Chip
                        key={`${ingredient}-${idx}`}
                        label={ingredient}
                        onDelete={() => handleRemoveIngredient(idx)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No ingredients added. Leave empty if this product doesn’t
                    need ingredient details.
                  </Typography>
                )}
              </Box>

              {/* Categories */}
              <Box>
                <CategorySelector
                  service="store"
                  selectedCategories={formData.categories}
                  onChange={handleCategoryChange}
                  label="Categories"
                  placeholder="Select categories for this store item..."
                  helperText="Choose from existing categories to help customers find this product"
                />
              </Box>

              {/* Options */}
              <Box>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isFeatured: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Featured Item"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPublished: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Published"
                  />
                </Stack>
              </Box>

              <Box>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                  >
                    <Typography variant="subtitle2">
                      Discount settings
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.discountActive}
                          onChange={handleDiscountToggle}
                        />
                      }
                      label="Enable discounts"
                    />
                  </Stack>

                  <Collapse in={formData.discountActive} unmountOnExit>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                      <TextField
                        select
                        label="Discount type"
                        size="small"
                        value={formData.discountType}
                        onChange={handleDiscountTypeChange}
                        fullWidth
                      >
                        <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                        <MenuItem value="FLAT">Flat amount</MenuItem>
                      </TextField>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label={
                            formData.discountType === "PERCENTAGE"
                              ? "Discount (%)"
                              : "Discount amount"
                          }
                          type="number"
                          size="small"
                          value={formData.discountValue}
                          onChange={handleDiscountValueChange}
                          inputProps={{
                            min: 0,
                            max:
                              formData.discountType === "PERCENTAGE"
                                ? 100
                                : undefined,
                          }}
                          fullWidth
                        />
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="Starts at"
                          type="date"
                          size="small"
                          value={toInputValue(formData.discountStart)}
                          onChange={handleDiscountDateChange("discountStart")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Ends at"
                          type="date"
                          size="small"
                          value={toInputValue(formData.discountEnd)}
                          onChange={handleDiscountDateChange("discountEnd")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>
                    </Stack>
                  </Collapse>
                </Stack>
              </Box>

              <Box>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                  >
                    <Typography variant="subtitle2">
                      Pre-order settings
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.preOrderEnabled}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preOrderEnabled: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Enable pre-orders"
                    />
                  </Stack>

                  <Collapse in={formData.preOrderEnabled} unmountOnExit>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="Pre-order starts"
                          type="date"
                          size="small"
                          value={toInputValue(formData.preOrderStart)}
                          onChange={handlePreOrderDateChange("preOrderStart")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Pre-order ends"
                          type="date"
                          size="small"
                          value={toInputValue(formData.preOrderEnd)}
                          onChange={handlePreOrderDateChange("preOrderEnd")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>

                      <TextField
                        label="Estimated fulfillment date"
                        type="date"
                        size="small"
                        value={toInputValue(formData.preOrderFulfillmentDate)}
                        onChange={handlePreOrderDateChange(
                          "preOrderFulfillmentDate"
                        )}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        helperText="Let customers know when to expect shipping"
                      />

                      <TextField
                        label="Deposit amount"
                        type="number"
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={formData.preOrderDepositAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preOrderDepositAmount: Number(e.target.value) || 0,
                          }))
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        helperText="Charged per unit during checkout"
                      />
                    </Stack>
                  </Collapse>
                </Stack>
              </Box>
            </Stack>
          )}

          {tabIndex === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Media Files
              </Typography>

              {/* Display File */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Display Image/Video (Required for new items)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Choose Display File
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={handleDisplayFileChange}
                  />
                </Button>
                {displayPreview && (
                  <Box
                    sx={{
                      mt: 1,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    {displayFile?.type.startsWith("video/") ? (
                      <video
                        src={displayPreview}
                        style={{
                          width: 140,
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <img
                        src={displayPreview}
                        alt="Display preview"
                        style={{
                          width: 140,
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>

              {/* Additional Images */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Additional Images (Optional, max 5)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Choose Images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                  />
                </Button>
                {imagePreviews.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {imagePreviews.map((preview, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(idx)}
                          sx={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            bgcolor: "error.main",
                            color: "white",
                            width: 24,
                            height: 24,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            "&:hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          sx={{
            bgcolor: "#00969b",
            "&:hover": { bgcolor: "#007a7e" },
            color: "white",
          }}
        >
          {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreItemDialog;
