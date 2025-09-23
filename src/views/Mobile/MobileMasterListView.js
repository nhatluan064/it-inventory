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
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header and Filter Section */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("master_list")}</h2>
            <p className="text-sm text-gray-500">{t("master_list_desc")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onAddType}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
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
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-base text-blue-600 dark:text-blue-400">
                    {item.name}
                  </p>
                  <div className="flex items-center mt-1 gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                    <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusColor}`}
                >
                  {statusText}
                </span>
              </div>

              <div className="border-t dark:border-gray-600 pt-3 flex justify-end space-x-2">
                <button
                  onClick={() => onEditItem(item)}
                  disabled={isModelInUse}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                >
                  <Edit2 className="w-5 h-5 text-amber-500" />
                </button>
                <button
                  onClick={() => onDeleteItem(item)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
