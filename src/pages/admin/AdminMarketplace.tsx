import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  fetchStoreItems,
  fetchStoreItemById,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
} from "../../api/marketplace.api";

// Marketplace admin with two-pane layout: list + details
const AdminMarketplace = () => {
  const [query, setQuery] = useState({ page: 1, limit: 12, search: "" });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
  });

  const debouncedSearch = useDebounce(query.search, 350);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchStoreItems({ ...query, search: debouncedSearch })
      .then((res) => {
        if (!mounted) return;
        setItems(res.items);
        setPagination(res.pagination);
        if (res.items.length && !selected) setSelected(res.items[0]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [query.page, query.limit, debouncedSearch]);

  const onSelect = async (item) => {
    setSelected(item);
    try {
      const full = await fetchStoreItemById(item.productId || item.id);
      if (full) setSelected(full);
    } catch {}
  };

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setForm({ name: "", price: 0, stock: 0, description: "" });
    setShowForm(true);
  };
  const openEdit = () => {
    if (!selected) return;
    setForm({
      name: selected.name || "",
      price: selected.price || 0,
      stock: selected.stock || 0,
      description: selected.description || "",
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    setSubmitting(true);
    try {
      if (selected && selected.productId) {
        const updated = await updateStoreItem(selected.productId, form);
        setSelected(updated);
      } else {
        await createStoreItem(form);
      }
      // refresh list
      const res = await fetchStoreItems({ ...query, search: debouncedSearch });
      setItems(res.items);
      setPagination(res.pagination);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!selected?.productId) return;
    if (!confirm("Delete this item?")) return;
    await deleteStoreItem(selected.productId);
    const res = await fetchStoreItems({ ...query, search: debouncedSearch });
    setItems(res.items);
    setPagination(res.pagination);
    setSelected(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-5 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex gap-2 items-center">
          <input
            value={query.search}
            onChange={(e) =>
              setQuery((q) => ({ ...q, search: e.target.value, page: 1 }))
            }
            placeholder="Search items…"
            className="w-full rounded-md border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
          <select
            value={query.limit}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                limit: Number(e.target.value),
                page: 1,
              }))
            }
            className="rounded-md border-gray-200 text-sm"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          <button
            onClick={openCreate}
            className="ml-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          >
            New Item
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto divide-y divide-gray-100">
          {loading && items.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">Loading items…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No items found</div>
          ) : (
            items.map((it) => (
              <button
                key={it.productId || it.id}
                onClick={() => onSelect(it)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                  (selected?.productId || selected?.id) ===
                  (it.productId || it.id)
                    ? "bg-indigo-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                    {it.display?.url ? (
                      <img
                        src={it.display.url}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {it.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${it.price ?? "—"}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="p-3 border-t border-gray-100 text-xs text-gray-500">
          Page {pagination.page} of {Math.max(1, pagination.totalPages)} •{" "}
          {pagination.total} items
        </div>
      </section>

      <section className="col-span-7 bg-white border border-gray-200 rounded-lg relative">
        {!selected ? (
          <div className="p-6 text-sm text-gray-500">
            Select an item to view details
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 p-6">
            <div className="col-span-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {selected.display?.url ? (
                  <img
                    src={selected.display.url}
                    alt={selected.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              {Array.isArray(selected.images) && selected.images.length > 0 ? (
                <div className="mt-3 flex gap-2 overflow-auto">
                  {selected.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="thumb"
                      className="h-14 w-14 rounded object-cover border"
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="col-span-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selected.name}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                {selected.description || "No description"}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-semibold text-indigo-700">
                  ${selected.price ?? "—"}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {selected.stock ?? "—"}
                </span>
              </div>
              {selected.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={openEdit}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="px-3 py-2 rounded-md bg-white border text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <Dialog.Root open={showForm} onOpenChange={setShowForm}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg rounded-lg border bg-white p-5 shadow-xl">
              <Dialog.Title className="text-lg font-semibold">
                {selected ? "Edit Store Item" : "Create Store Item"}
              </Dialog.Title>
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="block text-sm text-gray-600">Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-md border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-sm text-gray-600">Price</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-md border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-gray-600">Stock</span>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-md border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm text-gray-600">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    rows={3}
                  />
                </label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button
                    className="px-3 py-2 rounded-md bg-white border text-sm"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={submitForm}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : "Save"}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </div>
  );
};

export default AdminMarketplace;

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
