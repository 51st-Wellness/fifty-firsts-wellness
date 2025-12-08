import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Package,
  Bell,
  Loader,
  X,
  MapPin,
  CreditCard,
  FileText,
  ExternalLink,
  ShieldCheck,
  RefreshCcw,
  LifeBuoy,
  Star,
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
import { ResponseStatus } from "@/types/response.types";
import { useCart } from "../../context/CartContext";
import { cartAPI } from "../../api/cart.api";
import SubmitReviewModal from "../../components/SubmitReviewModal";
import { checkUserReviewForOrderItem } from "../../api/review.api";

// Helper functions outside component
const getStatusLabel = (status: string): string => {
  const upper = status.toUpperCase();
  if (upper === "PAID") return "Paid";
  if (upper === "PENDING") return "Pending";
  if (upper === "FAILED") return "Failed";
  if (upper === "CANCELLED") return "Cancelled";
  if (upper === "REFUNDED") return "Refunded";
  if (upper.includes("PRE") || upper.includes("PRE-ORDER")) return "Pre-order";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-green-100 text-green-700 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "FAILED":
      return "bg-red-100 text-red-700 border-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "REFUNDED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number, currency: string = "GBP") => {
  // Always use GBP, convert if needed
  const currencyCode = currency === "USD" ? "GBP" : currency || "GBP";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [reordering, setReordering] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<{
    orderItemId: string;
    productId: string;
    productName: string;
  } | null>(null);
  const [reviewedOrderItems, setReviewedOrderItems] = useState<Set<string>>(
    new Set()
  );
  const [checkingReviews, setCheckingReviews] = useState<Set<string>>(
    new Set()
  );
  const navigate = useNavigate();
  const { refreshCart, openCart } = useCart();

  const hasFetchedOrders = useRef(false);

  const filters = [
    "All",
    "PAID",
    "PENDING",
    "FAILED",
    "CANCELLED",
    "REFUNDED",
    "Pre Orders",
  ];

  // loadOrders fetches the current user's order summaries
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const response = await getMyOrders();
      if (response.status === ResponseStatus.SUCCESS && response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedOrders.current) {
      return;
    }
    hasFetchedOrders.current = true;
    void loadOrders();
  }, [loadOrders]);

  const handleViewOrder = async (orderId: string, isMobile: boolean) => {
    if (isMobile) {
      // Open modal on mobile
      setLoadingOrderDetails(true);
      setIsModalOpen(true);
      try {
        const response = await getMyOrder(orderId);
        if (
          response.status === ResponseStatus.SUCCESS &&
          response.data?.order
        ) {
          const orderData = response.data.order;
          setSelectedOrder(orderData);

          // Check review status for order items
          orderData.orderItems.forEach((item) => {
            if (item.hasReviewed === true) {
              setReviewedOrderItems((prev) => {
                if (prev.has(item.id)) return prev;
                return new Set(prev).add(item.id);
              });
            }
          });

          // Check reviews for items that can be reviewed
          const itemsToCheck = orderData.orderItems.filter((item) => {
            const canReview =
              item.productId &&
              item.product?.type === "STORE" &&
              orderData.status === "PAID";
            const alreadyChecked =
              reviewedOrderItems.has(item.id) || checkingReviews.has(item.id);
            const hasBackendValue = item.hasReviewed !== undefined;
            return canReview && !alreadyChecked && !hasBackendValue;
          });

          itemsToCheck.forEach((item) => {
            void checkOrderItemReview(item.id);
          });
        } else {
          toast.error("Failed to load order details");
          setIsModalOpen(false);
        }
      } catch (error: any) {
        toast.error("Failed to load order details");
        setIsModalOpen(false);
      } finally {
        setLoadingOrderDetails(false);
      }
    } else {
      // Navigate on desktop
      navigate(`/dashboard/orders/${orderId}`);
    }
  };

  const checkOrderItemReview = async (orderItemId: string) => {
    if (
      checkingReviews.has(orderItemId) ||
      reviewedOrderItems.has(orderItemId)
    ) {
      return;
    }

    try {
      setCheckingReviews((prev) => new Set(prev).add(orderItemId));
      const response = await checkUserReviewForOrderItem(orderItemId);
      if (
        response.status === ResponseStatus.SUCCESS &&
        response.data?.hasReviewed
      ) {
        setReviewedOrderItems((prev) => new Set(prev).add(orderItemId));
      }
    } catch (error) {
      console.error("Failed to check review status:", error);
    } finally {
      setCheckingReviews((prev) => {
        const next = new Set(prev);
        next.delete(orderItemId);
        return next;
      });
    }
  };

  const handleReviewClick = (item: OrderDetail["orderItems"][0]) => {
    if (!item.productId || !item.id) return;
    setSelectedOrderItem({
      orderItemId: item.id,
      productId: item.productId,
      productName: item.product?.storeItem?.name || "Product",
    });
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = () => {
    if (selectedOrderItem) {
      setReviewedOrderItems((prev) =>
        new Set(prev).add(selectedOrderItem.orderItemId)
      );
    }
    setReviewModalOpen(false);
    setSelectedOrderItem(null);
  };

  const handleReorder = async () => {
    if (!selectedOrder || !selectedOrder.orderItems.length) {
      toast.error("Unable to reorder at this time.");
      return;
    }

    try {
      setReordering(true);
      for (const item of selectedOrder.orderItems) {
        if (!item.productId) {
          continue;
        }

        const addResponse = await cartAPI.addToCart({
          productId: item.productId,
          quantity: Math.max(1, item.quantity ?? 1),
        });

        if (
          !(addResponse.status === ResponseStatus.SUCCESS && addResponse.data)
        ) {
          throw new Error(addResponse.message || "Unable to add item to cart");
        }
      }

      await refreshCart();
      toast.success(
        "Order items added to your cart. Review and checkout when ready."
      );
      openCart();
    } catch (error) {
      console.error("Order again failed:", error);
      toast.error(
        "We couldn't add those items to your cart. Please try again."
      );
    } finally {
      setReordering(false);
    }
  };

  const handleContactSupport = () => {
    if (!selectedOrder) return;
    navigate(`/contact?order=${selectedOrder.id}`);
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder) return;
    try {
      setVerifyingPayment(true);
      const response = await verifyOrderPayment(selectedOrder.id);
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        if (response.data.updated) {
          toast.success(
            response.data.message || "Payment status verified and updated"
          );
          // Reload order details
          const orderResponse = await getMyOrder(selectedOrder.id);
          if (
            orderResponse.status === ResponseStatus.SUCCESS &&
            orderResponse.data?.order
          ) {
            setSelectedOrder(orderResponse.data.order);
          }
        } else {
          toast.success(
            response.data.message || "Payment status verified (no changes)"
          );
        }
      } else {
        toast.error(response.message || "Failed to verify payment");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to verify payment");
    } finally {
      setVerifyingPayment(false);
    }
  };


  const filteredOrders = (() => {
    if (activeFilter === "Pre Orders") {
      return orders.filter((order) => order.isPreOrder);
    }
    if (activeFilter === "All") return orders;
    return orders.filter(
      (order) => order.status.toUpperCase() === activeFilter.toUpperCase()
    );
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
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
            const imageUrl =
              order.previewImage ||
              ((order as any).previewImage as string | undefined) ||
              "";
            const isPreOrder = order.isPreOrder === true;
            const wantsNotification = Boolean((order as any).wantsNotification);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  handleViewOrder(order.id, window.innerWidth < 768)
                }
              >
                {/* Product Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-base md:text-lg font-semibold text-gray-900"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Order {order.id.slice(0, 8).toUpperCase()}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* See Details / Bell Icon - Top Right */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {isPreOrder && wantsNotification && (
                        <Bell className="w-5 h-5 text-brand-green" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id, window.innerWidth < 768);
                        }}
                        className="hidden md:block text-brand-green underline text-sm font-medium"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        See Details
                      </button>
                    </div>
                  </div>

                  {/* Price, Item Count, and Status - Same Line */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(
                          order.totalAmount,
                          order.paymentCurrency || "GBP"
                        )}
                      </span>
                      <span>•</span>
                      <span>
                        {order.itemCount}{" "}
                        {order.itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                    {/* Status tag */}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] md:text-xs font-medium border flex-shrink-0 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Order Details
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {loadingOrderDetails ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 animate-spin text-brand-green" />
              </div>
            ) : selectedOrder ? (
              <div className="p-4 space-y-4 pb-6">
                {/* Order Header */}
                <div>
                  <p
                    className="text-base font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Order {selectedOrder.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <p
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Order Items
                  </p>
                  {selectedOrder.orderItems.map((item) => {
                    const productImage =
                      item.product?.storeItem?.display?.url ||
                      item.product?.storeItem?.images?.[0] ||
                      "";
                    return (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={item.product?.storeItem?.name || "Product"}
                              className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium text-gray-900"
                              style={{
                                fontFamily: '"League Spartan", sans-serif',
                              }}
                            >
                              {item.product?.storeItem?.name || "Product"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-xs font-medium text-gray-900 mt-1">
                              {formatCurrency(
                                item.price,
                                selectedOrder.payment?.currency || "GBP"
                              )}
                            </p>
                            {selectedOrder.status === "PAID" &&
                              item.productId &&
                              item.product?.type === "STORE" && (
                                <div className="mt-2">
                                  {item.hasReviewed ??
                                  reviewedOrderItems.has(item.id) ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                      <Star className="w-3 h-3 fill-green-600" />
                                      Review submitted
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleReviewClick(item)}
                                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                                    >
                                      <Star className="w-3 h-3" />
                                      Write a Review
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Items ({selectedOrder.orderItems.length})
                      </span>
                      <span className="text-gray-900">
                        {formatCurrency(
                          selectedOrder.orderItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          ),
                          selectedOrder.payment?.currency || "GBP"
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Total
                      </span>
                      <span
                        className="text-lg font-bold text-brand-green"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {formatCurrency(
                          selectedOrder.totalAmount,
                          selectedOrder.payment?.currency || "GBP"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <p
                        className="text-sm font-semibold text-gray-700"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Delivery Address
                      </p>
                    </div>
                    <p className="text-xs text-gray-900 font-medium">
                      {selectedOrder.deliveryAddress.recipientName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedOrder.deliveryAddress.contactPhone}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedOrder.deliveryAddress.addressLine1}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedOrder.deliveryAddress.postTown},{" "}
                      {selectedOrder.deliveryAddress.postcode}
                    </p>
                    {selectedOrder.deliveryAddress.deliveryInstructions && (
                      <p className="text-xs text-gray-500 italic mt-2">
                        Note:{" "}
                        {selectedOrder.deliveryAddress.deliveryInstructions}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Information */}
                {selectedOrder.payment && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <p
                        className="text-sm font-semibold text-gray-700"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Payment Information
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Provider</p>
                        <p className="text-gray-900 font-medium mt-0.5">
                          {selectedOrder.payment.provider}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5 ${getStatusColor(
                            selectedOrder.payment.status
                          )}`}
                        >
                          {getStatusLabel(selectedOrder.payment.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="text-gray-900 font-medium mt-0.5">
                          {formatCurrency(
                            selectedOrder.payment.amount,
                            selectedOrder.payment.currency || "GBP"
                          )}
                        </p>
                      </div>
                      {selectedOrder.payment.providerRef && (
                        <div>
                          <p className="text-gray-500">Reference</p>
                          <p className="text-xs font-mono text-gray-700 mt-0.5 truncate">
                            {selectedOrder.payment.providerRef}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedOrder.payment.metadata?.receiptUrl && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <a
                          href={selectedOrder.payment.metadata.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mt-4">
                  {/* Pending Order Actions */}
                  {selectedOrder.status.toUpperCase() === "PENDING" && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleVerifyPayment}
                        disabled={verifyingPayment}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-purple text-white px-4 py-2.5 text-sm font-semibold hover:bg-brand-purple-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {verifyingPayment ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                        <span>Verify Payment</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleReorder}
                        disabled={reordering}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green text-white px-4 py-2.5 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {reordering ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="w-4 h-4" />
                        )}
                        <span>Order Again</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleContactSupport}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        <LifeBuoy className="w-4 h-4" />
                        <span>Contact Support</span>
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        If payment seems stuck, verify it with Stripe. If
                        something feels off, reach out or rebuild the order
                        right away.
                      </p>
                    </div>
                  )}

                  {/* Order Again for non-pending orders */}
                  {selectedOrder.status.toUpperCase() !== "PENDING" && (
                    <button
                      type="button"
                      onClick={handleReorder}
                      disabled={reordering}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green text-white px-4 py-2.5 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {reordering ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="w-4 h-4" />
                      )}
                      <span>Order Again</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedOrderItem && (
        <SubmitReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedOrderItem(null);
          }}
          productName={selectedOrderItem.productName}
          productId={selectedOrderItem.productId}
          orderItemId={selectedOrderItem.orderItemId}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default OrdersHistory;
