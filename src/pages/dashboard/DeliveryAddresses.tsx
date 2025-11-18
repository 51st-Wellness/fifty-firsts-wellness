import React, { useState, useEffect } from "react";
import { Loader, MapPin, Edit3, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getDeliveryAddresses,
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  type DeliveryAddress,
  type CreateDeliveryAddressPayload,
  type UpdateDeliveryAddressPayload,
} from "../../api/user.api";

const DeliveryAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: "",
    contactPhone: "",
    addressLine1: "",
    postTown: "",
    postcode: "",
    deliveryInstructions: "",
    isDefault: false,
  });

  // Load delivery addresses
  useEffect(() => {
    loadAddresses();
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
      !addressForm.recipientName ||
      !addressForm.contactPhone ||
      !addressForm.addressLine1 ||
      !addressForm.postTown ||
      !addressForm.postcode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload: CreateDeliveryAddressPayload = {
        recipientName: addressForm.recipientName,
        contactPhone: addressForm.contactPhone,
        addressLine1: addressForm.addressLine1,
        postTown: addressForm.postTown,
        postcode: addressForm.postcode,
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
      recipientName: address.recipientName,
      contactPhone: address.contactPhone,
      addressLine1: address.addressLine1,
      postTown: address.postTown,
      postcode: address.postcode,
      deliveryInstructions: address.deliveryInstructions || "",
      isDefault: address.isDefault,
    });
    setShowAddAddress(true);
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;

    if (
      !addressForm.recipientName ||
      !addressForm.contactPhone ||
      !addressForm.addressLine1 ||
      !addressForm.postTown ||
      !addressForm.postcode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload: UpdateDeliveryAddressPayload = {
        recipientName: addressForm.recipientName,
        contactPhone: addressForm.contactPhone,
        addressLine1: addressForm.addressLine1,
        postTown: addressForm.postTown,
        postcode: addressForm.postcode,
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
      recipientName: "",
      contactPhone: "",
      addressLine1: "",
      postTown: "",
      postcode: "",
      deliveryInstructions: "",
      isDefault: false,
    });
    setEditingAddressId(null);
  };

  const cancelAddressForm = () => {
    setShowAddAddress(false);
    resetAddressForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
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

      <div className="space-y-6">
        {/* Add/Edit Address Form */}
        {showAddAddress && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={addressForm.recipientName}
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
                  Address Line 1 *
                </label>
                <textarea
                  name="addressLine1"
                  value={addressForm.addressLine1}
                  onChange={handleAddressFormChange}
                  rows={2}
                  className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Post Town *
                  </label>
                  <input
                    type="text"
                    name="postTown"
                    value={addressForm.postTown}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    placeholder="Town / City"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={addressForm.postcode}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-lg px-4 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20 uppercase"
                    placeholder="e.g. SW1A 1AA"
                  />
                </div>
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
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium">No delivery addresses yet</p>
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
                      <h4 className="text-sm font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                        {address.recipientName}
                      </h4>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 ml-6">
                      <p>{address.contactPhone}</p>
                      <p>{address.addressLine1}</p>
                      <p>{address.postTown}</p>
                      <p>{address.postcode}</p>
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
  );
};

export default DeliveryAddresses;
