import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { User, ShoppingBag, Heart, Package } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      label: "My Account",
      path: "/dashboard",
      icon: User,
    },
    {
      label: "Orders History",
      path: "/dashboard/orders",
      icon: Package,
    },
    {
      label: "My Cart",
      path: "/dashboard/cart",
      icon: ShoppingBag,
    },
    {
      label: "Wishlist",
      path: "/dashboard/wishlist",
      icon: Heart,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
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

