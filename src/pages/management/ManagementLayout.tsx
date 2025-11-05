import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  ShoppingCart,
  Target,
  Users,
  CreditCard,
} from "lucide-react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContextProvider";
import { theme } from "../../theme/muiTheme";
import { User } from "@/api/user.api";

// Layout container for all management pages with responsive sidebar
const ManagementLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen w-full bg-gray-50 font-primary">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
          >
            <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="Management Dashboard" width={32} height={32} />
                <span className="text-sm font-medium text-gray-700">
                  {user && user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Dashboard
                </span>
              </Link>
              {/* Close button for mobile */}
              <button
                className="md:hidden p-1 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-2 flex flex-col h-[calc(100vh-4rem)]">
              <div className="flex-1 space-y-2">
                <NavLink
                  to="/management"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-green text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Home size={18} />
                  </div>
                  Overview
                </NavLink>
                <NavLink
                  to="/management/general"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-green text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  General
                </NavLink>
                {/* Only show Subscriptions for ADMIN role */}
                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/management/subscriptions"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-brand-green text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    Subscriptions
                  </NavLink>
                )}
                <NavLink
                  to="/management/marketplace"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-green text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <ShoppingCart size={18} />
                  </div>
                  Marketplace
                </NavLink>
                <NavLink
                  to="/management/programmes"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-green text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                  Programmes
                </NavLink>
                {/* Only show User Management for ADMIN role */}
                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/management/users"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-brand-green text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    User Management
                  </NavLink>
                )}
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col min-w-0 md:ml-64">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {user.firstName} {user.lastName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ManagementLayout;