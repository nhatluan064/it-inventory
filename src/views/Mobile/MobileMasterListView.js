import React, { useState, useMemo } from "react";
import {
  Filter,
  Plus,
  ChevronDown,
  Check,
  Layers,
  Edit2,
  Trash2,
} from "lucide-react";

const MobileMasterListView = ({
  allItems,
  onEditItem,
  onDeleteItem,
  onAddType,
  t,
  categories,
  fullEquipmentList,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sortKey: "name",
    sortDirection: "asc",
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSortChange = (sortKey) => {
    setFilters((prev) => {
      const currentDirection = prev.sortDirection || "asc";
      const newDirection =
        prev.sortKey === sortKey && currentDirection === "asc" ? "desc" : "asc";
      return { ...prev, sortKey, sortDirection: newDirection };
    });
    setIsSortOpen(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    let items = [...allItems];

    // Filtering
    items = items.filter((item) => {
      const categoryMatch =
        filters.category === "all" || item.category === filters.category;
      const searchMatch = item.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      return categoryMatch && searchMatch;
    });

    // Sorting
    items.sort((a, b) => {
      const aVal = a[filters.sortKey] || "";
      const bVal = b[filters.sortKey] || "";
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const comparison = collator.compare(aVal, bVal);
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    return items;
  }, [allItems, filters]);

  const sortOptions = [
    { key: "name", label: t("master_item_name") },
    { key: "category", label: t("category") },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      {/* Header and Filter Section */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("master_list")}</h2>
            <p className="text-xs text-gray-500">{t("master_list_desc")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mobile-btn-icon mobile-optimized"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onAddType}
              className="mobile-btn-primary rounded-full p-2 mobile-optimized"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_master_item_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="relative">
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

      {/* Item List Section */}
      <div className="flex-grow overflow-y-auto p-3 space-y-2 mobile-stagger">
        {filteredAndSortedItems.map((item) => {
          const isModelInUse = fullEquipmentList.some(
            (e) =>
              e.name === item.name &&
              e.category === item.category &&
              e.status !== "master"
          );
          const statusText = isModelInUse
            ? t("has_been_used")
            : t("never_used");
          const statusColor = isModelInUse
            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-3 space-y-2 mobile-card"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-blue-600 dark:text-blue-400 leading-tight">
                    {item.name}
                  </p>
                  <div className="flex items-center mt-0.5 gap-1">
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                    <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 self-start">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${statusColor}`}
                  >
                    {statusText}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-600 pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => onEditItem(item)}
                  disabled={isModelInUse}
                  className="mobile-btn-icon mobile-optimized disabled:opacity-40"
                >
                  <Edit2 className="w-5 h-5 text-amber-500" />
                </button>
                <button
                  onClick={() => onDeleteItem(item)}
                  className="mobile-btn-icon mobile-optimized"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_master_items_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMasterListView;
