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
        sx={{
          mb: { xs: 1.5, sm: 2 },
          fontFamily: '"League Spartan", sans-serif',
          fontSize: { xs: "0.875rem", sm: "1rem", lg: "1.25rem" },
        }}
      >
        Media Files
      </Typography>

      {/* Display File */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: { xs: 0.75, sm: 1 },
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Display Image/Video (Required for new items)
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          fullWidth
          size="small"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            py: { xs: 0.75, sm: 1 },
          }}
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
              mt: { xs: 0.75, sm: 1 },
              position: "relative",
              display: "inline-block",
            }}
          >
            {displayFile?.type.startsWith("video/") ? (
              <video
                src={displayPreview}
                style={{
                  width: "100%",
                  maxWidth: 140,
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
                  width: "100%",
                  maxWidth: 140,
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
          sx={{
            mb: { xs: 0.75, sm: 1 },
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Additional Images (Optional, max 5)
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<ImageIcon />}
          fullWidth
          size="small"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            py: { xs: 0.75, sm: 1 },
          }}
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
          <Box
            sx={{
              mt: { xs: 0.75, sm: 1 },
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 1 },
            }}
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
                  onClick={() => onRemoveImage(idx)}
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    bgcolor: "error.main",
                    color: "white",
                    width: { xs: 20, sm: 24 },
                    height: { xs: 20, sm: 24 },
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: "error.dark",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />
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

