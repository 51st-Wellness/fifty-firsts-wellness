import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getSubscriptionPlans,
  getUserActiveSubscription,
  createSubscriptionCheckout,
  type SubscriptionPlan,
  type Subscription,
} from "../api/subscription.api";
import { getAuthToken } from "../lib/utils";

interface UseSubscriptionReturn {
  plans: SubscriptionPlan[];
  activeSubscription: Subscription | null;
  loading: boolean;
  checkoutLoading: string | null;
  fetchData: () => Promise<void>;
  handleSubscribe: (planId: string) => Promise<void>;
  isCurrentPlan: (planId: string) => boolean;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansResponse, activeSubResponse] = await Promise.all([
        getSubscriptionPlans(),
        getAuthToken()
          ? getUserActiveSubscription()
          : Promise.resolve({ success: true, data: null }),
      ]);

      setPlans(plansResponse);

      if (activeSubResponse.success) {
        setActiveSubscription(activeSubResponse.data);
      } else if (activeSubResponse.message && getAuthToken()) {
        console.warn(
          "Failed to fetch active subscription:",
          activeSubResponse.message
        );
      }
    } catch (error: any) {
      console.error("Error fetching subscription data:", error);
      toast.error(
        error.message || "Failed to load subscription plans. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!getAuthToken()) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      setCheckoutLoading(planId);
      const response = await createSubscriptionCheckout(planId);

      if (response.success && response.data?.approvalUrl) {
        toast.success("Redirecting to payment...");
        window.location.href = response.data.approvalUrl;
      } else {
        const errorMessage = response.message || "Failed to initiate checkout";
        toast.error(errorMessage);
        console.error("Checkout failed:", response);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.message || "Failed to start checkout. Please try again.";
      toast.error(errorMessage);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const isCurrentPlan = (planId: string): boolean => {
    if (!activeSubscription) return false;
    return (
      activeSubscription.planId === planId &&
      activeSubscription.status === "PAID"
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    plans,
    activeSubscription,
    loading,
    checkoutLoading,
    fetchData,
    handleSubscribe,
    isCurrentPlan,
  };
};
