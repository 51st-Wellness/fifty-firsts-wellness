import React from "react";
import { ShoppingBag, Minus, Plus, Trash2, Info, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const MyCart: React.FC = () => {
  const {
    activeItems,
    activeTab,
    setActiveTab,
    standardItems,
    preorderItems,
    totalPrice,
    updateCartItem,
    removeFromCart,
    isLoading
  } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);

  const handleCheckoutRedirect = () => {
    navigate("/checkout", { state: { cartType: activeTab } });
  };

  // Pre-order shipping logic (matching slider)
  const PREORDER_SHIPPING_FEE = 4.19;
  const estimatedPreorderShipping = preorderItems.reduce((acc, item) => acc + (PREORDER_SHIPPING_FEE * item.quantity), 0);

  const totalItemCount = activeItems.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { id: "standard", label: `Standard (${standardItems.length})` },
    { id: "preorder", label: `Pre-orders (${preorderItems.length})` },
  ] as const;

  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200 mb-6">
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          My Cart
        </h2>

        {/* Pill-styled Tabs like OrdersHistory */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                ? "text-brand-green border border-brand-green bg-brand-green/5"
                : "text-gray-600 border border-transparent hover:bg-gray-50"
                }`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "preorder" && preorderItems.length > 0 && (
        <div className="mb-6 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800 flex gap-3">
          <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p
              className="font-semibold mb-1"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Pre-order Fulfillment Notice
            </p>
            <p className="text-xs sm:text-sm">
              These products ship as they become available. To ensure timely delivery,
              each item is handled as a separate shipment with its own shipping fee.
            </p>
          </div>
        </div>
      )}

      {activeItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3
            className="text-lg font-medium text-gray-900 mb-1"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Your {activeTab === "standard" ? "standard" : "pre-order"} cart is empty
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Browse the marketplace to add products.
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-6 py-3 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-green-dark"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {activeItems.map((ci) => {
              const storeItem = ci.product.storeItem;
              const category = storeItem?.categories?.[0] || "Uncategorized";

              return (
                <div
                  key={ci.id}
                  className="bg-white rounded-xl p-4 flex items-start gap-4 relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={storeItem?.display?.url || storeItem?.images?.[0] || ""}
                    alt={storeItem?.name || "Item"}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0 border border-gray-100"
                  />

                  <div className="flex-1 min-w-0 pr-24">
                    <div
                      className="font-semibold text-gray-900 line-clamp-2 text-base"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {storeItem?.name}
                    </div>
                    <div className="text-xs text-brand-green font-medium mt-1 inline-block bg-brand-green/5 px-2 py-0.5 rounded">
                      {category}
                    </div>
                    {activeTab === "preorder" && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-600 font-medium uppercase tracking-tighter">
                        <Package className="w-3 h-3" />
                        Ships individually
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => updateCartItem(ci.productId, Math.max(1, ci.quantity - 1), activeTab)}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50 text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(ci.productId, ci.quantity + 1, activeTab)}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50 text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(storeItem?.price ?? 0)}
                    </div>
                    {activeTab === "preorder" && (
                      <div className="text-[10px] text-gray-400 mt-1">
                        + {formatPrice(PREORDER_SHIPPING_FEE)} shipping
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => removeFromCart(ci.productId, activeTab)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3
              className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              <ShoppingBag className="w-5 h-5 text-brand-green" />
              Cart Summary
            </h3>
            <div className="space-y-4 max-w-md ml-auto">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Items total ({totalItemCount})</span>
                <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                <span className="text-gray-500">
                  Shipping {activeTab === "preorder" ? `(${totalItemCount} items × ${formatPrice(PREORDER_SHIPPING_FEE)})` : "Fees"}
                </span>
                <span className="font-semibold text-gray-900">
                  {activeTab === "preorder" ? formatPrice(estimatedPreorderShipping) : "Calculated next"}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                  Total:
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-brand-green" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                    {formatPrice(activeTab === "preorder" ? totalPrice + estimatedPreorderShipping : totalPrice)}
                  </span>
                  {activeTab === "standard" && (
                    <p className="text-[10px] text-gray-400 font-medium">Excluded delivery fees</p>
                  )}
                </div>
              </div>

              <button
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-6 rounded-full mt-6 shadow-lg shadow-brand-green/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
                onClick={handleCheckoutRedirect}
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;

