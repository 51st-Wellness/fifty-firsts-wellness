import React from "react";
import { MapPinned, Phone, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { DeliveryAddress } from "../../api/user.api";
import type { CartCheckoutPayload } from "../../api/payment.api";
import { useAddressNow } from "../../hooks/useAddressNow";

interface CheckoutAddressSelectorProps {
  addresses: DeliveryAddress[];
  selectedAddressId: string | null;
  useCustomAddress: boolean;
  saveAddress: boolean;
  formData: CartCheckoutPayload;
  submitting: boolean;
  isInitialLoading: boolean;
  cartLoading: boolean;
  onAddressSelect: (addressId: string) => void;
  onToggleCustomAddress: () => void;
  onFormChange: (
    field: keyof CartCheckoutPayload
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSaveAddressChange: (checked: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CheckoutAddressSelector: React.FC<CheckoutAddressSelectorProps> = ({
  addresses,
  selectedAddressId,
  useCustomAddress,
  saveAddress,
  formData,
  submitting,
  isInitialLoading,
  cartLoading,
  onAddressSelect,
  onToggleCustomAddress,
  onFormChange,
  onSaveAddressChange,
  onSubmit,
}) => {
  // Initialize AddressNow when custom address fields are shown
  // Note: AddressNow updates form fields directly via DOM, so we rely on React's
  // controlled inputs to sync the state. The hook is mainly for initialization.
  useAddressNow({
    enabled: useCustomAddress || addresses.length === 0,
    onAddressPopulate: (address) => {
      // AddressNow populates fields directly, but we trigger onChange to sync React state
      if (address.addressLine1) {
        const event = {
          target: { value: address.addressLine1 },
        } as React.ChangeEvent<HTMLInputElement>;
        onFormChange("addressLine1")(event);
      }
      if (address.postTown) {
        const event = {
          target: { value: address.postTown },
        } as React.ChangeEvent<HTMLInputElement>;
        onFormChange("postTown")(event);
      }
      if (address.postcode) {
        const event = {
          target: { value: address.postcode },
        } as React.ChangeEvent<HTMLInputElement>;
        onFormChange("postcode")(event);
      }
    },
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-7">
      <div className="flex items-center gap-3 mb-5">
        <MapPinned className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
        <h2
          className="text-xl sm:text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Delivery Information
        </h2>
      </div>

      <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
        {addresses.length > 0 && !useCustomAddress && (
          <div className="space-y-2.5">
            <label className="block text-xs font-medium text-gray-700 mb-2 sm:text-sm">
              Select Delivery Address
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddressId === address.id && !useCustomAddress
                      ? "border-brand-green bg-brand-green/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id && !useCustomAddress}
                    onChange={() => onAddressSelect(address.id)}
                    className="mt-0.5 w-4 h-4 border-gray-300 focus:ring-brand-green accent-brand-green"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {address.recipientName}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-green/10 text-brand-green">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-600 space-y-0.5">
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
                </label>
              ))}
            </div>
          </div>
        )}

        {addresses.length === 0 && (
          <p className="text-xs sm:text-sm text-gray-500">
            You have not saved any delivery addresses yet. Provide the details
            below to continue.
          </p>
        )}

        {addresses.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={onToggleCustomAddress}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                useCustomAddress
                  ? "border-brand-green bg-brand-green/5 text-brand-green"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              } w-full sm:w-auto justify-center`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {useCustomAddress
                  ? "Back to saved addresses"
                  : "Add new delivery address"}
              </span>
            </button>
          </div>
        )}

        {(useCustomAddress || addresses.length === 0) && (
          <div className="space-y-3.5 pt-4 border-t border-gray-200">
            {/* AddressNow Search Input */}
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <label className="block text-xs sm:text-sm font-medium text-blue-900 mb-1">
                Find your address (Start typing here)
              </label>
              <input
                type="text"
                id="address-search"
                className="w-full rounded-xl border border-blue-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Start typing your address..."
              />
            </div>

            <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Recipient name *
                </label>
                <input
                  type="text"
                  value={formData.recipientName || ""}
                  onChange={onFormChange("recipientName")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="Who should receive the order?"
                  required={useCustomAddress}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Contact phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.contactPhone || ""}
                    onChange={onFormChange("contactPhone")}
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                    placeholder="Phone number"
                    required={useCustomAddress}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Address line 1 *
              </label>
              <input
                type="text"
                id="checkout-addressLine1"
                name="addressLine1"
                value={formData.addressLine1 || ""}
                onChange={onFormChange("addressLine1")}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                placeholder="Building, street, apartment"
                required={useCustomAddress}
              />
            </div>

            <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Post town *
                </label>
                <input
                  type="text"
                  id="checkout-postTown"
                  name="postTown"
                  value={formData.postTown || ""}
                  onChange={onFormChange("postTown")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="City / Town"
                  required={useCustomAddress}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="checkout-postcode"
                  name="postcode"
                  value={formData.postcode || ""}
                  onChange={onFormChange("postcode")}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. SW1A 1AA"
                  required={useCustomAddress}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Delivery instructions (optional)
              </label>
              <input
                type="text"
                value={formData.deliveryInstructions || ""}
                onChange={onFormChange("deliveryInstructions")}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                placeholder="Gate code, drop-off guidance, etc."
              />
            </div>

            {addresses.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => onSaveAddressChange(e.target.checked)}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green accent-brand-green"
                />
                <label
                  htmlFor="saveAddress"
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Save this address for future orders
                </label>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard/cart"
            className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Review cart
          </Link>
          <button
            type="submit"
            disabled={submitting || isInitialLoading || cartLoading}
            className="flex-1 inline-flex items-center justify-center rounded-full bg-brand-green text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirm & Continue to Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutAddressSelector;

