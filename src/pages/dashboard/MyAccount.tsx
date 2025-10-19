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
  const [editingField, setEditingField] = useState<string | null>(null);

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
    <div className="space-y-10">
      {/* My Profile Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200" style={{ fontFamily: '"League Spartan", sans-serif' }}>
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
              <button className="px-4 py-1.5 rounded-full text-xs font-medium text-white hover:opacity-90 bg-brand-green">
                Change Image
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white bg-white">
                Remove Image
              </button>
            </div>
            <p className="text-xs text-gray-500">
              We support PNGs and JPEGs under 10MB
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                First Name
              </label>
              <div className="flex items-center justify-between gap-4">
                <div className="w-full max-w-md">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    readOnly={editingField !== 'firstName'}
                    className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none"
                    placeholder="Margaret"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField(editingField === 'firstName' ? null : 'firstName')}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap"
                >
                  {editingField === 'firstName' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Last Name
              </label>
              <div className="flex items-center justify-between gap-4">
                <div className="w-full max-w-md">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    readOnly={editingField !== 'lastName'}
                    className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none"
                    placeholder="Davis"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField(editingField === 'lastName' ? null : 'lastName')}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap"
                >
                  {editingField === 'lastName' ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Account Security Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200" style={{ fontFamily: '"League Spartan", sans-serif' }}>
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
                  className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap"
              >
                Change Email
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Password</label>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-md">
                <input
                  type="password"
                  value="••••••••••••••"
                  readOnly
                  className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Shipping Information
          </h2>
          <button 
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white"
          >
            Edit Information
          </button>
        </div>
        
        <div className="space-y-6 mt-6">
          {/* Delivery Address */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Delivery Address</label>
            </div>
            <div className="w-full max-w-md">
              <p className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900">
                {user.address || "12, New town, off agung road"}
              </p>
            </div>
          </div>

          {/* Region */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Region</label>
            </div>
            <div className="w-full max-w-md">
              <p className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900">
                {user.city || "Lagos"}
              </p>
            </div>
          </div>

          {/* City */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">City</label>
            </div>
            <div className="w-full max-w-md">
              <p className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900">
                {user.city || "Lekki"}
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
            </div>
            <div className="w-full max-w-md">
              <p className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-900">
                {user.phone || "+234 9043280943"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200" style={{ fontFamily: '"League Spartan", sans-serif' }}>
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
                Logout of all other active sessions on other devices besides this one.
              </p>
            </div>
            <button 
              type="button"
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white bg-white whitespace-nowrap"
            >
              Logout
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-start justify-between gap-4">
            <div className="w-full max-w-md">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Delete my account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete my account
              </p>
            </div>
            <button 
              type="button"
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50 bg-white whitespace-nowrap"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

