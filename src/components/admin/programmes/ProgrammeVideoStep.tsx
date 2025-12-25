import React from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  VideoFile,
  Delete,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { ProgrammeFormData } from "./types";
import { formatFileSize } from "./utils";

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

const DropZone = styled(Paper)(
  ({ theme, isDragActive }: { theme?: any; isDragActive: boolean }) => ({
    border: `2px dashed ${
      isDragActive ? theme.palette.primary.main : theme.palette.grey[300]
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isDragActive
      ? theme.palette.primary.light + "10"
      : "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + "05",
    },
  })
);

interface ProgrammeVideoStepProps {
  formData: ProgrammeFormData;
  onFormDataChange: (updates: Partial<ProgrammeFormData>) => void;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onVideoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const ProgrammeVideoStep: React.FC<ProgrammeVideoStepProps> = ({
  formData,
  onFormDataChange,
  dragActive,
  onDrag,
  onDrop,
  onVideoFileSelect,
  disabled = false,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Programme Title"
        value={formData.title}
        onChange={(e) => onFormDataChange({ title: e.target.value })}
        margin="normal"
        required
        disabled={disabled}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Video File *
        </Typography>

        {formData.videoFile ? (
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <VideoFile color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {formData.videoFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(formData.videoFile.size)}
              </Typography>
            </Box>
            <IconButton
              onClick={() => onFormDataChange({ videoFile: null })}
              disabled={disabled}
            >
              <Delete />
            </IconButton>
          </Paper>
        ) : (
          <DropZone
            isDragActive={dragActive}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
            onClick={() => document.getElementById("video-upload")?.click()}
          >
            <CloudUpload
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Drag and drop your video file here
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports MP4, MOV, AVI, MKV, WebM (max 500MB)
            </Typography>
            <VisuallyHiddenInput
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={onVideoFileSelect}
              disabled={disabled}
            />
          </DropZone>
        )}
      </Box>
    </Box>
  );
};

export default ProgrammeVideoStep;

