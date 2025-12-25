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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Global Discount Status
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {globalDiscount ? "Active" : "None"}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Products Affected
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {globalDiscount ? items.length : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            {globalDiscount ? (
              <Chip
                label={getDiscountStatus(globalDiscount).label}
                color={getDiscountStatus(globalDiscount).color}
                size="small"
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No global discount
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ flex: 1 }}
              disabled={!globalDiscount}
            />
            {!globalDiscount && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onOpenGlobalDiscountDialog}
                disabled={loading}
              >
                Create Global Discount
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Global Discount Table */}
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
                  Name
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
                  Products Affected
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
              {loading && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : globalDiscountTableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4 }}>
                      <PublicIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        No global discount active
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onOpenGlobalDiscountDialog}
                        sx={{ mt: 2 }}
                      >
                        Create Global Discount
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                globalDiscountTableData.map((item) => {
                  const status = getDiscountStatus(item);
                  return (
                    <TableRow key={item.productId} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.name}
                          </Typography>
                          <Chip
                            label="Global"
                            size="small"
                            color="primary"
                            sx={{ mt: 0.5 }}
                          />
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
                        <Typography variant="body2">{items.length} products</Typography>
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
          count={globalDiscountTableData.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
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
      >
        <MenuItem
          onClick={() => {
            onOpenGlobalDiscountDialog();
            onMenuClose();
          }}
        >
          <EditIcon sx={{ fontSize: 20, mr: 1 }} />
          Edit Discount
        </MenuItem>
        <MenuItem onClick={handleDeactivate}>
          <PowerOffIcon sx={{ fontSize: 20, mr: 1 }} />
          Deactivate
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ fontSize: 20, mr: 1, color: "error.main" }} />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default GlobalDiscountsTab;

