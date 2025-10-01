import React, { useState, useMemo, useEffect } from "react";
import { RotateCcw, Search, Wrench } from "lucide-react";
import { useSort } from "../hooks/useSort";

const AllocatedView = ({
  items,
  unfilteredAllocatedItems,
  onRecallItem,
  onMarkDamaged,
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

  const {
    items: sortedItems,
  } = useSort(items, {
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
      const aName = (categories.find(c => c.id === a)?.name || a);
      const bName = (categories.find(c => c.id === b)?.name || b);
      const comparison = aName.localeCompare(bName);
      return categorySortConfig.direction === "ascending" ? comparison : -comparison;
    });

    sortedCategories.forEach(categoryId => {
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
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

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table container animation */}
        <div className="flex-grow overflow-y-auto hide-scrollbar">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  className="px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 cursor-pointer select-none w-1/3"
                  onClick={handleCategorySort}
                >
                  {t("category")}
                  {categorySortConfig.direction === "ascending" ? " ▲" : " ▼"}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-24">
                  {t("quantity")}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-32">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(groupedByCategory).map(([categoryId, items]) => {
                const isOpening = animatingRows[categoryId] === "opening";
                const isClosing = animatingRows[categoryId] === "closing";
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
                  <React.Fragment key={categoryId}>
                    <tr
                      className="bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer animate-fadeInUp transition-all duration-300"
                      style={{
                        animationDelay: `${
                          Object.keys(groupedByCategory).indexOf(categoryId) *
                          0.1
                        }s`,
                      }}
                      onClick={() => toggleExpand(categoryId)}
                    >
                      <td className="px-4 py-3 font-semibold capitalize">
                        <span>{category?.name || categoryId}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        <div className="flex flex-col items-center">
                          <span>{items.length}</span>
                          <span className="text-gray-400 dark:text-gray-500 text-[9px]">
                            {t('label_devices')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-xs text-gray-500">
                          {expandedRows[categoryId] ? '−' : '+'}
                        </div>
                      </td>
                    </tr>
                    {(expandedRows[categoryId] || isClosing) && (
                      <tr>
                        <td
                          colSpan={3}
                          className={`p-0 overflow-hidden ${
                            isOpening ? "animate-slideDown" : ""
                          } ${isClosing ? "animate-slideUp" : ""}`}
                        >
                          <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-blue-200 dark:border-blue-700">
                            <div className="px-8 py-4">
                              <div className="grid grid-cols-12 gap-x-4 items-center p-2 rounded-t-md font-bold italic text-gray-600 dark:text-gray-400 text-xs border-b border-gray-200 dark:border-gray-700">
                                <div
                                  className="col-span-3 cursor-pointer flex items-center"
                                  onClick={() =>
                                    requestSubSort(categoryId, "name")
                                  }
                                >
                                  <span className="ml-4">📦 {t("device_name")}</span>
                                </div>
                                <div
                                  className="col-span-2 cursor-pointer"
                                  onClick={() =>
                                    requestSubSort(categoryId, "serialNumber")
                                  }
                                >
                                  {t("serial_number_sn")}
                                </div>
                                <div
                                  className="col-span-2 cursor-pointer"
                                  onClick={() =>
                                    requestSubSort(
                                      categoryId,
                                      "allocationDetails.recipientName"
                                    )
                                  }
                                >
                                  {t("recipient")}
                                </div>
                                <div
                                  className="col-span-2 cursor-pointer"
                                  onClick={() =>
                                    requestSubSort(
                                      categoryId,
                                      "allocationDetails.department"
                                    )
                                  }
                                >
                                  {t("department")}
                                </div>
                                <div
                                  className="col-span-1 cursor-pointer"
                                  onClick={() =>
                                    requestSubSort(
                                      categoryId,
                                      "allocationDetails.handoverDate"
                                    )
                                  }
                                >
                                  {t("handover_date")}
                                </div>
                                <div className="col-span-2 text-center">
                                  {t("actions")}
                                </div>
                              </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {sortedSubItems.map((item, itemIndex) => (
                                <div
                                  key={item.id}
                                  className="grid grid-cols-12 gap-x-4 items-center py-3 hover:bg-gray-100 dark:hover:bg-gray-700/30 animate-slideInLeft transition-all duration-300 border-l-2 border-transparent hover:border-blue-300"
                                  style={{
                                    animationDelay: `${itemIndex * 0.05}s`,
                                  }}
                                >
                                  <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 ml-4"></div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                      {item.name}
                                    </span>
                                  </div>
                                  <div className="col-span-2 text-left truncate font-mono">
                                    {item.serialNumber || "N/A"}
                                  </div>
                                  <div className="col-span-2 text-left truncate">
                                    {item.allocationDetails?.recipientName ||
                                      "N/A"}
                                  </div>
                                  <div className="col-span-2 text-left truncate">
                                    {item.allocationDetails?.department
                                      ? departmentsList.find(
                                          (dept) =>
                                            dept.id ===
                                            item.allocationDetails.department
                                        )?.name ||
                                        item.allocationDetails.department
                                      : "N/A"}
                                  </div>
                                  <div className="col-span-1 text-left truncate">
                                    {formatDate(
                                      item.allocationDetails?.handoverDate
                                    )}
                                  </div>
                                  <div className="col-span-2 flex items-center justify-center space-x-1">
                                    <button
                                      onClick={() => onRecallItem(item)}
                                      className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 animate-hoverScale transition-all duration-200"
                                      title={t("recall_device")}
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => onMarkDamaged(item)}
                                      className="p-2 rounded-lg text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 animate-hoverScale transition-all duration-200"
                                      title={t("maintenance")}
                                    >
                                      <Wrench className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllocatedView;
