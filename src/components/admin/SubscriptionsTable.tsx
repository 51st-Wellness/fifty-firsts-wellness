import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  getAdminSubscriptions,
  type AdminSubscriptionData,
} from "../../api/subscription.api";

interface SubscriptionsTableProps {
  onViewDetails: (subscription: AdminSubscriptionData) => void;
}

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  onViewDetails,
}) => {
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Fetch subscriptions data using API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAdminSubscriptions({
        page: currentPage,
        limit: limit,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });

      if (result.success && result.data) {
        setSubscriptions(result.data.subscriptions);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.total);
      } else {
        setError(result.message || "Failed to fetch subscriptions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, statusFilter, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchSubscriptions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get status color for chip
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      case "CANCELLED":
        return "default";
      case "REFUNDED":
        return "info";
      default:
        return "default";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={{ xs: 200, sm: 400 }}
        py={{ xs: 4, sm: 6 }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters and Search */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          placeholder="Search by name, email, or plan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: { xs: "100%", sm: 300 },
            flexGrow: { xs: 1, sm: 0 }
          }}
        />

        <FormControl 
          size="small"
          sx={{ 
            minWidth: { xs: "100%", sm: 150 },
            flexShrink: 0
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="REFUNDED">Refunded</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: { xs: 1, sm: 2 }, 
          boxShadow: 1,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "grey.100",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "grey.400",
            borderRadius: 4,
          },
        }}
      >
        <Table 
          size="small" 
          sx={{ 
            minWidth: 650,
            "& .MuiTableCell-root": {
              whiteSpace: { xs: "normal", sm: "nowrap" },
              wordBreak: { xs: "break-word", sm: "normal" },
            },
            "& .MuiTableCell-body": {
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CreditCardIcon
                      sx={{ 
                        fontSize: { xs: 48, sm: 64 }, 
                        color: "text.secondary", 
                        mb: 2 
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontFamily: '"League Spartan", sans-serif',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {searchTerm || statusFilter
                        ? "No subscriptions found"
                        : "No subscriptions yet"}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {searchTerm || statusFilter
                        ? "Try adjusting your search or filter criteria"
                        : "Subscriptions will appear here once users subscribe"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
              <TableRow
                key={subscription.id}
                hover
                onClick={() => onViewDetails(subscription)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
                    <Avatar
                      sx={{ 
                        width: { xs: 28, sm: 32 }, 
                        height: { xs: 28, sm: 32 }, 
                        bgcolor: "primary.main",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }
                      }}
                    >
                      {subscription.userFirstName.charAt(0)}
                      {subscription.userLastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{ 
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          lineHeight: 1.2,
                          mb: 0.25
                        }}
                      >
                        {subscription.userFirstName} {subscription.userLastName}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {subscription.userEmail}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={500}
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {subscription.planName}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      {subscription.planDuration} days
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Chip
                    label={subscription.status}
                    color={getStatusColor(subscription.status) as any}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      height: { xs: 20, sm: 24 }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {formatCurrency(subscription.planPrice)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {formatDate(subscription.startDate)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {formatDate(subscription.endDate)}
                  </Typography>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, sm: 3 } }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            showFirstButton
            showLastButton
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }
            }}
          />
        </Box>
      )}

      {/* Results count */}
      <Box sx={{ mt: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Showing {subscriptions.length} of {totalCount} subscriptions
        </Typography>
      </Box>
    </Box>
  );
};

export default SubscriptionsTable;
