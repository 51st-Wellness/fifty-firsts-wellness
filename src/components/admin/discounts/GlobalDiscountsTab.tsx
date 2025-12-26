import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Button,
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
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Public as PublicIcon,
  PowerOff as PowerOffIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { fetchStoreItems, updateStoreItem } from "../../../api/marketplace.api";
import type { StoreItem, DiscountType } from "../../../types/marketplace.types";
import { isProductDiscountActive } from "../../../utils/discounts";

interface GlobalDiscountsTabProps {
  globalDiscount: StoreItem | null;
  items: StoreItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGlobalDiscountDialog: () => void;
  onLoadItems: () => void;
  globalDiscountName: string;
  anchorEl: HTMLElement | null;
  selectedItem: StoreItem | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, item: StoreItem) => void;
  onMenuClose: () => void;
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

const GlobalDiscountsTab: React.FC<GlobalDiscountsTabProps> = ({
  globalDiscount,
  items,
  loading,
  searchQuery,
  onSearchChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onOpenGlobalDiscountDialog,
  onLoadItems,
  globalDiscountName,
  anchorEl,
  selectedItem,
  onMenuOpen,
  onMenuClose,
}) => {
  const globalDiscountTableData = globalDiscount
    ? [
        {
          ...globalDiscount,
          productId: "GLOBAL",
          name: globalDiscountName,
          isGlobal: true,
        },
      ]
    : [];

  const handleDeactivate = async () => {
    if (!globalDiscount) return;
    try {
      let pageNum = 1;
      const limit = 50;
      const allItems: StoreItem[] = [];
      let hasMore = true;

      while (hasMore) {
        const response = await fetchStoreItems({ page: pageNum, limit });
        const payload = response.data;
        if (!payload) break;
        allItems.push(...(payload.items || []));
        const pagination = payload.pagination;
        if (!pagination || !pagination.hasMore) {
          hasMore = false;
        } else {
          pageNum += 1;
        }
      }

      for (const item of allItems) {
        await updateStoreItem(item.productId, {
          discountActive: false,
        });
      }
      toast.success("Global discount deactivated");
      onLoadItems();
      onMenuClose();
    } catch (error) {
      console.error("Failed to deactivate global discount:", error);
      toast.error("Failed to deactivate global discount");
    }
  };

  const handleDelete = async () => {
    if (!globalDiscount) return;
    try {
      let pageNum = 1;
      const limit = 50;
      const allItems: StoreItem[] = [];
      let hasMore = true;

      while (hasMore) {
        const response = await fetchStoreItems({ page: pageNum, limit });
        const payload = response.data;
        if (!payload) break;
        allItems.push(...(payload.items || []));
        const pagination = payload.pagination;
        if (!pagination || !pagination.hasMore) {
          hasMore = false;
        } else {
          pageNum += 1;
        }
      }

      for (const item of allItems) {
        await updateStoreItem(item.productId, {
          discountType: "NONE" as DiscountType,
          discountValue: 0,
          discountActive: false,
          discountStart: null,
          discountEnd: null,
        });
      }
      localStorage.removeItem("globalDiscountName");
      toast.success("Global discount deleted");
      onLoadItems();
      onMenuClose();
    } catch (error) {
      console.error("Failed to delete global discount:", error);
      toast.error("Failed to delete global discount");
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Global Discount Status
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {globalDiscount ? "Active" : "None"}
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
              Products Affected
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"League Spartan", sans-serif',
                fontSize: { xs: "1.25rem", sm: "1.5rem", lg: "1.75rem" },
              }}
            >
              {globalDiscount ? items.length : 0}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              size="small"
              placeholder="Search..."
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
              disabled={!globalDiscount}
            />
            {!globalDiscount && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onOpenGlobalDiscountDialog}
                disabled={loading}
                size="small"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1.5, sm: 2 },
                }}
              >
                <span className="hidden sm:inline">Create Global Discount</span>
                <span className="sm:hidden">Create</span>
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Global Discount Table */}
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
                  Name
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
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  Products Affected
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
              {loading && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : globalDiscountTableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box sx={{ py: { xs: 2, sm: 4 } }}>
                      <PublicIcon
                        sx={{
                          fontSize: { xs: 48, sm: 64 },
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontFamily: '"League Spartan", sans-serif',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        No global discount active
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onOpenGlobalDiscountDialog}
                        size="small"
                        sx={{
                          mt: 2,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          px: { xs: 1.5, sm: 2 },
                        }}
                      >
                        <span className="hidden sm:inline">Create Global Discount</span>
                        <span className="sm:hidden">Create</span>
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                globalDiscountTableData.map((item) => {
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
                          <Chip
                            label="Global"
                            size="small"
                            color="primary"
                            sx={{
                              mt: 0.5,
                              height: { xs: 20, sm: 24 },
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            }}
                          />
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
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {items.length} products
                        </Typography>
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
          count={globalDiscountTableData.length}
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

      {/* Actions Menu for Global Discount */}
      <Menu
        anchorEl={anchorEl}
        open={
          Boolean(anchorEl) &&
          selectedItem?.productId === "GLOBAL"
        }
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
          onClick={() => {
            onOpenGlobalDiscountDialog();
            onMenuClose();
          }}
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
        >
          <EditIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem
          onClick={handleDeactivate}
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
        >
          <PowerOffIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
          Deactivate
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
        >
          <DeleteIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1, color: "error.main" }} />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default GlobalDiscountsTab;

