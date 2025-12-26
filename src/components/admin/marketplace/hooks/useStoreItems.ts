import { useState, useEffect, useCallback } from "react";
import { fetchStoreItems, fetchStoreItemById } from "../../../../api/marketplace.api";
import type { StoreItem } from "../../../../types/marketplace.types";
import toast from "react-hot-toast";

interface UseStoreItemsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface UseStoreItemsReturn {
  items: StoreItem[];
  loading: boolean;
  selected: StoreItem | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  setSelected: (item: StoreItem | null) => void;
  loadItems: () => Promise<void>;
  selectItem: (item: StoreItem) => Promise<void>;
}

export const useStoreItems = (
  query: UseStoreItemsParams,
  debouncedSearch: string
): UseStoreItemsReturn => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
  });

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchStoreItems({
        page: query.page || 1,
        limit: query.limit || 12,
        search: debouncedSearch || undefined,
      });
      setItems(response.data?.items || []);
      setPagination((prev) => response.data?.pagination || prev);

      // Auto-select first item if none selected
      setSelected((prevSelected) => {
        if (response.data?.items?.length && !prevSelected) {
          return response.data.items[0];
        }
        return prevSelected;
      });
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load store items");
    } finally {
      setLoading(false);
    }
  }, [query.page, query.limit, debouncedSearch]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const selectItem = async (item: StoreItem) => {
    setSelected(item);
    try {
      const response = await fetchStoreItemById(item.productId);
      if (response.data) {
        setSelected(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    }
  };

  return {
    items,
    loading,
    selected,
    pagination,
    setSelected,
    loadItems,
    selectItem,
  };
};

