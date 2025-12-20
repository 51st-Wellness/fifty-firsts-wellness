import { useEffect } from "react";

interface UseAddressNowOptions {
  enabled: boolean;
  onAddressPopulate: (address: {
    addressLine1?: string;
    postTown?: string;
    postcode?: string;
  }) => void;
}

/**
 * Custom hook to initialize Royal Mail AddressNow for UK address autocomplete
 */
export const useAddressNow = ({
  enabled,
  onAddressPopulate,
}: UseAddressNowOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const initAddressNow = () => {
      const AN = (window as any).addressNow || (window as any).AddressNow;
      const addressLine1 = document.getElementById("checkout-addressLine1");

      if (AN && addressLine1) {
        try {
          if (AN.listen) {
            AN.listen("load", (control: any) => {
              control.listen("options", (options: any) => {
                options.fields = [
                  { element: "address-search", field: "Line1", mode: "search" },
                  {
                    element: "checkout-addressLine1",
                    field: "FormattedLine1",
                  },
                  { element: "checkout-postTown", field: "City" },
                  { element: "checkout-postcode", field: "PostalCode" },
                ];

                options.bar = options.bar || {};
                options.bar.visible = false;

                options.search = options.search || {};
                options.search.maxSuggestions = 7;
              });

              control.listen("populate", (address: any) => {
                onAddressPopulate({
                  addressLine1:
                    address.FormattedLine1 ||
                    (address.Company
                      ? `${address.Company}, ${address.Line1}`
                      : address.Line1) ||
                    address.AddressLine1 ||
                    "",
                  postTown: address.City || address.Town || "",
                  postcode:
                    address.PostalCode || address.Postcode || "",
                });
              });
            });

            AN.load();
          }
        } catch (error) {
          console.error("Failed to initialize AddressNow:", error);
        }
      }
    };

    // Retry mechanism to wait for DOM and Script
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      const AN = (window as any).addressNow || (window as any).AddressNow;
      const element = document.getElementById("address-search");

      if (AN && element) {
        initAddressNow();
        clearInterval(checkInterval);
      } else if (attempts > 50) {
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [enabled, onAddressPopulate]);
};

