import React from "react";
import { ShoppingCart } from "lucide-react";
import { IconButton, Badge } from "@mui/material";
import { useCart } from "../context/CartContext";
import CartSlider from "./CartSlider";

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className = "" }) => {
  const { totalItems, isCartOpen, toggleCart, closeCart } = useCart();

  return (
    <>
      <IconButton
        onClick={toggleCart}
        edge="start"
        color="inherit"
        aria-label={`Shopping cart with ${totalItems} items`}
        size="large"
        className={className}
      >
        <Badge badgeContent={totalItems} color="error" max={99}>
          <ShoppingCart className="w-6 h-6 text-gray-700" />
        </Badge>
      </IconButton>

      {/* Cart Slider */}
      <CartSlider isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default CartIcon;
