import React from "react";
import { Loader2, ShoppingBag, Package, Plus, Minus } from "lucide-react";
import type {
  CartCheckoutSummary,
  CartCheckoutSummaryItem,
  ShippingService,
} from "../../api/payment.api";
import type { CartItemWithRelations } from "../../context/CartContext";

interface CheckoutOrderSummaryProps {
  summary: CartCheckoutSummary | null;
  items: CartItemWithRelations[];
  orderTotals: {
    itemCount: number;
    baseSubtotal: number;
    productDiscountTotal: number;
    globalDiscountTotal: number;
    totalDiscount: number;
    grandTotal: number;
  };
  globalDiscountInfo?: {
    isActive: boolean;
    applied?: boolean;
  } | null;
  hasPreOrders: boolean;
  isInitialLoading: boolean;
  error: string | null;
  showRefreshOverlay: boolean;
  updatingProductId: string | null;
  submitting: boolean;
  cartLoading: boolean;
  isRefreshingSummary: boolean;
  selectedShippingKey: string | null;
  selectedShipping: ShippingService | null;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onShippingChange: (shippingKey: string) => void;
  formatCurrency: (amount: number, currencyCode?: string) => string;
}

const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  summary,
  items,
  orderTotals,
  globalDiscountInfo,
  hasPreOrders,
  isInitialLoading,
  error,
  showRefreshOverlay,
  updatingProductId,
  submitting,
  cartLoading,
  isRefreshingSummary,
  selectedShippingKey,
  selectedShipping,
  onQuantityChange,
  onRemove,
  onShippingChange,
  formatCurrency,
}) => {
  return (
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

      {hasPreOrders && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
          <p className="font-semibold">
            Pre-order items included — we'll notify you once they're ready to
            ship.
          </p>
        </div>
      )}

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
                  item.baseUnitPrice && item.baseUnitPrice > item.unitPrice;
                const showBaseLine =
                  item.baseLineTotal && item.baseLineTotal > item.lineTotal;
                const itemDueNow = item.lineTotal;
                const isPreOrderItem = Boolean(item.isPreOrder);

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
                        {isPreOrderItem && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 mt-0.5">
                            <Package className="w-3 h-3" />
                            Pre-order
                          </span>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Unit price:{" "}
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.unitPrice)}
                          </span>
                          {showBaseUnit && (
                            <span className="ml-1 line-through text-gray-400">
                              {formatCurrency(item.baseUnitPrice!)}
                            </span>
                          )}
                        </p>
                        {item.discount?.isActive &&
                          item.discount.totalAmount > 0 && (
                            <p className="text-[11px] text-emerald-600 mt-0.5">
                              -{formatCurrency(item.discount.totalAmount)} savings
                              (
                              {item.discount.type === "PERCENTAGE"
                                ? `${item.discount.value}%`
                                : "instant"}
                              )
                            </p>
                          )}
                        {isPreOrderItem && (
                          <p className="text-[11px] text-amber-600 mt-0.5">
                            Charged today{" "}
                            <strong className="text-amber-700">
                              {formatCurrency(itemDueNow)}
                            </strong>
                          </p>
                        )}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                          <div className="inline-flex items-center rounded-full border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                onQuantityChange(item.productId, quantity - 1)
                              }
                              className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                              disabled={disableControls || quantity <= 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 text-sm font-semibold text-gray-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onQuantityChange(item.productId, quantity + 1)
                              }
                              className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                              disabled={disableControls}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.productId)}
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
                        {formatCurrency(item.lineTotal)}
                      </p>
                      {showBaseLine && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatCurrency(item.baseLineTotal!)}
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
                <span>{formatCurrency(orderTotals.baseSubtotal)}</span>
              </div>

              {orderTotals.productDiscountTotal > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Total product savings</span>
                  <span>
                    - {formatCurrency(orderTotals.productDiscountTotal)}
                  </span>
                </div>
              )}
              {orderTotals.globalDiscountTotal > 0 &&
                globalDiscountInfo?.applied && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Global discount</span>
                    <span>
                      - {formatCurrency(orderTotals.globalDiscountTotal)}
                    </span>
                  </div>
                )}

              {/* Shipping Options */}
              {summary?.shipping?.availableServices &&
                summary.shipping.availableServices.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <h4
                      className="text-sm font-semibold text-gray-900"
                      style={{
                        fontFamily: '"League Spartan", sans-serif',
                      }}
                    >
                      Shipping Method
                    </h4>
                    <div className="space-y-2">
                      {summary.shipping.availableServices.map((service) => (
                        <label
                          key={service.key}
                          className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedShippingKey === service.key
                              ? "border-brand-green bg-brand-green/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingService"
                            value={service.key}
                            checked={selectedShippingKey === service.key}
                            onChange={(e) => onShippingChange(e.target.value)}
                            className="mt-0.5 h-4 w-4 text-brand-green focus:ring-brand-green"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {service.label}
                                  {service.isDefault && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-green/10 text-brand-green">
                                      Recommended
                                    </span>
                                  )}
                                </p>
                                {service.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {service.description}
                                  </p>
                                )}
                                {service.estimatedDays && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Estimated: {service.estimatedDays}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex justify-between text-gray-700 pt-2">
                <span>Shipping</span>
                <span className="font-medium">
                  {selectedShipping
                    ? formatCurrency(selectedShipping.price)
                    : formatCurrency(0)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Total due today
                </span>
                <span className="text-xl sm:text-2xl font-bold text-brand-green">
                  {formatCurrency(orderTotals.grandTotal)}
                </span>
              </div>
              {orderTotals.totalDiscount > 0 && (
                <p className="text-[11px] text-gray-500">
                  You save {formatCurrency(orderTotals.totalDiscount)} with
                  applied discounts.
                </p>
              )}
              {hasPreOrders && (
                <p className="text-[11px] text-amber-600">
                  Includes pre-order items — we'll notify you before they ship.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutOrderSummary;

