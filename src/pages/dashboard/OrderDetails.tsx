import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader, RefreshCcw, LifeBuoy, Package, ShieldCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getMyOrder,
  verifyOrderPayment,
  submitOrderToClickDrop,
  type OrderDetail,
} from "../../api/user.api";
import { useCart } from "../../context/CartContext";
import { cartAPI } from "../../api/cart.api";
import { ResponseStatus } from "@/types/response.types";
import SubmitReviewModal from "../../components/SubmitReviewModal";
import { checkUserReviewForOrderItem } from "../../api/review.api";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [submittingToClickDrop, setSubmittingToClickDrop] = useState(false);
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

  useEffect(() => {
    if (orderId) {
      void loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const response = await getMyOrder(orderId);
      if (response.status === ResponseStatus.SUCCESS && response.data?.order) {
        const orderData = response.data.order;
        setOrder(orderData);

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
        toast.error(response.message || "Failed to load order details");
        navigate("/dashboard/orders");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load order details"
      );
      navigate("/dashboard/orders");
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "DELIVERED":
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getStatusLabel = (status: string): string => {
    const upper = status.toUpperCase();
    if (upper === "PAID") return "Paid";
    if (upper === "PENDING") return "Pending";
    if (upper === "FAILED") return "Failed";
    if (upper === "CANCELLED") return "Cancelled";
    if (upper === "REFUNDED") return "Refunded";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleReorder = async () => {
    if (!order || !order.orderItems.length) {
      toast.error("Unable to reorder at this time.");
      return;
    }

    try {
      setReordering(true);
      for (const item of order.orderItems) {
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
    if (!orderId) return;
    navigate(`/contact?order=${orderId}`);
  };

  const handleVerifyPayment = async () => {
    if (!orderId) return;
    try {
      setVerifyingPayment(true);
      const response = await verifyOrderPayment(orderId);
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        if (response.data.updated) {
          toast.success(
            response.data.message || "Payment status verified and updated"
          );
          await loadOrder();
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

  const handleSubmitToClickDrop = async () => {
    if (!orderId) return;
    try {
      setSubmittingToClickDrop(true);
      const response = await submitOrderToClickDrop(orderId);
      if (response.status === ResponseStatus.SUCCESS) {
        toast.success(
          response.data?.message ||
            "Order submitted to Click & Drop successfully"
        );
        await loadOrder();
      } else {
        toast.error(
          response.message || "Failed to submit order to Click & Drop"
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit order to Click & Drop"
      );
    } finally {
      setSubmittingToClickDrop(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-brand-green" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm font-medium">Order not found</p>
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="mt-4 text-brand-green hover:text-brand-green-dark"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // Calculate totals
  const itemsTotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = order.payment?.amount
    ? order.payment.amount - itemsTotal
    : 0;
  const discount = 0; // This would come from order data if available
  const total = order.totalAmount;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/orders")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Orders</span>
      </button>

      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2
          className="text-2xl font-semibold text-gray-900"
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
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Items */}
      <div className="py-4 space-y-3">
        <p className="text-sm text-gray-600 mb-2">Items in your order</p>

        {order.orderItems.map((item) => {
          const productName =
            item.product?.storeItem?.name || "Product";
          const productImage =
            item.product?.storeItem?.display?.url ||
            item.product?.storeItem?.images?.[0] ||
            "";
          const category =
            item.product?.storeItem?.categories?.[0] || "Uncategorized";
          const itemPrice = formatCurrency(
            item.price,
            order.payment?.currency || "GBP"
          );

          return (
            <div key={item.id} className="bg-white rounded-xl p-4">
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
                  <div className="flex items-start justify-between">
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
                      <p className="text-xs text-gray-500 mt-1">
                        Category: {category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      {order.status === "PAID" &&
                        item.productId &&
                        item.product?.type === "STORE" && (
                          <div className="mt-2">
                            {(item.hasReviewed ??
                              reviewedOrderItems.has(item.id)) ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                Review submitted
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReviewClick(item)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                              >
                                Write a Review
                              </button>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Desktop: Price top right */}
                    <div className="hidden md:block ml-4">
                      <p
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {itemPrice}
                      </p>
                    </div>
                  </div>

                  {/* Desktop: Buy button bottom right */}
                  <div className="hidden md:flex justify-end mt-2">
                    <button
                      onClick={handleReorder}
                      disabled={reordering}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-green text-white hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {reordering ? "Adding..." : "Buy Again"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile: Price and Buy button at bottom */}
              <div className="flex items-center justify-between mt-4 md:hidden">
                <p
                  className="text-sm font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {itemPrice}
                </p>
                <button
                  onClick={handleReorder}
                  disabled={reordering}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-green text-white hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {reordering ? "Adding..." : "Buy Again"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="pb-6">
        <div className="bg-white rounded-xl">
          <div className="p-4 grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-600">
              Item's total ({order.orderItems.length})
            </span>
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
            {discount > 0 && (
              <>
                <span className="text-gray-600">Discount</span>
                <span className="text-right text-gray-900">
                  -{formatCurrency(discount, order.payment?.currency || "GBP")}
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
      </div>

      {/* Address */}
      {order.deliveryAddress && (
        <div className="pb-6">
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-2">Shipping Address</p>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.addressLine1}
            </p>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.postTown}, {order.deliveryAddress.postcode}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {order.deliveryAddress.contactPhone}
            </p>
            {order.deliveryAddress.recipientName && (
              <p className="text-sm font-medium text-gray-900 mt-2">
                {order.deliveryAddress.recipientName}
              </p>
            )}
            {order.deliveryAddress.deliveryInstructions && (
              <p className="text-xs text-gray-500 italic mt-2">
                Note: {order.deliveryAddress.deliveryInstructions}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment Info */}
      {order.payment && (
        <div className="pb-6">
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-2">Payment Information</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {order.payment.provider}
                </p>
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
              {order.payment.providerRef && (
                <div>
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="text-xs font-mono text-gray-700 mt-0.5 truncate">
                    {order.payment.providerRef}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Test button for Click & Drop submission */}
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <button
            type="button"
            onClick={handleSubmitToClickDrop}
            disabled={submittingToClickDrop}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-600 text-white px-4 py-2 text-sm font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {submittingToClickDrop ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Package className="w-4 h-4" />
            )}
            <span>Test: Submit to Click & Drop</span>
          </button>
          <p className="text-xs text-yellow-700 mt-2">
            TEST ONLY - This button will be removed in production
          </p>
        </div>

        {/* Pending Order Actions */}
        {order.status.toUpperCase() === "PENDING" && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={verifyingPayment}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-purple text-white px-4 py-2 text-sm font-semibold hover:bg-brand-purple-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green text-white px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              If payment seems stuck, verify it with Stripe. If something feels
              off, reach out or rebuild the order right away.
            </p>
          </div>
        )}

        {/* Order Again for non-pending orders */}
        {order.status.toUpperCase() !== "PENDING" && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <button
              type="button"
              onClick={handleReorder}
              disabled={reordering}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green text-white px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {reordering ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              <span>Order Again</span>
            </button>
          </div>
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

export default OrderDetails;
