import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { settingsAPI, type GlobalDiscountSetting } from "../api/settings.api";
import { ResponseStatus } from "../types/response.types";

type GlobalDiscountContextValue = {
  globalDiscount: GlobalDiscountSetting | null;
  isLoading: boolean;
  error: string | null;
  refreshGlobalDiscount: () => Promise<void>;
};

const GlobalDiscountContext = createContext<
  GlobalDiscountContextValue | undefined
>(undefined);

export const GlobalDiscountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [globalDiscount, setGlobalDiscount] =
    useState<GlobalDiscountSetting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGlobalDiscount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await settingsAPI.getGlobalDiscount();
      if (
        (response.status === ResponseStatus.SUCCESS ||
          (response.status as unknown as string) === "success") &&
        response.data
      ) {
        setGlobalDiscount(response.data);
      } else {
        setError("Unable to load global discount");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load discount";
      setError(message);
      console.error("[GlobalDiscount] fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshGlobalDiscount();
  }, [refreshGlobalDiscount]);

  return (
    <GlobalDiscountContext.Provider
      value={{ globalDiscount, isLoading, error, refreshGlobalDiscount }}
    >
      {children}
    </GlobalDiscountContext.Provider>
  );
};

export const useGlobalDiscount = (): GlobalDiscountContextValue => {
  const context = useContext(GlobalDiscountContext);
  if (!context) {
    throw new Error(
      "useGlobalDiscount must be used within a GlobalDiscountProvider"
    );
  }
  return context;
};
