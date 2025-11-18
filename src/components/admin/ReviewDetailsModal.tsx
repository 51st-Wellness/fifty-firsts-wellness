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
import type { AdminReview } from "../../types/review.types";

interface ReviewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  review: AdminReview | null;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
  open,
  onClose,
  review,
}) => {
  return (
    <Dialog open={open && !!review} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Review Details
      </DialogTitle>
      <DialogContent dividers>
        {review ? (
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
              >
                Product
              </Typography>
              <Typography fontWeight={600}>
                {`Product ${review.productId}`}
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
                {review.author.name || "Anonymous"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.author.email || "No email"}
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
              <Typography>{review.comment || "No comment"}</Typography>
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
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDetailsModal;
