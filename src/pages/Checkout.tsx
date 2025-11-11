import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  ShoppingBag,
  ArrowLeft,
  MapPinned,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContextProvider";
import { useCart } from "../context/CartContext";
import {
  paymentAPI,
  CartCheckoutSummary,
  CartCheckoutPayload,
} from "../api/payment.api";
import toast from "react-hot-toast";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, isLoading: cartLoading } = useCart();

  const [summary, setSummary] = useState<CartCheckoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CartCheckoutPayload>({
    contactName: "",
    contactPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryInstructions: "",
  });

  const hasCartItems = items.length > 0;

  // Format helper for currency display
  const formatCurrency = (amount: number, currencyCode: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);

  const orderTotals = useMemo(() => {
    if (!summary) {
      return {
        subtotal: 0,
        currency: "USD",
        itemCount: 0,
        totalQuantity: 0,
      };
    }
    return summary.summary;
  }, [summary]);
  const currencyCode = summary?.currency || "USD";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await paymentAPI.getCartCheckoutSummary();

        if (
          (response.status === "SUCCESS" || response.status === "success") &&
          response.data
        ) {
          setSummary(response.data);

          setFormData((prev) => ({
            ...prev,
            contactName:
              prev.contactName ||
              response.data.deliveryDefaults.contactName ||
              (user
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                : ""),
            contactPhone:
              prev.contactPhone ||
              response.data.deliveryDefaults.contactPhone ||
              user?.phone ||
              "",
            deliveryAddress:
              prev.deliveryAddress ||
              response.data.deliveryDefaults.deliveryAddress ||
              user?.address ||
              "",
            deliveryCity:
              prev.deliveryCity ||
              response.data.deliveryDefaults.deliveryCity ||
              user?.city ||
              "",
          }));
        } else {
          setError("Unable to load checkout summary. Please try again.");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "We could not prepare your checkout. Please review your cart.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [isAuthenticated, user]);

  const handleChange =
    (field: keyof CartCheckoutPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!summary) return;

    try {
      setSubmitting(true);
      setError(null);

      const sanitize = (value?: string) =>
        value && value.trim().length > 0 ? value.trim() : undefined;

      const payload: CartCheckoutPayload = {
        contactName: sanitize(formData.contactName),
        contactPhone: sanitize(formData.contactPhone),
        deliveryAddress: sanitize(formData.deliveryAddress),
        deliveryCity: sanitize(formData.deliveryCity),
        deliveryInstructions: sanitize(formData.deliveryInstructions),
      };

      const response = await paymentAPI.checkoutCart(payload);

      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data
      ) {
        toast.success("Redirecting you to securely complete payment");
        if (response.data.approvalUrl) {
          window.location.href = response.data.approvalUrl;
          return;
        }

        navigate(
          `/payment/success?paymentId=${response.data.paymentId}&status=${
            response.data.paymentId ? "PENDING" : "PAID"
          }`
        );
      } else {
        throw new Error(
          response.message || "Unable to initialize checkout. Please retry."
        );
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to initialize payment. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasCartItems && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl shadow-sm p-10">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some wellness products to your cart to start the checkout
            process.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Review & Confirm
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Confirm your order details and delivery information. You will be
            redirected to our secure payment partner to complete your purchase.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              {loading || cartLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
                </div>
              ) : error ? (
                <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-red-700">
                  <p className="font-semibold mb-2">We hit a snag</p>
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {summary?.orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 items-start rounded-2xl border border-gray-100 p-4"
                      >
                        {item.image?.url && (
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-500">
                            Unit price:{" "}
                            {formatCurrency(item.unitPrice, currencyCode)}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(item.lineTotal, currencyCode)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({orderTotals.itemCount})</span>
                      <span>
                        {formatCurrency(orderTotals.subtotal, currencyCode)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="text-sm">Calculated at dispatch</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total due
                      </span>
                      <span className="text-2xl font-bold text-brand-green">
                        {formatCurrency(orderTotals.subtotal, currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPinned className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Delivery Information
                </h2>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact name
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={handleChange("contactName")}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                      placeholder="Who should receive the order?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleChange("contactPhone")}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery address
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={handleChange("deliveryAddress")}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                    placeholder="Street, building, apartment"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryCity}
                      onChange={handleChange("deliveryCity")}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                      placeholder="City / Town"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery instructions (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryInstructions}
                      onChange={handleChange("deliveryInstructions")}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                      placeholder="Gate code, drop-off guidance, etc."
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/dashboard/cart"
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Review cart
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || loading || cartLoading}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-brand-green text-white px-6 py-3 font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Confirm & Continue to Payment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Need help?
              </h3>
              <p className="text-gray-600 mb-6">
                Have questions about delivery timelines or payment? Our support
                team is here for you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full rounded-full border border-brand-green text-brand-green px-4 py-3 font-semibold hover:bg-brand-green/10 transition-colors"
              >
                Contact support
              </Link>
            </div>

            {deliveryDetailsCard(summary, formatCurrency)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Render delivery defaults in a subtle card to reassure the user
const deliveryDetailsCard = (
  summary: CartCheckoutSummary | null,
  formatCurrency: (amount: number, currencyCode: string) => string
) => {
  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Checkout Insights
      </h3>
      <ul className="space-y-3 text-gray-600">
        <li>
          Total items:{" "}
          <span className="font-semibold text-gray-900">
            {summary.summary.itemCount}
          </span>
        </li>
        <li>
          Total quantity:{" "}
          <span className="font-semibold text-gray-900">
            {summary.summary.totalQuantity}
          </span>
        </li>
        <li>
          Cart total:{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(summary.totalAmount, summary.currency)}
          </span>
        </li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        Delivery fees are calculated separately based on your location and the
        weight of the items.
      </p>
    </div>
  );
};

export default Checkout;
