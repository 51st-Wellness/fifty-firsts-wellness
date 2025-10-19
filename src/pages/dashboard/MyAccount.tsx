import React, { useState } from "react";
import { useAuth } from "../../context/AuthContextProvider";
import { Camera, Loader, Mail, Lock, MapPin, Phone, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const MyAccount: React.FC = () => {
  const { user, updateProfile, updateProfilePicture, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });
  const [uploading, setUploading] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600">Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-green/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand-green">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-brand-green text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-brand-green-dark transition-colors">
                <Camera className="w-4 h-4" />
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
                  <Loader className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-brand-green text-white">
                  Change Image
                </button>
                <button className="px-4 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Remove Image
                </button>
              </div>
              <p className="text-sm text-gray-500">
                We support PNGs, JPEGs under 10MB
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="Margaret"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="Davis"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-brand-green text-white rounded-lg font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Change Email
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <p className="text-sm text-gray-600">••••••••••••••</p>
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit Information
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Delivery Address */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
              <p className="text-sm text-gray-900">
                {user.address || "12, New town, off agung road"}
              </p>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Country</p>
              <p className="text-sm text-gray-900">{user.city || "Lagos"}</p>
            </div>
          </div>

          {/* City */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">City</p>
              <p className="text-sm text-gray-900">{user.city || "Lekki"}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-3 py-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Phone Number</p>
              <p className="text-sm text-gray-900">{user.phone || "+234 9043280943"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Logout all devices */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Logout of all devices
              </p>
              <p className="text-xs text-gray-500">
                Logout of all other active sessions on other devices besides this one.
              </p>
            </div>
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Logout
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Delete my account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete my account
              </p>
            </div>
            <button className="px-4 py-1.5 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

