import React, { useMemo, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  type NavItem = {
    to: string;
    label: string;
    icon: React.ElementType;
    roles?: Array<User["role"]>;
    end?: boolean;
  };

  const navItems: NavItem[] = useMemo(
    () => [
      { to: "/management", label: "Overview", icon: Home, end: true },
      { to: "/management/general", label: "General", icon: Settings },
      {
        to: "/management/subscriptions",
        label: "Subscriptions",
        icon: CreditCard,
        roles: ["ADMIN"],
      },
      {
        to: "/management/marketplace",
        label: "Marketplace",
        icon: ShoppingCart,
      },
      { to: "/management/programmes", label: "Programmes", icon: Target },
      {
        to: "/management/users",
        label: "User Management",
        icon: Users,
        roles: ["ADMIN"],
      },
    ],
    []
  );

  const availableNavItems = useMemo(
    () =>
      navItems.filter(
        (item) => !item.roles || (user?.role && item.roles.includes(user.role))
      ),
    [navItems, user?.role]
  );

  const getNavLinkClasses = (isActive: boolean) =>
    [
      "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
      isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-4",
      "py-3",
      isActive
        ? "bg-brand-green text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    ].join(" ");

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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:transition-[width]
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
          ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}
        `}
          >
            <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
              <Link
                to="/"
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : "gap-2"
                }`}
              >
                <img
                  src={Logo}
                  alt="Management Dashboard"
                  width={32}
                  height={32}
                />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium text-gray-700">
                    {user &&
                      user.role.charAt(0).toUpperCase() +
                        user.role.slice(1).toLowerCase()}{" "}
                    Dashboard
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100"
                  onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                  aria-label={
                    isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </button>
                {/* Close button for mobile */}
                <button
                  className="md:hidden p-1 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2 flex flex-col h-[calc(100vh-4rem)]">
              <div className="flex-1 space-y-2">
                {availableNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => getNavLinkClasses(isActive)}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main
            className={`flex-1 flex flex-col min-w-0 ${
              isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
            } transition-[margin] duration-300`}
          >
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <h1
                  className="text-lg font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
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
