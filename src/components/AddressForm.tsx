import React, { useState } from "react";
import useRoyalMailAddress from "../hooks/useRoyalMailAddress";

interface AddressFormProps {
  onValid?: (address: any) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onValid }) => {
  const [postcode, setPostcode] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const { validateAddress, loading, error } = useRoyalMailAddress();

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await validateAddress({ postcode, line1, city });
    if (result?.valid && onValid) onValid(result.address);
  };

  return (
    <form onSubmit={handleValidate} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Postcode (UK)</label>
        <input value={postcode} onChange={(e) => setPostcode(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Address line 1</label>
        <input value={line1} onChange={(e) => setLine1(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="px-6 py-2 rounded-full bg-brand-green text-white font-semibold">
        {loading ? "Validating…" : "Validate address"}
      </button>
    </form>
  );
};

export default AddressForm;


