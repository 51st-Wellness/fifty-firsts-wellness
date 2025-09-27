import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/images/logo.png";

// Layout container for all admin pages with responsive sidebar
const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-50">
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
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
        >
          <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="Admin Dashboard" width={32} height={32} />
              <span className="text-sm font-medium text-gray-700">
                Admin Dashboard
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
          <nav className="p-3 space-y-1">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Overview
            </NavLink>
            <NavLink
              to="/admin/general"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              General
            </NavLink>
            <NavLink
              to="/admin/marketplace"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Marketplace
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Admin Console</span>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
