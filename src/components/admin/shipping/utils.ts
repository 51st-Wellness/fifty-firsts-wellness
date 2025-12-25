import type {
  ShippingRatesConfig,
  ShippingServiceConfig,
  ShippingAddOn,
  WeightBand,
} from "../../../api/shipping.api";

export const DEFAULT_CONFIG: ShippingRatesConfig = {
  services: {
    ROYAL_MAIL_48: {
      label: "Royal Mail 2nd Class",
      serviceCode: "CRL1",
      description: "Standard delivery, 2-3 business days",
      bands: [
        { maxWeight: 1000, price: 4.19 },
        { maxWeight: 2000, price: 6.49 },
        { maxWeight: 5000, price: 9.99 },
      ],
    },
    ROYAL_MAIL_24: {
      label: "Royal Mail 1st Class",
      serviceCode: "CRL2",
      description: "Next day delivery",
      bands: [
        { maxWeight: 1000, price: 5.82 },
        { maxWeight: 2000, price: 8.5 },
      ],
    },
  },
  addOns: {
    SIGNED_FOR: {
      label: "Signed For",
      price: 1.5,
      description: "Requires signature on delivery",
    },
  },
  defaultService: "ROYAL_MAIL_48",
};

