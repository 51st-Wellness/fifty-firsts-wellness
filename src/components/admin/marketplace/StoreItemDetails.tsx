import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import type { StoreItem } from "../../../types/marketplace.types";

interface StoreItemDetailsProps {
  item: StoreItem | null;
  onEdit: () => void;
  onDelete: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const StoreItemDetails: React.FC<StoreItemDetailsProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  if (!item) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Select an item to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {item.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Display Image/Video */}
            <Box
              sx={{
                aspectRatio: "1",
                bgcolor: "grey.100",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {item.display?.url ? (
                item.display.type === "video" ? (
                  <video
                    src={item.display.url}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={item.display.url}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )
              ) : (
                <ImageIcon sx={{ fontSize: 64, color: "grey.400" }} />
              )}
            </Box>

            {/* Additional Images */}
            {item.images && item.images.length > 0 && (
              <ImageList cols={4} gap={8}>
                {item.images.map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{ mb: 2, fontFamily: '"League Spartan", sans-serif' }}
            >
              {item.description || "No description provided"}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: 600, fontFamily: '"League Spartan", sans-serif' }}
              >
                {currencyFormatter.format(item.price)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Stock: {item.stock} items
              </Typography>
            </Box>

            {item.discountType && item.discountType !== "NONE" && (
              <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                <Chip
                  label={`Discount: ${
                    item.discountType === "PERCENTAGE"
                      ? `${item.discountValue || 0}%`
                      : currencyFormatter.format(item.discountValue || 0)
                  }`}
                  color="success"
                  variant="outlined"
                />
                {item.discountActive ? (
                  <Chip label="Active" color="success" size="small" />
                ) : (
                  <Chip label="Inactive" color="default" size="small" />
                )}
              </Box>
            )}

            {/* Categories */}
            {item.categories && item.categories.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontFamily: '"League Spartan", sans-serif' }}
                >
                  Categories:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {item.categories.map((category, idx) => (
                    <Chip
                      key={idx}
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Status */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {item.isFeatured && <Chip label="Featured" color="primary" />}
              {item.isPublished ? (
                <Chip
                  label="Published"
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                  }}
                />
              ) : (
                <Chip label="Draft" color="default" />
              )}
              {item.preOrderEnabled && (
                <Chip
                  label="Pre-orders enabled"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreItemDetails;

