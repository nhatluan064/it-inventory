import React, { useState, useMemo, useEffect } from "react";
import { RotateCcw, Search, Wrench, Edit, ChevronDown, ChevronRight, Package, User } from "lucide-react";
import { useSort } from "../hooks/useSort";

const AllocatedView = ({
  items,
  unfilteredAllocatedItems,
  onRecallItem,
  onMarkDamaged,
  onEditAllocation,
  categories,
  departmentsList,
  filters,
  setFilters,
  t,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [animatingRows, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});

  // State để quản lý sorting category riêng
  const [categorySortConfig, setCategorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  // Handler riêng cho category sort
  const handleCategorySort = () => {
    setCategorySortConfig((prev) => ({
      key: "category",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [filters]);

  const { items: sortedItems } = useSort(items, {
    key: "category",
    direction: "ascending",
  });

  const groupedByCategory = useMemo(() => {
    const grouped = sortedItems.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Sắp xếp các categories theo thứ tự
    const sortedGrouped = {};
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      const aName = categories.find((c) => c.id === a)?.name || a;
      const bName = categories.find((c) => c.id === b)?.name || b;
      const comparison = aName.localeCompare(bName);
      return categorySortConfig.direction === "ascending"
        ? comparison
        : -comparison;
    });

    sortedCategories.forEach((categoryId) => {
      sortedGrouped[categoryId] = grouped[categoryId];
    });

    return sortedGrouped;
  }, [sortedItems, categories, categorySortConfig]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(t("locale_string"));
  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const categoryCounts = useMemo(() => {
    if (!unfilteredAllocatedItems) return {};
    return unfilteredAllocatedItems.reduce((acc, item) => {
      if (item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [unfilteredAllocatedItems]);

  const departmentOptions = useMemo(() => {
    const allOption = { id: "all", name: t("all") };
    return [allOption, ...departmentsList];
  }, [departmentsList, t]);

  const toggleExpand = (name) => {
    const isExpanded = expandedRows[name];
    if (isExpanded) {
      setAnimatingRows((prev) => ({ ...prev, [name]: "closing" }));
      setTimeout(() => {
        setExpandedRows((prev) => ({ ...prev, [name]: false }));
        setAnimatingRows((prev) => ({ ...prev, [name]: undefined }));
      }, 300);
    } else {
      setExpandedRows((prev) => ({ ...prev, [name]: true }));
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  const requestSubSort = (groupName, key) => {
    setSubSortConfigs((prevConfigs) => {
      const currentConfig = prevConfigs[groupName] || {};
      let direction = "ascending";
      if (
        currentConfig.key === key &&
        currentConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      return { ...prevConfigs, [groupName]: { key, direction } };
    });
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      {/* Page transition */}

      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
        {/* Filter section animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              {t("allocated_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("allocated_desc")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">
              {t("category")}
            </label>
            <select
              name="category"
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${
                  cat.id === "all"
                    ? unfilteredAllocatedItems.length
                    : categoryCounts[cat.id] || 0
                })`}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">
              {t("department")}
            </label>
            <select
              name="department"
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={filters.department}
              onChange={handleFilterChange}
            >
              {departmentOptions.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">
              {t("handover_date")}
            </label>
            <input
              name="handoverDate"
              type="date"
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={filters.handoverDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        {/* Card-based container */}
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
              {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
                const isExpanded = expandedRows[categoryId];
                const category = categories.find((c) => c.id === categoryId);
                const subSortConfig = subSortConfigs[categoryId] || {
                  key: "name",
                  direction: "ascending",
                };
                const sortedSubItems = [...items].sort((a, b) => {
                  const getNestedValue = (obj, key) =>
                    key
                      .split(".")
                      .reduce((o, i) => (o ? o[i] : undefined), obj);
                  const aValue = getNestedValue(a, subSortConfig.key) || "";
                  const bValue = getNestedValue(b, subSortConfig.key) || "";
                  const collator = new Intl.Collator(undefined, {
                    numeric: true,
                    sensitivity: "base",
                  });
                  const comparison = collator.compare(
                    aValue.toString(),
                    bValue.toString()
                  );
                  return subSortConfig.direction === "ascending"
                    ? comparison
                    : -comparison;
                });
                
                return (
                  <div
                    key={categoryId}
                    className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${catIndex * 0.05}s` }}
                  >
                    {/* Category Header with Yellow Gradient */}
                    <div
                      onClick={() => toggleExpand(categoryId)}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-800/40 dark:hover:to-amber-800/40 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-white" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {category?.name || categoryId}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {items.length} {t("label_devices")}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {isExpanded ? t("collapse") : t("expand")}
                      </div>
                    </div>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                        {sortedSubItems.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-yellow-400 dark:hover:border-yellow-500"
                            style={{
                              animationDelay: `${itemIndex * 0.03}s`,
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full flex-shrink-0"></div>
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-500 dark:to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                                  <Package className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                                    SN: {item.serialNumber || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex items-center gap-2 ml-4 min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                <User className="w-4 h-4 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {item.allocationDetails?.recipientName || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {item.allocationDetails?.position
                                      ? t(item.allocationDetails.position)
                                      : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Department */}
                            <div className="text-xs text-gray-600 dark:text-gray-300 ml-4 min-w-0">
                              🏢 {item.allocationDetails?.department
                                ? departmentsList.find(
                                    (dept) =>
                                      dept.id === item.allocationDetails.department
                                  )?.name || item.allocationDetails.department
                                : "N/A"}
                            </div>

                            {/* Handover Date */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 ml-4 min-w-0">
                              🤝 {formatDate(item.allocationDetails?.handoverDate)}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => onEditAllocation(item)}
                                className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                                title={t("edit_recipient")}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onRecallItem(item)}
                                className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                                title={t("recall_device")}
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onMarkDamaged(item)}
                                className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-all duration-200"
                                title={t("maintenance")}
                              >
                                <Wrench className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default AllocatedView;
