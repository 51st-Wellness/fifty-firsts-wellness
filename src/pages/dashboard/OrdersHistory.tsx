import React, { useState, useEffect } from "react";
import {
  Package,
  Loader,
  X,
  Bell,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getMyOrders,
  getMyOrder,
  verifyOrderPayment,
  type OrderSummary,
  type OrderDetail,
} from "../../api/user.api";
import { useNavigate } from "react-router-dom";

interface OrderWithDetails extends OrderSummary {
  firstProductName?: string;
  firstProductImage?: string;
  wantsNotification?: boolean; // For pre-orders: indicates if user wants to be notified when in stock
}

interface PreOrderDemo extends OrderSummary {
  firstProductName?: string;
  firstProductImage?: string;
  wantsNotification?: boolean;
  isPreOrder?: boolean;
}

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

  // Check review status for order items when order details are loaded
  useEffect(() => {
    if (!expandedOrderId) return;

    const detail = orderDetails[expandedOrderId];
    if (!detail || !detail.orderItems) return;

    // Also populate reviewedOrderItems from backend hasReviewed first
    detail.orderItems.forEach((item) => {
      if (item.hasReviewed === true) {
        setReviewedOrderItems((prev) => {
          if (prev.has(item.id)) return prev;
          return new Set(prev).add(item.id);
        });
      }
    });

    // Check reviews for items that can be reviewed and don't have backend value
    const itemsToCheck = detail.orderItems.filter((item) => {
      const canReview =
        item.productId &&
        item.product?.type === "STORE" &&
        detail.status === "PAID";
      const alreadyChecked =
        reviewedOrderItems.has(item.id) || checkingReviews.has(item.id);
      // Use backend hasReviewed if available, otherwise check
      const hasBackendValue = item.hasReviewed !== undefined;

      return canReview && !alreadyChecked && !hasBackendValue;
    });

    // Check reviews for items that need checking
    itemsToCheck.forEach((item) => {
      void checkOrderItemReview(item.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedOrderId, orderDetails]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getMyOrders();
      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data?.orders
      ) {
        const ordersWithDetails: OrderWithDetails[] = response.data.orders;
        setOrders(ordersWithDetails);
        
        // Fetch order details for each order to get product images
        void loadOrderImages(ordersWithDetails);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadOrderImages = async (ordersList: OrderWithDetails[]) => {
    // Load images for all orders in parallel
    const imagePromises = ordersList.map(async (order) => {
      if (loadingImages.has(order.id)) return;
      
      setLoadingImages((prev) => new Set(prev).add(order.id));
      
      try {
        const response = await getMyOrder(order.id);
        if (
          (response.status === "SUCCESS" || response.status === "success") &&
          response.data?.order?.orderItems &&
          response.data.order.orderItems.length > 0
        ) {
          const firstItem = response.data.order.orderItems[0];
          const productName = firstItem.product?.storeItem?.name || "Product";
          const productImage =
            firstItem.product?.storeItem?.display?.url ||
            firstItem.product?.storeItem?.images?.[0] ||
            "";

          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
                ? { ...o, firstProductName: productName, firstProductImage: productImage }
                : o
            )
          );
        }
      } catch (error) {
        console.error(`Failed to load image for order ${order.id}:`, error);
      } finally {
        setLoadingImages((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }
    });

    await Promise.all(imagePromises);
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes("DELIVERED")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (upperStatus.includes("CANCELLED") || upperStatus.includes("FAILED")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (upperStatus.includes("PENDING") || upperStatus.includes("PROGRESS") || upperStatus.includes("ONGOING")) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    if (upperStatus === "PAID") {
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
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

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency === "USD" ? "GBP" : currency || "GBP",
    }).format(amount);
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
    if (upperStatus.includes("PENDING") || upperStatus.includes("PROGRESS") || upperStatus.includes("ONGOING")) {
      return "Delivery in progress";
    }
    // Capitalize first letter only
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleViewOrder = async (orderId: string, isMobile: boolean = false) => {
    if (isMobile) {
      // Show modal on mobile
      setLoadingOrderDetails(true);
      setIsModalOpen(true);
      try {
        const response = await getMyOrder(orderId);
        if (
          (response.status === "SUCCESS" || response.status === "success") &&
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
    } else {
      // Navigate on desktop
      navigate(`/dashboard/orders/${orderId}`);
    }
  };

  // Generate demo pre-orders data
  const generateDemoPreOrders = (): PreOrderDemo[] => {
    const demoPreOrders: PreOrderDemo[] = [
      {
        id: "pre-order-1",
        userId: "user-1",
        status: "PRE_ORDER",
        totalAmount: 49.99,
        paymentId: null,
        deliveryAddressId: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 1,
        totalQuantity: 1,
        firstProductName: "Wellness Bundle",
        firstProductImage: "/assets/marketplace/mandi-face-masks.jpg",
        wantsNotification: true,
        isPreOrder: true,
        paymentCurrency: "GBP",
      },
      {
        id: "pre-order-2",
        userId: "user-1",
        status: "PRE_ORDER",
        totalAmount: 79.99,
        paymentId: null,
        deliveryAddressId: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 2,
        totalQuantity: 2,
        firstProductName: "Premium Supplements",
        firstProductImage: "/assets/marketplace/afrilet-multivitamin.jpg",
        wantsNotification: false,
        isPreOrder: true,
        paymentCurrency: "GBP",
      },
      {
        id: "pre-order-3",
        userId: "user-1",
        status: "PRE_ORDER",
        totalAmount: 29.99,
        paymentId: null,
        deliveryAddressId: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 1,
        totalQuantity: 1,
        firstProductName: "Skincare Set",
        firstProductImage: "/assets/marketplace/chara-lip-balm.jpg",
        wantsNotification: true,
        isPreOrder: true,
        paymentCurrency: "GBP",
      },
    ];
    return demoPreOrders;
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
                  handleViewOrder(order.id, isMobile);
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
                        {activeFilter === "Pre Orders" && (order as PreOrderDemo).wantsNotification ? (
                          <div className="flex-shrink-0">
                            <Bell className="w-5 h-5 text-brand-green" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isMobile = window.innerWidth < 768;
                              handleViewOrder(order.id, isMobile);
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Order Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
    if (upperStatus.includes("PENDING") || upperStatus.includes("PROGRESS") || upperStatus.includes("ONGOING")) {
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
    if (upperStatus.includes("PENDING") || upperStatus.includes("PROGRESS") || upperStatus.includes("ONGOING")) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

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
