import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMyOrder, type OrderDetail } from "../../api/user.api";
import { useCart } from "../../context/CartContext";
import { cartAPI } from "../../api/cart.api";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
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
      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data?.order
      ) {
        setOrder(response.data.order);
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

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
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
          !(
            (addResponse.status === "SUCCESS" ||
              addResponse.status === "success") &&
            addResponse.data
          )
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
            {order.status}
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
            order.payment?.currency || "USD"
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
              {formatCurrency(itemsTotal, order.payment?.currency || "USD")}
            </span>
            {shipping > 0 && (
              <>
                <span className="text-gray-600">Shipping</span>
                <span className="text-right text-gray-900">
                  {formatCurrency(shipping, order.payment?.currency || "USD")}
                </span>
              </>
            )}
            {discount > 0 && (
              <>
                <span className="text-gray-600">Discount</span>
                <span className="text-right text-gray-900">
                  -{formatCurrency(discount, order.payment?.currency || "USD")}
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
              {formatCurrency(total, order.payment?.currency || "USD")}
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
    </div>
  );
};

export default OrderDetails;
