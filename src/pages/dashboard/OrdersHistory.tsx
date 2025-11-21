import React, { useState, useEffect } from "react";
import {
  Package,
  DollarSign,
  CreditCard,
  MapPin,
  Edit3,
  X,
  Loader,
  FileText,
  ExternalLink,
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
import { useCart } from "../../context/CartContext";
import { cartAPI } from "../../api/cart.api";
import { useNavigate } from "react-router-dom";
import SubmitReviewModal from "../../components/SubmitReviewModal";
import { checkUserReviewForOrderItem } from "../../api/review.api";
import { ResponseStatus } from "@/types/response.types";

const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderDetail>>(
    {}
  );
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingDetailOrderId, setLoadingDetailOrderId] = useState<
    string | null
  >(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(
    null
  );
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
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

  const { refreshCart, openCart } = useCart();
  const navigate = useNavigate();

  const filters = ["All", "PAID", "PENDING", "FAILED", "CANCELLED", "REFUNDED"];

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
        (response.status === ResponseStatus.SUCCESS) &&
        response.data?.orders
      ) {
        setOrders(response.data.orders);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetail = async (
    orderId: string
  ): Promise<OrderDetail | null> => {
    if (orderDetails[orderId]) {
      return orderDetails[orderId];
    }

    try {
      setLoadingDetailOrderId(orderId);
      const response = await getMyOrder(orderId);
      if (
        (response.status === ResponseStatus.SUCCESS) &&
        response.data?.order
      ) {
        const order = response.data.order;
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: order,
        }));
        return order;
      }
      toast.error(response.message || "Failed to load order details.");
      return null;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load order details."
      );
      return null;
    } finally {
      setLoadingDetailOrderId(null);
    }
  };

  const ensureOrderDetail = async (
    orderId: string
  ): Promise<OrderDetail | null> => {
    return orderDetails[orderId] ?? (await fetchOrderDetail(orderId));
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
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleReorder = async (order: OrderSummary) => {
    const detail = await ensureOrderDetail(order.id);
    if (!detail || !detail.orderItems.length) {
      toast.error("Unable to reorder at this time.");
      return;
    }

    try {
      setReorderingOrderId(order.id);
      for (const item of detail.orderItems) {
        if (!item.productId) {
          continue;
        }

        const addResponse = await cartAPI.addToCart({
          productId: item.productId,
          quantity: Math.max(1, item.quantity ?? 1),
        });

        if (
          !(
            (addResponse.status === ResponseStatus.SUCCESS) &&
            addResponse.data
          )
        ) {
          throw new Error(addResponse?.message || "Unable to add item to cart");
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
      setReorderingOrderId(null);
    }
  };

  const handleContactSupport = (orderId: string) => {
    navigate(`/contact?order=${orderId}`);
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      setVerifyingOrderId(orderId);
      const response = await verifyOrderPayment(orderId);
      if (
        (response.status === ResponseStatus.SUCCESS) &&
        response.data
      ) {
        if (response.data.updated) {
          toast.success(
            response.data.message || "Payment status verified and updated"
          );
          // Reload orders to get updated status
          await loadOrders();
          // If order is expanded, reload its details
          if (expandedOrderId === orderId) {
            await fetchOrderDetail(orderId);
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
      setVerifyingOrderId(null);
    }
  };

  const handleToggleOrder = (orderId: string) => {
    setExpandedOrderId((current) => {
      const next = current === orderId ? null : orderId;
      if (next === orderId && !orderDetails[orderId]) {
        void fetchOrderDetail(orderId);
      }
      return next;
    });
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
        (response.status === ResponseStatus.SUCCESS) &&
        response.data?.hasReviewed
      ) {
        setReviewedOrderItems((prev) => new Set(prev).add(orderItemId));
      }
    } catch (error) {
      // Silently fail - don't block UI
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

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    return order.status.toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2
          className="text-xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Orders History
        </h2>

        <div className="flex gap-2 mb-6 bg-white p-2 rounded-full border border-gray-200">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
            const detail = orderDetails[order.id];
            const isDetailLoading = loadingDetailOrderId === order.id;
            const receiptUrl =
              detail?.payment?.metadata?.receiptUrl ?? undefined;

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-brand-green/50 transition-colors"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleToggleOrder(order.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4
                            className="text-sm font-semibold text-gray-900"
                            style={{
                              fontFamily: '"League Spartan", sans-serif',
                            }}
                          >
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-8">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-medium text-gray-700">
                            {formatCurrency(
                              order.totalAmount,
                              order.paymentCurrency || "USD"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {order.itemCount} item
                            {order.itemCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <button
                        type="button"
                        className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleOrder(order.id);
                        }}
                      >
                        {expandedOrderId === order.id ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {isDetailLoading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader className="w-5 h-5 animate-spin text-brand-green" />
                      </div>
                    )}

                    {!isDetailLoading && !detail && (
                      <div className="p-4 text-sm text-gray-500">
                        Order details are currently unavailable. Please try
                        again later.
                      </div>
                    )}

                    {detail && (
                      <>
                        <div className="p-4 space-y-3">
                          <h5
                            className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3"
                            style={{
                              fontFamily: '"League Spartan", sans-serif',
                            }}
                          >
                            Order Items
                          </h5>
                          {detail.orderItems.map((item) => {
                            // Use backend hasReviewed if available, otherwise use local state
                            const hasReviewed =
                              item.hasReviewed ??
                              reviewedOrderItems.has(item.id);
                            const isChecking = checkingReviews.has(item.id);
                            const canReview =
                              item.productId &&
                              item.product?.type === "STORE" &&
                              order.status === "PAID";

                            return (
                              <div
                                key={item.id}
                                className="bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-start gap-3">
                                  {item.product?.storeItem?.display?.url && (
                                    <img
                                      src={item.product.storeItem.display.url}
                                      alt={item.product.storeItem.name}
                                      className="w-16 h-16 object-cover rounded border border-gray-200"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h6
                                      className="text-sm font-medium text-gray-900 truncate"
                                      style={{
                                        fontFamily:
                                          '"League Spartan", sans-serif',
                                      }}
                                    >
                                      {item.product?.storeItem?.name ||
                                        "Product"}
                                    </h6>
                                    {item.product?.storeItem?.description && (
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {item.product.storeItem.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-xs text-gray-600">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="text-xs font-medium text-gray-900">
                                        {formatCurrency(
                                          item.price,
                                          detail.payment?.currency ||
                                            order.paymentCurrency ||
                                            "USD"
                                        )}
                                      </span>
                                    </div>
                                    {canReview && (
                                      <div className="mt-3">
                                        {hasReviewed ? (
                                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                            <Star className="w-3 h-3 fill-green-600" />
                                            Review submitted
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleReviewClick(item)
                                            }
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

                        {detail.deliveryAddress && (
                          <div className="p-4 border-t border-gray-200">
                            <h5
                              className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2"
                              style={{
                                fontFamily: '"League Spartan", sans-serif',
                              }}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              Delivery Address
                            </h5>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-sm font-medium text-gray-900">
                                {detail.deliveryAddress.recipientName}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {detail.deliveryAddress.contactPhone}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {detail.deliveryAddress.addressLine1}
                              </p>
                              <p className="text-xs text-gray-600">
                                {detail.deliveryAddress.postTown}
                              </p>
                              <p className="text-xs text-gray-600">
                                {detail.deliveryAddress.postcode}
                              </p>
                              {detail.deliveryAddress.deliveryInstructions && (
                                <p className="text-xs text-gray-500 italic mt-2">
                                  Note:{" "}
                                  {detail.deliveryAddress.deliveryInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {detail.payment && (
                          <div className="p-4 border-t border-gray-200">
                            <h5
                              className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2"
                              style={{
                                fontFamily: '"League Spartan", sans-serif',
                              }}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Payment Information
                            </h5>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Provider
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                                    {detail.payment.provider}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Status
                                  </p>
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5 ${getStatusColor(
                                      detail.payment.status
                                    )}`}
                                  >
                                    {detail.payment.status}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Amount
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                                    {formatCurrency(
                                      detail.payment.amount,
                                      detail.payment.currency
                                    )}
                                  </p>
                                </div>
                                {detail.payment.providerRef && (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Reference
                                    </p>
                                    <p className="text-xs font-mono text-gray-700 mt-0.5 truncate">
                                      {detail.payment.providerRef}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {receiptUrl && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <a
                                    href={receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span>View Receipt</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-semibold text-gray-900"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          Total Amount
                        </span>
                        <span className="text-lg font-bold text-brand-green">
                          {formatCurrency(
                            order.totalAmount,
                            order.paymentCurrency || "USD"
                          )}
                        </span>
                      </div>
                    </div>

                    {order.status.toUpperCase() === "PENDING" && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(order.id)}
                            disabled={verifyingOrderId === order.id}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {verifyingOrderId === order.id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCcw className="w-4 h-4" />
                            )}
                            <span>Verify Payment</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            disabled={reorderingOrderId === order.id}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green text-white px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {reorderingOrderId === order.id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCcw className="w-4 h-4" />
                            )}
                            <span>Order Again</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleContactSupport(order.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors"
                          >
                            <LifeBuoy className="w-4 h-4" />
                            <span>Contact Support</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          If payment seems stuck, verify it with Stripe. If
                          something feels off, reach out or rebuild the order
                          right away.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

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
