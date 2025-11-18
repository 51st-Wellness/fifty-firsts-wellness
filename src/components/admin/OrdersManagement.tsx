import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  Button,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingActionsIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";

export type OrderStatus = "PENDING" | "PROCESSING" | "FULFILLED" | "CANCELLED";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  placedAt: string;
  fulfillmentEta?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
  }>;
  paymentMethod: "card" | "wallet" | "transfer";
  shippingMethod: "standard" | "express";
}

const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

const generateDemoOrders = (): Order[] => {
  const now = new Date();
  return [
    {
      id: "ORD-93421",
      customerName: "Maria Jacobs",
      customerEmail: "maria.jacobs@example.com",
      total: 79.99,
      status: "PROCESSING",
      placedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      fulfillmentEta: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { productId: "prod-1", name: "Mindful Tea Set", quantity: 1 },
        { productId: "prod-5", name: "Wellness Journal", quantity: 1 },
      ],
      paymentMethod: "card",
      shippingMethod: "express",
    },
    {
      id: "ORD-93420",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      total: 29.99,
      status: "FULFILLED",
      placedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      fulfillmentEta: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{ productId: "prod-2", name: "Aromatherapy Candle", quantity: 2 }],
      paymentMethod: "wallet",
      shippingMethod: "standard",
    },
    {
      id: "ORD-93390",
      customerName: "Sarah Williams",
      customerEmail: "sarah.williams@example.com",
      total: 59.99,
      status: "PENDING",
      placedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      fulfillmentEta: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      items: [{ productId: "prod-3", name: "Yoga Mat Pro", quantity: 1 }],
      paymentMethod: "transfer",
      shippingMethod: "express",
    },
    {
      id: "ORD-93375",
      customerName: "David Brown",
      customerEmail: "david.brown@example.com",
      total: 45.49,
      status: "CANCELLED",
      placedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      fulfillmentEta: undefined,
      items: [{ productId: "prod-6", name: "Calming Essential Oil Duo", quantity: 1 }],
      paymentMethod: "card",
      shippingMethod: "standard",
    },
    {
      id: "ORD-93360",
      customerName: "Emily Chen",
      customerEmail: "emily.chen@example.com",
      total: 110.0,
      status: "FULFILLED",
      placedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      fulfillmentEta: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { productId: "prod-7", name: "Wellness Retreat Kit", quantity: 1 },
        { productId: "prod-2", name: "Aromatherapy Candle", quantity: 1 },
      ],
      paymentMethod: "card",
      shippingMethod: "standard",
    },
  ];
};

const statusConfig: Record<
  OrderStatus,
  { label: string; color: "default" | "warning" | "success" | "primary" | "error" }
> = {
  PENDING: { label: "Pending", color: "warning" },
  PROCESSING: { label: "Processing", color: "primary" },
  FULFILLED: { label: "Fulfilled", color: "success" },
  CANCELLED: { label: "Cancelled", color: "error" },
};

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(generateDemoOrders());
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, order: Order) => {
    setAnchorEl(event.currentTarget);
    setActiveOrder(order);
  };
  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveOrder(null);
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    toast.success(`Order status updated to ${status.toLowerCase()}`);
  };

  const handleFulfill = () => {
    if (!activeOrder) return;
    updateStatus(activeOrder.id, "FULFILLED");
    handleMenuClose();
  };

  const handleCancel = () => {
    if (!activeOrder) return;
    updateStatus(activeOrder.id, "CANCELLED");
    handleMenuClose();
  };

  const handleProcess = () => {
    if (!activeOrder) return;
    updateStatus(activeOrder.id, "PROCESSING");
    handleMenuClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Orders
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track orders placed on the marketplace and update fulfillment status
          </p>
        </div>
        <Button
          variant="outlined"
          startIcon={<LocalShippingIcon />}
          onClick={() =>
            toast("Placeholder action. Connect your orders API to enable syncing.")
          }
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            fontFamily: '"League Spartan", sans-serif',
          }}
        >
          Sync Orders
        </Button>
      </div>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search by customer, order ID, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ flex: 1, minWidth: 220 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="FULFILLED">Fulfilled</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Placed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.paymentMethod === "card"
                          ? "Card"
                          : order.paymentMethod === "wallet"
                          ? "Wallet"
                          : "Transfer"}{" "}
                        • {order.shippingMethod === "express" ? "Express" : "Standard"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {currency(order.total)}
                      </Typography>
                      {order.fulfillmentEta && (
                        <Typography variant="caption" color="text.secondary">
                          ETA:{" "}
                          {new Date(order.fulfillmentEta).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[order.status].label}
                        color={statusConfig[order.status].color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.placedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => { setActiveOrder(order); setDetailsOpen(true); }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, order)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {activeOrder && (
          <MenuItem onClick={handleViewDetails}>
            <VisibilityIcon sx={{ fontSize: 20, mr: 1 }} />
            View details
          </MenuItem>
        )}
        {activeOrder?.status !== "FULFILLED" && (
          <MenuItem onClick={handleFulfill}>
            <CheckCircleIcon sx={{ fontSize: 20, mr: 1 }} />
            Mark as fulfilled
          </MenuItem>
        )}
        {activeOrder?.status === "PENDING" && (
          <MenuItem onClick={handleProcess}>
            <PendingActionsIcon sx={{ fontSize: 20, mr: 1 }} />
            Move to processing
          </MenuItem>
        )}
        {activeOrder?.status !== "CANCELLED" && (
          <MenuItem onClick={handleCancel}>
            <CancelIcon sx={{ fontSize: 20, mr: 1 }} />
            Cancel order
          </MenuItem>
        )}
      </Menu>

      <OrderDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={activeOrder}
      />
    </div>
  );
};

export default OrdersManagement;

