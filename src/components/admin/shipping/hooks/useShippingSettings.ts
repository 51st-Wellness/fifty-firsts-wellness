import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  shippingAPI,
  type ShippingRatesConfig,
  type ShippingServiceConfig,
  type ShippingAddOn,
  type WeightBand,
} from "../../../../api/shipping.api";
import { ResponseStatus } from "../../../../types/response.types";
import { DEFAULT_CONFIG } from "../utils";

export const useShippingSettings = (open: boolean) => {
  const [config, setConfig] = useState<ShippingRatesConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedService, setExpandedService] = useState<string | false>(false);

  // Load current configuration
  useEffect(() => {
    if (open) {
      loadConfiguration();
    }
  }, [open]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const response = await shippingAPI.getShippingRates();
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setConfig(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load shipping rates:", error);
      toast.error("Failed to load shipping settings");
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<boolean> => {
    setSaving(true);
    try {
      const response = await shippingAPI.updateShippingRates(config);
      if (response.status === ResponseStatus.SUCCESS) {
        toast.success("Shipping settings updated successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Failed to update shipping rates:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update shipping settings"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Service management
  const addService = () => {
    const newKey = `NEW_SERVICE_${Date.now()}`;
    setConfig({
      ...config,
      services: {
        ...config.services,
        [newKey]: {
          label: "New Service",
          serviceCode: "",
          description: "",
          bands: [{ maxWeight: 1000, price: 0 }],
        },
      },
    });
    setExpandedService(newKey);
  };

  const updateService = (
    key: string,
    updates: Partial<ShippingServiceConfig>
  ) => {
    setConfig({
      ...config,
      services: {
        ...config.services,
        [key]: {
          ...config.services[key],
          ...updates,
        },
      },
    });
  };

  const deleteService = (key: string) => {
    if (Object.keys(config.services).length <= 1) {
      toast.error("You must have at least one shipping service");
      return;
    }

    const newServices = { ...config.services };
    delete newServices[key];

    // Update default service if deleted
    const newDefaultService =
      config.defaultService === key
        ? Object.keys(newServices)[0]
        : config.defaultService;

    setConfig({
      ...config,
      services: newServices,
      defaultService: newDefaultService,
    });
    toast.success("Service removed");
  };

  // Weight band management
  const addWeightBand = (serviceKey: string) => {
    const service = config.services[serviceKey];
    const lastBand = service.bands[service.bands.length - 1];
    const newMaxWeight = lastBand ? lastBand.maxWeight + 1000 : 1000;

    updateService(serviceKey, {
      bands: [...service.bands, { maxWeight: newMaxWeight, price: 0 }],
    });
  };

  const updateWeightBand = (
    serviceKey: string,
    index: number,
    updates: Partial<WeightBand>
  ) => {
    const service = config.services[serviceKey];
    const newBands = [...service.bands];
    newBands[index] = { ...newBands[index], ...updates };
    updateService(serviceKey, { bands: newBands });
  };

  const deleteWeightBand = (serviceKey: string, index: number) => {
    const service = config.services[serviceKey];
    if (service.bands.length <= 1) {
      toast.error("Service must have at least one weight band");
      return;
    }

    const newBands = service.bands.filter((_, i) => i !== index);
    updateService(serviceKey, { bands: newBands });
  };

  // Add-on management
  const addAddOn = () => {
    const newKey = `NEW_ADDON_${Date.now()}`;
    setConfig({
      ...config,
      addOns: {
        ...config.addOns,
        [newKey]: {
          label: "New Add-on",
          price: 0,
          description: "",
        },
      },
    });
  };

  const updateAddOn = (key: string, updates: Partial<ShippingAddOn>) => {
    setConfig({
      ...config,
      addOns: {
        ...config.addOns,
        [key]: {
          ...config.addOns![key],
          ...updates,
        },
      },
    });
  };

  const deleteAddOn = (key: string) => {
    const newAddOns = { ...config.addOns };
    delete newAddOns[key];
    setConfig({ ...config, addOns: newAddOns });
    toast.success("Add-on removed");
  };

  const setDefaultService = (serviceKey: string) => {
    setConfig({ ...config, defaultService: serviceKey });
  };

  return {
    config,
    loading,
    saving,
    expandedService,
    setExpandedService,
    handleSave,
    addService,
    updateService,
    deleteService,
    addWeightBand,
    updateWeightBand,
    deleteWeightBand,
    addAddOn,
    updateAddOn,
    deleteAddOn,
    setDefaultService,
  };
};

