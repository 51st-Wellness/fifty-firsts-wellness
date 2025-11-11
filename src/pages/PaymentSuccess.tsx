import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
  ShoppingBag,
  Crown,
} from "lucide-react";
import { paymentAPI } from "../api/payment.api";
import { PaymentDetails, PaymentStatusResponse } from "../types/payment";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setError("Payment ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await paymentAPI.getPaymentStatus(paymentId);
        setPaymentDetails(response.data);
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setError(err.response?.data?.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Unable to verify your payment. Please contact support."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const isSubscription = paymentDetails.metadata?.type === "subscription";
  const isStoreCheckout = paymentDetails.metadata?.type === "store_checkout";
  const resolvedOrderItems = paymentDetails.metadata?.orderItems?.length
    ? paymentDetails.metadata.orderItems
    : paymentDetails.orders?.flatMap((order) =>
        (order.items ?? []).map((item) => ({
          productId: item.productId,
          name: item.storeItemName ?? "Store item",
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: item.price * item.quantity,
        }))
      ) ?? [];
  const deliveryDetails = paymentDetails.metadata?.deliveryDetails;
  const formatCurrency = (amount: number, currencyCode: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);

  // Ensure we have valid payment status
  if (paymentDetails.status !== "PAID") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Status: {paymentDetails.status}
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment is currently {paymentDetails.status.toLowerCase()}.
            {paymentDetails.status === "PENDING" &&
              " Please wait while we process your payment."}
            {paymentDetails.status === "FAILED" &&
              " Please try again or contact support."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="py-16 px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isSubscription
              ? "Welcome to your wellness journey! Your subscription is now active."
              : "Thank you for your purchase! Your order has been confirmed."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              {isSubscription ? (
                <Crown className="w-6 h-6 text-purple-600" />
              ) : (
                <Package className="w-6 h-6 text-blue-600" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {isSubscription ? "Subscription Details" : "Order Details"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Payment Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {paymentDetails.paymentId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {paymentDetails.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${paymentDetails.amount.toFixed(2)}{" "}
                    {paymentDetails.currency}
                  </span>
                </div>
              </div>

              {/* Subscription/Order Specific Info */}
              <div className="space-y-4">
                {isSubscription && paymentDetails.subscriptions?.[0] && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold text-gray-900">
                        {paymentDetails.metadata.planName || "Wellness Plan"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Start Date</span>
                      <span className="text-gray-900">
                        {new Date(
                          paymentDetails.subscriptions[0].startDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">End Date</span>
                      <span className="text-gray-900">
                        {new Date(
                          paymentDetails.subscriptions[0].endDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}

                {isStoreCheckout && paymentDetails.orders?.[0] && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentDetails.orders[0].id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isStoreCheckout && resolvedOrderItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {resolvedOrderItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.name}`}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Unit:{" "}
                          {formatCurrency(
                            item.unitPrice,
                            paymentDetails.currency
                          )}
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {formatCurrency(
                            item.lineTotal,
                            paymentDetails.currency
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isStoreCheckout && deliveryDetails && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Contact Name</p>
                    <p className="text-base font-semibold text-gray-900">
                      {deliveryDetails.contactName || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="text-base font-semibold text-gray-900">
                      {deliveryDetails.contactPhone || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-base font-semibold text-gray-900">
                      {deliveryDetails.deliveryAddress || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-base font-semibold text-gray-900">
                      {deliveryDetails.deliveryCity || "Not provided"}
                    </p>
                  </div>
                  {deliveryDetails.deliveryInstructions && (
                    <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                      <p className="text-sm text-gray-500">
                        Delivery Instructions
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {deliveryDetails.deliveryInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What's Next?
            </h2>

            {isSubscription ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-purple-50 rounded-xl">
                  <Crown className="w-8 h-8 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Access Your Programs
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Explore your personalized wellness programs and start your
                    journey.
                  </p>
                  <Link
                    to="/programmes"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View Programs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Manage Subscription
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View your subscription details and manage your account.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Go to Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-xl">
                  <Package className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Order Confirmation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You'll receive an email confirmation with your order details
                    shortly.
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Continue Shopping
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover more wellness products in our marketplace.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Browse Marketplace <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Need help or have questions about your{" "}
                {isSubscription ? "subscription" : "order"}?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
