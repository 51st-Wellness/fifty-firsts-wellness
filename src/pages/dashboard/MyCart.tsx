import React from "react";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const MyCart: React.FC = () => {
  const { items, totalPrice, updateCartItem, removeFromCart, isLoading } =
    useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);

  // Navigates to the checkout experience.
  const handleCheckoutRedirect = () => {
    navigate("/checkout");
  };

  const hasPreOrderItem = items.some(
    (ci) => ci.product.storeItem?.preOrderEnabled
  );

  if (items.length === 0) {
    return (
      <div className="rounded-lg">
        <div className="border-b border-gray-200 mb-6">
          <h2
            className="text-2xl font-semibold text-gray-900 mb-6"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            My Cart
          </h2>
        </div>

        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3
            className="text-lg font-medium text-gray-900 mb-1"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Your cart is empty
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Browse the marketplace to add products.
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-6 py-3 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-green-dark"
          >
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200 mb-6">
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          My Cart
        </h2>
      </div>

      {/* Info banner for preorder rules */}
      {hasPreOrderItem && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">Pre-order items are delivered separately</p>
          <p>
            Your cart currently contains a pre-order item. You&apos;ll need to{" "}
            <span className="font-medium">checkout this item on its own</span> before adding other
            products, as it will ship once it becomes available.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((ci) => {
          const storeItem = ci.product.storeItem;
          const category = storeItem?.categories?.[0] || "Uncategorized";

          return (
            <div
              key={ci.id}
              className="bg-white rounded-xl p-4 flex items-start gap-4 relative"
            >
              {/* Image left */}
              <img
                src={storeItem?.display?.url || storeItem?.images?.[0] || ""}
                alt={storeItem?.name || "Item"}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
              />

              {/* Top right of image: product name, category below */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 line-clamp-1">
                  {storeItem?.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Category: {category}
                </div>

                {/* Bottom right of image: quantity controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      updateCartItem(ci.productId, Math.max(1, ci.quantity - 1))
                    }
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {ci.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItem(ci.productId, ci.quantity + 1)
                    }
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Top right of card: price */}
              <div className="absolute top-4 right-4">
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(storeItem?.price ?? 0)}
                </div>
              </div>

              {/* Bottom right of card: delete icon */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => removeFromCart(ci.productId)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary at bottom */}
      {items.length > 0 && (
        <div className="mt-8 bg-white rounded-xl p-6">
          <h3
            className="text-lg font-semibold text-gray-900 mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Cart Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">
                Item's total ({items.length}):
              </span>
              <span className="font-semibold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-500 pb-3 border-b border-gray-200">
              Delivery fees not included yet.
            </p>
            <button
              className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 px-6 rounded-full mt-4"
              disabled={isLoading}
              onClick={handleCheckoutRedirect}
            >
              Checkout ({formatPrice(totalPrice)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;
