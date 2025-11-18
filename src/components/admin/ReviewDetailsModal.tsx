import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import type { Review } from "./ReviewManagement";

interface ReviewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  review: Review | null;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
  open,
  onClose,
  review,
}) => {
  if (!review) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Review Details
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Product
            </Typography>
            <Typography fontWeight={600}>
              {review.productName || `Product ${review.productId}`}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Reviewer
            </Typography>
            <Typography fontWeight={600}>
              {review.userName || "Anonymous"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {review.userEmail}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Rating
            </Typography>
            <Typography fontWeight={600}>{review.rating}/5</Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Comment
            </Typography>
            <Typography>{review.comment}</Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Status
            </Typography>
            <Chip label={review.status} color="primary" size="small" />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Submitted
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(review.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDetailsModal;

