import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Package,
  ChevronDown,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MyAccount from "./MyAccount";
import OrdersHistory from "./OrdersHistory";
import MyCart from "./MyCart";
import DeliveryAddresses from "./DeliveryAddresses";
import { useAuth } from "../../context/AuthContextProvider";
import { getDeliveryAddresses } from "../../api/user.api";

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [hasDeliveryAddress, setHasDeliveryAddress] = useState<boolean | null>(null);
  const { isAuthenticated } = useAuth();

  // Check for delivery addresses
  useEffect(() => {
    const checkDeliveryAddresses = async () => {
      if (!isAuthenticated) {
        setHasDeliveryAddress(null);
        return;
      }
      try {
        const response = await getDeliveryAddresses();
        if (response?.data?.addresses && response.data.addresses.length > 0) {
          setHasDeliveryAddress(true);
        } else {
          setHasDeliveryAddress(false);
        }
      } catch (error) {
        console.error("Failed to check delivery addresses:", error);
        setHasDeliveryAddress(false);
      }
    };
    checkDeliveryAddresses();
  }, [isAuthenticated]);

  const menuItems = [
    {
      label: "My Account",
      path: "/dashboard",
      icon: User,
      component: <MyAccount />,
    },
    {
      label: "Orders History",
      path: "/dashboard/orders",
      icon: Package,
      component: <OrdersHistory />,
    },
    {
      label: "Delivery Addresses",
      path: "/dashboard/addresses",
      icon: MapPin,
      component: <DeliveryAddresses />,
    },
    {
      label: "My Cart",
      path: "/dashboard/cart",
      icon: ShoppingBag,
      component: <MyCart />,
    },
  ];

  const toggleItem = (path: string) => {
    setExpandedItem(expandedItem === path ? null : path);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Accordion Sidebar */}
            <aside className="lg:hidden">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="space-y-0">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isExpanded = expandedItem === item.path;

                    return (
                      <div key={item.path}>
                        <button
                          onClick={() => toggleItem(item.path)}
                          className={`w-full relative flex items-center justify-between gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                            isExpanded
                              ? "bg-white text-gray-900"
                              : "bg-white text-gray-900 hover:bg-gray-50"
                          }`}
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          {isExpanded && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green"></div>
                          )}
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            {item.path === "/dashboard/addresses" && hasDeliveryAddress === false && (
                              <span className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "max-h-[9999px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-4 pt-6 pb-4 bg-gray-50">
                            {item.component}
                          </div>
                        </div>
                        {index < menuItems.length - 1 && (
                          <div className="h-px bg-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-gray-50 text-gray-900 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-green"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.path === "/dashboard/addresses" && hasDeliveryAddress === false && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content - Desktop */}
            <main className="hidden lg:block flex-1 bg-gray-50 rounded-lg p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
