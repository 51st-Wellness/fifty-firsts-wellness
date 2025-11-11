import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContextProvider";
import {
  Camera,
  Loader,
  Mail,
  Lock,
  MapPin,
  LogOut,
  Edit3,
  Key,
  Plus,
  Trash2,
  Check,
  X,
  Package,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getDeliveryAddresses,
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getMyOrders,
  type DeliveryAddress,
  type CreateDeliveryAddressPayload,
  type UpdateDeliveryAddressPayload,
  type Order,
} from "../../api/user.api";

const MyAccount: React.FC = () => {
  const { user, updateProfile, updateProfilePicture, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatingFields, setUpdatingFields] = useState<Record<string, boolean>>(
    {}
  );

  // Delivery Addresses state
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    contactName: "",
    contactPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryInstructions: "",
    isDefault: false,
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Helper function to check if any field is being updated
  const isAnyFieldUpdating = Object.values(updatingFields).some(Boolean);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Load delivery addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await getDeliveryAddresses();
      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data?.addresses
      ) {
        setAddresses(response.data.addresses);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getMyOrders();
      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data?.orders
      ) {
        setOrders(response.data.orders);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

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

  // Delivery Address handlers
  const handleAddressFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddAddress = async () => {
    if (
      !addressForm.contactName ||
      !addressForm.contactPhone ||
      !addressForm.deliveryAddress ||
      !addressForm.deliveryCity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload: CreateDeliveryAddressPayload = {
        contactName: addressForm.contactName,
        contactPhone: addressForm.contactPhone,
        deliveryAddress: addressForm.deliveryAddress,
        deliveryCity: addressForm.deliveryCity,
        deliveryInstructions: addressForm.deliveryInstructions || undefined,
        isDefault: addressForm.isDefault,
      };

      const response = await createDeliveryAddress(payload);
      if (response.status === "SUCCESS" || response.status === "success") {
        toast.success("Address added successfully");
        setShowAddAddress(false);
        resetAddressForm();
        loadAddresses();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    }
  };

  const handleEditAddress = (address: DeliveryAddress) => {
    setEditingAddressId(address.id);
    setAddressForm({
      contactName: address.contactName,
      contactPhone: address.contactPhone,
      deliveryAddress: address.deliveryAddress,
      deliveryCity: address.deliveryCity,
      deliveryInstructions: address.deliveryInstructions || "",
      isDefault: address.isDefault,
    });
    setShowAddAddress(true);
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;

    if (
      !addressForm.contactName ||
      !addressForm.contactPhone ||
      !addressForm.deliveryAddress ||
      !addressForm.deliveryCity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload: UpdateDeliveryAddressPayload = {
        contactName: addressForm.contactName,
        contactPhone: addressForm.contactPhone,
        deliveryAddress: addressForm.deliveryAddress,
        deliveryCity: addressForm.deliveryCity,
        deliveryInstructions: addressForm.deliveryInstructions || undefined,
        isDefault: addressForm.isDefault,
      };

      const response = await updateDeliveryAddress(editingAddressId, payload);
      if (response.status === "SUCCESS" || response.status === "success") {
        toast.success("Address updated successfully");
        setShowAddAddress(false);
        setEditingAddressId(null);
        resetAddressForm();
        loadAddresses();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await deleteDeliveryAddress(id);
      if (response.status === "SUCCESS" || response.status === "success") {
        toast.success("Address deleted successfully");
        loadAddresses();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      contactName: "",
      contactPhone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryInstructions: "",
      isDefault: false,
    });
    setEditingAddressId(null);
  };

  const cancelAddressForm = () => {
    setShowAddAddress(false);
    resetAddressForm();
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "REFUNDED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper function to format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
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
                  className={`w-full rounded-lg px-4 py-2 text-sm text-gray-900 border  ${
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
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50 sm:px-4 sm:py-1.5 sm:text-xs md:px-4 md:py-1.5 md:text-xs"
              >
                {updatingFields.firstName ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "firstName" ? (
                  <>
                    <span className="hidden sm:inline">Save</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Edit</span>
                    <Edit3 className="w-3 h-3 sm:hidden" />
                  </>
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
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50 sm:px-4 sm:py-1.5 sm:text-xs md:px-4 md:py-1.5 md:text-xs"
              >
                {updatingFields.lastName ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "lastName" ? (
                  <>
                    <span className="hidden sm:inline">Save</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Edit</span>
                    <Edit3 className="w-3 h-3 sm:hidden" />
                  </>
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
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap disabled:opacity-50 sm:px-4 sm:py-1.5 sm:text-xs md:px-4 md:py-1.5 md:text-xs"
              >
                {updatingFields.phone ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : editingField === "phone" ? (
                  <>
                    <span className="hidden sm:inline">Save</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Edit</span>
                    <Edit3 className="w-3 h-3 sm:hidden" />
                  </>
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
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#4444B3] text-[#4444B3] hover:bg-[#4444B3] hover:text-white transition-colors bg-white whitespace-nowrap sm:px-4 sm:py-1.5 sm:text-xs md:px-4 md:py-1.5 md:text-xs"
              >
                <span className="hidden sm:inline">Change Password</span>
                <Key className="w-3 h-3 sm:hidden" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Addresses Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <h2
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Delivery Addresses
          </h2>
          {!showAddAddress && (
            <button
              type="button"
              onClick={() => {
                resetAddressForm();
                setShowAddAddress(true);
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors bg-white"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Add Address</span>
            </button>
          )}
        </div>

        <div className="space-y-6 mt-6">
          {/* Add/Edit Address Form */}
          {showAddAddress && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={addressForm.contactName}
                      onChange={handleAddressFormChange}
                      className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={addressForm.contactPhone}
                      onChange={handleAddressFormChange}
                      className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Delivery Address *
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={addressForm.deliveryAddress}
                    onChange={handleAddressFormChange}
                    rows={2}
                    className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="deliveryCity"
                    value={addressForm.deliveryCity}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={addressForm.deliveryInstructions}
                    onChange={handleAddressFormChange}
                    rows={2}
                    className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                    placeholder="Any special delivery instructions"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressFormChange}
                    className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    Set as default address
                  </label>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={
                      editingAddressId ? handleUpdateAddress : handleAddAddress
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-brand-green text-white hover:bg-brand-green-dark transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    {editingAddressId ? "Update" : "Add"} Address
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddressForm}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses List */}
          {loadingAddresses ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 animate-spin text-brand-green" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No delivery addresses yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add an address to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-green/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          {address.contactName}
                        </h4>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 ml-6">
                        <p>{address.contactPhone}</p>
                        <p>{address.deliveryAddress}</p>
                        <p>{address.deliveryCity}</p>
                        {address.deliveryInstructions && (
                          <p className="text-gray-500 italic">
                            Note: {address.deliveryInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAddress(address)}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Edit address"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          My Orders
        </h2>

        <div className="space-y-4 mt-6">
          {loadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 animate-spin text-brand-green" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Your order history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-brand-green/50 transition-colors"
                >
                  {/* Order Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 ml-8">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">
                              {formatCurrency(
                                order.totalAmount,
                                order.payment?.currency || "USD"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {order.orderItems.length} item
                              {order.orderItems.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <button
                          type="button"
                          className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          {expandedOrderId === order.id ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Edit3 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {/* Order Items */}
                      <div className="p-4 space-y-3">
                        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                          Order Items
                        </h5>
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-3 border border-gray-200"
                          >
                            <div className="flex items-start gap-3">
                              {item.product?.storeItem?.display?.url && (
                                <img
                                  src={item.product.storeItem.display.url}
                                  alt={item.product.storeItem.name}
                                  className="w-16 h-16 object-cover rounded border border-gray-200"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h6 className="text-sm font-medium text-gray-900 truncate">
                                  {item.product?.storeItem?.name || "Product"}
                                </h6>
                                {item.product?.storeItem?.description && (
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {item.product.storeItem.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-600">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-xs font-medium text-gray-900">
                                    {formatCurrency(
                                      item.price,
                                      order.payment?.currency || "USD"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      {order.deliveryAddress && (
                        <div className="p-4 border-t border-gray-200">
                          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            Delivery Address
                          </h5>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              {order.deliveryAddress.contactName}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {order.deliveryAddress.contactPhone}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {order.deliveryAddress.deliveryAddress}
                            </p>
                            <p className="text-xs text-gray-600">
                              {order.deliveryAddress.deliveryCity}
                            </p>
                            {order.deliveryAddress.deliveryInstructions && (
                              <p className="text-xs text-gray-500 italic mt-2">
                                Note:{" "}
                                {order.deliveryAddress.deliveryInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment Information */}
                      {order.payment && (
                        <div className="p-4 border-t border-gray-200">
                          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            Payment Information
                          </h5>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Provider
                                </p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">
                                  {order.payment.provider}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5 ${getStatusColor(
                                    order.payment.status
                                  )}`}
                                >
                                  {order.payment.status}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">
                                  {formatCurrency(
                                    order.payment.amount,
                                    order.payment.currency
                                  )}
                                </p>
                              </div>
                              {order.payment.providerRef && (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Reference
                                  </p>
                                  <p className="text-xs font-mono text-gray-700 mt-0.5 truncate">
                                    {order.payment.providerRef}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            Total Amount
                          </span>
                          <span className="text-lg font-bold text-brand-green">
                            {formatCurrency(
                              order.totalAmount,
                              order.payment?.currency || "USD"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-white whitespace-nowrap flex items-center gap-2 sm:px-4 sm:py-1.5 sm:text-xs md:px-4 md:py-1.5 md:text-xs"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
