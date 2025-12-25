import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import type { StoreItem } from "../../../types/marketplace.types";
import { useStoreItemForm } from "./hooks/useStoreItemForm";
import StoreItemBasicInfo from "./StoreItemBasicInfo";
import StoreItemDiscounts from "./StoreItemDiscounts";
import StoreItemShipping from "./StoreItemShipping";
import StoreItemPreOrder from "./StoreItemPreOrder";
import StoreItemMedia from "./StoreItemMedia";

interface StoreItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: StoreItem | null;
  mode: "create" | "edit";
}

const StoreItemDialog: React.FC<StoreItemDialogProps> = ({
  open,
  onClose,
  onSuccess,
  item,
  mode,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const {
    formData,
    updateFormData,
    displayFile,
    displayPreview,
    imageFiles,
    imagePreviews,
    existingImageUrls,
    submitting,
    ingredientInput,
    setIngredientInput,
    productUsageIsList,
    setProductUsageIsList,
    productBenefitsIsList,
    setProductBenefitsIsList,
    handleDisplayFileChange,
    handleImageFilesChange,
    handleRemoveImage,
    handleAddIngredient,
    handleRemoveIngredient,
    handleDiscountTypeChange,
    handleDiscountToggle,
    handleDiscountDateChange,
    handleSubmit,
  } = useStoreItemForm({
    open,
    mode,
    item,
    onSuccess,
    onClose,
  });

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
              <StoreItemBasicInfo
                formData={formData}
                onFormDataChange={updateFormData}
                ingredientInput={ingredientInput}
                onIngredientInputChange={setIngredientInput}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                productUsageIsList={productUsageIsList}
                onProductUsageIsListChange={setProductUsageIsList}
                productBenefitsIsList={productBenefitsIsList}
                onProductBenefitsIsListChange={setProductBenefitsIsList}
              />

              <StoreItemDiscounts
                formData={formData}
                onFormDataChange={updateFormData}
                onDiscountTypeChange={handleDiscountTypeChange}
                onDiscountToggle={handleDiscountToggle}
                onDiscountDateChange={handleDiscountDateChange}
              />

              <StoreItemShipping
                formData={formData}
                onFormDataChange={updateFormData}
              />

              <StoreItemPreOrder
                formData={formData}
                onFormDataChange={updateFormData}
              />
            </Stack>
          )}

          {tabIndex === 1 && (
            <StoreItemMedia
              displayFile={displayFile}
              displayPreview={displayPreview}
              imageFiles={imageFiles}
              imagePreviews={imagePreviews}
              existingImageUrls={existingImageUrls}
              onDisplayFileChange={handleDisplayFileChange}
              onImageFilesChange={handleImageFilesChange}
              onRemoveImage={handleRemoveImage}
              mode={mode}
            />
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

