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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Individual
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {individualDiscounts.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "success.main",
              }}
            >
              {stats.active}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Scheduled
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "info.main",
              }}
            >
              {stats.scheduled}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expired
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                color: "error.main",
              }}
            >
              {stats.expired}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ flex: 1 }}
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
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Individual Discounts Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Product
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Value
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Start Date
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  End Date
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Loading discounts...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4 }}>
                      <LocalOfferIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
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
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {item.productId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.discountType === "PERCENTAGE"
                              ? "Percentage"
                              : "Flat"
                          }
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatDiscountValue(item)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
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
                      <TableCell>
                        <Typography variant="body2">
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
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => onMenuOpen(e, item)}
                        >
                          <MoreVertIcon />
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
        />
      </Card>

      {/* Actions Menu for Individual Discounts */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={onEdit}>
          <EditIcon sx={{ fontSize: 20, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem onClick={onRemoveDiscount}>
          <DeleteIcon sx={{ fontSize: 20, mr: 1 }} />
          Remove Discount
        </MenuItem>
      </Menu>
    </div>
  );
};

export default IndividualDiscountsTab;

