import React from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import type { StoreItem } from "../../../types/marketplace.types";

interface StoreItemsListProps {
  items: StoreItem[];
  loading: boolean;
  selected: StoreItem | null;
  searchQuery: string;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onSearchChange: (value: string) => void;
  onSelectItem: (item: StoreItem) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const StoreItemsList: React.FC<StoreItemsListProps> = ({
  items,
  loading,
  selected,
  searchQuery,
  pagination,
  onSearchChange,
  onSelectItem,
}) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "420px" },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        maxHeight: { xs: "400px", md: "none" },
      }}
    >
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: 1, borderColor: "divider" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {loading && items.length === 0 ? (
            <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
              <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Loading items...
              </Typography>
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                No items found
              </Typography>
            </Box>
          ) : (
            items.map((item) => (
              <Card
                key={item.productId}
                variant={
                  selected?.productId === item.productId
                    ? "outlined"
                    : "elevation"
                }
                sx={{
                  m: { xs: 0.75, sm: 1 },
                  cursor: "pointer",
                  bgcolor:
                    selected?.productId === item.productId
                      ? "action.selected"
                      : "background.paper",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => onSelectItem(item)}
              >
                <Box sx={{ display: "flex", p: { xs: 1.5, sm: 2 } }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      overflow: "hidden",
                      mr: { xs: 1.5, sm: 2 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.display?.url ? (
                      <img
                        src={item.display.url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <ImageIcon
                        sx={{ fontSize: { xs: 20, sm: 24 } }}
                        color="disabled"
                      />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"League Spartan", sans-serif',
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"League Spartan", sans-serif',
                        fontSize: { xs: "0.7rem", sm: "0.875rem" },
                      }}
                    >
                      {currencyFormatter.format(item.price)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                      {item.isFeatured && (
                        <Chip
                          label="Featured"
                          size="small"
                          color="primary"
                          sx={{
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                      )}
                      {item.isPublished && (
                        <Chip
                          label="Published"
                          size="small"
                          sx={{
                            bgcolor: "primary.light",
                            color: "white",
                            "&:hover": { bgcolor: "primary.main" },
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            Page {pagination.page} of {Math.max(1, pagination.totalPages)} •{" "}
            {pagination.total} items
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default StoreItemsList;

