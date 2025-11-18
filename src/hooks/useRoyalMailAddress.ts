import { useState } from "react";

type AddressInput = {
  postcode: string;
  addressLine1: string;
  postTown: string;
};

export default function useRoyalMailAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAddress = async (input: AddressInput) => {
    try {
      setLoading(true);
      setError(null);
      // Placeholder for backend validation call
      await new Promise((r) => setTimeout(r, 500));
      if (
        !/^([A-Z]{1,2}\d[\dA-Z]? ?\d[ABD-HJLNP-UW-Z]{2})$/i.test(input.postcode)
      ) {
        setError("Enter a valid UK postcode");
        return { valid: false } as const;
      }
      return { valid: true, address: input } as const;
    } catch (e: any) {
      setError(e?.message || "Address validation failed");
      return { valid: false } as const;
    } finally {
      setLoading(false);
    }
  };

  return { validateAddress, loading, error };
}
