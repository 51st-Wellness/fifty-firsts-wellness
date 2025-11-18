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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-brand-green animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center p-6 sm:p-8">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h1
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Payment Verification Failed
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {error || "Unable to verify your payment. Please contact support."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
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
  // Get delivery details from order's delivery address
  const deliveryDetails = paymentDetails.orders?.[0]?.deliveryAddress
    ? {
        recipientName: paymentDetails.orders[0].deliveryAddress.recipientName,
        contactPhone: paymentDetails.orders[0].deliveryAddress.contactPhone,
        addressLine1: paymentDetails.orders[0].deliveryAddress.addressLine1,
        postTown: paymentDetails.orders[0].deliveryAddress.postTown,
        postcode: paymentDetails.orders[0].deliveryAddress.postcode,
        deliveryInstructions:
          paymentDetails.orders[0].deliveryAddress.deliveryInstructions,
      }
    : null;
  const formatCurrency = (amount: number, currencyCode: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);

  // Ensure we have valid payment status
  if (paymentDetails.status !== "PAID") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center p-6 sm:p-8">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
          <h1
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Payment Status: {paymentDetails.status}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Your payment is currently {paymentDetails.status.toLowerCase()}.
            {paymentDetails.status === "PENDING" &&
              " Please wait while we process your payment."}
            {paymentDetails.status === "FAILED" &&
              " Please try again or contact support."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-24 text-brand-green" />
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-brand-green/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-5 text-brand-green" />
              </div>
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Payment Successful!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {isSubscription
              ? "Welcome to your wellness journey! Your subscription is now active."
              : "Thank you for your purchase! Your order has been confirmed."}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Payment Details Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              {isSubscription ? (
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-brand-purple" />
              ) : (
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
              )}
              <h2
                className="text-xl sm:text-2xl font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {isSubscription ? "Subscription Details" : "Order Details"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Payment Info */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Payment ID
                  </span>
                  <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                    {paymentDetails.paymentId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {paymentDetails.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Amount
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formatCurrency(
                      paymentDetails.amount,
                      paymentDetails.currency
                    )}
                  </span>
                </div>
              </div>

              {/* Subscription/Order Specific Info */}
              <div className="space-y-3 sm:space-y-4">
                {isSubscription && paymentDetails.subscriptions?.[0] && (
                  <>
                    <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Plan
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        {paymentDetails.metadata.planName || "Wellness Plan"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Start Date
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900">
                        {new Date(
                          paymentDetails.subscriptions[0].startDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-600">
                        End Date
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900">
                        {new Date(
                          paymentDetails.subscriptions[0].endDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}

                {isStoreCheckout && paymentDetails.orders?.[0] && (
                  <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Order ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentDetails.orders[0].id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isStoreCheckout && resolvedOrderItems.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Order Items
                </h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {resolvedOrderItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.name}`}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-3 sm:p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Unit:{" "}
                          {formatCurrency(
                            item.unitPrice,
                            paymentDetails.currency
                          )}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
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
              <div className="mt-6 sm:mt-8">
                <h3
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Delivery Information
                </h3>
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Recipient
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {deliveryDetails.recipientName || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Contact Phone
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {deliveryDetails.contactPhone || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:p-4 md:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Address Line 1
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {deliveryDetails.addressLine1 || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Post town
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {deliveryDetails.postTown || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Postcode</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                      {deliveryDetails.postcode || "Not provided"}
                    </p>
                  </div>
                  {deliveryDetails.deliveryInstructions && (
                    <div className="rounded-xl bg-gray-50 p-3 sm:p-4 md:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Delivery Instructions
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {deliveryDetails.deliveryInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 sm:mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              What's Next?
            </h2>

            {isSubscription ? (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-brand-purple/5 rounded-xl border border-brand-purple/20">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-brand-purple mb-3 sm:mb-4" />
                  <h3
                    className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Access Your Programs
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Explore your personalized wellness programs and start your
                    journey.
                  </p>
                  <Link
                    to="/programmes"
                    className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple-dark text-sm font-semibold"
                  >
                    View Programs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-4 sm:p-6 bg-brand-green/5 rounded-xl border border-brand-green/20">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green mb-3 sm:mb-4" />
                  <h3
                    className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Manage Subscription
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    View your subscription details and manage your account.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm font-semibold"
                  >
                    Go to Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-brand-green/5 rounded-xl border border-brand-green/20">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green mb-3 sm:mb-4" />
                  <h3
                    className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Order Confirmation
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    You'll receive an email confirmation with your order details
                    shortly.
                  </p>
                </div>
                <div className="p-4 sm:p-6 bg-brand-green/5 rounded-xl border border-brand-green/20">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green mb-3 sm:mb-4" />
                  <h3
                    className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Continue Shopping
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Discover more wellness products in our marketplace.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm font-semibold"
                  >
                    Browse Marketplace <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200 text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Need help or have questions about your{" "}
                {isSubscription ? "subscription" : "order"}?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
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
