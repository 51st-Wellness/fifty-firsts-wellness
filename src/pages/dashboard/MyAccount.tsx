import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContextProvider";
import { Camera, Loader, Mail, Lock, MapPin, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyAccount: React.FC = () => {
  const { user, updateProfile, updateProfilePicture, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatingFields, setUpdatingFields] = useState<Record<string, boolean>>(
    {}
  );

  // Helper function to check if any field is being updated
  const isAnyFieldUpdating = Object.values(updatingFields).some(Boolean);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update for individual fields
  const handleSave = async (field: string) => {
    setUpdatingFields((prev) => ({ ...prev, [field]: true }));
    const success = await updateProfile({
      [field]: formData[field as keyof typeof formData],
    });
    if (success) {
      setEditingField(null);
    }
    setUpdatingFields((prev) => ({ ...prev, [field]: false }));
  };

  // Handle forgot password redirect
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Handle logout all devices
  const handleLogoutAllDevices = async () => {
    if (window.confirm("Are you sure you want to logout from all devices?")) {
      await logout();
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const success = await updateProfilePicture(file);
    setUploading(false);

    if (!success) {
      // Reset file input
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* My Profile Section */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          My Profile
        </h2>

        <div className="flex items-start gap-6 mb-8 mt-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-green/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-brand-green">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 bg-brand-green text-white rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-brand-green-dark transition-colors">
              <Camera className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <label className="px-4 py-1.5 rounded-full text-xs font-medium text-white hover:opacity-90 bg-brand-green cursor-pointer">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              We support PNGs and JPEGs under 5MB
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              First Name
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={editingField !== "firstName"}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border ${
                    editingField === "firstName"
                      ? "border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      : "border-gray-200 bg-gray-50"
                  } ${updatingFields.firstName ? "pr-10" : ""}`}
                  placeholder="Enter your first name"
                />
                {updatingFields.firstName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 animate-spin text-brand-green" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingField === "firstName") {
                    handleSave("firstName");
                  } else {
                    setEditingField("firstName");
                  }
                }}
                disabled={
                  updatingFields.firstName ||
                  (isAnyFieldUpdating && editingField !== "firstName")
                }
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50"
              >
                {updatingFields.firstName ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "firstName" ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Last Name
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={editingField !== "lastName"}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border ${
                    editingField === "lastName"
                      ? "border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      : "border-gray-200 bg-gray-50"
                  } ${updatingFields.lastName ? "pr-10" : ""}`}
                  placeholder="Enter your last name"
                />
                {updatingFields.lastName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 animate-spin text-brand-green" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingField === "lastName") {
                    handleSave("lastName");
                  } else {
                    setEditingField("lastName");
                  }
                }}
                disabled={
                  updatingFields.lastName ||
                  (isAnyFieldUpdating && editingField !== "lastName")
                }
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50"
              >
                {updatingFields.lastName ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "lastName" ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Phone Number
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={editingField !== "phone"}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border ${
                    editingField === "phone"
                      ? "border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      : "border-gray-200 bg-gray-50"
                  } ${updatingFields.phone ? "pr-10" : ""}`}
                  placeholder="Enter your phone number"
                />
                {updatingFields.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 animate-spin text-brand-green" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingField === "phone") {
                    handleSave("phone");
                  } else {
                    setEditingField("phone");
                  }
                }}
                disabled={
                  updatingFields.phone ||
                  (isAnyFieldUpdating && editingField !== "phone")
                }
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50"
              >
                {updatingFields.phone ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "phone" ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Account Security
        </h2>

        <div className="space-y-6 mt-6">
          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Email</label>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md">
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-400 bg-gray-100 whitespace-nowrap">
                Cannot Change
              </span>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md">
                <input
                  type="password"
                  value="••••••••••••••"
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Shipping Information
        </h2>

        <div className="space-y-6 mt-6">
          {/* City */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">City</label>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  readOnly={editingField !== "city"}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border ${
                    editingField === "city"
                      ? "border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Enter your city"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingField === "city") {
                    handleSave("city");
                  } else {
                    setEditingField("city");
                  }
                }}
                disabled={
                  updatingFields.city ||
                  (isAnyFieldUpdating && editingField !== "city")
                }
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50"
              >
                {updatingFields.city ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "city" ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  readOnly={editingField !== "address"}
                  rows={3}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border resize-none ${
                    editingField === "address"
                      ? "border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Enter your full address"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingField === "address") {
                    handleSave("address");
                  } else {
                    setEditingField("address");
                  }
                }}
                disabled={
                  updatingFields.address ||
                  (isAnyFieldUpdating && editingField !== "address")
                }
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50 self-start"
              >
                {updatingFields.address ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "address" ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Account Actions
        </h2>

        <div className="space-y-6 mt-6">
          {/* Logout all devices */}
          <div className="flex items-start justify-between gap-4">
            <div className="w-full max-w-md">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Logout of all devices
              </p>
              <p className="text-xs text-gray-500">
                Logout of all other active sessions on other devices besides
                this one.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogoutAllDevices}
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white bg-white whitespace-nowrap flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
