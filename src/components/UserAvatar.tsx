import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContextProvider";

interface UserAvatarProps {
  className?: string;
}

// User avatar component with dropdown menu functionality
export function UserAvatar({ className = "" }: UserAvatarProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout action
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Not authenticated - show login/signup buttons
  if (!isAuthenticated || !user) {
    return (
      <div className={`flex gap-4 ${className}`}>
        <Link to="/login">
          <button className="text-brand-green font-medium hover:text-brand-green-dark transition-colors duration-300 px-4 py-2 text-sm">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-brand-green text-white hover:bg-brand-green-dark transition-colors duration-300 px-5 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg">
            Sign Up
          </button>
        </Link>
      </div>
    );
  }

  // Check if profile is incomplete
  const requiredFields = ["firstName", "lastName", "phone", "city", "address"];
  const isProfileIncomplete = requiredFields.some(
    (field) => !user[field as keyof typeof user]
  );

  return (
    <div className="relative flex items-center h-min" ref={dropdownRef}>
      {/* Unified Container with Rounded Border */}
      <div className="flex items-center bg-gray-50/80 hover:bg-gray-100/90 rounded-full border border-gray-200/50 shadow-sm transition-all duration-200 p-1">
        {/* Profile Picture with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative hover:opacity-80 focus:outline-none"
          >
            <div className="relative">
              <div className="bg-brand-green/20 p-1.5 rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="rounded-full object-cover w-[30px] h-[30px]"
                  />
                ) : (
                  <UserCircle className="w-[30px] h-[30px] text-brand-green" />
                )}
              </div>
              {isProfileIncomplete && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  !
                </div>
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="rounded-full object-cover w-[40px] h-[40px]"
                    />
                  ) : (
                    <UserCircle className="w-[40px] h-[40px] text-brand-green" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Profile</span>
                  {isProfileIncomplete && (
                    <span className="ml-auto text-yellow-500 text-xs font-medium">
                      Incomplete
                    </span>
                  )}
                </button>

                <Link
                  to="/orders"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span>My Orders</span>
                </Link>

                {(user.role === "ADMIN" || user.role === "admin") && (
                  <Link
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Name Area with Profile Link (Desktop only) */}
        <button
          onClick={handleProfileClick}
          className="hidden md:block pl-3 pr-4 py-1 hover:bg-gray-200/50 rounded-r-full transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                {user.firstName}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 group-hover:text-gray-600">
                  view profile
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 group-hover:text-gray-500 transition-transform group-hover:translate-x-0.5"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
