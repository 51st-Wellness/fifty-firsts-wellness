import React, { useState } from "react";
import {
  Box,
  TextField,
  Stack,
  Typography,
  Chip,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  InputAdornment,
} from "@mui/material";
import type { StoreItemFormState } from "./types";
import CategorySelector from "../CategorySelector";
import NumberInput from "../../ui/NumberInput";

interface StoreItemBasicInfoProps {
  formData: StoreItemFormState;
  onFormDataChange: (updates: Partial<StoreItemFormState>) => void;
  ingredientInput: string;
  onIngredientInputChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
  productUsageIsList: boolean;
  onProductUsageIsListChange: (isList: boolean) => void;
  productBenefitsIsList: boolean;
  onProductBenefitsIsListChange: (isList: boolean) => void;
}

const StoreItemBasicInfo: React.FC<StoreItemBasicInfoProps> = ({
  formData,
  onFormDataChange,
  ingredientInput,
  onIngredientInputChange,
  onAddIngredient,
  onRemoveIngredient,
  productUsageIsList,
  onProductUsageIsListChange,
  productBenefitsIsList,
  onProductBenefitsIsListChange,
}) => {
  return (
    <Stack spacing={2}>
      {/* Basic Information */}
      <Box>
        <TextField
          fullWidth
          size="small"
          label="Name"
          placeholder="e.g. Wellness Journal"
          value={formData.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
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
          <NumberInput
            fullWidth
            size="small"
            label="Price"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={formData.price}
            onChange={(val) => onFormDataChange({ price: val })}
            allowDecimals={true}
            decimalPlaces={2}
            min={0}
            placeholder="0.00"
            required
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <NumberInput
            fullWidth
            size="small"
            label="Stock"
            value={formData.stock}
            onChange={(val) => onFormDataChange({ stock: val })}
            allowDecimals={false}
            min={0}
            placeholder="0"
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
          onChange={(e) => onFormDataChange({ description: e.target.value })}
        />
      </Box>

      {/* Product Usage */}
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0.5 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Product Usage (optional)
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              variant={productUsageIsList ? "text" : "contained"}
              onClick={() => onProductUsageIsListChange(false)}
            >
              Paragraph
            </Button>
            <Button
              size="small"
              variant={productUsageIsList ? "contained" : "text"}
              onClick={() => onProductUsageIsListChange(true)}
            >
              List
            </Button>
          </Stack>
        </Stack>
        <TextField
          fullWidth
          placeholder={
            productUsageIsList
              ? "Each new line will appear as a bullet on the product page"
              : "How to use this product"
          }
          multiline
          rows={4}
          value={formData.productUsage}
          onChange={(e) => onFormDataChange({ productUsage: e.target.value })}
        />
      </Box>

      {/* Product Benefits */}
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0.5 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Product Benefits (optional)
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              variant={productBenefitsIsList ? "text" : "contained"}
              onClick={() => onProductBenefitsIsListChange(false)}
            >
              Paragraph
            </Button>
            <Button
              size="small"
              variant={productBenefitsIsList ? "contained" : "text"}
              onClick={() => onProductBenefitsIsListChange(true)}
            >
              List
            </Button>
          </Stack>
        </Stack>
        <TextField
          fullWidth
          placeholder={
            productBenefitsIsList
              ? "Each new line will appear as a bullet on the product page"
              : "Benefits of using this product"
          }
          multiline
          rows={4}
          value={formData.productBenefits}
          onChange={(e) => onFormDataChange({ productBenefits: e.target.value })}
        />
      </Box>

      {/* Product Ingredients */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, fontFamily: '"League Spartan", sans-serif' }}
        >
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
            onChange={(e) => onIngredientInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddIngredient();
              }
            }}
          />
          <Button
            variant="outlined"
            onClick={onAddIngredient}
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
                onDelete={() => onRemoveIngredient(idx)}
                variant="outlined"
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No ingredients added. Leave empty if this product doesn't need
            ingredient details.
          </Typography>
        )}
      </Box>

      {/* Categories */}
      <Box>
        <CategorySelector
          service="store"
          selectedCategories={formData.categories}
          onChange={(categories) => onFormDataChange({ categories })}
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
                  onFormDataChange({ isFeatured: e.target.checked })
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
                  onFormDataChange({ isPublished: e.target.checked })
                }
              />
            }
            label="Published"
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default StoreItemBasicInfo;

