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
    <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
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
                <InputAdornment position="start" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  £
                </InputAdornment>
              ),
            }}
            value={formData.price}
            onChange={(val) => onFormDataChange({ price: val })}
            allowDecimals={true}
            decimalPlaces={2}
            min={0}
            placeholder="0.00"
            required
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
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
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
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
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        />
      </Box>

      {/* Product Usage */}
      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={{ xs: 1, sm: 0 }}
          sx={{ mb: { xs: 0.5, sm: 0.5 } }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Product Usage (optional)
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              variant={productUsageIsList ? "text" : "contained"}
              onClick={() => onProductUsageIsListChange(false)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 1.5 },
              }}
            >
              Paragraph
            </Button>
            <Button
              size="small"
              variant={productUsageIsList ? "contained" : "text"}
              onClick={() => onProductUsageIsListChange(true)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 1.5 },
              }}
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
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        />
      </Box>

      {/* Product Benefits */}
      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={{ xs: 1, sm: 0 }}
          sx={{ mb: { xs: 0.5, sm: 0.5 } }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Product Benefits (optional)
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              variant={productBenefitsIsList ? "text" : "contained"}
              onClick={() => onProductBenefitsIsListChange(false)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 1.5 },
              }}
            >
              Paragraph
            </Button>
            <Button
              size="small"
              variant={productBenefitsIsList ? "contained" : "text"}
              onClick={() => onProductBenefitsIsListChange(true)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 1.5 },
              }}
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
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        />
      </Box>

      {/* Product Ingredients */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            mb: { xs: 0.75, sm: 1 },
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Product Ingredients
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mb: { xs: 0.75, sm: 1 } }}
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
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={onAddIngredient}
            disabled={!ingredientInput.trim()}
            size="small"
            sx={{
              whiteSpace: "nowrap",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1.5, sm: 2 },
            }}
          >
            Add
          </Button>
        </Stack>
        {formData.productIngredients.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}>
            {formData.productIngredients.map((ingredient, idx) => (
              <Chip
                key={`${ingredient}-${idx}`}
                label={ingredient}
                onDelete={() => onRemoveIngredient(idx)}
                variant="outlined"
                size="small"
                sx={{
                  height: { xs: 24, sm: 32 },
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
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
        <Divider sx={{ my: { xs: 0.75, sm: 1 } }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={formData.isFeatured}
                onChange={(e) =>
                  onFormDataChange({ isFeatured: e.target.checked })
                }
                size="small"
              />
            }
            label="Featured Item"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={(e) =>
                  onFormDataChange({ isPublished: e.target.checked })
                }
                size="small"
              />
            }
            label="Published"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default StoreItemBasicInfo;

