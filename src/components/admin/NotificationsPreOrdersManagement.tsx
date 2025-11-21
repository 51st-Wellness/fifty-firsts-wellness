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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  ShoppingBag as ShoppingBagIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Close as CloseIcon,
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
import { SearchableSelect } from "../SearchableSelect";

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
  const [selectedProductId, setSelectedProductId] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Default email template
  const defaultEmailTemplate = `Hi <First Name>,

Great news! The product you subscribed to, "<Product Name>", is now available for purchase.

Don't miss out - grab yours today while stocks last!

Visit our marketplace to complete your order: <Product URL>

Thank you for your patience,
The Fifty First Wellness Team`;

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
    setSelectedProductId("");
    setEmailSubject(defaultEmailSubject);
    setEmailMessage(defaultEmailTemplate);
    setBulkEmailOpen(true);
  };

  const handleSendBulkEmail = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    if (!emailSubject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    if (!emailMessage.trim()) {
      toast.error("Please enter an email message");
      return;
    }

    try {
      setSendingEmail(true);
      const response = await sendBulkEmail({
        productId: selectedProductId,
        subject: emailSubject,
        message: emailMessage,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Product Notifications
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage user notification subscriptions for products
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          onClick={handleOpenBulkEmail}
          sx={{
            bgcolor: "#00969b",
            "&:hover": { bgcolor: "#007a7f" },
            fontFamily: '"League Spartan", sans-serif',
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Send Bulk Email
        </Button>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#00969b",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Notification Subscribers
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search by product or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                  setStatusFilter(e.target.value as "PENDING" | "NOTIFIED" | "")
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="NOTIFIED">Notified</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Subscribed Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No subscribers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#00969b",
                            width: 32,
                            height: 32,
                            fontSize: "0.875rem",
                          }}
                        >
                          {subscriber.user?.firstName?.[0]?.toUpperCase() ||
                            subscriber.user?.email?.[0]?.toUpperCase() ||
                            "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {subscriber.user?.firstName}{" "}
                            {subscriber.user?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {subscriber.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {subscriber.product?.name || "Unknown Product"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscriber.status}
                        color={getStatusColor(subscriber.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(subscriber.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        title="Delete subscriber"
                      >
                        <DeleteIcon fontSize="small" />
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
        />
      </Card>

      {/* Bulk Email Dialog */}
      <Dialog
        open={bulkEmailOpen}
        onClose={() => !sendingEmail && setBulkEmailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Send Bulk Email to Subscribers
          <IconButton
            aria-label="close"
            onClick={() => setBulkEmailOpen(false)}
            disabled={sendingEmail}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
            {/* Product Select */}
            <SearchableSelect
              value={selectedProductId}
              onChange={setSelectedProductId}
              onSearch={handleSearchProducts}
              label="Select Product"
              placeholder="Search for a product..."
              required
              disabled={sendingEmail}
            />

            {/* Email Subject */}
            <TextField
              fullWidth
              label="Email Subject"
              placeholder="e.g., Your Product is Now Available!"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              disabled={sendingEmail}
              required
            />

            {/* Email Message */}
            <TextField
              fullWidth
              label="Email Message"
              placeholder="Enter your custom message..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              multiline
              rows={10}
              disabled={sendingEmail}
              required
              helperText="You can use placeholders: <First Name>, <Product Name>, <Product URL>"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setBulkEmailOpen(false)}
            disabled={sendingEmail}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendBulkEmail}
            variant="contained"
            disabled={sendingEmail}
            startIcon={
              sendingEmail ? <CircularProgress size={16} /> : <EmailIcon />
            }
            sx={{
              bgcolor: "#00969b",
              "&:hover": { bgcolor: "#007a7f" },
              fontFamily: '"League Spartan", sans-serif',
            }}
          >
            {sendingEmail ? "Sending..." : "Send Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationsPreOrdersManagement;
