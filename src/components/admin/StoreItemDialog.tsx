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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productUsage: "",
    productBenefits: "",
    productIngredients: [] as string[],
    price: 0,
    stock: 0,
    categories: [] as string[],
    isFeatured: false,
    isPublished: false,
    discountType: "NONE" as DiscountType,
    discountValue: 0,
    discountActive: false,
    discountStart: "",
    discountEnd: "",
    preOrderEnabled: false,
    preOrderStart: "",
    preOrderEnd: "",
    preOrderFulfillmentDate: "",
    preOrderDepositRequired: false,
    preOrderDepositAmount: 0,
  });
  const [displayFile, setDisplayFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [displayPreview, setDisplayPreview] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [ingredientInput, setIngredientInput] = useState("");
  const toIsoString = (value?: string | Date | null) =>
    value ? new Date(value).toISOString() : "";
  const toInputValue = (value?: string) => (value ? value.slice(0, 16) : "");

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && item) {
        setFormData({
          name: item.name || "",
          description: item.description || "",
          productUsage: (item as any).productUsage || "",
          productBenefits: (item as any).productBenefits || "",
          productIngredients:
            ((item as any).productIngredients as string[]) || [],
          price: item.price || 0,
          stock: item.stock || 0,
          categories: item.categories || [],
          isFeatured: item.isFeatured || false,
          isPublished: item.isPublished || false,
          discountType: (item as any).discountType || "NONE",
          discountValue: (item as any).discountValue || 0,
          discountActive: Boolean(
            (item as any).discountActive &&
              (item as any).discountType !== "NONE"
          ),
          discountStart: toIsoString((item as any).discountStart),
          discountEnd: toIsoString((item as any).discountEnd),
          preOrderEnabled: Boolean((item as any).preOrderEnabled),
          preOrderStart: toIsoString((item as any).preOrderStart),
          preOrderEnd: toIsoString((item as any).preOrderEnd),
          preOrderFulfillmentDate: toIsoString(
            (item as any).preOrderFulfillmentDate
          ),
          preOrderDepositRequired: Boolean(
            (item as any).preOrderDepositRequired
          ),
          preOrderDepositAmount: Number(
            (item as any).preOrderDepositAmount ?? 0
          ),
        });
        setDisplayPreview(item.display?.url || "");
        const existingImages = item.images || [];
        setImagePreviews(existingImages);
        setExistingImageUrls(existingImages);
      } else {
        setFormData({
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
          preOrderDepositRequired: false,
          preOrderDepositAmount: 0,
        });
        setDisplayPreview("");
        setImagePreviews([]);
        setExistingImageUrls([]);
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
      discountActive: nextType === "NONE" ? false : prev.discountActive,
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

  const handleDiscountSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      discountActive: event.target.checked,
    }));
  };

  const handleDiscountDateChange =
    (field: "discountStart" | "discountEnd") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value ? new Date(value).toISOString() : "",
      }));
    };

  const handlePreOrderDateChange =
    (field: "preOrderStart" | "preOrderEnd" | "preOrderFulfillmentDate") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value ? new Date(value).toISOString() : "",
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
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("productUsage", formData.productUsage);
      submitData.append("productBenefits", formData.productBenefits);
      formData.productIngredients.forEach((ingredient) => {
        submitData.append("productIngredients", ingredient);
      });
      submitData.append("price", formData.price.toString());
      submitData.append("stock", formData.stock.toString());
      submitData.append("isFeatured", formData.isFeatured.toString());
      submitData.append("isPublished", formData.isPublished.toString());
      submitData.append("discountType", formData.discountType);
      submitData.append("discountValue", formData.discountValue.toString());
      submitData.append("discountActive", formData.discountActive.toString());
      if (formData.discountStart) {
        submitData.append("discountStart", formData.discountStart);
      }
      if (formData.discountEnd) {
        submitData.append("discountEnd", formData.discountEnd);
      }
      submitData.append("preOrderEnabled", formData.preOrderEnabled.toString());
      if (formData.preOrderStart) {
        submitData.append("preOrderStart", formData.preOrderStart);
      }
      if (formData.preOrderEnd) {
        submitData.append("preOrderEnd", formData.preOrderEnd);
      }
      if (formData.preOrderFulfillmentDate) {
        submitData.append(
          "preOrderFulfillmentDate",
          formData.preOrderFulfillmentDate
        );
      }
      submitData.append(
        "preOrderDepositRequired",
        formData.preOrderDepositRequired.toString()
      );
      submitData.append(
        "preOrderDepositAmount",
        formData.preOrderDepositAmount.toString()
      );

      // Add tags
      formData.categories.forEach((tag) => {
        submitData.append("categories", tag);
      });

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
                  label="Product Usage"
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
                  label="Product Benefits"
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
                  <Typography variant="subtitle2">Discounts</Typography>
                  <TextField
                    select
                    label="Discount type"
                    size="small"
                    value={formData.discountType}
                    onChange={handleDiscountTypeChange}
                  >
                    <MenuItem value="NONE">None</MenuItem>
                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                    <MenuItem value="FLAT">Flat amount</MenuItem>
                  </TextField>

                  {formData.discountType !== "NONE" && (
                    <>
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
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.discountActive}
                              onChange={handleDiscountSwitch}
                              color="primary"
                            />
                          }
                          label="Active"
                        />
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="Starts at"
                          type="datetime-local"
                          size="small"
                          value={toInputValue(formData.discountStart)}
                          onChange={handleDiscountDateChange("discountStart")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Ends at"
                          type="datetime-local"
                          size="small"
                          value={toInputValue(formData.discountEnd)}
                          onChange={handleDiscountDateChange("discountEnd")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>
                    </>
                  )}
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
                          type="datetime-local"
                          size="small"
                          value={toInputValue(formData.preOrderStart)}
                          onChange={handlePreOrderDateChange("preOrderStart")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Pre-order ends"
                          type="datetime-local"
                          size="small"
                          value={toInputValue(formData.preOrderEnd)}
                          onChange={handlePreOrderDateChange("preOrderEnd")}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>

                      <TextField
                        label="Estimated fulfillment date"
                        type="datetime-local"
                        size="small"
                        value={toInputValue(formData.preOrderFulfillmentDate)}
                        onChange={handlePreOrderDateChange(
                          "preOrderFulfillmentDate"
                        )}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        helperText="Let customers know when to expect shipping"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.preOrderDepositRequired}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                preOrderDepositRequired: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Require deposit at checkout"
                      />

                      {formData.preOrderDepositRequired && (
                        <TextField
                          label="Deposit amount"
                          type="number"
                          size="small"
                          inputProps={{ min: 0, step: 0.01 }}
                          value={formData.preOrderDepositAmount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preOrderDepositAmount:
                                Number(e.target.value) || 0,
                            }))
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          helperText="Charged per unit during checkout"
                        />
                      )}

                      <Typography variant="caption" color="text.secondary">
                        Customers will see clear pre-order messaging on the
                        storefront. Deposits are captured now; remaining balance
                        is due when the order ships.
                      </Typography>
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
