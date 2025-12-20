import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  AlertCircle,
  Home,
  RefreshCw,
  Mail,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const PaymentError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const errorMessage =
    searchParams.get("message") ||
    "An unexpected error occurred during payment processing.";

  // Determine error type based on message
  const isServerError =
    errorMessage.toLowerCase().includes("server") ||
    errorMessage.toLowerCase().includes("down") ||
    errorMessage.toLowerCase().includes("unavailable");
  const isPaymentNotFound =
    errorMessage.toLowerCase().includes("payment not found") ||
    errorMessage.toLowerCase().includes("not found");
  const isNetworkError =
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("connection");

  const getErrorTitle = () => {
    if (isServerError) return "Service Temporarily Unavailable";
    if (isPaymentNotFound) return "Payment Not Found";
    if (isNetworkError) return "Connection Error";
    return "Payment Processing Error";
  };

  const getErrorDescription = () => {
    if (isServerError) {
      return "Our payment service is currently experiencing technical difficulties. Please try again in a few moments.";
    }
    if (isPaymentNotFound) {
      return "We couldn't locate your payment information. This may happen if the payment session expired or was interrupted.";
    }
    if (isNetworkError) {
      return "We're having trouble connecting to our payment service. Please check your internet connection and try again.";
    }
    return "We encountered an issue while processing your payment. Don't worry - no charges have been made to your account.";
  };

  const getSuggestedActions = () => {
    if (isServerError || isNetworkError) {
      return [
        {
          icon: <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />,
          title: "Try Again",
          description: "Wait a moment and retry your payment",
          action: "Retry Payment",
          link: "/checkout",
        },
        {
          icon: <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
          title: "Contact Support",
          description: "Get help from our support team",
          action: "Get Support",
          link: "/contact",
        },
      ];
    }
    return [
      {
        icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
        title: "Return to Checkout",
        description: "Start a new payment session",
        action: "Go to Checkout",
        link: "/checkout",
      },
      {
        icon: <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
        title: "Contact Support",
        description: "Our team can help resolve this issue",
        action: "Get Support",
        link: "/contact",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <AlertCircle className="w-16 h-16 sm:w-20 sm:h-24 text-red-500" />
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {getErrorTitle()}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4">
            {getErrorDescription()}
          </p>
          {errorMessage && (
            <div className="max-w-xl mx-auto mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs sm:text-sm text-red-700 font-medium">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Error Details Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <h2
                className="text-xl sm:text-2xl font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                What Happened?
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm sm:text-base text-gray-700">
                  {isServerError && (
                    <>
                      Our payment processing system is temporarily unavailable.
                      This is usually resolved quickly, and you can try again
                      shortly.
                    </>
                  )}
                  {isPaymentNotFound && (
                    <>
                      The payment session may have expired or was interrupted.
                      This can happen if you navigated away from the payment
                      page or if there was a timeout.
                    </>
                  )}
                  {isNetworkError && (
                    <>
                      There was a problem connecting to our payment service.
                      This could be due to network issues on your end or
                      temporary service interruptions.
                    </>
                  )}
                  {!isServerError && !isPaymentNotFound && !isNetworkError && (
                    <>
                      An unexpected error occurred while processing your
                      payment. This could be due to various reasons, but rest
                      assured that no charges have been made to your account.
                    </>
                  )}
                </p>
              </div>

              <div className="p-4 bg-brand-green/5 rounded-xl border border-brand-green/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3
                      className="text-sm sm:text-base font-semibold text-gray-900 mb-1"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      Your Payment is Safe
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      No charges have been made to your account. If you see a
                      pending transaction, it will be automatically reversed
                      within a few business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 sm:mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              What Can You Do?
            </h2>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {getSuggestedActions().map((action, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 bg-brand-green/5 rounded-xl border border-brand-green/20 hover:border-brand-green/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="bg-brand-green text-white p-2 rounded-lg">
                      {action.icon}
                    </div>
                    <h3
                      className="text-base sm:text-lg font-semibold text-gray-900"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Link
                    to={action.link}
                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm font-semibold transition-colors"
                  >
                    {action.action}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Need More Help?
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                    Check Your Payment Method
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Ensure your card has sufficient funds and is not expired.
                    Some banks may require additional verification.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <RefreshCw className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                    Clear Your Browser Cache
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Sometimes clearing your browser cache or trying a different
                    browser can resolve payment issues.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                    Contact Our Support Team
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Our support team is available to help you complete your
                    purchase. We're here to assist you every step of the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;




