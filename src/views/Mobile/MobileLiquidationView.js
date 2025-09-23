import React, { useState, useMemo } from "react";
import {
  Trash2,
  Filter,
  ChevronDown,
  Check,
  Package,
  User,
  Wrench,
} from "lucide-react";

const MobileLiquidationView = ({ items, onLiquidateItem, t }) => {
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

  const filteredAndSortedItems = useMemo(() => {
    let results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.serialNumber?.toLowerCase().includes(filters.search.toLowerCase())
    );

    results.sort((a, b) => {
      const aVal = a[filters.sortKey] || "";
      const bVal = b[filters.sortKey] || "";
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true });
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    return results;
  }, [items, filters]);

  const sortOptions = [{ key: "name", label: t("device_name") }];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header và Bộ lọc */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("liquidation_list")}</h2>
            <p className="text-sm text-gray-500">{t("liquidation_desc")}</p>
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
                placeholder={t("search")}
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

      {/* Danh sách Card */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3"
            >
              <div>
                <p className="font-bold text-base text-slate-600 dark:text-slate-400">
                  {item.name}
                </p>
                <p className="text-xs font-mono text-gray-500">
                  {item.serialNumber || "N/A"}
                </p>
              </div>

              <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> {t("failure_note")}:
                  </span>
                  <span className="font-medium text-right">
                    {item.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User className="w-4 h-4" /> {t("recalled_from_user")}:
                  </span>
                  <span className="font-medium">
                    {item.recalledFrom || "---"}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-600 pt-3 flex justify-end">
                <button
                  onClick={() => onLiquidateItem(item)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  title={t("confirm_liquidated")}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("confirm_liquidated")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 m-auto">
            <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-semibold">
              {t("liquidation_empty_title")}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t("liquidation_empty_text")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileLiquidationView;
