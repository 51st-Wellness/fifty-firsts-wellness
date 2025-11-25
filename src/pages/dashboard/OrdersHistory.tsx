import React, { useState, useEffect } from "react";
import { Package, Loader, X, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getMyOrders,
  getMyOrder,
  type OrderSummary,
  type OrderDetail,
} from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import { ResponseStatus } from "@/types/response.types";

const formatCurrency = (amount: number, currency: string = "GBP") => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency === "USD" ? "GBP" : currency || "GBP",
  }).format(amount);
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: string) => {
  const upperStatus = status.toUpperCase();
  if (upperStatus.includes("DELIVERED")) {
    return "Delivered";
  }
  if (upperStatus === "PAID") {
    return "Paid";
  }
  if (upperStatus === "PENDING") {
    return "Pending";
  }
  if (upperStatus === "FAILED") {
    return "Failed";
  }
  if (upperStatus === "CANCELLED") {
    return "Cancelled";
  }
  if (upperStatus === "REFUNDED") {
    return "Refunded";
  }
  if (upperStatus === "PRE_ORDER" || upperStatus.includes("PREORDER")) {
    return "Pre-order";
  }
  if (upperStatus.includes("CANCELLED") || upperStatus.includes("FAILED")) {
    if (upperStatus.includes("PAYMENT")) {
      return "Cancelled - Payment Unsuccessful";
    }
    return "Cancelled";
  }
  if (
    upperStatus.includes("PENDING") ||
    upperStatus.includes("PROGRESS") ||
    upperStatus.includes("ONGOING")
  ) {
    return "Delivery in progress";
  }
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusColor = (status: string) => {
  const upperStatus = status.toUpperCase();
  if (upperStatus.includes("DELIVERED") || upperStatus === "PAID") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (upperStatus.includes("CANCELLED") || upperStatus.includes("FAILED")) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (
    upperStatus.includes("PENDING") ||
    upperStatus.includes("PROGRESS") ||
    upperStatus.includes("ONGOING")
  ) {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

type OrderWithDetails = OrderSummary & {
  firstProductName?: string;
  firstProductImage?: string;
  wantsNotification?: boolean;
  isPreOrder?: boolean;
};

const generateDemoPreOrders = (): OrderWithDetails[] => {
  const now = Date.now();
  return [
    {
      id: "PREORDER-DEMO-001",
      userId: "demo-user",
      status: "PRE_ORDER",
      totalAmount: 45,
      paymentId: null,
      deliveryAddressId: null,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 1,
      totalQuantity: 1,
      paymentStatus: null,
      paymentProvider: null,
      paymentCurrency: "GBP",
      firstProductName: "Glow Restore Elixir",
      firstProductImage:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=60",
      wantsNotification: true,
      isPreOrder: true,
    },
    {
      id: "PREORDER-DEMO-002",
      userId: "demo-user",
      status: "PRE_ORDER",
      totalAmount: 62,
      paymentId: null,
      deliveryAddressId: null,
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 2,
      totalQuantity: 3,
      paymentStatus: null,
      paymentProvider: null,
      paymentCurrency: "GBP",
      firstProductName: "Calm Nights Bundle",
      firstProductImage:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=400&q=60",
      wantsNotification: false,
      isPreOrder: true,
    },
    {
      id: "PREORDER-DEMO-003",
      userId: "demo-user",
      status: "PRE_ORDER",
      totalAmount: 38,
      paymentId: null,
      deliveryAddressId: null,
      createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 1,
      totalQuantity: 1,
      paymentStatus: null,
      paymentProvider: null,
      paymentCurrency: "GBP",
      firstProductName: "Herbal Focus Drops",
      firstProductImage:
        "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=60",
      wantsNotification: true,
      isPreOrder: true,
    },
  ];
};

const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filters = ["All", "PAID", "PENDING", "FAILED", "CANCELLED", "REFUNDED", "Pre Orders"];

  useEffect(() => {
    void loadOrders();
  }, []);

  const loadOrderImages = async (orderList: OrderWithDetails[]) => {
    if (!orderList.length) return;
    const loadingSet = new Set<string>();
    orderList.forEach((order) => loadingSet.add(order.id));
    setLoadingImages(new Set(loadingSet));

    await Promise.all(
      orderList.map(async (order) => {
        try {
          const response = await getMyOrder(order.id);
          if (
            response.status === ResponseStatus.SUCCESS &&
            response.data?.order
          ) {
            const detail = response.data.order;
            const firstItem = detail.orderItems?.[0];
            const firstProductImage =
              firstItem?.product?.storeItem?.display?.url ||
              firstItem?.product?.storeItem?.images?.[0] ||
              "";
            const firstProductName =
              firstItem?.product?.storeItem?.name || "Order item";

            setOrders((prev) =>
            prev.map((existing) =>
                existing.id === order.id
                  ? {
                      ...existing,
                      firstProductImage,
                      firstProductName,
                    }
                  : existing
              )
            );
          }
        } catch (error) {
          console.error("Failed to load order preview", error);
        } finally {
          loadingSet.delete(order.id);
          setLoadingImages(new Set(loadingSet));
        }
      })
    );
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getMyOrders();
      if (
        (response.status === ResponseStatus.SUCCESS) &&
        response.data?.orders
      ) {
        const baseOrders: OrderWithDetails[] = response.data.orders.map((order) => ({
          ...order,
        }));
        setOrders(baseOrders);
        void loadOrderImages(baseOrders);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrder = async (
    order: OrderWithDetails,
    isMobile: boolean
  ) => {
    if (order.isPreOrder) {
      toast.success("Pre-order updates will be shared once the item ships.");
      return;
    }

    if (!isMobile) {
      navigate(`/dashboard/orders/${order.id}`);
      return;
    }

    setIsModalOpen(true);
    setLoadingOrderDetails(true);
    setSelectedOrder(null);

    try {
      const response = await getMyOrder(order.id);
      if (
        response.status === ResponseStatus.SUCCESS &&
        response.data?.order
      ) {
        setSelectedOrder(response.data.order);
      } else {
        toast.error(response.message || "Failed to load order details");
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load order details"
      );
      setIsModalOpen(false);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const filteredOrders = (() => {
    if (activeFilter === "Pre Orders") {
      return generateDemoPreOrders();
    }
    if (activeFilter === "All") return orders;
    return orders.filter((order) => order.status.toUpperCase() === activeFilter.toUpperCase());
  })();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2
          className="text-xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Orders History
        </h2>

        {/* Tabs with horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 mb-6 bg-white p-2 rounded-full border border-gray-200 min-w-max md:min-w-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "text-brand-green border border-brand-green bg-brand-green/5"
                    : "text-gray-600 border border-transparent hover:bg-gray-50"
                }`}
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-brand-green" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium">
              {activeFilter === "All"
                ? "No orders yet"
                : `No ${activeFilter.toLowerCase()} orders`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {activeFilter === "All"
                ? "Your order history will appear here"
                : "Try selecting a different filter"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isLoadingImage = loadingImages.has(order.id);
            const productImage = order.firstProductImage || "";
            const statusLabel = getStatusLabel(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  const isMobile = window.innerWidth < 768;
                  void handleViewOrder(order, isMobile);
                }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {isLoadingImage ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      ) : productImage ? (
                        <img
                          src={productImage}
                          alt={`Order ${order.id.slice(0, 8).toUpperCase()}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          {/* Order ID as main title */}
                          <h4
                            className="text-sm md:text-base font-semibold text-gray-900 mb-1"
                            style={{ fontFamily: '"League Spartan", sans-serif' }}
                          >
                            Order {order.id.slice(0, 8).toUpperCase()}
                          </h4>
                          
                          {/* Date */}
                          <p className="text-xs text-gray-500 mb-2">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        {/* See Details / Bell Icon - Top Right */}
                        {order.isPreOrder && order.wantsNotification ? (
                          <div className="flex-shrink-0">
                            <Bell className="w-5 h-5 text-brand-green" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isMobile = window.innerWidth < 768;
                              void handleViewOrder(order, isMobile);
                            }}
                            className="hidden md:block text-brand-green hover:text-brand-green-dark text-sm flex-shrink-0 underline"
                            style={{ fontFamily: '"League Spartan", sans-serif' }}
                          >
                            See Details
                          </button>
                        )}
                      </div>

                      {/* Price • Items and Status Tag on same line, tag aligned bottom right */}
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <p className="text-xs text-gray-600">
                          {formatCurrency(
                            order.totalAmount,
                            order.paymentCurrency || "GBP"
                          )}{" "}
                          • {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                        </p>
                        <span
                          className={`px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium border flex-shrink-0 ${getStatusColor(
                            order.status
                          )}`}
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Modal for Order Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Order Details
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              {loadingOrderDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-brand-green" />
                </div>
              ) : selectedOrder ? (
                <OrderDetailsContent order={selectedOrder} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Failed to load order details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Order Details Content Component (reusable)
const OrderDetailsContent: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const itemsTotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = order.payment?.amount ? order.payment.amount - itemsTotal : 0;
  const total = order.totalAmount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2
          className="text-xl font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Order Summary
        </h2>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
          <span>Order No: {order.id.slice(0, 8).toUpperCase()}</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              order.status
            )}`}
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-2">Items in your order</p>
        {order.orderItems.map((item) => {
          const productName = item.product?.storeItem?.name || "Product";
          const productImage =
            item.product?.storeItem?.display?.url ||
            item.product?.storeItem?.images?.[0] ||
            "";
          const category = item.product?.storeItem?.categories?.[0] || "Uncategorized";
          const itemPrice = formatCurrency(
            item.price,
            order.payment?.currency || "GBP"
          );

          return (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-4">
                {productImage && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium text-gray-900 truncate"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {productName}
                  </h3>
                  {item.product?.storeItem?.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.product.storeItem.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Category: {category}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  <p
                    className="text-sm font-semibold text-gray-900 mt-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {itemPrice}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-600">Item's total ({order.orderItems.length})</span>
          <span className="text-right text-gray-900">
            {formatCurrency(itemsTotal, order.payment?.currency || "GBP")}
          </span>
          {shipping > 0 && (
            <>
              <span className="text-gray-600">Shipping</span>
              <span className="text-right text-gray-900">
                {formatCurrency(shipping, order.payment?.currency || "GBP")}
              </span>
            </>
          )}
          <div className="col-span-2 border-t border-gray-200 my-2" />
          <span
            className="text-gray-900 font-semibold"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Total
          </span>
          <span
            className="text-right text-gray-900 font-semibold"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {formatCurrency(total, order.payment?.currency || "GBP")}
          </span>
        </div>
      </div>

      {/* Address */}
      {order.deliveryAddress && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">Shipping Address</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress.addressLine1}</p>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.postTown}, {order.deliveryAddress.postcode}
          </p>
          <p className="text-sm text-gray-600 mt-2">{order.deliveryAddress.contactPhone}</p>
          {order.deliveryAddress.recipientName && (
            <p className="text-sm font-medium text-gray-900 mt-2">
              {order.deliveryAddress.recipientName}
            </p>
          )}
        </div>
      )}

      {/* Payment Info */}
      {order.payment && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">Payment Information</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Provider</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{order.payment.provider}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5 ${getStatusColor(
                  order.payment.status
                )}`}
              >
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
