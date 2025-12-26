import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  getAllSubscribers,
  deleteSubscriber,
  sendBulkEmail,
  searchStoreItems,
  type ProductSubscriber,
} from "../../api/product-subscriber.api";
import { BulkEmailDialog } from "./BulkEmailDialog";
import PreOrdersManagement from "./PreOrdersManagement";

const defaultEmailSubject = "Product update from Fifty Firsts Wellness";

const NotificationsPreOrdersManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<ProductSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "NOTIFIED" | "">(
    ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Bulk email modal state
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Default email template
  const defaultEmailTemplate = `Hi <First Name>,

Great news! The product you subscribed to, "<Product Name>", is now available for purchase.

Don't miss out - grab yours today while stocks last!

Visit our marketplace to complete your order: <Product URL>

Thank you for your patience,
The Fifty Firsts Wellness Team`;

  // Load subscribers
  const loadSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSubscribers({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter || undefined,
      });

      if (response.data) {
        setSubscribers(response.data.items);
        setTotalCount(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to load subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setStatusFilter("");
    setSearchQuery("");
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await deleteSubscriber(id);
      toast.success("Subscriber deleted successfully");
      loadSubscribers();
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
      toast.error("Failed to delete subscriber");
    }
  };

  const handleOpenBulkEmail = () => {
    setBulkEmailOpen(true);
  };

  const handleSendBulkEmail = async (data: {
    productId: string;
    subject: string;
    message: string;
  }) => {
    try {
      setSendingEmail(true);
      const response = await sendBulkEmail({
        productId: data.productId,
        subject: data.subject,
        message: data.message,
      });

      if (response.data) {
        toast.success(
          `Email sent to ${response.data.totalSent} subscriber(s) for "${response.data.productName}"`
        );
        setBulkEmailOpen(false);
        loadSubscribers();
      }
    } catch (error: any) {
      console.error("Failed to send bulk email:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send bulk email"
      );
    } finally {
      setSendingEmail(false);
    }
  };

  // Search products for select dropdown
  const handleSearchProducts = useCallback(async (query: string) => {
    if (!query.trim()) return [];

    try {
      const response = await searchStoreItems(query, 10);
      return response.data || [];
    } catch (error) {
      console.error("Failed to search products:", error);
      return [];
    }
  }, []);

  // Filter subscribers based on search query (client-side)
  const filteredSubscribers = useMemo(() => {
    if (!searchQuery.trim()) return subscribers;

    return subscribers.filter((subscriber) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        subscriber.product?.name?.toLowerCase().includes(searchLower) ||
        subscriber.user?.email?.toLowerCase().includes(searchLower) ||
        subscriber.user?.firstName?.toLowerCase().includes(searchLower) ||
        subscriber.user?.lastName?.toLowerCase().includes(searchLower)
      );
    });
  }, [subscribers, searchQuery]);

  // Summary stats
  const notificationStats = useMemo(() => {
    const pending = subscribers.filter((s) => s.status === "PENDING").length;
    const notified = subscribers.filter((s) => s.status === "NOTIFIED").length;
    return { total: totalCount, pending, notified };
  }, [subscribers, totalCount]);

  const getStatusColor = (status: "PENDING" | "NOTIFIED") => {
    switch (status) {
      case "NOTIFIED":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-2 sm:p-4 lg:p-0">
      {/* Header */}
      <div>
        <h2
          className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Notifications & Pre-Orders
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
          Manage product notifications and pre-orders
        </p>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontFamily: '"League Spartan", sans-serif',
              minHeight: { xs: 48, lg: 64 },
              px: { xs: 1.5, sm: 2, lg: 3 },
              fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "1rem" },
            },
            "& .MuiTabs-scrollButtons": {
              width: { xs: 32, lg: 40 },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1rem", lg: "1.25rem" },
              },
            },
          }}
        >
          <Tab
            icon={<NotificationsIcon />}
            label="Product Notifications"
            iconPosition="start"
          />
          <Tab icon={<EmailIcon />} label="Pre-Orders" iconPosition="start" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between w-full">
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Product Notifications
                </h3>
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={handleOpenBulkEmail}
                  size="small"
                  sx={{
                    bgcolor: "#00969b",
                    "&:hover": { bgcolor: "#007a7f" },
                    fontFamily: '"League Spartan", sans-serif',
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    px: { xs: 1.5, sm: 2 },
                    ml: { xs: 2, sm: 4 },
                  }}
                >
                  <span className="hidden sm:inline">Send Bulk Email</span>
                  <span className="sm:hidden">Send Email</span>
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                Manage user notification subscriptions for products
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    bgcolor: "#00969b",
                    borderRadius: { xs: 1, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NotificationsIcon sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontFamily: '"League Spartan", sans-serif',
                      fontSize: { xs: "0.875rem", sm: "1rem", lg: "1.25rem" },
                    }}
                  >
                    Notification Subscribers
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Total: {notificationStats.total} • Pending:{" "}
                    <span className="font-semibold text-yellow-600">
                      {notificationStats.pending}
                    </span>{" "}
                    • Notified: {notificationStats.notified}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
                <TextField
                  size="small"
                  placeholder="Search by product or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                    ),
                  }}
                  sx={{
                    flex: { xs: 1, sm: 1 },
                    minWidth: { xs: "100%", sm: 200 },
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
                  <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as "PENDING" | "NOTIFIED" | ""
                      )
                    }
                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    <MenuItem value="" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>All</MenuItem>
                    <MenuItem value="PENDING" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Pending</MenuItem>
                    <MenuItem value="NOTIFIED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Notified</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>User</TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Product</TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
                    <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Subscribed Date</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                        <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 32 } }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <NotificationsIcon
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
                            {searchQuery || statusFilter
                              ? "No subscribers found"
                              : "No subscribers yet"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {searchQuery || statusFilter
                              ? "Try adjusting your search or filter criteria"
                              : "Subscribers will appear here once users subscribe to products"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} hover>
                        <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: { xs: 1, sm: 1.5 },
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#00969b",
                                width: { xs: 28, sm: 32 },
                                height: { xs: 28, sm: 32 },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {subscriber.user?.firstName?.[0]?.toUpperCase() ||
                                subscriber.user?.email?.[0]?.toUpperCase() ||
                                "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                {subscriber.user?.firstName}{" "}
                                {subscriber.user?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                              >
                                {subscriber.user?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            {subscriber.product?.name || "Unknown Product"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                          <Chip
                            label={subscriber.status}
                            color={getStatusColor(subscriber.status)}
                            size="small"
                            sx={{
                              height: { xs: 20, sm: 24 },
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                            {formatDate(subscriber.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: { xs: 1, sm: 1.5 } }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteSubscriber(subscriber.id)
                            }
                            title="Delete subscriber"
                            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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

          {/* Bulk Email Dialog */}
          <BulkEmailDialog
            open={bulkEmailOpen}
            onClose={() => setBulkEmailOpen(false)}
            onSend={handleSendBulkEmail}
            defaultSubject={defaultEmailSubject}
            defaultMessage={defaultEmailTemplate}
            title="Send Bulk Email to Subscribers"
            sending={sendingEmail}
          />
        </div>
      )}

      {activeTab === 1 && <PreOrdersManagement />}
    </div>
  );
};

export default NotificationsPreOrdersManagement;
