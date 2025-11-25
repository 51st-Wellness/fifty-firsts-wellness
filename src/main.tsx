import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContextProvider";
import { CartProvider } from "./context/CartContext";
import { GlobalDiscountProvider } from "./context/GlobalDiscountContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <GlobalDiscountProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </GlobalDiscountProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
