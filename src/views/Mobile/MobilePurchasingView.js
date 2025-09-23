import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Layers,
  Filter,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

const MobilePurchasingView = ({
  items,
  onUpdateStatus,
  onCancel,
  categories,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sortKey: "name",
    sortDirection: "asc",
  });
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSortChange = (sortKey) => {
    setFilters((prev) => {
      const newDirection =
        prev.sortKey === sortKey && prev.sortDirection === "asc"
          ? "desc"
          : "asc";
      return { ...prev, sortKey, sortDirection: newDirection };
    });
    setIsSortOpen(false);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items].filter((item) =>
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    );

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

  const sortOptions = [
    { key: "name", label: t("device_name") },
    { key: "category", label: t("category") },
    { key: "price", label: t("price") },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("purchasing_list")}</h2>
            <p className="text-sm text-gray-500">{t("purchasing_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_master_item_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
              <div className="relative col-span-1">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <span className="text-sm">{t("sort_by")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isSortOpen && (
                  <div className="absolute z-10 top-full right-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSortChange(opt.key)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center"
                      >
                        {opt.label}
                        {filters.sortKey === opt.key && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3"
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
