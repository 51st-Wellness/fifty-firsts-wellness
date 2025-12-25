import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useProgrammeForm } from "./hooks/useProgrammeForm";
import ProgrammeVideoStep from "./ProgrammeVideoStep";
import ProgrammeDetailsStep from "./ProgrammeDetailsStep";
import type { Programme } from "../../../api/programme.api";
import toast from "react-hot-toast";

interface CreateProgrammeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProgramme?: Programme | null;
}

const CreateProgrammeDialog: React.FC<CreateProgrammeDialogProps> = ({
  open,
  onClose,
  onSuccess,
  editProgramme,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const {
    formData,
    draftResponse,
    uploading,
    uploadProgress,
    backgroundUploadComplete,
    savingDetails,
    dragActive,
    isEditMode,
    resetForm,
    updateFormData,
    handleDrag,
    handleDrop,
    handleVideoFileSelect,
    handleBackgroundUpload,
    handleSubmitDetails,
  } = useProgrammeForm(open, editProgramme);

  const steps = isEditMode
    ? ["Details & Publishing"]
    : ["Video & Basic Info", "Details & Publishing"];

  const handleClose = () => {
    if (!savingDetails) {
      setActiveStep(0);
      resetForm();
      onClose();
    }
  };

  const handleNext = async () => {
    if (isEditMode) {
      const success = await handleSubmitDetails();
      if (success) {
        handleClose();
        onSuccess();
      }
    } else if (activeStep === 0) {
      // Validate step 1
      if (!formData.title.trim()) {
        toast.error("Please enter a title");
        return;
      }
      if (!formData.videoFile) {
        toast.error("Please select a video file");
        return;
      }

      // Start background upload and proceed to step 2
      handleBackgroundUpload();
      setActiveStep(1);
      toast.success(
        "Video upload started! You can continue filling details while it uploads."
      );
    } else {
      // Submit step 2 details
      const success = await handleSubmitDetails();
      if (success) {
        handleClose();
        onSuccess();
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={savingDetails}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: '"League Spartan", sans-serif',
          fontWeight: 600,
        }}
      >
        {isEditMode ? "Edit Programme" : "Create New Programme"}
        <IconButton onClick={handleClose} disabled={savingDetails}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Show upload progress when on step 1 and uploading */}
        {uploading && activeStep === 0 && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Uploading video... Please don't close this dialog.
            </Alert>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {uploadProgress}% uploaded
            </Typography>
          </Box>
        )}

        {/* Show background upload status on step 2 */}
        {activeStep === 1 && !isEditMode && (
          <Box sx={{ mb: 3 }}>
            {uploading && !backgroundUploadComplete ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Video is uploading in the background... You can fill in the
                details below.
              </Alert>
            ) : backgroundUploadComplete ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Video uploaded successfully! Fill in the details below to
                complete your programme.
              </Alert>
            ) : null}
          </Box>
        )}

        {/* Show saving progress when submitting details */}
        {savingDetails && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Saving programme details...
            </Alert>
            <LinearProgress />
          </Box>
        )}

        {isEditMode ? (
          <ProgrammeDetailsStep
            formData={formData}
            onFormDataChange={updateFormData}
            showTitle={true}
            disabled={savingDetails}
          />
        ) : activeStep === 0 ? (
          <ProgrammeVideoStep
            formData={formData}
            onFormDataChange={updateFormData}
            dragActive={dragActive}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onVideoFileSelect={handleVideoFileSelect}
            disabled={uploading}
          />
        ) : (
          <ProgrammeDetailsStep
            formData={formData}
            onFormDataChange={updateFormData}
            disabled={savingDetails}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={savingDetails}>
          Cancel
        </Button>

        {!isEditMode && activeStep > 0 && (
          <Button onClick={handleBack} disabled={savingDetails}>
            Back
          </Button>
        )}

        <Button
          onClick={handleNext}
          variant="contained"
          disabled={
            (!isEditMode &&
              activeStep === 0 &&
              (!formData.title.trim() || !formData.videoFile)) ||
            savingDetails
          }
        >
          {isEditMode
            ? "Update Programme"
            : activeStep === steps.length - 1
            ? savingDetails
              ? "Saving..."
              : "Create Programme"
            : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProgrammeDialog;

