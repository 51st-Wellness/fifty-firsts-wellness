import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, UserCircle, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContextProvider";
import { getDeliveryAddresses } from "../api/user.api";
// import { UserRole } from "../types/user.types";
interface UserAvatarProps {
  className?: string;
}

// User avatar component with dropdown menu functionality
export function UserAvatar({ className = "" }: UserAvatarProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasDeliveryAddress, setHasDeliveryAddress] = useState<boolean | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Check for delivery addresses
  useEffect(() => {
    const checkDeliveryAddresses = async () => {
      if (!isAuthenticated || !user) {
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
  }, [isAuthenticated, user]);

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

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Not authenticated - show login button only
  if (!isAuthenticated || !user) {
    return (
      <div className={`flex gap-4 ${className}`}>
        <Link to="/login">
          <button className="bg-brand-green text-white hover:bg-brand-green-dark transition-colors duration-300 px-5 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg">
            Login
          </button>
        </Link>
      </div>
    );
  }

  // Check if profile is incomplete
  const requiredFields = ["firstName", "lastName", "phone"];
  const hasRequiredFields = requiredFields.every(
    (field) => {
      const value = user[field as keyof typeof user];
      return value && (typeof value !== "string" || value.trim() !== "");
    }
  );
  const isProfileIncomplete = !hasRequiredFields || hasDeliveryAddress === false;

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Unified Container with Rounded Border */}
      <div className="flex items-center bg-gray-50/80 hover:bg-gray-100/90 rounded-full border border-gray-200/50 shadow-sm transition-all duration-200 py-0.5 pl-0.5 pr-1">
        {/* Profile Picture with Dropdown */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative hover:opacity-80 focus:outline-none flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <div className="bg-brand-green/20 p-1 rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="rounded-full object-cover w-[24px] h-[24px]"
                  />
                ) : (
                  <UserCircle className="w-[24px] h-[24px] text-brand-green" />
                )}
              </div>
              {isProfileIncomplete && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  !
                </div>
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
                {user.role === "ADMIN" || user.role === "MODERATOR" ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="flex-1">User Dashboard</span>
                      {isProfileIncomplete && (
                        <span className="ml-auto text-orange-500 text-[9px] font-medium whitespace-nowrap">
                          Complete profile
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/management"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>Management Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-1">Dashboard</span>
                    {isProfileIncomplete && (
                      <span className="ml-auto text-orange-500 text-[9px] font-medium whitespace-nowrap">
                        Complete profile
                      </span>
                    )}
                  </Link>
                )}
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

        {/* Name Area with Profile/Dashboard Link (Desktop only) */}
        <button
          onClick={() => {
            setIsDropdownOpen(false);
            navigate(
              user.role === "ADMIN" || user.role === "MODERATOR"
                ? "/management"
                : "/dashboard"
            );
          }}
          className="hidden md:flex items-center pl-2 pr-3 hover:bg-gray-200/50 rounded-r-full transition-all duration-200 cursor-pointer group h-full"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-start justify-center py-0.5">
              <span className="text-xs font-medium text-gray-800 group-hover:text-gray-900 leading-tight">
                {user.firstName}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] text-gray-500 group-hover:text-gray-600 leading-tight">
                  {user.role === "ADMIN" || user.role === "MODERATOR"
                    ? "Management"
                    : "Dashboard"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
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
