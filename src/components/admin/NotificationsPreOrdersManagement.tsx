import React, { useState, useMemo } from "react";
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
  Menu,
  IconButton,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  ShoppingBag as ShoppingBagIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

export interface NotificationRequest {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestedAt: string;
  status: "PENDING" | "NOTIFIED";
}

export interface PreOrder {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  userEmail: string;
  userName: string;
  quantity: number;
  preOrderedAt: string;
  estimatedFulfillmentDate?: string;
  status: "PENDING" | "FULFILLED";
}

// Demo data - can be easily cleared
const generateDemoNotifications = (): NotificationRequest[] => {
  const now = new Date();
  return [
    {
      id: "notif-1",
      productId: "prod-2",
      productName: "Aromatherapy Candle",
      productImage: undefined,
      userId: "user-1",
      userEmail: "maria.jacobs@example.com",
      userName: "Maria Jacobs",
      requestedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
    {
      id: "notif-2",
      productId: "prod-4",
      productName: "Yoga Mat Premium",
      productImage: undefined,
      userId: "user-2",
      userEmail: "john.smith@example.com",
      userName: "John Smith",
      requestedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
    {
      id: "notif-3",
      productId: "prod-2",
      productName: "Aromatherapy Candle",
      productImage: undefined,
      userId: "user-3",
      userEmail: "sarah.williams@example.com",
      userName: "Sarah Williams",
      requestedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "NOTIFIED",
    },
    {
      id: "notif-4",
      productId: "prod-5",
      productName: "Meditation Cushion Set",
      productImage: undefined,
      userId: "user-4",
      userEmail: "david.brown@example.com",
      userName: "David Brown",
      requestedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
    {
      id: "notif-5",
      productId: "prod-4",
      productName: "Yoga Mat Premium",
      productImage: undefined,
      userId: "user-5",
      userEmail: "emily.chen@example.com",
      userName: "Emily Chen",
      requestedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
  ];
};

const generateDemoPreOrders = (): PreOrder[] => {
  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
  const futureDate2 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 3 weeks
  const futureDate3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

  return [
    {
      id: "pre-1",
      productId: "prod-6",
      productName: "Wellness Subscription Box",
      productImage: undefined,
      userId: "user-6",
      userEmail: "michael.jones@example.com",
      userName: "Michael Jones",
      quantity: 1,
      preOrderedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedFulfillmentDate: futureDate1.toISOString(),
      status: "PENDING",
    },
    {
      id: "pre-2",
      productId: "prod-7",
      productName: "Herbal Tea Collection",
      productImage: undefined,
      userId: "user-7",
      userEmail: "lisa.anderson@example.com",
      userName: "Lisa Anderson",
      quantity: 2,
      preOrderedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedFulfillmentDate: futureDate2.toISOString(),
      status: "PENDING",
    },
    {
      id: "pre-3",
      productId: "prod-6",
      productName: "Wellness Subscription Box",
      productImage: undefined,
      userId: "user-8",
      userEmail: "robert.taylor@example.com",
      userName: "Robert Taylor",
      quantity: 1,
      preOrderedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedFulfillmentDate: pastDate.toISOString(),
      status: "FULFILLED",
    },
    {
      id: "pre-4",
      productId: "prod-8",
      productName: "Essential Oil Diffuser",
      productImage: undefined,
      userId: "user-1",
      userEmail: "maria.jacobs@example.com",
      userName: "Maria Jacobs",
      quantity: 1,
      preOrderedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedFulfillmentDate: futureDate3.toISOString(),
      status: "PENDING",
    },
    {
      id: "pre-5",
      productId: "prod-7",
      productName: "Herbal Tea Collection",
      productImage: undefined,
      userId: "user-2",
      userEmail: "john.smith@example.com",
      userName: "John Smith",
      quantity: 1,
      preOrderedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedFulfillmentDate: futureDate2.toISOString(),
      status: "PENDING",
    },
  ];
};

const NotificationsPreOrdersManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRequest[]>(
    generateDemoNotifications()
  );
  const [preOrders, setPreOrders] = useState<PreOrder[]>(generateDemoPreOrders());
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "NOTIFIED" | "FULFILLED" | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrder | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setStatusFilter("");
    setSearchQuery("");
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, preOrder: PreOrder) => {
    setAnchorEl(event.currentTarget);
    setSelectedPreOrder(preOrder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPreOrder(null);
  };


  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "PENDING" && notif.status === "PENDING") ||
        (statusFilter === "NOTIFIED" && notif.status === "NOTIFIED");
      const matchesSearch =
        !searchQuery ||
        notif.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [notifications, statusFilter, searchQuery]);

  // Filter pre-orders
  const filteredPreOrders = useMemo(() => {
    return preOrders.filter((preOrder) => {
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "PENDING" && preOrder.status === "PENDING") ||
        (statusFilter === "FULFILLED" && preOrder.status === "FULFILLED");
      const matchesSearch =
        !searchQuery ||
        preOrder.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preOrder.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preOrder.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [preOrders, statusFilter, searchQuery]);

  // Paginated notifications
  const paginatedNotifications = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredNotifications, page, rowsPerPage]);

  // Paginated pre-orders
  const paginatedPreOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPreOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPreOrders, page, rowsPerPage]);

  // Summary stats
  const notificationStats = useMemo(() => {
    const pending = notifications.filter((n) => n.status === "PENDING").length;
    const notified = notifications.filter((n) => n.status === "NOTIFIED").length;
    return { total: notifications.length, pending, notified };
  }, [notifications]);

  const preOrderStats = useMemo(() => {
    const pending = preOrders.filter((p) => p.status === "PENDING").length;
    const fulfilled = preOrders.filter((p) => p.status === "FULFILLED").length;
    const totalQuantity = preOrders.reduce((sum, p) => sum + p.quantity, 0);
    return { total: preOrders.length, pending, fulfilled, totalQuantity };
  }, [preOrders]);

  const getStatusColor = (
    status: NotificationRequest["status"] | PreOrder["status"]
  ) => {
    switch (status) {
      case "FULFILLED":
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

  const isDatePast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Notifications & Pre-Orders
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          View and manage user notification requests and pre-orders
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Notification Requests
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
                <ShoppingBagIcon sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Pre-Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {preOrderStats.total} • Pending:{" "}
                  <span className="font-semibold text-yellow-600">
                    {preOrderStats.pending}
                  </span>{" "}
                  • Fulfilled: {preOrderStats.fulfilled} • Qty:{" "}
                  {preOrderStats.totalQuantity}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
              px: 3,
              fontFamily: '"League Spartan", sans-serif',
            },
          }}
        >
          <Tab
            icon={<NotificationsIcon />}
            iconPosition="start"
            label={`Notifications (${notificationStats.total})`}
          />
          <Tab
            icon={<ShoppingBagIcon />}
            iconPosition="start"
            label={`Pre-Orders (${preOrderStats.total})`}
          />
        </Tabs>

        {/* Filters */}
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
                  setStatusFilter(
                    e.target.value as
                      | "PENDING"
                      | "NOTIFIED"
                      | "FULFILLED"
                      | ""
                  )
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                {activeTab === 0 ? (
                  <MenuItem value="NOTIFIED">Notified</MenuItem>
                ) : (
                  <MenuItem value="FULFILLED">Fulfilled</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications Tab Content */}
      {activeTab === 0 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No notification requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedNotifications.map((notif) => (
                    <TableRow key={notif.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: "#00969b",
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {notif.userName?.[0]?.toUpperCase() ||
                              notif.userEmail?.[0]?.toUpperCase() ||
                              "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {notif.userName || "Anonymous User"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notif.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{notif.productName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={notif.status}
                          color={getStatusColor(notif.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notif.requestedAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredNotifications.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      )}

      {/* Pre-Orders Tab Content */}
      {activeTab === 1 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Est. Fulfillment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pre-Ordered Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPreOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No pre-orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPreOrders.map((preOrder) => (
                    <TableRow key={preOrder.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: "#00969b",
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {preOrder.userName?.[0]?.toUpperCase() ||
                              preOrder.userEmail?.[0]?.toUpperCase() ||
                              "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {preOrder.userName || "Anonymous User"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {preOrder.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{preOrder.productName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {preOrder.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {preOrder.estimatedFulfillmentDate ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography
                              variant="body2"
                              color={
                                isDatePast(preOrder.estimatedFulfillmentDate) &&
                                preOrder.status === "PENDING"
                                  ? "error"
                                  : "text.secondary"
                              }
                            >
                              {formatDate(preOrder.estimatedFulfillmentDate)}
                              {isDatePast(preOrder.estimatedFulfillmentDate) &&
                                preOrder.status === "PENDING" && (
                                  <Chip
                                    label="Overdue"
                                    color="error"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={preOrder.status}
                          color={getStatusColor(preOrder.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(preOrder.preOrderedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {preOrder.status === "PENDING" && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, preOrder)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredPreOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      )}

      {/* Actions Menu for Pre-Orders */}
      {activeTab === 1 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2">Mark as Fulfilled</Typography>
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default NotificationsPreOrdersManagement;

