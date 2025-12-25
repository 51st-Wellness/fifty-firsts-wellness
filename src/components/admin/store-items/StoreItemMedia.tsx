import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface StoreItemMediaProps {
  displayFile: File | null;
  displayPreview: string;
  imageFiles: File[];
  imagePreviews: string[];
  existingImageUrls: string[];
  onDisplayFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  mode: "create" | "edit";
}

const StoreItemMedia: React.FC<StoreItemMediaProps> = ({
  displayFile,
  displayPreview,
  imageFiles,
  imagePreviews,
  existingImageUrls,
  onDisplayFileChange,
  onImageFilesChange,
  onRemoveImage,
  mode,
}) => {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontFamily: '"League Spartan", sans-serif' }}
      >
        Media Files
      </Typography>

      {/* Display File */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontFamily: '"League Spartan", sans-serif' }}
        >
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
            onChange={onDisplayFileChange}
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
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontFamily: '"League Spartan", sans-serif' }}
        >
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
            onChange={onImageFilesChange}
          />
        </Button>
        {imagePreviews.length > 0 && (
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
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
                  onClick={() => onRemoveImage(idx)}
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
  );
};

export default StoreItemMedia;

