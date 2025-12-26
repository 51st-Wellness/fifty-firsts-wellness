import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { Close as CloseIcon, Email as EmailIcon } from "@mui/icons-material";
import { SearchableSelect } from "../SearchableSelect";
import { searchStoreItems } from "../../api/product-subscriber.api";
import type { SelectOption } from "../SearchableSelect";

interface BulkEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: {
    productId: string;
    subject: string;
    message: string;
  }) => Promise<void>;
  defaultSubject?: string;
  defaultMessage?: string;
  title?: string;
  sending?: boolean;
}

export const BulkEmailDialog: React.FC<BulkEmailDialogProps> = ({
  open,
  onClose,
  onSend,
  defaultSubject = "Product update from Fifty Firsts Wellness",
  defaultMessage = `
Great news! The product you subscribed to, "<Product Name>", is now available for purchase.

Don't miss out - grab yours today while stocks last!

Visit our marketplace to complete your order: <Product URL>

Thank you for your patience,
The Fifty Firsts Wellness Team`,
  title = "Send Bulk Email",
  sending = false,
}) => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [emailSubject, setEmailSubject] = useState(defaultSubject);
  const [emailMessage, setEmailMessage] = useState(defaultMessage);

  // Debug: Track when selectedProductId changes
  useEffect(() => {
    console.log("selectedProductId changed to:", selectedProductId);
  }, [selectedProductId]);

  const handleProductChange = useCallback((value: string) => {
    console.log("handleProductChange called with:", value);
    setSelectedProductId(value);
  }, []);

  const handleSearchProducts = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) return [];

    try {
      const response = await searchStoreItems(query, 10);
      return response.data || [];
    } catch (error) {
      console.error("Failed to search products:", error);
      return [];
    }
  }, []);

  const handleSend = async () => {
    console.log("handleSend called, selectedProductId:", selectedProductId);

    if (!selectedProductId || selectedProductId.trim() === "") {
      console.error("No product selected!");
      // You might want to show a toast here
      return;
    }

    if (!emailSubject.trim() || !emailMessage.trim()) {
      return;
    }

    await onSend({
      productId: selectedProductId,
      subject: emailSubject,
      message: emailMessage,
    });
  };

  const handleClose = () => {
    if (!sending) {
      setSelectedProductId("");
      setEmailSubject(defaultSubject);
      setEmailMessage(defaultMessage);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          margin: { xs: 1, sm: 2 },
          width: { xs: "calc(100% - 16px)", sm: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"League Spartan", sans-serif',
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: { xs: "1rem", sm: "1.25rem" },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={sending}
          edge="end"
          size="small"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 }, py: { xs: 0, sm: 1 } }}>
          {/* Product Select */}
          <SearchableSelect
            value={selectedProductId}
            onChange={handleProductChange}
            onSearch={handleSearchProducts}
            label="Select Product"
            placeholder="Search for a product..."
            required
            disabled={sending}
          />

          {/* Email Subject */}
          <TextField
            fullWidth
            label="Email Subject"
            placeholder="e.g., Your Product is Now Available!"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            disabled={sending}
            required
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />

          {/* Email Message */}
          <TextField
            fullWidth
            label="Email Message"
            placeholder="Enter your custom message..."
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            multiline
            rows={8}
            disabled={sending}
            required
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
                minHeight: { xs: "120px", sm: "auto" },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputBase-inputMultiline": {
                minHeight: { xs: "120px", sm: "auto" },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={handleClose}
          disabled={sending}
          size="small"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={
            sending ||
            !selectedProductId ||
            !emailSubject.trim() ||
            !emailMessage.trim()
          }
          startIcon={
            sending ? (
              <CircularProgress
                size={14}
                sx={{ fontSize: { xs: 14, sm: 16 } }}
                color="inherit"
              />
            ) : (
              <EmailIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
            )
          }
          size="small"
          sx={{
            bgcolor: "#00969b",
            "&:hover": { bgcolor: "#007a7f" },
            fontFamily: '"League Spartan", sans-serif',
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {sending ? "Sending..." : "Send Email"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
