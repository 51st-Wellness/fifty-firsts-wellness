import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  ShoppingBag,
  ArrowLeft,
  MapPinned,
  Phone,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "../context/AuthContextProvider";
import { useCart } from "../context/CartContext";
import {
  paymentAPI,
  CartCheckoutSummary,
  CartCheckoutPayload,
} from "../api/payment.api";
import { getDeliveryAddresses, type DeliveryAddress } from "../api/user.api";
import toast from "react-hot-toast";

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

  const hasCartItems = items.length > 0;

  // Format helper for currency display
  const formatCurrency = (amount: number, currencyCode: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);

  const orderTotals = useMemo(() => {
    const fallbackCurrency = summary?.currency || "USD";
    if (!summary) {
      return {
        subtotal: 0,
        baseSubtotal: 0,
        productDiscountTotal: 0,
        globalDiscountTotal: 0,
        totalDiscount: 0,
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

    return {
      subtotal,
      baseSubtotal,
      productDiscountTotal,
      globalDiscountTotal,
      totalDiscount,
      currency: summary.pricing?.currency || fallbackCurrency,
      itemCount: summaryBreakdown?.itemCount || items.length,
      totalQuantity: summaryBreakdown?.totalQuantity || items.length,
    };
  }, [summary, items.length]);
  const currencyCode = summary?.pricing?.currency || summary?.currency || "USD";
  const discountSummary = summary?.discounts;
  const globalDiscountInfo =
    summary?.globalDiscount || discountSummary?.globalDiscount;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    }
  }, [isAuthenticated, navigate]);

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

        if (
          (response.status === "SUCCESS" || response.status === "success") &&
          response.data
        ) {
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
                (addressesResponse.status === "SUCCESS" ||
                  addressesResponse.status === "success") &&
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

  const isInitialLoading = loading && !summary;
  const showRefreshOverlay =
    !isInitialLoading && (cartLoading || isRefreshingSummary);

  if (!hasCartItems && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
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

        {globalDiscountInfo && (
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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Order Summary
                </h2>
              </div>

              {isInitialLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-7 h-7 text-brand-green animate-spin" />
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700">
                  <p className="font-semibold mb-1.5">We hit a snag</p>
                  <p className="text-sm sm:text-base mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="relative">
                  {showRefreshOverlay && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                      <Loader2 className="w-6 h-6 text-brand-green animate-spin" />
                    </div>
                  )}

                  <div
                    className={`space-y-4 ${
                      showRefreshOverlay ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {summary?.orderItems?.map((item) => {
                        const cartItem = items.find(
                          (cart) => cart.productId === item.productId
                        );
                        const quantity = cartItem?.quantity ?? item.quantity;
                        const disableControls =
                          updatingProductId === item.productId ||
                          submitting ||
                          cartLoading ||
                          isRefreshingSummary;
                        const showBaseUnit =
                          item.baseUnitPrice &&
                          item.baseUnitPrice > item.unitPrice;
                        const showBaseLine =
                          item.baseLineTotal &&
                          item.baseLineTotal > item.lineTotal;

                        return (
                          <div
                            key={item.productId}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center rounded-2xl border border-gray-100 p-3 sm:p-4"
                          >
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                              {item.image?.url && (
                                <img
                                  src={item.image.url}
                                  alt={item.name}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Unit price:{" "}
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(
                                      item.unitPrice,
                                      currencyCode
                                    )}
                                  </span>
                                  {showBaseUnit && (
                                    <span className="ml-1 line-through text-gray-400">
                                      {formatCurrency(
                                        item.baseUnitPrice!,
                                        currencyCode
                                      )}
                                    </span>
                                  )}
                                </p>
                                {item.discount?.isActive &&
                                  item.discount.totalAmount > 0 && (
                                    <p className="text-[11px] text-emerald-600 mt-0.5">
                                      -
                                      {formatCurrency(
                                        item.discount.totalAmount,
                                        currencyCode
                                      )}{" "}
                                      savings (
                                      {item.discount.type === "PERCENTAGE"
                                        ? `${item.discount.value}%`
                                        : "instant"}
                                      )
                                    </p>
                                  )}
                                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                                  <div className="inline-flex items-center rounded-full border border-gray-200">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.productId,
                                          quantity - 1
                                        )
                                      }
                                      className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                                      disabled={
                                        disableControls || quantity <= 0
                                      }
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 text-sm font-semibold text-gray-900">
                                      {quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.productId,
                                          quantity + 1
                                        )
                                      }
                                      className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                                      disabled={disableControls}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(item.productId)}
                                    className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
                                    disabled={disableControls}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="text-left sm:text-right sm:flex-shrink-0">
                              <p className="text-sm sm:text-base font-semibold text-gray-900">
                                {formatCurrency(item.lineTotal, currencyCode)}
                              </p>
                              {showBaseLine && (
                                <p className="text-xs text-gray-400 line-through">
                                  {formatCurrency(
                                    item.baseLineTotal!,
                                    currencyCode
                                  )}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                ({quantity} item{quantity > 1 ? "s" : ""})
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-5 space-y-2.5 sm:space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({orderTotals.itemCount})</span>
                        <span>
                          {formatCurrency(
                            orderTotals.baseSubtotal ?? orderTotals.subtotal,
                            currencyCode
                          )}
                        </span>
                      </div>
                      {orderTotals.productDiscountTotal > 0 && (
                        <div className="flex justify-between text-rose-600">
                          <span>Product savings</span>
                          <span>
                            -{" "}
                            {formatCurrency(
                              orderTotals.productDiscountTotal,
                              currencyCode
                            )}
                          </span>
                        </div>
                      )}
                      {orderTotals.globalDiscountTotal > 0 && (
                        <div className="flex justify-between text-rose-600">
                          <span>Global discount</span>
                          <span>
                            -{" "}
                            {formatCurrency(
                              orderTotals.globalDiscountTotal,
                              currencyCode
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span className="text-xs sm:text-sm">
                          Calculated at dispatch
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          Total due
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-brand-green">
                          {formatCurrency(orderTotals.subtotal, currencyCode)}
                        </span>
                      </div>
                      {orderTotals.totalDiscount > 0 && (
                        <p className="text-[11px] text-gray-500">
                          You save{" "}
                          {formatCurrency(
                            orderTotals.totalDiscount,
                            currencyCode
                          )}{" "}
                          with applied discounts.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {summary && (
            <section className="order-2 lg:order-2 lg:col-start-2 lg:col-end-3">
              {deliveryDetailsCard(summary, formatCurrency)}
            </section>
          )}

          <section className="order-3 lg:order-3 lg:col-start-1 lg:col-end-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3 mb-5">
                <MapPinned className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                <h2
                  className="text-xl sm:text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Delivery Information
                </h2>
              </div>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {addresses.length > 0 && !useCustomAddress && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-medium text-gray-700 mb-2 sm:text-sm">
                      Select Delivery Address
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === address.id &&
                            !useCustomAddress
                              ? "border-brand-green bg-brand-green/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryAddress"
                            value={address.id}
                            checked={
                              selectedAddressId === address.id &&
                              !useCustomAddress
                            }
                            onChange={() => {
                              setSelectedAddressId(address.id);
                              setUseCustomAddress(false);
                            }}
                            className="mt-0.5 w-4 h-4 border-gray-300 focus:ring-brand-green accent-brand-green"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {address.recipientName}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-green/10 text-brand-green">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] sm:text-xs text-gray-600 space-y-0.5">
                              <p>{address.contactPhone}</p>
                              <p>{address.addressLine1}</p>
                              <p>{address.postTown}</p>
                              <p>{address.postcode}</p>
                              {address.deliveryInstructions && (
                                <p className="text-gray-500 italic">
                                  Note: {address.deliveryInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {addresses.length === 0 && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    You have not saved any delivery addresses yet. Provide the
                    details below to continue.
                  </p>
                )}

                {addresses.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleCustomAddress}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                        useCustomAddress
                          ? "border-brand-green bg-brand-green/5 text-brand-green"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      } w-full sm:w-auto justify-center`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {useCustomAddress
                          ? "Back to saved addresses"
                          : "Add new delivery address"}
                      </span>
                    </button>
                  </div>
                )}

                {(useCustomAddress || addresses.length === 0) && (
                  <div className="space-y-3.5 pt-4 border-t border-gray-200">
                    <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Recipient name *
                        </label>
                        <input
                          type="text"
                          value={formData.recipientName}
                          onChange={handleChange("recipientName")}
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                          placeholder="Who should receive the order?"
                          required={useCustomAddress}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Contact phone *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={handleChange("contactPhone")}
                            className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                            placeholder="Phone number"
                            required={useCustomAddress}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Address line 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={handleChange("addressLine1")}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                        placeholder="Building, street, apartment"
                        required={useCustomAddress}
                      />
                    </div>

                    <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Post town *
                        </label>
                        <input
                          type="text"
                          value={formData.postTown}
                          onChange={handleChange("postTown")}
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                          placeholder="City / Town"
                          required={useCustomAddress}
                        />
                      </div>
                      <div>
                        {/* // TODO: Integrate Royal Mail / AddressNow API search here for auto-suggest. */}
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          value={formData.postcode}
                          onChange={handleChange("postcode")}
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                          placeholder="e.g. SW1A 1AA"
                          required={useCustomAddress}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Delivery instructions (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryInstructions}
                        onChange={handleChange("deliveryInstructions")}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                        placeholder="Gate code, drop-off guidance, etc."
                      />
                    </div>

                    {addresses.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green accent-brand-green"
                        />
                        <label
                          htmlFor="saveAddress"
                          className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                        >
                          Save this address for future orders
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/dashboard/cart"
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Review cart
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || isInitialLoading || cartLoading}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-brand-green text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
  formatCurrency: (amount: number, currencyCode: string) => string
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
            {formatCurrency(summary.totalAmount, summary.currency)}
          </span>
        </li>
      </ul>
      <p className="mt-3 text-[11px] sm:text-xs text-gray-500">
        Delivery fees are calculated separately based on your location and the
        weight of the items.
      </p>
    </div>
  );
};

export default Checkout;
