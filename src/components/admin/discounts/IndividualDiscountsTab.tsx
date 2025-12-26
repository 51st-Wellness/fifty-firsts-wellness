import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import type { StoreItem } from "../../../types/marketplace.types";
import { isProductDiscountActive } from "../../../utils/discounts";

interface IndividualDiscountsTabProps {
  individualDiscounts: StoreItem[];
  paginatedItems: StoreItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "active" | "inactive" | "expired";
  onFilterStatusChange: (value: "all" | "active" | "inactive" | "expired") => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  stats: {
    total: number;
    active: number;
    expired: number;
    scheduled: number;
  };
  globalDiscount: StoreItem | null;
  anchorEl: HTMLElement | null;
  selectedItem: StoreItem | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, item: StoreItem) => void;
  onMenuClose: () => void;
  onEdit: () => void;
  onRemoveDiscount: () => void;
}

const formatDiscountValue = (item: StoreItem) => {
  if (!item.discountType || item.discountType === "NONE" || !item.discountValue) {
    return "-";
  }
  if (item.discountType === "PERCENTAGE") {
    return `${item.discountValue}%`;
  }
  return `£${item.discountValue.toFixed(2)}`;
};

const getDiscountStatus = (item: StoreItem) => {
  const now = new Date();
  const isActive = isProductDiscountActive(item, now);
  
  if (isActive) {
    return { label: "Active", color: "success" as const };
  }
  
  if (item.discountEnd) {
    const endDate = new Date(item.discountEnd);
    if (now > endDate) {
      return { label: "Expired", color: "error" as const };
    }
  }
  
  if (item.discountStart) {
    const startDate = new Date(item.discountStart);
    if (now < startDate) {
      return { label: "Scheduled", color: "info" as const };
    }
  }
  
  return { label: "Inactive", color: "default" as const };
};

const IndividualDiscountsTab: React.FC<IndividualDiscountsTabProps> = ({
  individualDiscounts,
  paginatedItems,
  loading,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  stats,
  globalDiscount,
  anchorEl,
  selectedItem,
  onMenuOpen,
  onMenuClose,
  onEdit,
  onRemoveDiscount,
}) => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Total Individual
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {individualDiscounts.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Active
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "success.main",
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {stats.active}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Scheduled
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "info.main",
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {stats.scheduled}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Expired
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "error.main",
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {stats.expired}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 2 }}>
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                ),
              }}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) =>
                onFilterStatusChange(
                  e.target.value as "all" | "active" | "inactive" | "expired"
                )
              }
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            >
              <MenuItem value="all" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>All</MenuItem>
              <MenuItem value="active" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Active</MenuItem>
              <MenuItem value="inactive" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Inactive</MenuItem>
              <MenuItem value="expired" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Expired</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Individual Discounts Table */}
      <Card>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Product
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Value
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                    display: { xs: "none", lg: "table-cell" },
                  }}
                >
                  Start Date
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                    display: { xs: "none", lg: "table-cell" },
                  }}
                >
                  End Date
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                      Loading discounts...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box sx={{ py: { xs: 2, sm: 4 } }}>
                      <LocalOfferIcon
                        sx={{
                          fontSize: { xs: 48, sm: 64 },
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontFamily: '"League Spartan", sans-serif',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {searchQuery || filterStatus !== "all"
                          ? "No individual discounts match your filters"
                          : globalDiscount
                          ? "All products are using the global discount. No individual discounts found."
                          : "No products have individual discounts applied"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => {
                  const status = getDiscountStatus(item);
                  return (
                    <TableRow key={item.productId} hover>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                          >
                            ID: {item.productId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Chip
                          label={
                            item.discountType === "PERCENTAGE"
                              ? "Percentage"
                              : "Flat"
                          }
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {formatDiscountValue(item)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {item.discountStart
                            ? new Date(item.discountStart).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {item.discountEnd
                            ? new Date(item.discountEnd).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <IconButton
                          size="small"
                          onClick={(e) => onMenuOpen(e, item)}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          <MoreVertIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={individualDiscounts.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              px: { xs: 1, sm: 2 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Card>

      {/* Actions Menu for Individual Discounts */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            minWidth: { xs: 160, sm: 180 },
          },
        }}
      >
        <MenuItem
          onClick={onEdit}
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
        >
          <EditIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem
          onClick={onRemoveDiscount}
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
        >
          <DeleteIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
          Remove Discount
        </MenuItem>
      </Menu>
    </div>
  );
};

export default IndividualDiscountsTab;

