import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, Layers, Filter } from "lucide-react";

const MobilePurchasingView = ({
  items,
  onUpdateStatus,
  onCancel,
  categories,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "all" });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  const cleanedCategories = (categories || []).filter(
    (c) => String(c.id).toLowerCase() !== "all" && (c.name || "").toLowerCase() !== (t("all") || "").toLowerCase()
  );

  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items].filter((item) =>
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (filters.category && filters.category !== "all") {
      sortedItems = sortedItems.filter((item) => item.category === filters.category);
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


  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("purchasing_list")}</h2>
            <p className="text-sm text-gray-500">{t("purchasing_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mobile-btn-icon mobile-optimized"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_master_item_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option key="all" value="all">
                  {t("all")}
                </option>
                {cleanedCategories.map((c) => (
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
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">
                  {t("purchase_quantity")}
                </p>
                <p className="font-semibold text-lg">{item.purchaseQuantity}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500">
                  {t("price")} (VNĐ)
                </p>
                <p className="font-semibold text-lg font-mono">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 grid grid-cols-2 gap-4">
              <button
                onClick={() => onUpdateStatus([item.id])}
                className="col-span-1 bg-green-500 text-white p-2 rounded-md flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t("purchased")}</span>
              </button>
              <button
                onClick={() => onCancel(item)}
                className="col-span-1 bg-red-500 text-white p-2 rounded-md flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>{t("cancel")}</span>
              </button>
            </div>
          </div>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePurchasingView;
