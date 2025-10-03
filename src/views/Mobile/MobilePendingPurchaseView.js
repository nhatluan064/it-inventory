import React, { useState, useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Filter, Layers, ShoppingBag } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import toast from "react-hot-toast";

const MobilePendingPurchaseView = ({
  items,
  onStartPurchase,
  onDeleteItem,
  onOpenAddFromMasterModal,
  categories,
  t,
}) => {
  const [purchaseData, setPurchaseData] = useState({});
  // Show filters visible by default on mobile
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    sortKey: "name",
    sortDirection: "asc",
    category: "all",
  });
  // sort dropdown replaced with inline select

  const handleDataChange = (id, field, value) => {
    setPurchaseData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handlePurchaseClick = (item) => {
    const price = parseFloat(purchaseData[item.id]?.price);
    const quantity = parseInt(purchaseData[item.id]?.quantity, 10) || 1;
    if (!price || price <= 0) {
      toast.error(t("toast_price_is_required"));
      return;
    }
    onStartPurchase([{ id: item.id, quantity, price }]);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items];

    if (filters.search) {
      sortedItems = sortedItems.filter((item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    sortedItems.sort((a, b) => {
      const aVal = a[filters.sortKey] || "";
      const bVal = b[filters.sortKey] || "";
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const comparison = collator.compare(aVal.toString(), bVal.toString());
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    return sortedItems;
  }, [items, filters]);

  // sort options are handled on desktop; mobile uses category select and simple search

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("pending_purchase_list")}</h2>
            <p className="text-sm text-gray-500">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mobile-btn-icon mobile-optimized"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenAddFromMasterModal}
              className="mobile-btn-primary rounded-full p-2 mobile-optimized"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_master_item_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              >
                <option key="all" value="all">
                  {t("all")}
                </option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 mobile-card"
          >
            <div>
              <p className="font-bold text-base">{item.name}</p>
              <div className="flex items-center mt-1 gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                  {(categories.find((c) => c.id === item.category) || {})
                    .name || item.category}
                </span>
              </div>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("purchase_quantity")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={purchaseData[item.id]?.quantity || 1}
                  onChange={(e) =>
                    handleDataChange(item.id, "quantity", e.target.value)
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("price")} (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={purchaseData[item.id]?.price || ""}
                  onChange={(e) =>
                    handleDataChange(item.id, "price", e.target.value)
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <button
                onClick={() => handlePurchaseClick(item)}
                className="col-span-1 bg-green-500 text-white p-2 rounded-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {/* Sửa lỗi hiển thị ở đây */}
                <span>{t("purchasing")}</span>
              </button>
              <button
                onClick={() => onDeleteItem(item)}
                className="col-span-1 bg-red-500 text-white p-2 rounded-md flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t("delete")}</span>
              </button>
            </div>
          </div>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title={t("empty_pending_title")}
            description={t("empty_pending_text")}
          />
        )}
      </div>
    </div>
  );
};

export default MobilePendingPurchaseView;
