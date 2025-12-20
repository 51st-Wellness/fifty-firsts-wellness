import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowLeft, MapPinned, Phone, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContextProvider";
import { useCart } from "../../context/CartContext";
import {
  paymentAPI,
  CartCheckoutSummary,
  CartCheckoutPayload,
} from "../../api/payment.api";
import { getDeliveryAddresses, type DeliveryAddress } from "../../api/user.api";
import toast from "react-hot-toast";
import { ResponseStatus } from "@/types/response.types";
import CheckoutEmptyState from "../../components/checkout/CheckoutEmptyState";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";
import CheckoutAddressSelector from "../../components/checkout/CheckoutAddressSelector";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    items,
    isLoading: cartLoading,
    updateCartItem,
    removeFromCart,
  } = useCart();

  const [summary, setSummary] = useState<CartCheckoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [previousAddressId, setPreviousAddressId] = useState<string | null>(
    null
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [recipientDefaults, setRecipientDefaults] = useState({
    recipientName: "",
    contactPhone: "",
  });
  const [formData, setFormData] = useState<CartCheckoutPayload>({
    recipientName: "",
    contactPhone: "",
    addressLine1: "",
    postTown: "",
    postcode: "",
    deliveryInstructions: "",
  });
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [selectedShippingKey, setSelectedShippingKey] = useState<string | null>(
    null
  );

  const hasCartItems = items.length > 0;
  const isSuccessStatus = (status?: string | null) =>
    typeof status === "string" && status.toUpperCase() === "SUCCESS";

  // Format helper for currency display - Always use GBP
  const formatCurrency = (amount: number, currencyCode?: string) => {
    // Always use GBP regardless of API response
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Get selected or default shipping service
  const selectedShipping = useMemo(() => {
    if (!summary?.shipping?.availableServices) return null;

    if (selectedShippingKey) {
      return summary.shipping.availableServices.find(
        (s) => s.key === selectedShippingKey
      );
    }

    // Auto-select default service
    const defaultService = summary.shipping.availableServices.find(
      (s) => s.isDefault
    );
    return defaultService || summary.shipping.availableServices[0];
  }, [summary, selectedShippingKey]);

  // Auto-select default shipping on load
  useEffect(() => {
    if (summary?.shipping?.availableServices && !selectedShippingKey) {
      const defaultService = summary.shipping.availableServices.find(
        (s) => s.isDefault
      );
      if (defaultService) {
        setSelectedShippingKey(defaultService.key);
      } else if (summary.shipping.availableServices.length > 0) {
        setSelectedShippingKey(summary.shipping.availableServices[0].key);
      }
    }
  }, [summary, selectedShippingKey]);

  const orderTotals = useMemo(() => {
    const fallbackCurrency = summary?.currency || "GBP";
    if (!summary) {
      return {
        subtotal: 0,
        baseSubtotal: 0,
        productDiscountTotal: 0,
        globalDiscountTotal: 0,
        totalDiscount: 0,
        shippingCost: 0,
        grandTotal: 0,
        currency: fallbackCurrency,
        itemCount: 0,
        totalQuantity: 0,
      };
    }
    const summaryBreakdown = summary.summary as CartCheckoutSummary["summary"];
    const baseSubtotal =
      summary.pricing?.baseSubtotal ||
      summaryBreakdown?.subtotalBeforeDiscounts ||
      summaryBreakdown?.subtotal ||
      0;
    const productDiscountTotal =
      summary.pricing?.productDiscountTotal ||
      summaryBreakdown?.productDiscountTotal ||
      0;
    const globalDiscountTotal =
      summary.pricing?.globalDiscountTotal ||
      summaryBreakdown?.globalDiscountTotal ||
      0;
    const totalDiscount =
      summary.pricing?.totalDiscount ||
      summaryBreakdown?.discountTotal ||
      productDiscountTotal + globalDiscountTotal;
    const subtotal =
      summary.pricing?.grandTotal || summaryBreakdown?.subtotal || 0;

    // Add shipping cost
    const shippingCost = selectedShipping?.price || 0;
    const grandTotal = subtotal + shippingCost;

    return {
      subtotal,
      baseSubtotal,
      productDiscountTotal,
      globalDiscountTotal,
      totalDiscount,
      shippingCost,
      grandTotal,
      currency: summary.pricing?.currency || fallbackCurrency,
      itemCount: summaryBreakdown?.itemCount || items.length,
      totalQuantity: summaryBreakdown?.totalQuantity || items.length,
    };
  }, [summary, items.length, selectedShipping]);
  // Always use GBP - force conversion regardless of API response
  const currencyCode = "GBP";
  const discountSummary = summary?.discounts;
  const globalDiscountInfo =
    summary?.globalDiscount || discountSummary?.globalDiscount;
  const hasPreOrders =
    summary?.orderItems?.some((orderItem) => orderItem.isPreOrder) ?? false;
  const totalDueToday = orderTotals.subtotal;

  const loadSummary = useCallback(
    async (options?: { showLoading?: boolean }) => {
      if (!isAuthenticated) return;
      const showLoading = options?.showLoading ?? true;

      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setIsRefreshingSummary(true);
        }
        setError(null);
        const response = await paymentAPI.getCartCheckoutSummary();

        if (isSuccessStatus(response.status) && response.data) {
          const summaryData = response.data;
          setSummary(summaryData);

          const prefillRecipientName =
            summaryData.deliveryDefaults?.recipientName ||
            (user
              ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
              : "");
          const prefillContactPhone =
            summaryData.deliveryDefaults?.contactPhone || user?.phone || "";
          const prefillAddressLine1 =
            summaryData.deliveryDefaults?.addressLine1 || "";
          const prefillPostTown = summaryData.deliveryDefaults?.postTown || "";
          const prefillPostcode = summaryData.deliveryDefaults?.postcode || "";

          setRecipientDefaults({
            recipientName: prefillRecipientName,
            contactPhone: prefillContactPhone,
          });
          setFormData((prev) => ({
            ...prev,
            recipientName: prev.recipientName || prefillRecipientName,
            contactPhone: prev.contactPhone || prefillContactPhone,
            addressLine1: prev.addressLine1 || prefillAddressLine1,
            postTown: prev.postTown || prefillPostTown,
            postcode: prev.postcode || prefillPostcode,
          }));

          const applyAddresses = (addressList: DeliveryAddress[]) => {
            setAddresses(addressList);
            setPreviousAddressId(null);

            if (addressList.length > 0) {
              const defaultAddress =
                addressList.find((address) => address.isDefault) ??
                addressList[0];
              setSelectedAddressId(defaultAddress.id);
              setUseCustomAddress(false);
              setSaveAddress(false);
            } else {
              setSelectedAddressId(null);
              setUseCustomAddress(true);
              setSaveAddress(true);
              setFormData((prev) => ({
                ...prev,
                recipientName: prev.recipientName || prefillRecipientName,
                contactPhone: prev.contactPhone || prefillContactPhone,
                addressLine1: prev.addressLine1 || prefillAddressLine1,
                postTown: prev.postTown || prefillPostTown,
                postcode: prev.postcode || prefillPostcode,
                deliveryInstructions: prev.deliveryInstructions || "",
              }));
            }
          };

          if (summaryData.deliveryAddresses?.length) {
            applyAddresses(summaryData.deliveryAddresses as DeliveryAddress[]);
          } else {
            try {
              const addressesResponse = await getDeliveryAddresses();
              if (
                isSuccessStatus(addressesResponse.status) &&
                addressesResponse.data?.addresses
              ) {
                applyAddresses(addressesResponse.data.addresses);
              } else {
                applyAddresses([]);
              }
            } catch (fetchError) {
              console.error("Failed to fetch delivery addresses:", fetchError);
              applyAddresses([]);
            }
          }
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
        if (showLoading) {
          setLoading(false);
        } else {
          setIsRefreshingSummary(false);
        }
      }
    },
    [isAuthenticated, user]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // AddressNow initialization is now handled in CheckoutAddressSelector component

  const handleChange =
    (field: keyof CartCheckoutPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleRemove = async (productId: string) => {
    try {
      setUpdatingProductId(productId);
      await removeFromCart(productId);
      await loadSummary({ showLoading: false });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    nextQuantity: number
  ) => {
    if (nextQuantity < 1) {
      await handleRemove(productId);
      return;
    }

    try {
      setUpdatingProductId(productId);
      await updateCartItem(productId, nextQuantity);
      await loadSummary({ showLoading: false });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleToggleCustomAddress = () => {
    if (useCustomAddress) {
      const fallbackAddress =
        (previousAddressId &&
          addresses.find((address) => address.id === previousAddressId)) ??
        addresses[0] ??
        null;

      setUseCustomAddress(false);
      setSaveAddress(false);
      if (fallbackAddress) {
        setSelectedAddressId(fallbackAddress.id);
      }
      setPreviousAddressId(null);
    } else {
      setPreviousAddressId(selectedAddressId);
      setSelectedAddressId(null);
      setUseCustomAddress(true);
      setSaveAddress(true);
      setFormData((prev) => ({
        ...prev,
        recipientName: prev.recipientName || recipientDefaults.recipientName,
        contactPhone: prev.contactPhone || recipientDefaults.contactPhone,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!summary) return;

    try {
      setSubmitting(true);
      setError(null);

      const sanitize = (value?: string) =>
        value && value.trim().length > 0 ? value.trim() : undefined;

      let payload: CartCheckoutPayload;

      if (useCustomAddress) {
        // Validate custom address fields
        if (
          !formData.recipientName ||
          !formData.contactPhone ||
          !formData.addressLine1 ||
          !formData.postTown ||
          !formData.postcode
        ) {
          toast.error("Please fill in all required delivery fields");
          setSubmitting(false);
          return;
        }

        payload = {
          recipientName: sanitize(formData.recipientName),
          contactPhone: sanitize(formData.contactPhone),
          addressLine1: sanitize(formData.addressLine1),
          postTown: sanitize(formData.postTown),
          postcode: sanitize(formData.postcode),
          deliveryInstructions: sanitize(formData.deliveryInstructions),
          saveAddress: saveAddress,
        };
      } else {
        // Use selected address
        if (!selectedAddressId) {
          toast.error("Please select a delivery address");
          setSubmitting(false);
          return;
        }

        payload = {
          deliveryAddressId: selectedAddressId,
        };
      }

      // Add selected shipping service
      if (selectedShippingKey) {
        payload.shippingServiceKey = selectedShippingKey;
      }

      const response = await paymentAPI.checkoutCart(payload);

      if (response.status === ResponseStatus.SUCCESS && response.data) {
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

  const isInitialLoading = loading && !summary;
  const showRefreshOverlay =
    !isInitialLoading && (cartLoading || isRefreshingSummary);

  if (!hasCartItems && !loading) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="mb-7 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Review & Confirm
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Confirm your order details and delivery information. You will be
            redirected to our secure payment partner to complete your purchase.
          </p>
        </div>

        {globalDiscountInfo?.isActive && (
          <div
            className={`mb-6 rounded-3xl border p-4 sm:p-5 ${
              globalDiscountInfo.applied
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">
              {globalDiscountInfo.label || "Storewide discount"}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              {globalDiscountInfo.applied
                ? `You just saved ${formatCurrency(
                    globalDiscountInfo.amountApplied || 0,
                    currencyCode
                  )} with this offer.`
                : `Spend at least ${
                    globalDiscountInfo.minOrderTotal
                      ? formatCurrency(
                          globalDiscountInfo.minOrderTotal,
                          currencyCode
                        )
                      : "the required amount"
                  } to unlock ${
                    globalDiscountInfo.type === "PERCENTAGE"
                      ? `${globalDiscountInfo.value}%`
                      : formatCurrency(
                          globalDiscountInfo.value || 0,
                          currencyCode
                        )
                  } off your total.`}
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1.6fr,1fr]">
          <section className="order-1 lg:order-1 lg:col-start-1 lg:col-end-2">
            <CheckoutOrderSummary
              summary={summary}
              items={items}
              orderTotals={orderTotals}
              globalDiscountInfo={globalDiscountInfo}
              hasPreOrders={hasPreOrders}
              isInitialLoading={isInitialLoading}
              error={error}
              showRefreshOverlay={showRefreshOverlay}
              updatingProductId={updatingProductId}
              submitting={submitting}
              cartLoading={cartLoading}
              isRefreshingSummary={isRefreshingSummary}
              selectedShippingKey={selectedShippingKey}
              selectedShipping={selectedShipping ?? null}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onShippingChange={setSelectedShippingKey}
              formatCurrency={formatCurrency}
            />
          </section>

          {summary && (
            <section className="order-2 lg:order-2 lg:col-start-2 lg:col-end-3">
              {deliveryDetailsCard(
                summary,
                formatCurrency,
                hasPreOrders,
                orderTotals.grandTotal
              )}
            </section>
          )}

          <section className="order-3 lg:order-3 lg:col-start-1 lg:col-end-2">
            <CheckoutAddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              useCustomAddress={useCustomAddress}
              saveAddress={saveAddress}
              formData={formData}
              submitting={submitting}
              isInitialLoading={isInitialLoading}
              cartLoading={cartLoading}
              onAddressSelect={(addressId) => {
                setSelectedAddressId(addressId);
                setUseCustomAddress(false);
              }}
              onToggleCustomAddress={handleToggleCustomAddress}
              onFormChange={handleChange}
              onSaveAddressChange={setSaveAddress}
              onSubmit={handleSubmit}
            />
          </section>

          <section className="order-4 lg:order-4 lg:col-start-2 lg:col-end-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <h3
                className="text-lg sm:text-xl font-semibold text-gray-900 mb-3"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Need help?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-5">
                Have questions about delivery timelines or payment? Our support
                team is here for you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full rounded-full border border-brand-green text-brand-green px-4 py-2.5 text-sm font-semibold hover:bg-brand-green/10 transition-colors"
              >
                Contact support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Render delivery defaults in a subtle card to reassure the user
const deliveryDetailsCard = (
  summary: CartCheckoutSummary | null,
  formatCurrency: (amount: number) => string,
  hasPreOrders?: boolean,
  grandTotal?: number
) => {
  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <h3
        className="text-lg sm:text-xl font-semibold text-gray-900 mb-3"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        Checkout Insights
      </h3>
      <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
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
            {formatCurrency(summary.totalAmount)}
          </span>
        </li>
        <li>
          Due today:{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(
              grandTotal ?? summary.totalAmount ?? summary.summary.subtotal
            )}
          </span>
        </li>
        {hasPreOrders && (
          <li>
            Includes pre-order items — we'll notify you as soon as they are
            ready to ship.
          </li>
        )}
      </ul>

      {/* Per-item discount breakdown */}
      {summary?.orderItems?.some(
        (item) =>
          item.discount?.isActive &&
          item.discount?.totalAmount &&
          item.discount.totalAmount > 0
      ) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p
            className="text-xs font-semibold text-gray-900 mb-2"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Item Discounts:
          </p>
          <ul className="space-y-1.5">
            {summary.orderItems
              .filter(
                (item) =>
                  item.discount?.isActive &&
                  item.discount?.totalAmount &&
                  item.discount.totalAmount > 0
              )
              .map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between text-xs text-rose-600"
                >
                  <span className="truncate pr-2">{item.name}</span>
                  <span className="flex-shrink-0">
                    -{formatCurrency(item.discount!.totalAmount)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
      {summary.shipping && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[11px] sm:text-xs text-gray-600 mb-1">
            <span className="font-semibold">Parcel weight:</span>{" "}
            {(summary.shipping.weight / 1000).toFixed(2)} kg
          </p>
          <p className="text-[11px] sm:text-xs text-gray-600">
            <span className="font-semibold">Package type:</span>{" "}
            {summary.shipping.packageFormat}
          </p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
