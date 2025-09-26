import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Wrench,
  Filter,
  ChevronDown,
  Check,
  User,
  Building,
  Calendar,
} from "lucide-react";
import { useDynamicData } from "../../hooks/useDynamicData";

const MobileAllocatedView = ({
  items,
  onRecallItem,
  onMarkDamaged,
  categories,
  t,
  filters,
  setFilters,
}) => {
  const { departmentsList } = useDynamicData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString(t("locale_string"));
  };

  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items]; // items are already filtered by App.js
    const { sortKey, sortDirection } = filters;

    if (sortKey) {
      sortedItems.sort((a, b) => {
        const getNestedValue = (obj, key) =>
          key.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);
        const aVal = getNestedValue(a, sortKey) || "";
        const bVal = getNestedValue(b, sortKey) || "";
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        });
        const comparison = collator.compare(aVal.toString(), bVal.toString());
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return sortedItems;
  }, [items, filters]);

  const sortOptions = [
    { key: "name", label: t("device_name") },
    { key: "allocationDetails.recipientName", label: t("recipient") },
    { key: "allocationDetails.handoverDate", label: t("handover_date") },
  ];

  const departmentOptions = useMemo(() => {
    const allOption = { id: "all", name: t("all") };
    return [allOption, ...departmentsList];
  }, [departmentsList, t]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("allocated_list")}</h2>
            <p className="text-sm text-gray-500">{t("allocated_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mobile-btn-icon mobile-optimized"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_inventory_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-2"
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
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="handoverDate"
                type="date"
                value={filters.handoverDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
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

      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 mobile-card"
          >
            <div>
              <p className="font-bold text-base">{item.name}</p>
              <p className="text-xs font-mono text-gray-500">
                {item.serialNumber || "N/A"}
              </p>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("recipient")}:</span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {item.allocationDetails?.recipientName}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("department")}:</span>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {item.allocationDetails?.department
                      ? (departmentsList.find(dept => dept.id === item.allocationDetails.department)?.name || item.allocationDetails.department)
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("handover_date")}:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(item.allocationDetails?.handoverDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 flex justify-end space-x-2">
              <button
                onClick={() => onRecallItem(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <RotateCcw className="w-5 h-5 text-green-500" />
              </button>
              <button
                onClick={() => onMarkDamaged(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <Wrench className="w-5 h-5 text-orange-500" />
              </button>
            </div>
          </div>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {t("no_allocated_items_match_filter")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAllocatedView;
