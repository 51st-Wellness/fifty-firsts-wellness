import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

// Layout container for all admin pages with sidebar and header
const AdminLayout = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        <aside className="bg-white border-r border-gray-200">
          <div className="h-16 flex items-center px-4 border-b border-gray-100">
            <Link
              to="/admin/overview"
              className="text-xl font-semibold text-gray-900"
            >
              Admin
            </Link>
          </div>
          <nav className="p-3 space-y-1">
            <NavLink
              to="/admin/overview"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Overview
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
            >
              Marketplace
            </NavLink>
          </nav>
        </aside>

        <main className="flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Admin Console</span>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
