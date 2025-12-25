import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { Image as ImageIcon, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { ProgrammeFormData } from "./types";
import { AVAILABLE_CATEGORIES, formatFileSize } from "./utils";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ProgrammeDetailsStepProps {
  formData: ProgrammeFormData;
  onFormDataChange: (updates: Partial<ProgrammeFormData>) => void;
  showTitle?: boolean;
  disabled?: boolean;
}

const ProgrammeDetailsStep: React.FC<ProgrammeDetailsStepProps> = ({
  formData,
  onFormDataChange,
  showTitle = false,
  disabled = false,
}) => {
  const handleThumbnailFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        onFormDataChange({ thumbnailFile: file });
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {showTitle && (
        <TextField
          fullWidth
          label="Programme Title"
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
          margin="normal"
          required
          disabled={disabled}
        />
      )}

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => onFormDataChange({ description: e.target.value })}
        margin="normal"
        multiline
        rows={4}
        disabled={disabled}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          value={formData.categories}
          onChange={(e) =>
            onFormDataChange({
              categories:
                typeof e.target.value === "string"
                  ? [e.target.value]
                  : e.target.value,
            })
          }
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
          disabled={disabled}
        >
          {AVAILABLE_CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thumbnail Image
        </Typography>

        {formData.thumbnailFile ? (
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <ImageIcon color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {formData.thumbnailFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(formData.thumbnailFile.size)}
              </Typography>
            </Box>
            <IconButton
              onClick={() => onFormDataChange({ thumbnailFile: null })}
              disabled={disabled}
            >
              <Delete />
            </IconButton>
          </Paper>
        ) : (
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
            fullWidth
            sx={{ py: 2 }}
            disabled={disabled}
          >
            Upload Thumbnail
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileSelect}
            />
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isFeatured}
              onChange={(e) =>
                onFormDataChange({
                  isFeatured: e.target.checked,
                })
              }
              disabled={disabled}
            />
          }
          label="Featured Programme"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isPublished}
              onChange={(e) =>
                onFormDataChange({
                  isPublished: e.target.checked,
                })
              }
              disabled={disabled}
            />
          }
          label="Publish Immediately"
        />
      </Box>
    </Box>
  );
};

export default ProgrammeDetailsStep;

