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
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Select an item to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: { xs: 1.5, sm: 2 },
            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontFamily: '"League Spartan", sans-serif',
              fontSize: { xs: "1rem", sm: "1.25rem", lg: "1.5rem" },
              flex: 1,
              minWidth: 0,
            }}
          >
            {item.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <IconButton
              onClick={onEdit}
              color="primary"
              size="small"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              onClick={onDelete}
              color="error"
              size="small"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Display Image/Video */}
            <Box
              sx={{
                aspectRatio: "1",
                bgcolor: "grey.100",
                borderRadius: { xs: 1, sm: 2 },
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
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
                <ImageIcon
                  sx={{ fontSize: { xs: 40, sm: 64 }, color: "grey.400" }}
                />
              )}
            </Box>

            {/* Additional Images */}
            {item.images && item.images.length > 0 && (
              <ImageList
                cols={4}
                gap={8}
                sx={{
                  "& .MuiImageListItem-root": {
                    "& img": {
                      height: { xs: 40, sm: 60 },
                    },
                  },
                }}
              >
                {item.images.map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
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
              sx={{
                mb: { xs: 1.5, sm: 2 },
                fontFamily: '"League Spartan", sans-serif',
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {item.description || "No description provided"}
            </Typography>

            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="h4"
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontFamily: '"League Spartan", sans-serif',
                  fontSize: { xs: "1.25rem", sm: "1.75rem", lg: "2.125rem" },
                }}
              >
                {currencyFormatter.format(item.price)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: '"League Spartan", sans-serif',
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Stock: {item.stock} items
              </Typography>
            </Box>

            {item.discountType && item.discountType !== "NONE" && (
              <Box sx={{ mb: { xs: 1.5, sm: 2 }, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                <Chip
                  label={`Discount: ${
                    item.discountType === "PERCENTAGE"
                      ? `${item.discountValue || 0}%`
                      : currencyFormatter.format(item.discountValue || 0)
                  }`}
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                />
                {item.discountActive ? (
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                    sx={{
                      height: { xs: 24, sm: 32 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  />
                ) : (
                  <Chip
                    label="Inactive"
                    color="default"
                    size="small"
                    sx={{
                      height: { xs: 24, sm: 32 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  />
                )}
              </Box>
            )}

            {/* Categories */}
            {item.categories && item.categories.length > 0 && (
              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: { xs: 0.5, sm: 1 },
                    fontFamily: '"League Spartan", sans-serif',
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Categories:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  {item.categories.map((category, idx) => (
                    <Chip
                      key={idx}
                      label={category}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: { xs: 24, sm: 32 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Status */}
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {item.isFeatured && (
                <Chip
                  label="Featured"
                  color="primary"
                  size="small"
                  sx={{
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                />
              )}
              {item.isPublished ? (
                <Chip
                  label="Published"
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                />
              ) : (
                <Chip
                  label="Draft"
                  color="default"
                  size="small"
                  sx={{
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                />
              )}
              {item.preOrderEnabled && (
                <Chip
                  label="Pre-orders enabled"
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
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

